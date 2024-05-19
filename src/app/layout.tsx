import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Аптека",
  description: "Описание",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans mt-[var(--mobile-navbar-height)] md:mt-[var(--navbar-height)] ${inter.variable}`}>
        <TRPCReactProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
