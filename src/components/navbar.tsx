import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Search from "./search";
import ProfileButton from "./profile_button";
import Link from "next/link";
import CartButton from "./cart_button";
import LogoPic from "../../public/logo.svg";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="transition-all ease-in-out duration-300 hover:scale-105">
      <Image
        src={LogoPic}
        alt="logo"
        className="size-16"
      />
    </Link>
  )
}

export function CatalogButton() {
  return (
    <Link href="/catalog">
      <Button className="gap-2">
        <Menu />
        Каталог
      </Button>
    </Link>
  )
}

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-screen h-[var(--mobile-navbar-height)] md:h-[var(--navbar-height)] bg-white shadow-lg z-30 flex flex-col gap-2">
      <div className="flex flex-row container mx-auto justify-between items-center h-20 gap-8 px-4">
        <Logo />
        <div className="flex flex-row items-center gap-4 grow">
          <CatalogButton />
          <span className="hidden md:flex grow">
            <Search />
          </span>
        </div>
        <div className="flex flex-row items-center gap-1 md:gap-4">
          <CartButton />
          <ProfileButton />
        </div>
      </div>
      <div className="container mx-auto flex items-center p-2 px-4 md:hidden">
        <Search />
      </div>
    </div>
  );
}
