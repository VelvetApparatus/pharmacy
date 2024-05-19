"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { api } from "~/trpc/react";
import { useToast } from "./ui/use-toast";
import { Session } from "next-auth";

export default function ProductCartButton({
  productId,
  session
}: {
  productId: string,
  session?: Session
}) {
  return (
    <SessionProvider session={session}>
      <ProductCartButtonWithoutProvider productId={productId} />
    </SessionProvider>
  )
}

function ProductCartButtonWithoutProvider({
  productId,
}: {
  productId: string
}) {
  const session = useSession();

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setQuantity(session.data?.user.cartProducts.find((p) => p.productId === productId)?.quantity ?? 0)
  }, [session.data])

  const toast = useToast();

  const inrementProductMutation = api.cart.increment.useMutation({
    onSuccess: () => {
      session.update();
    },
    onError: () => {
      toast.toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении в корзину",
        variant: "destructive",
      })
    }

  })
  return (
    <>
      {quantity === 0 ? (
        <Button className="w-fit px-6 py-4"
          onClick={() => {
            if (!session.data?.user.id) {
              toast.toast({
                title: "Ошибка",
                description: "Для добавления в корзину необходима авторизация",
                variant: "destructive",
              })
              return;
            }
            inrementProductMutation.mutate({ productId, increment: 1 })
          }}
        >
          В корзину
        </Button>
      ) : (
        <div className="grid grid-cols-4 w-fit">
          <Button size="icon"
            onClick={() => {
              if (!session.data?.user.id) {
                toast.toast({
                  title: "Ошибка",
                  description: "Для добавления в корзину необходима авторизация",
                  variant: "destructive",
                })
                return;
              }
              inrementProductMutation.mutate({ productId, increment: -1 })
            }}
          >
            <Minus />
          </Button>
          <p className="text-center col-span-2 text-xl my-auto"
          >
            {quantity}
          </p>
          <Button size="icon"
            onClick={() => {
              if (!session.data?.user.id) {
                toast.toast({
                  title: "Ошибка",
                  description: "Для добавления в корзину необходима авторизация",
                  variant: "destructive",
                })
                return;
              }

              inrementProductMutation.mutate({ productId, increment: 1 })
            }}
          >
            <Plus />
          </Button>
        </div>
      )}
    </>
  )
}
