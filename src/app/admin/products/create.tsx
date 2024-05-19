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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { categoryEnum, categoryEnumSchema } from "~/server/db/schema";
import { CategoryToData, ImagesToBase64 } from "~/shared";
import { api } from "~/trpc/react";

export default function CreateProduct() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string({
      required_error: "Название обязательно",
      invalid_type_error: "Название должно быть строкой",
    }).min(1, "Название обязательно"),
    price: z.coerce.number({
      required_error: "Цена обязательна",
      invalid_type_error: "Цена должна быть числом",
    }).min(1, "Цена обязательна"),
    image: z.string({
      required_error: "Изображение обязательно",
      invalid_type_error: "Изображение должно быть строкой",
    }).min(1, "Изображение обязательно"),
    manufacturer: z.string({
      required_error: "Производитель обязателен",
      invalid_type_error: "Производитель должен быть строкой",
    }).min(1, "Производитель обязателен"),
    manufacturerCountry: z.string({
      required_error: "Страна производства обязательна",
      invalid_type_error: "Страна производства должна быть строкой",
    }).min(1, "Страна производства обязательна"),
    category: categoryEnumSchema,
    activeSubstance: z.string({
      required_error: "Активное вещество обязательно",
      invalid_type_error: "Активное вещество должно быть строкой",
    }).min(1, "Активное вещество обязательно"),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
      category: "",
      price: 0,
      activeSubstance: "",
      manufacturer: "",
      manufacturerCountry: "",
    }
  })

  const createProductMutation = api.product.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      form.reset();
      toast.toast({
        description: "Товар создан",
      })
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createProductMutation.mutate(data);
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
          <DialogTitle>Создание товара</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            <div className="overflow-scroll max-h-[80svh]">
              <div className="flex items-center justify-center w-full">
                {form.watch("image") ? (
                  <div className="w-5/6 aspect-square">
                    <Image
                      className="w-full h-full aspect-square rounded-xl object-cover"
                      width={1000}
                      height={1000}
                      src={form.watch("image")}
                      alt={form.watch("name")}
                    />
                  </div>
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
                      <Input type="text" {...field} placeholder="Доктор мом..." />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Цена</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="100" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Производитель</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder={`ООО "Пилюля"`} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturerCountry"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Страна производства</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="Россия" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryEnum.enumValues.map((category) => {
                          const data = CategoryToData(category)
                          return (
                            <SelectItem key={category} value={category}>
                              <div className="flex flex-row gap-2">
                                <Image
                                  width={100}
                                  height={100}
                                  src={data.icon}
                                  className="size-4"
                                  alt={data.name}
                                />
                                {data.name}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activeSubstance"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Активное вещество</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Вещество..." />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button>Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
