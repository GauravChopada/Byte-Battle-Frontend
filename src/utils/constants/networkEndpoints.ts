export enum HttpMethodType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

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
      method: HttpMethodType.PATCH,
      endpoint: '/user'
    },
    delete: {
      method: HttpMethodType.DELETE,
      endpoint: '/user'
    }
  },
  quest: {
    getAll: {
      method: HttpMethodType.GET,
      endpoint: '/quest/dsa'
    },
    getById: {
      method: HttpMethodType.GET,
      endpoint: '/quest/dsa/:questId'
    },
    create : {
      method: HttpMethodType.POST,
      endpoint: '/quest/dsa'
    },
    update: {
      method: HttpMethodType.PATCH,
      endpoint: '/quest/dsa/:questId'
    },
    delete: {
      method: HttpMethodType.DELETE,
      endpoint: '/quest/dsa/:questId'
    },

    language: {
      getAll: {
        method: HttpMethodType.GET,
        endpoint: '/quest/dsa/:questId/language'
      },
      get: {
        method: HttpMethodType.GET,
        endpoint: '/quest/dsa/:questId/language/:language'
      },
      create: {
        method: HttpMethodType.POST,
        endpoint: '/quest/dsa/:questId/language'
      },
      update: {
        method: HttpMethodType.PATCH,
        endpoint: '/quest/dsa/:questId/language/:language'
      },
      delete: {
        method: HttpMethodType.DELETE,
        endpoint: '/quest/dsa/:questId/language/:language'
      }
    },
    testCase: {
      getAll: {
        method: HttpMethodType.GET,
        endpoint: '/quest/dsa/:questId/testcase'
      },
      get: {
        method: HttpMethodType.GET,
        endpoint: '/quest/dsa/:questId/testcase/:testCaseId'
      },
      create: {
        method: HttpMethodType.POST,
        endpoint: '/quest/dsa/:questId/testcase'
      },
      update: {
        method: HttpMethodType.PATCH,
        endpoint: '/quest/dsa/:questId/testcase/:testCaseId'
      },
      delete: {
        method: HttpMethodType.DELETE,
        endpoint: '/quest/dsa/:questId/testcase/:testCaseId'
      }
    }
  }
}
