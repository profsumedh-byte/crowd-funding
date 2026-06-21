import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import SessionWraper from "./components/SessionWrapper";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Buy Me GTA",
  description: "Curator platform connecting creators with supporters.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-cubist-charcoal bg-cubist-bg">
        <SessionWraper>{children}</SessionWraper>
      </body>
    </html>
  );
}
