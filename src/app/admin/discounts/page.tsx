import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import CreateDiscount from "./create";
import { api } from "~/trpc/server";
import Image from "next/image";
import UpdateDiscount from "./update";
import DeleteDiscount from "./delete";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Discounts() {
  const discounts = await api.discount.getAll();

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-row w-full justify-between">
        <p className="font-bold text-4xl">Акции</p>
        <CreateDiscount />
      </div>
      <Table className="overflow-scroll text-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Фото</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Ссылка</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => (
            <TableRow>
              <TableCell>
                <div className="size-16">
                  <Image
                    width={100}
                    height={100}
                    src={discount.image}
                    alt={discount.name}
                    className="rounded-md w-full h-full"
                  />
                </div>
              </TableCell>
              <TableCell>
                {discount.name}
              </TableCell>
              <TableCell>
                <Link href={discount.href}>
                  <Button variant="link" className="p-0 w-fit">
                    {discount.href}
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2 justify-end">
                  <UpdateDiscount discount={discount} />
                  <DeleteDiscount discount={discount} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
