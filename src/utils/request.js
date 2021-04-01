/* eslint-disable indent */
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5 * 1000
})

service.interceptors.request.use(
  config => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
  }
)

// 响应拦截
service.interceptors.response.use(response => {
  const res = response.data
  // console.log('axios res', res)
  if (res.code !== 200) {
    Message({
      message: res.msg || 'Success',
      type: 'success',
      duration: 5 * 1000
    })
  }
  return res
},
  err => {
    Message({
      message: err.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(err)
  })
export default service
