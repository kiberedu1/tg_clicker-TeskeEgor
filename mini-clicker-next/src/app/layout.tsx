import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {Inter} from 'next/font/google'
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Mini Clicker - Игра кликер',
  description: 'Простая игра-кликер для Telegram с минималистичным дизайном',
  manifest: 'manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffeb3b'
}

export default function RootLayout({children}: {children: React.ReactNode}){
  return(
      <html lang="ru">
        <body className={inter.className}>
          <script src='https://telegram.org/js/telegram-web-app.js' async />
        </body>
      </html>
  )
}