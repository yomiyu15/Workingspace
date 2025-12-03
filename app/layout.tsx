import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Replace Geist with Inter (Geist is NOT in next/font/google)
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WorkSpace Hub Addis - ስፋተ ስራ | Flexible Coworking Spaces",
  description:
    "Book premium working spaces in Addis Ababa by the day or month. ሁሉም ለእርስዎ ፈጣን የስራ ቦታ አገናጅ። Find the perfect workspace in Addis Ababa for your productivity needs.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
