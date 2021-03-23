export function login (data) {
  return this.$request({
    url: '/api/user/login',
    method: 'get',
    data
  })
}
