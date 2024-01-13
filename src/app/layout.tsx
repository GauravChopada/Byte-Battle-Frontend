import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.scss'
import ContextProvider from '../../context/providers'
import Header from '../../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Byte Battle',
  description: 'Code me if you can',
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <Toaster position='top-right' />
          <Header />
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
