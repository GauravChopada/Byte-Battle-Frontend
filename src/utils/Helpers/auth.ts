import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

/**
 * @param {string} token - JWT token
 * @returns {boolean} - true if token is expired, false otherwise
 * @description - Checks if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true
  }

  const tokenPayload = jwt.decode(token) as JwtPayload
  const tokenExpiresAt = ( tokenPayload?.exp ?? 0 ) * 1000
  const currentTimestamp = new Date().getTime()
  const isExpired = tokenExpiresAt < currentTimestamp

  return isExpired
}

/**
 * @description - Removes access token and refresh token from local storage
 */
export const clearLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
