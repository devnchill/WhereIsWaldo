import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import { ScoreProvider } from "./context/score";

export const metadata: Metadata = {
  title: "MapIt",
  description: "Map different states",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="antialiased min-h-screen">
        <ScoreProvider>
          <NavBar />
          {children}
        </ScoreProvider>
      </body>
    </html>
  );
}
