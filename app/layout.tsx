import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import SiteHeader from '@/app/components/templates/SiteHeader'
import Footer from '@/app/components/templates/Footer'
import { Geist, Geist_Mono } from 'next/font/google'
import AuthSync from '@/app/components/utilities/AuthSync'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Catherine Idalia Dance',
  description: 'Dance course',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <ClerkProvider>
          <AuthSync />
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  )
}