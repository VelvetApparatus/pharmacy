"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderStatusBadge from "~/components/order_status_badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { orderStatusEnum } from "~/server/db/schema";
import { Order } from "~/shared"
import { api } from "~/trpc/react"

export default function UpdateOrderStatus({
  order
}: {
  order: Order
}) {
  const router = useRouter();
  const toast = useToast();
  const [newStatus, setNewStatus] = useState(order.status);

  const updateOrderStatusMutation = api.order.updateStatus.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })

  useEffect(() => {
    if (newStatus === order.status) return;

    updateOrderStatusMutation.mutate({ id: order.id, status: newStatus })
  }, [newStatus])

  return (
    <Select value={newStatus} onValueChange={(val) => setNewStatus(val as Order["status"])}>
      <SelectTrigger className="border-0 ring-0 focus-visible:ring-0">
        <SelectValue placeholder="Статус заказа" />
      </SelectTrigger>
      <SelectContent>
        {orderStatusEnum.enumValues.map((status) => (
          <SelectItem key={status} value={status}>
            <OrderStatusBadge status={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
