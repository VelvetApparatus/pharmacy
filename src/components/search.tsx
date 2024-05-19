"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Search as SearchIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Search() {
  const [query, setQuery] = useState("");
  const [newQuery, setNewQuery] = useState("")

  useEffect(() => {
    const debounce = setTimeout(() => {
      setNewQuery(query)
    }, 500)

    return () => {
      clearTimeout(debounce)
    }
  }, [query])

  const products = api.product.getSearch.useQuery({
    query: newQuery
  }, {
    enabled: !!newQuery
  })

  const [open, setOpen] = useState(false)
  const openRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (newQuery) {
      setOpen(true)
      console.log(open)
    }
  }, [query])

  useEffect(() => {
    if (open && openRef.current) {
      const handleClick = (event: MouseEvent) => {
        if (openRef.current && !openRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener("click", handleClick)
      return () => {
        document.removeEventListener("click", handleClick)
      }
    }
  }, [open])

  return (
    <>
      <div className="h-10 relative grow flex flex-row" ref={openRef}>
        {open && (
          <div className="absolute left-0 right-0 bg-white shadow-xl px-6 py-2 top-12 rounded-xl">
            {products.data && products.data.length !== 0 ? (
              <>
                {products.data?.map((p) => (
                  <Link href={`/product/${p.id}`} key={p.id} onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <div className="size-8">
                        <Image
                          width={50}
                          height={50}
                          className="w-full h-full object-cover rounded-sm"
                          alt={p.name}
                          src={p.image}
                        />
                      </div>
                      <p>{p.name}</p>
                    </Button>
                  </Link>
                ))}
              </>
            ) : (
              <p className="p-2">Ничего не найдено</p>
            )}

          </div>
        )}
        <Input onFocus={() => setOpen(true)} value={query} onChange={(e) => setQuery(e.target.value)} className="w-full" placeholder="Поиск" />
        <div className="absolute right-0 top-0 h-full aspect-square rounded-r-md border-l hover:bg-input flex items-center justify-center hover:text-white pointer-events-none">
          <SearchIcon className="wize-4" />
        </div>
      </div>
    </>
  );
}
