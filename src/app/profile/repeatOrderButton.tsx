"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

interface RepeatOrderButtonProps {
  orderId: string;
}

export default function RepeatOrderButton({
  orderId,
}: RepeatOrderButtonProps) {
  const router = useRouter();
  const toast = useToast();

  const repeatOrderMutaiton = api.order.repeatOrder.useMutation({
    onSuccess: () => {
      router.push("/cart");
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })

  return (
    <Button
      variant="secondary"
      className="w-fit"
      onClick={() => {
        repeatOrderMutaiton.mutate({ id: orderId });
      }}
    >
      Повторить заказ
    </Button>
  );
}
