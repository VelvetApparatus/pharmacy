import OrderStatusBadge from "~/components/order_status_badge";
import { api } from "~/trpc/server";
import RepeatOrderButton from "./repeatOrderButton";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Profile() {
  const orders = await api.order.getOwned();

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {orders.length === 0 && (
        <div className="grow flex flex-col gap-2 items-center justify-center">
          <p className="text-3xl font-bold">Заказы отсутствуют</p>
          <Link href="/">
            <Button>
              На главную
            </Button>
          </Link>
        </div>
      )}
      {orders.map((order) => (
        <div className="w-full rounded-xl border">
          <div className="rounded-t-xl w-full p-4 bg-secondary">
            <p className="text-3xl">Заказ от {format(new Date(), "dd.MM.yyyy")}</p>
            <p>{order.id}</p>
          </div>
          <div className="flex flex-row w-full justify-between p-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-2 items-center">
                <p className="font-semibold">Доставка по адресу</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p>Дата доставки: {format(order.date, "dd.MM.yyyy")}</p>
              <RepeatOrderButton orderId={order.id} />
            </div>
            <div className="h-full aspect-square bg-muted rounded-xl">
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
