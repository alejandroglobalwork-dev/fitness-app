import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutrition App",
  description: "Menús, platos y lista de la compra a partir de tu dieta diaria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
