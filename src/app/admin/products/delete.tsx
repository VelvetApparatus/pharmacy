"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Product } from "~/shared";
import { api } from "~/trpc/react";

export default function DeleteProduct({
  product
}: {
  product: Product
}) {
  const router = useRouter();
  const toast = useToast();

  const deleteProductProcedure = api.product.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.toast({
        description: "Товар удален",
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
          <AlertDialogTitle>Удаление товара</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены, что хотите удалить товар "{product.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => deleteProductProcedure.mutate({ id: product.id })}>
            Удалить
          </AlertDialogAction>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
