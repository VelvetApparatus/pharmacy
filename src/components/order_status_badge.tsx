import { cn } from "~/lib/utils";
import { OrderStatus } from "~/server/db/schema";


export default function OrderStatusBadge({
  status
}: {
  status: OrderStatus
}) {
  let data: {
    color: string;
    text: string;
  }

  switch (status) {
    case "PROCESSING": data = {
      color: "bg-amber-400",
      text: "В обработке"
    }; break;
    case "DELIVERY": data = {
      color: "bg-blue-400",
      text: "Доставка"
    }; break;
    case "DELIVERED": data = {
      color: "bg-green-400",
      text: "Доставлен"
    }; break;
    case "ACCEPTED": data = {
      color: "bg-gray-400",
      text: "Принят"
    }; break;
  }

  return (
    <span
      className={cn(
        "inline-flex text-white items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-nowrap",
        data.color
      )}
    >
      {data.text}
    </span>
  );
}
