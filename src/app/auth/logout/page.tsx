"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    signOut({
      redirect: false
    })
    router.push("/");
  }, [])

  return (
    <div className="h-full w-full flex items-center justify-center">
      Выходим из аккаунта...
    </div>
  )
}
