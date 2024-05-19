
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CartButton() {
  return (
    <Link href="/cart">
      <CartButtonWithoutProvider />
    </Link>
  )
}

function CartButtonWithoutProvider() {
  return (
    <Button className="transition-all ease-in-out duration-300 hover:scale-105 flex flex-col gap-1 h-fit w-fit justify-center items-center" variant="ghost">
      <ShoppingCart className="size-5 md:size-1/2 aspect-square" />
      <p className="text-xs hidden md:flex">Корзина</p>
    </Button>
  )
}
