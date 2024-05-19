import Image from "next/image"
import Link from "next/link"
import ProductCartButton from "~/components/product_cart_button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel"
import { Separator } from "~/components/ui/separator"
import { Category, categoryEnum } from "~/server/db/schema"
import { CategoryToData, Discount, Product } from "~/shared"
import { api } from "~/trpc/server"
import bannerPic from "../../public/banner.png"
import mobileBannerPic from "../../public/mobile_banner.png"

function Banner() {
  return (
    <div className="w-full bg-muted rounded-xl">
      <Image
        className="w-full object-cover hidden md:block"
        src={bannerPic}
        alt="Banner"
        priority
      />
      <Image
        className="w-full object-cover md:hidden"
        src={mobileBannerPic}
        alt="Banner"
        priority
      />
    </div>
  )
}

function OrderTutorialStep({
  index,
  text
}: {
  index: number,
  text: string
}) {
  return (
    <div className="flex flex-row md:flex-col items-center gap-1">
      <div className="md:w-full w-fit grid grid-cols-1 md:grid-cols-3 gap-0.5 items-center justify-center">
        {index > 1 ? (
          <div className="md:h-1 ml-[1.375rem] md:m-0 h-4 w-1 md:rounded-r-full bg-foreground md:w-full">
          </div>
        ) : (
          <span className=""></span>
        )}
        <div className="flex w-fit md:w-full items-center justify-center">
          <div className="size-12 text-2xl font-bold rounded-md bg-primary text-primary-foreground flex items-center justify-center">
            {index}
          </div>
        </div>
        {index < 5 ? (
          <div className="md:h-1 rounded-l-full bg-foreground md:w-full">
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <p className={`text-center ${index !== 1 ? "mt-4" : ""} md:m-0 text-sm px-2`}>{text}</p>
    </div>
  )
}

function OrderTutorial() {
  return (
    <div className="flex flex-col gap-8">
      <p className="md:text-center font-bold text-2xl">Как оформить заказ?</p>
      <div className="grid grid-cols-1 md:grid-cols-5">
        <OrderTutorialStep index={1} text="Воспользуйтесь поиском товара или каталогом" />
        <OrderTutorialStep index={2} text="Добавьте товар в корзину" />
        <OrderTutorialStep index={3} text="Выберите удобный способ получения" />
        <OrderTutorialStep index={4} text="Дождитесь уведомления о готовности заказа" />
        <OrderTutorialStep index={5} text="Получите заказ и будьте здоровы!" />
      </div>
    </div>
  )
}

async function Discounts() {
  const discounts = await api.discount.getAll();

  return (
    <div className="flex flex-col gap-8">
      <p className="font-bold text-2xl">Акции</p>
      <Carousel>
        <CarouselContent>
          {discounts.map((d) => (
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link href={d.href} className="w-full">
                <div className="w-full aspect-video">
                  <Image
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover rounded-xl"
                    src={d.image}
                    alt={d.name}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function CategoryCard({
  category
}: {
  category: Category
}) {
  const data = CategoryToData(category);
  return (
    <Link href={`/category/${category.toLowerCase()}`} className="shadow-md hover:scale-105 hover:shadow-xl flex flex-row gap-2 p-4 items-center rounded-xl transition-all ease-in-out duration-300">
      <Image
        width={1000}
        height={1000}
        className="size-14"
        src={data.icon}
        alt={data.name}
      />
      <p className="text-sm">{data.name}</p>
    </Link>
  );
}

function Categories() {
  return (
    <div className="flex flex-col gap-8">
      <p className="font-bold text-2xl">Категории</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categoryEnum.enumValues.map((c) => (
          <CategoryCard category={c} />
        ))}
      </div>
    </div>
  )
}

export function ProductCard({
  product
}: {
  product: Product
}) {
  return (
    <div
      className="flex flex-col gap-2 shadow-md hover:shadow-xl transition-all ease-in-out duration-300 p-4 rounded-xl hover:scale-105">
      <Link href={`/product/${product.id}`} className="flex flex-col gap-2">
        <Image
          width={1000}
          height={1000}
          className="w-full aspect-square object-cover"
          src={product.image}
          alt={product.name}
        />
        <p className="text-sm line-clamp-2 truncate">{product.name}</p>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm">Цена:</p>
          <p className="font-bold text-xl">{product.price}₽</p>
        </div>
      </Link>
      <ProductCartButton productId={product.id} />
    </div>
  );
}

async function Products() {
  const products = await api.product.getAll();

  return (
    <div className="flex flex-col gap-8">
      <p className="font-bold text-2xl">Товары</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard product={p} />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <div className="container mx-auto px-6 py-8 lg:px-20 space-y-8">
      <Banner />
      <Separator />
      <OrderTutorial />
      <Separator />
      <Discounts />
      <Separator />
      <Categories />
      <Separator />
      <Products />
    </div>
  )
}
