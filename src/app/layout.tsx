import { metadata } from "./metadata";
import "./globals.css";
import Header from "@/components/header";
import { Providers } from "./providers";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
