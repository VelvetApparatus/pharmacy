"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { LogIn } from "lucide-react";
import RegisterModal from "../register/page";
import { useState } from "react";

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const formSchema = z.object({
    email: z.string({
      required_error: "Email обязателен",
      invalid_type_error: "Email должен быть строкой",
    }).email({
      message: "Некорректный email",
    }),
    password: z.string({
      required_error: "Пароль обязателен",
      invalid_type_error: "Пароль должен быть строкой",
    }).min(6, "Минимальная длина пароля 6 символов"),
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setOpen(false);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/"
    })
  }

  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: "Ошибка", description: errors[key].message, variant: "destructive" });
        break;
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-col gap-1 h-fit w-fit justify-center items-center" variant="ghost">
          <LogIn className="w-1/2 aspect-square" />
          <p className="text-xs">Войти</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Вход
          </DialogTitle>
        </DialogHeader>
        <Form
          {...form}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col items-center justify-center gap-2 min-w-80 p-6"
          >
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
            <Button className="w-full">
              Войти
            </Button>
            <RegisterModal setLoginOpen={(val) => setOpen(val)} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
