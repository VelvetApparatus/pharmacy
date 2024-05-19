import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="h-screen-navbar flex items-center justify-center gap-4 flex-col">
      <p className="text-9xl md:text-[11rem]/[12rem] lg:text-[12rem]/[13rem] font-bold">404</p>
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-3xl text-foreground/60">Страница не найдена</p>
        <Link href="/">
          <Button size="lg">
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
