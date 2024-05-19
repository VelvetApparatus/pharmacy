"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { ImagesToBase64 } from "~/shared";
import { api } from "~/trpc/react";

export default function CreateDiscount() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string({
      required_error: "Название обязательно",
      invalid_type_error: "Название должно быть строкой",
    }).min(1, "Название обязательно"),
    image: z.string({
      required_error: "Изображение обязательно",
      invalid_type_error: "Изображение должно быть строкой",
    }).min(1, "Изображение обязательно"),
    href: z.string({
      required_error: "Ссылка обязательна",
      invalid_type_error: "Ссылка должна быть строкой",
    }).url({
      message: "Некорректная ссылка",
    }).min(1, "Ссылка обязательна"),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
      href: "",
    }
  })

  const createDiscountMutation = api.discount.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      form.reset();
      toast.toast({
        description: "Акция создана",
      })
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createDiscountMutation.mutate(data);
  }

  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: "Ошибка", description: errors[key].message, variant: "destructive" });
        break;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          Создать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание акции</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              {form.watch("image") ? (
                <Image
                  className="w-5/6 rounded-xl aspect-video object-cover"
                  width={1000}
                  height={1000}
                  src={form.watch("image")}
                  alt={form.watch("name")}
                />
              ) : (
                <Skeleton className="w-5/6 rounded-xl aspect-square" />
              )}
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Фото</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        ImagesToBase64([file]).then((images) => {
                          field.onChange(images[0]!)
                        })
                      }
                    }} placeholder="Доктор мом..." />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Скидка на Доктор Мом" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Ссылка</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="https://website.com" />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button>Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
