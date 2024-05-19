import { User } from "lucide-react";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

async function ProfileNavbar() {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-full md:w-[400px] flex flex-col py-4 px-8 rounded-xl shadow-md border gap-10">
      <div className="flex flex-row md:flex-col gap-4 w-full items-center justify-center">
        <div className="w-1/2 aspect-square rounded-full bg-muted flex items-center justify-center">
          <User className="size-1/2" />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="md:text-4xl font-bold text-center">{session?.user.name}</p>
          <p className="hidden md:block text-center">{session?.user.email}</p>
          <Link href="/admin/orders" className="hover:text-primary hover:underline flex md:hidden">
            Админ панель
          </Link>
        </div>
      </div>
      {session?.user.role === "ADMIN" && (
        <div className="hidden md:flex flex-col gap-2">
          <p className="text-3xl font-bold">Администратор</p>
          <Link href="/admin/orders" className="hover:text-primary hover:underline">
            Админ панель
          </Link>
        </div>

      )}
      <div className="hidden md:flex flex-col gap-2">
        <p className="text-3xl font-bold">Заказы</p>
        <Link href="/profile" className="hover:text-primary hover:underline">
          Итория покупок
        </Link>
      </div>
      <div className="hidden md:flex flex-col gap-2">
        <p className="text-3xl font-bold">Аккаунт</p>
        <Link href="/auth/logout" className="text-destructive hover:underline">
          Выйти
        </Link>
      </div>
    </div>
  );
}

export default function ProfileLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 min-h-screen-navbar">
      <ProfileNavbar />
      <div className="grow border rounded-xl p-6 shadow-md">
        {children}
      </div>
    </div>
  )
}
