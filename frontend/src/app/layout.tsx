import type { Metadata } from "next";
import "./globals.css";

import { Inter } from 'next/font/google';
import ReduxProvider from "../redux/ReduxProvider";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ToastifyContainer from "../components/ToastifyContainer";
import PrelineScript from "../components/ PrelineScript";

const inter = Inter({subsets: ['latin'], weight: ['400', '500', '600', '700']});

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
    <html lang="en" suppressHydrationWarning >
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-background `}
      >
        <ReduxProvider>
          <ToastifyContainer />
          <div className="flex flex-col min-h-screen">
              <Navbar />
              {children}

          </div>
        </ReduxProvider>
      </body>
      <PrelineScript />
    </html>
  );
}
