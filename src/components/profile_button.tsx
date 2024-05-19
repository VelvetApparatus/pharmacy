"use client";

import { Loader, LogIn, User } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import LoginModal from "~/app/auth/login/page";

export default function ProfileButton() {
  return (
    <SessionProvider>
      <ProfileButtonWithoutProvider />
    </SessionProvider>
  )
}

function ProfileButtonWithoutProvider() {
  const session = useSession();

  return (
    <>
      {session.status === "loading" ? (
        <span className="animate-spin">
          <Loader className="size-5" />
        </span>
      ) : (
        <>
          {session.status === "authenticated" ? (
            <Link href="/profile" className="transition-all ease-in-out duration-300 hover:scale-105">
              <Button className="flex flex-col gap-1 h-fit w-fit justify-center items-center" variant="ghost">
                <User className="size-5 md:size-1/2 aspect-square" />
                <p className="text-xs hidden md:flex">Профиль</p>
              </Button>
            </Link>
          ) : (
            <LoginModal />
          )}

        </>
      )}
    </>
  )
}
