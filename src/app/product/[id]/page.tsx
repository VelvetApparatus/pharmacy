import Image from "next/image";
import NotFoundPage from "~/app/not-found";
import ProductCartButton from "~/components/product_cart_button";
import { api } from "~/trpc/server";

export default async function ProductPage({
  params
}: {
  params: {
    id: string;
  }
}) {
  const product = await api.product.getOne({ id: params.id });

  if (!product) {
    return <NotFoundPage />
  }

  return (
    <div className="w-screen container mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-12 min-h-screen-navbar py-10 px-6">
      <p className="lg:hidden w-full text-center flex items-center justify-center font-bold text-3xl max-w-[80vw] mx-auto">{product.name}</p>
      <div className="lg:col-span-2 flex justify-center items-center lg:block">
        <Image
          width={2000}
          height={2000}
          className="w-[max(50vw,400px)] lg:w-full aspect-square object-cover rounded-xl"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="lg:col-span-3 flex flex-col gap-4">
        <p className="hidden lg:flex font-bold text-3xl">{product.name}</p>
        <p className="flex flex-row gap-1">
          <span className="text-muted-foreground">Производитель:</span>
          {product.manufacturer}
        </p>
        <p className="flex flex-row gap-1">
          <span className="text-muted-foreground">Страна производитель:</span>
          {product.manufacturerCountry}
        </p>

        <p className="flex flex-row gap-1">
          <span className="text-muted-foreground">Действующее вещество:</span>
          {product.activeSubstance}
        </p>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-2 w-full row-start-3 lg:row-start-auto">
        <div className="flex flex-row gap-2 items-center w-full">
          <p>Цена:</p>
          <p className="font-bold text-2xl">{product.price}₽</p>
        </div>
        <ProductCartButton productId={product.id} />
      </div>
    </div>
  )
}
