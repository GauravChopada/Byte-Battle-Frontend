'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'

import { networkEndpoints } from '@/utils/constants/networkEndpoints'
import BinaryAnimation from '@/components/BinaryAnimation'
import ByteBattleLogo from '@/components/ByteBattleLogo'
import googleSVG from '@/utils/Icons/Google.svg'
import LoadingSpinner from '@/components/LoadingSpinner'
import networkClient from '@/network/networkClient'
import styles from './login.module.scss'
import type { NetworkClientInputs } from '@/network/networkClient'

const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const webBaseURL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

const callbackURL = `${webBaseURL}/login`

const LoginPage = () => {
  // init
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // action for on click of google sso button.
  const loginWithGoogle = async () => {
    setIsLoading(true)
    const authURL = new URL(`${serverBaseURL}/v1${networkEndpoints.auth.googleLogin.endpoint}`)
    authURL.searchParams.append('redirect_uri', callbackURL)
    window.location.href = authURL.toString()
  }

  // handle google callback
  useEffect(() => {
    // get code from url
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code')

    // if code is present, call google callback endpoint
    if (authCode) {
      setIsLoading(true)
      const networkInput = {
        ...networkEndpoints.auth.googleCallback,
        body: {
          redirect_uri: callbackURL,
          code: authCode
        },
        withCredentials: false
      } as NetworkClientInputs

      networkClient(networkInput).then((response) => {
        setIsLoading(false)

        // if api success, store tokens in local storage.
        if (response?.status == 200) {

          localStorage.setItem('accessToken', response?.data.access_token);
          localStorage.setItem('refreshToken', response?.data.refresh_token);
          router.push('/')
        } else {
          console.error(response)
          const errorMessage = response?.status && response?.status < 500 ? response?.data?.description : 'Something went wrong'
          toast.error(errorMessage)
        }
      }).catch((err) => {
        console.error(err)
        toast.error('Something went wrong')
      })
    }
  }, [router])

  return (
    <main className={styles.LoginPage}>
      <div className={styles.LoginPage__LeftSide}>
        <BinaryAnimation />
      </div>
      <div className={styles.LoginPage__PageContent}>
        {/* Logo */}
        <div className={styles.LoginPage__LogoContainer}>
          <ByteBattleLogo />
        </div>

        {/* Log in Button */}
        <div className={styles.LoginPage__LoginButtonContainer}>
          {isLoading && <div className={styles.LoginPage__LoadingSpinner}>
            <LoadingSpinner />
          </div>}

          {!isLoading && <button onClick={loginWithGoogle} className={styles.LoginPage__LoginButton}>
            <Image className={styles.LoginPage__GoogleIcon} src={googleSVG} alt='Sign In with Google' />
            <span>Sign In with Google</span>
          </button>}
        </div>
      </div>
    </main>
  )
}

export default LoginPage
