"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CartTotal() {
  return (
    <SessionProvider>
      <CartTotalWithoutProvider />
    </SessionProvider>
  )
}

function CartTotalWithoutProvider() {
  const session = useSession();

  useEffect(() => {
    const interval = setInterval(() => session.update(), 1000)
    return () => clearInterval(interval)
  }, [session.update])

  return (
    <p className="text-2xl">
      {session.data?.user.cartProducts.reduce((acc, product) => acc + product.product.price * product.quantity, 0) ?? 0}₽
    </p>
  );
}
