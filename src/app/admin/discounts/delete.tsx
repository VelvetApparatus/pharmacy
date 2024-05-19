"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Discount } from "~/shared";
import { api } from "~/trpc/react";

export default function DeleteDiscount({
  discount
}: {
  discount: Discount
}) {
  const router = useRouter();
  const toast = useToast();

  const deleteDiscountProcedure = api.discount.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.toast({
        description: "Акция удалена",
      })
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-destructive">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление акции</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены, что хотите удалить акцию "{discount.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => deleteDiscountProcedure.mutate({ id: discount.id })}>
            Удалить
          </AlertDialogAction>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
