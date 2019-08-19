import request from '@/utils/request'

export function login(data) {
  const commonResquest = {
    head: {
      'version': '1',
      'token': '1',
      'businessType': '1',
      'deviceId': '1',
      'deviceType': '0',
      'encrypt': 'false'
    },
    body: {
      data: {
        'code': data.username,
        'password': data.password
      }
    }
  }
  return request({
    url: '/login/check',
    method: 'post',
    data: commonResquest
  })
}

export function getInfo(token) {
  console.log(token)
  return request({
    url: '/login/getInfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getMenu(token) {
  return request({
    url: '/user/menu',
    method: 'get',
    params: { token }
  })
}
