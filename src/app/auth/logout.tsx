"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react";

export default function Logout() {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: "/"
    })
  }, [])

  return (
    <div className="h-full w-full flex items-center justify-center">
      Выходим из аккаунта...
    </div>
  )
}
