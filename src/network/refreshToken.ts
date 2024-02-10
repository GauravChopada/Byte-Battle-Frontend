import axios from "axios";

import { networkEndpoints } from "../utils/constants/networkEndpoints";

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1`;

const refreshToken = async () => {
  const axiosPrivate = axios.create({ baseURL });

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('Refresh Token not found');
  }

  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }

  // request to refresh token endpoint
  const { data, status } = await axiosPrivate.post(networkEndpoints.auth.refreshToken.endpoint, body)

  // if successful, update local storage with new access token and expires_at
  if (status === 200) {
    // update local storage with new access token
    localStorage.setItem('accessToken', data.access_token);
    return data.access_token;
  }
  throw new Error('Refresh Token failed');
}

export default refreshToken;
