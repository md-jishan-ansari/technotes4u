import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from 'next/font/google';
import ContextProviders from "../providers/ContextProviders";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const poppins = Poppins({subsets: ['latin'], weight: ['400', '500', '600', '700']});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-bgPrimary`}
      >
        <ContextProviders>
          <div className="flex flex-col min-h-screen">
              <Navbar />
              {children}
              <Footer />
        </div>
        </ContextProviders>
      </body>
    </html>
  );
}
