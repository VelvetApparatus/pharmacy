import { format } from "date-fns";
import { Badge, BadgeInfo, Calendar, Info, Mail, Map, MessagesSquare, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Order } from "~/shared";
import UpdateOrderStatus from "./update_status";

export default function OrderInfo({
  order
}: {
  order: Order
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Заказ от {format(order.date, "dd.MM.yyyy")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Information
            title="Фио"
            value={order.user?.name}
            icon={<User className="size-4" />}
          />
          <Information
            title="Email"
            value={order.user?.email}
            icon={<Mail className="size-4" />}
          />
          <Information
            title="Адрес доставки"
            value={order.address}
            icon={<Map className="size-4" />}
          />
          <Information
            title="Дата доставки"
            value={format(order.date, "dd.MM.yyyy")}
            icon={<Calendar className="size-4" />}
          />
          <Information
            title="Комментарий"
            value={order.comment}
            icon={<MessagesSquare className="size-4" />}
          />
          <div className="flex flex-row gap-2 items-center">
            <span className="text-muted-foreground flex flex-row gap-1 items-center">
              <BadgeInfo className="size-4" />
              Статус:
            </span>
            <UpdateOrderStatus order={order} />
          </div>
          <Separator />
          <div className="max-h-[40svh] overflow-scroll">
            <Table className="w-full overflow-scroll">
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-scroll">
                {[...order.products, ...order.products, ...order.products, ...order.products]
                  .map((product) => (
                    <TableRow>
                      <TableCell>{product.product?.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.product?.price}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <p className="text-xl font-bold">
              Итого: {order.products.reduce((acc, product) => acc + (product.product?.price ?? 0) * product.quantity, 0)}₽
            </p>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function Information({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | null | undefined;
  icon: React.ReactNode
}) {
  return (
    <>
      {value && (
        <div className="flex flex-row gap-2 items-center">
          <span className="text-muted-foreground flex flex-row gap-1 items-center">
            {icon}
            {title}:
          </span>
          <p>{value}</p>
        </div>
      )}
    </>
  )
}
