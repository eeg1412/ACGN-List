export default function (api) {
  return {
    adminregister (data) {
      return api.post('/adminregister', data)
    },
    adminlogin (data) {
      return api.post('/adminlogin', data)
    },
    login (data) {
      return api.post('/login', data)
    },
    checkadmin () {
      return api.get('/checkadmin')
    },
  }
}
