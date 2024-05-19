"use client";

import NotFoundPage from "../not-found";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Image from "next/image";
import ProductCartButton from "~/components/product_cart_button";
import { ScrollArea } from "~/components/ui/scroll-area";
import ClearCartButton from "./clear";
import Checkout from "./checkout";
import CartTotal from "./total";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CartPage() {
  return (
    <SessionProvider>
      <CartPageWithoutProvider />
    </SessionProvider>
  )
}

function CartPageWithoutProvider() {
  const session = useSession();

  useEffect(() => {
    const interval = setInterval(() => session.update(), 1000)
    return () => clearInterval(interval)
  }, [session.update])

  return (
    <>
      {session.status !== "unauthenticated" ? (
        <>
          {session.data?.user.cartProducts.length === 0 ? (
            <div className="container mx-auto flex flex-col h-screen-navbar items-center justify-center gap-2">
              <p className="text-4xl font-bold">Корзина пуста</p>
              <Link href="/">
                <Button>
                  На главную
                </Button>
              </Link>
            </div>
          ) : (
            <div className="container mx-auto flex flex-col md:h-screen-navbar py-8 gap-4 overflow-hidden">
              <div className="">
                <p className="text-2xl font-bold">Ваша корзина</p>
              </div>
              <div className="flex flex-col w-full gap-2 md:hidden">
                {session.data?.user.cartProducts
                  .map((product) => (
                    <div className="flex flex-row items-center gap-4">
                      <div className="size-48">
                        <Image
                          width={100}
                          height={100}
                          src={product.product.image}
                          alt={product.product.name}
                          className="rounded-md w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2 h-full justify-between">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold">{product.product.name}</p>
                          <p className="text-2xl">{product.product.price}₽</p>
                        </div>
                        <ProductCartButton session={session.data} productId={product.product.id} />
                      </div>
                    </div>
                  ))}
              </div>
              <ScrollArea className="overscroll-none grow">
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow className="hover:bg-background bg-background">
                      <TableHead>Препарат</TableHead>
                      <TableHead>Количество</TableHead>
                      <TableHead>Цена</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-scroll overscroll-none h-full">
                    {session.data?.user.cartProducts
                      .map((product) => (
                        <TableRow>
                          <TableCell>
                            <div className="flex flex-row items-center gap-2">
                              <div className="size-32">
                                <Image
                                  width={100}
                                  height={100}
                                  src={product.product.image}
                                  alt={product.product.name}
                                  className="rounded-md w-full h-full object-cover"
                                />
                              </div>
                              <p className="font-bold">{product.product.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <ProductCartButton productId={product.product.id} />
                          </TableCell>
                          <TableCell>
                            {product.product.price}₽
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="flex flex-col w-full gap-2">
                <div className="w-full flex flex-row gap-2 justify-end items-center">
                  <p className="font-bold text-xl">Итого:</p>
                  <CartTotal />
                </div>
                <div className="flex flex-row w-full justify-end gap-4">
                  <ClearCartButton />
                  <Checkout />
                </div>
              </div>
            </div >
          )
          }
        </>
      ) : (
        <NotFoundPage />
      )}

    </>
  );
}
