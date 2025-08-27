import { Roboto } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "3twenty Admin",
  description: "Control panel for 3twenty coin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
