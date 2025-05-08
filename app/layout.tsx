import type React from "react"
import type { Metadata } from "next"
import { Unbounded, Montserrat } from "next/font/google"
import "./globals.css"

const unbounded = Unbounded({ 
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
})

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Raindots",
  description: "The source of all things Polkadot",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  )
}
