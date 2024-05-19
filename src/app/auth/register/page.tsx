"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";

export default function RegisterModal({
  setLoginOpen
}: {
  setLoginOpen: (open: boolean) => void
}) {
  const toast = useToast();

  const formSchema = z.object({
    name: z.string({
      required_error: "Имя обязательно",
      invalid_type_error: "Имя должно быть строкой",
    }).min(1, "Имя обязательно"),
    email: z.string({
      required_error: "Email обязателен",
      invalid_type_error: "Email должен быть строкой",
    }),
    password: z.string({
      required_error: "Пароль обязателен",
      invalid_type_error: "Пароль должен быть строкой",
    }).min(6, "Минимальная длина пароля 6 символов"),
    password_repeat: z.string(),
  }).superRefine(({ password, password_repeat }, ctx) => {
    if (password !== password_repeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароли не совпадают",
        path: ["password_repeat"]
      })
    }
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_repeat: ""
    }
  })

  const router = useRouter();

  const registerMutation = api.user.register.useMutation({
    onSuccess: (data) => {
      signIn("credentials", {
        email: data.email,
        password: form.getValues("password"),
        redirect: true,
        callbackUrl: "/"
      })
      setLoginOpen(false);
      setOpen(false);
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    registerMutation.mutate({
      ...data
    })
  }

  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: "Ошибка", description: errors[key].message, variant: "destructive" });
        break;
      }
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="link">
          Еще не зарегистрировались?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          {...form}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col items-center justify-center gap-2 min-w-80 rounded-xl p-6 shadow-xl bg-white"
          >
            <h1 className="font-semibold">Регистрация</h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="text" {...field} placeholder="Имя" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="text" {...field} placeholder="Email" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="password" {...field} placeholder="Пароль" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_repeat"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="password" {...field} placeholder="Повторите пароль" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="w-full">
              Зарегистрироваться
            </Button>
            <Link href="/auth/login">
              <Button variant="link" type="button">
                Уже есть аккаунт?
              </Button>
            </Link>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

}
