import request from '@/utils/request'

export function save(data) {
  const commonResquest = {
    head: {
      'version': '1',
      'token': this.$store.state.user.token,
      'businessType': '1',
      'deviceId': '1',
      'deviceType': '0',
      'encrypt': 'false'
    },
    body: {
      data
    }
  }
  return request({
    url: '/company/saveCompany',
    method: 'post',
    data: commonResquest
  })
}

export function del(data) {
  const commonResquest = {
    head: {
      'version': '1',
      'token': this.$store.state.user.token,
      'businessType': '1',
      'deviceId': '1',
      'deviceType': '0',
      'encrypt': 'false'
    },
    body: {
      data
    }
  }
  return request({
    url: '/company/deleteCompany',
    method: 'post',
    data: commonResquest
  })
}

export function update(data) {
  const commonResquest = {
    head: {
      'version': '1',
      'token': this.$store.state.user.token,
      'businessType': '1',
      'deviceId': '1',
      'deviceType': '0',
      'encrypt': 'false'
    },
    body: {
      data
    }
  }
  return request({
    url: '/company/updateCompany',
    method: 'post',
    data: commonResquest
  })
}

export function query(data) {
  const commonResquest = {
    head: {
      'version': '1',
      'token': this.$store.state.user.token,
      'businessType': '1',
      'deviceId': '1',
      'deviceType': '0',
      'encrypt': 'false'
    },
    body: {
      data
    }
  }
  return request({
    url: '/company/queryCompany',
    method: 'post',
    data: commonResquest
  })
}

export function getInfo() {
  const commonResquest = {
    head: {
      'version': '1',
      'token': this.$store.state.user.token,
      'businessType': '1',
      'deviceId': '1',
      'deviceType': '0',
      'encrypt': 'false'
    },
    body: {
      data: {}
    }
  }
  return request({
    url: '/company/getCompanyInfo',
    method: 'post',
    data: commonResquest
  })
}
