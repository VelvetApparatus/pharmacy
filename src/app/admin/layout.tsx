import { getServerAuthSession } from "~/server/auth"
import NotFoundPage from "../not-found";
import { Button } from "~/components/ui/button";
import { Boxes, Coins, PercentCircle, PhoneCall } from "lucide-react";
import Link from "next/link";

function AdminNavbarItem({
  text,
  href,
  icon
}: {
  text: string;
  href: string;
  icon: React.ReactNode
}) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="gap-2">
        {icon}
        <span className="hidden md:flex">
          {text}
        </span>
      </Button>
    </Link>
  )
}

function AdminNavbar() {
  const iconClass = "size-6 md:size-4";
  return (
    <div className="fixed z-40 bottom-0 md:bottom-auto md:top-[var(--navbar-height)] p-2 left-0 w-screen bg-white border-t shadow-md">
      <div className="container mx-auto flex flex-row gap-4 items-center justify-between md:justify-start">
        <AdminNavbarItem
          text="Товары"
          href="/admin/products"
          icon={<Boxes className={iconClass} />}
        />
        <AdminNavbarItem
          text="Акции"
          href="/admin/discounts"
          icon={<PercentCircle className={iconClass} />}
        />
        <AdminNavbarItem
          text="Обратная связь"
          href="/admin/feedback"
          icon={<PhoneCall className={iconClass} />}
        />
        <AdminNavbarItem
          text="Заказы"
          href="/admin/orders"
          icon={<Coins className={iconClass} />}
        />
      </div>
    </div>
  )
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession();
  if (session?.user.role !== "ADMIN") {
    return <NotFoundPage />
  }

  return (
    <div className="min-h-screen-navbar container mb-16 md:mb-auto md:pt-20 mx-auto p-6 flex">
      <AdminNavbar />
      {children}
    </div>
  )
}
