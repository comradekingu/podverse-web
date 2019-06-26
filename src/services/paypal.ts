import axios from 'axios'
import config from '~/config'
const { API_BASE_URL } = config()

export const createPayPalOrder = async (data: any) => {
  return axios(`${API_BASE_URL}/paypal/order`, {
    method: 'post',
    data,
    withCredentials: true
  })
}

export const getPayPalOrderById = async (id: string) => {
  return axios(`${API_BASE_URL}/paypal/order/${id}`, {
    method: 'get',
    withCredentials: true
  })
}
