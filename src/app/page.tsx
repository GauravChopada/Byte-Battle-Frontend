'use client'

import { redirect, usePathname } from 'next/navigation'

export default function Home() {
  const currentPath = usePathname()
  const path = currentPath === '/' ? localStorage.getItem('lastTab') ?? 'challenges' : currentPath.substring(1)
  redirect(`/${path}`)
}
