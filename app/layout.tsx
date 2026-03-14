import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MapIt",
  description: "Map different states",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="antialiased min-h-screen">
        <header>
          <nav className="h-15">NavBar</nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
