import { api } from "~/trpc/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { format } from "date-fns";
import OrderStatusBadge from "~/components/order_status_badge";
import OrderInfo from "./info";

export default async function Orders() {
  const orders = await api.order.getAll();

  return (
    <div className="w-full space-y-8 overflow-hidden">
      <div className="flex flex-row w-full justify-between">
        <p className="font-bold text-4xl">Заказы</p>
      </div>
      <Table className="text-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Дата доставки</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll">
          {orders.map((order) => (
            <TableRow>
              <TableCell>{format(new Date(), "dd.MM.yyyy")}</TableCell>
              <TableCell>{order.products.reduce((acc, product) => acc + (product.product?.price ?? 0) * product.quantity, 0)}₽</TableCell>
              <TableCell>{format(order.date, "dd.MM.yyyy")}</TableCell>
              <TableCell><OrderStatusBadge status={order.status} /></TableCell>
              <TableCell><OrderInfo order={order} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
