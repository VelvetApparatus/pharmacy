import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import CreateProduct from "./create";
import { api } from "~/trpc/server";
import Image from "next/image";
import { CategoryToData } from "~/shared";
import UpdateProduct from "./update";
import DeleteProduct from "./delete";

export default async function Products() {
  const products = await api.product.getAll();

  return (
    <div className="w-full space-y-8 overflow-hidden">
      <div className="flex flex-row w-full justify-between">
        <p className="font-bold text-4xl">Товары</p>
        <CreateProduct />
      </div>
      <Table className="text-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Фото</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll">
          {[...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products, ...products,]
            .map((product) => (
              <TableRow>
                <TableCell>
                  <div className="size-16">
                    <Image
                      width={100}
                      height={100}
                      src={product.image}
                      alt={product.name}
                      className="rounded-md w-full h-full"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {product.name}
                </TableCell>
                <TableCell>
                  {product.price}руб.
                </TableCell>
                <TableCell>
                  {CategoryToData(product.category).name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2 justify-end">
                    <UpdateProduct product={product} />
                    <DeleteProduct product={product} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
