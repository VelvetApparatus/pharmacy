"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ru } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

export default function Checkout() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const formSchema = z.object({
    address: z.string({
      required_error: "Адрес обязателен",
      invalid_type_error: "Адрес должен быть строкой",
    }).min(1, "Адрес обязателен"),
    date: z.date({
      required_error: "Дата обязательна",
      invalid_type_error: "Дата должна быть датой",
    }).min(new Date(), "Дата обязательна"),
    comment: z.string().optional()
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      date: nextDay,
      comment: ""
    }
  })

  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: "Ошибка", description: errors[key].message, variant: "destructive" });
        break;
      }
    }
  }

  const createOrderMutation = api.order.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.push("/profile");
      toast.toast({
        description: "Заказ создан",
      })
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createOrderMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Оформить заказ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit, onError)}>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <Input placeholder="Адрес" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ru }) : <span>Дата</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        locale={ru}
                        onSelect={(value) => field.onChange(value)}
                        hidden={{
                          before: new Date()
                        }}
                        disabled={new Date()}
                        fromMonth={new Date()}
                        toMonth={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий</FormLabel>
                  <Textarea placeholder="Комментарий" {...field} />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button>Оформить заказ</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

