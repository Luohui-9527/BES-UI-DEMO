import { commonRequestUtil, userRequestApi } from '@/utils/requestUtils'

export function save(data) {
  const commonResquest = commonRequestUtil(data)
  return userRequestApi('/company/saveCompany', 'post', commonResquest)
}

export function del(data) {
  const commonResquest = commonRequestUtil(data)
  return userRequestApi('/company/deleteCompany', 'delete', commonResquest)
}

export function update(data) {
  const commonResquest = commonRequestUtil(data)
  return userRequestApi('/company/updateCompany', 'put', commonResquest)
}

export function query(data) {
  const commonResquest = commonRequestUtil(data)
  return userRequestApi('/company/deleteCompany', 'post', commonResquest)
}

export function getData() {
  const commonResquest = commonRequestUtil()
  return userRequestApi('/company/getCompanyInfo', 'post', commonResquest)
}
