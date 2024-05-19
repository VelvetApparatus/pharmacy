"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function ClearCartButton() {
  const router = useRouter();
  const toast = useToast();

  const clearCartMutation = api.cart.clear.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.toast({
        description: "Корзина очищена",
      })
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })

  return (
    <Button variant="secondary"
      onClick={() => {
        clearCartMutation.mutate();
      }}
    >
      Очистить корзину
    </Button>
  )
}
