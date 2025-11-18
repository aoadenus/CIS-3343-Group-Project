import type { Metadata } from 'next'
import { Open_Sans, Playfair_Display, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../src/styles/globals.css'
import { NextNav } from '../components/NextNav'

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: '--font-open-sans',
  display: 'swap'
});

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Emily Bakes Cakes - Houston Custom Cake Bakery',
  description: 'Houston\'s premier custom cake bakery. Handcrafted cakes made with love for weddings, birthdays, and special celebrations.',
  keywords: 'custom cakes, Houston bakery, wedding cakes, birthday cakes, Emily Bakes Cakes',
  openGraph: {
    title: 'Emily Bakes Cakes - Houston Custom Cake Bakery',
    description: 'Houston\'s premier custom cake bakery. Handcrafted cakes made with love.',
    type: 'website',
    locale: 'en_US',
  },
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${playfairDisplay.variable} ${poppins.variable} antialiased`}>
        <NextNav />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
