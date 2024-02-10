import { isAxiosError } from "axios"

import { HttpMethodType } from "@/utils/constants/networkEndpoints"
import axiosClient from "./axiosClient"

export interface NetworkClientInputs {
  method: HttpMethodType
  endpoint: string
  body?: any
  params?: any
  withCredentials? : boolean
}

const client = axiosClient()

const networkClient = async ({ method, endpoint, body, params, withCredentials = true }: NetworkClientInputs) => {
  let response

  try {
    switch (method) {
      case HttpMethodType.GET:
        response = await client.get(endpoint, { params, withCredentials })
        break

      case HttpMethodType.POST:
        response = await client.post(endpoint, body, { withCredentials })
        break

      case HttpMethodType.PUT:
        response = await client.put(endpoint, body, { withCredentials })
        break

      case HttpMethodType.PATCH:
        response = await client.patch(endpoint, body, { withCredentials })
        break

      case HttpMethodType.DELETE:
        response = await client.delete(endpoint, { withCredentials })
        break

      default:
        throw new Error('Invalid method')
    }
    return response
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error
      return response
    }
    throw error
  }
}

export default networkClient
