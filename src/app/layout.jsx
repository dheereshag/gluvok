import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Cookbook",
  description: "Cookbook",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@master/ci.css"
          as="style"
        />
      </head>
      <body className={`${inter.className} max-w-screen-sm mx-auto`}>
        <DataProvider>
          <section>
            <Navbar />
            <hr className="mt-1 mx-4" />
          </section>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
