import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Voxy AI — Multilingual Voice Assistant for Small Businesses",
  description:
    "Voxy converts WhatsApp voice notes in English, Pidgin, and Yoruba into text and generates ready-to-send replies for your business.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

