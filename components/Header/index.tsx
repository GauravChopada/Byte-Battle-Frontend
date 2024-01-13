'use client'

import { Fragment, useEffect } from "react"
import { usePathname, useRouter } from 'next/navigation'
import classNames from "classnames"
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

import { useAuth } from "../../context/auth"
import Avatar from "../Avatar"
import ByteBattleLogo from "../ByteBattleLogo"
import styles from "./Header.module.scss"
import refreshToken from "../../network/refreshToken"

const Header = () => {
  // init
  const { user, setUser } = useAuth()
  const currentPath = usePathname()
  const router = useRouter()
  const navigationTabs = ['Challenges', 'Quests', 'Admins']

  // flag used to hide header
  const showHeader = currentPath !== '/login'

  // handles navigation indicator animations
  const handleIndicator = (el: any) => {
    const indicator = document.querySelector('[class*="__NavigationIndicator"]') as HTMLDivElement
    const items = document.querySelectorAll('[class*="__NavigationItem"]')

    items.forEach((item) => {
      item.classList.remove('is-active');
      item.removeAttribute('style');
    });

    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;

    el.classList.add('is-active');
    el.style.fontWeight = '500';
    el.style.color = 'white';
  }

  // handles navigation tab click
  const onNavigationItemClick = (event: any) => {
    localStorage.setItem('lastTab', event.target.id)
    handleIndicator(event.target)
    router.push(`/${event.target.id}`)
  }

  // authenticate user on page load, set user payload in context.
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      const tokenPayload = jwt.decode(accessToken) as JwtPayload
      const tokenExpiresAt = ( tokenPayload?.exp ?? 0 ) * 1000
      const currentTimestamp = new Date().getTime()
      const isExpired = tokenExpiresAt < currentTimestamp

      if (isExpired) {
        refreshToken().catch(() => {
          router.push('/login')
        })
      }

      if (tokenPayload?.user) {
        setUser(tokenPayload?.user)
      }
    }
  }, [setUser, router])

  // navigate to last page visit on page load
  useEffect(() => {
    const path = currentPath === '/' ? localStorage.getItem('lastTab') ?? 'challenges' : currentPath.substring(1)
    const targetElement = document.getElementById(path)

    if (targetElement) {
      handleIndicator(targetElement)
    }
  })

  return (
    <Fragment>
      {showHeader && <header className={styles.Header}>
        <div className={styles.Header__TopBar}>
          {/* Left Side */}
          <ByteBattleLogo />

          {/* Tabs */}
          <nav className={styles.Header__NavigationBar}>
            {navigationTabs.map((tab) => (
              <button key={tab.toLowerCase()} id={tab.toLowerCase()} onClick={onNavigationItemClick} className={classNames(styles.Header__NavigationItem)}>{tab}</button>
            ))}
            <span className={styles.Header__NavigationIndicator} />
          </nav>

          {/* Right Side */}
          <Avatar src={user?.picture ?? ''} name={user?.firstName ? `${user.firstName} ${user.lastName}` : null} />
        </div>
      </header>}
    </Fragment>
  )
}

export default Header
