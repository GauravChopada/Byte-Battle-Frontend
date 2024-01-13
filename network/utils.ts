import { HttpMethodType } from "./networkClient";

export const networkEndpoints = {
  auth: {
    refreshToken: {
      method: HttpMethodType.POST,
      endpoint: '/auth/token'
    },
    googleLogin: {
      method: HttpMethodType.GET,
      endpoint: '/auth/google/login'
    },
    googleCallback: {
      method: HttpMethodType.POST,
      endpoint: '/auth/google/callback'
    },
  },
  user: {
    getAll: {
      method: HttpMethodType.GET,
      endpoint: '/user'
    },
    getById: {
      method: HttpMethodType.GET,
      endpoint: '/user'
    },
    create : {
      method: HttpMethodType.POST,
      endpoint: '/user'
    },
    update: {
      method: HttpMethodType.PUT,
      endpoint: '/user'
    },
    delete: {
      method: HttpMethodType.DELETE,
      endpoint: '/user'
    }
  }
}
