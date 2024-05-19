import Image from "next/image";
import Link from "next/link";
import NotFoundPage from "~/app/not-found";
import RenderMDX from "~/components/mdx";
import ProductCartButton from "~/components/product_cart_button";
import { Button } from "~/components/ui/button";
import { Category, categoryEnumSchema } from "~/server/db/schema";
import { CategoryToData } from "~/shared";
import { api } from "~/trpc/server";

export default async function CategoryPage({
  params
}: {
  params: {
    id: string;
  }
}) {
  if (!categoryEnumSchema.safeParse(params.id.toUpperCase()).success) {
    return <NotFoundPage />
  }

  const data = CategoryToData(params.id.toUpperCase() as Category);
  const products = await api.product.getByCategory({
    category: params.id.toUpperCase() as Category
  })

  return (
    <div className="flex w-full h-full flex-col">
      <p className="container mx-auto flex items-center text-center h-16 p-6 text-2xl font-bold">
        {data.name}
      </p>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100svh-var(--navbar-height)-4rem)] text-2xl text-center md:text-4xl font-bold">
          В категории пока что нет товаров
          <Link href="/">
            <Button>
              На главную
            </Button>
          </Link>
        </div>
      ) : (
        <div className="min-h-[calc(100svh-var(--navbar-height)-4rem)] flex flex-col">
          {products.map((p) => (
            <div className="p-6 border-b transition-all ease-in-out duration-300 hover:bg-secondary">
              <div className="container mx-auto flex flex-col lg:flex-row gap-1 lg:gap-8">
                <Link href={`/product/${p.id}`} className="flex flex-col md:flex-row grow gap-8">
                  <div className="w-full aspect-square lg:size-40">
                    <Image
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-xl"
                      src={p.image}
                      alt={p.name}
                    />
                  </div>
                  <div className="grow flex flex-col">
                    <p className="font-bold">{p.name}</p>

                    <div className="flex-col hidden lg:flex">
                      <p className="flex flex-row gap-1">
                        <span className="text-muted-foreground">Производитель:</span>
                        {p.manufacturer}
                      </p>
                      <p className="flex flex-row gap-1">
                        <span className="text-muted-foreground">Страна производитель:</span>
                        {p.manufacturerCountry}
                      </p>

                      <p className="flex flex-row gap-1">
                        <span className="text-muted-foreground">Действующее вещество:</span>
                        {p.activeSubstance}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center w-full">
                    <p>Цена:</p>
                    <p className="font-bold text-2xl">{p.price}₽</p>
                  </div>
                  <ProductCartButton productId={p.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <RenderMDX
        category={params.id.toUpperCase() as Category}
      />
    </div>
  );
}
