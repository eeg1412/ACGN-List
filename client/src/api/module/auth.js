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
    tagcreate (data) {
      return api.post('/tagcreate', data)
    },
    tagsearch (data) {
      return api.post('/tagsearch', data)
    },
    seriesCreateOrEdit (data) {
      return api.post('/seriesCreateOrEdit', data)
    },
    seriesSearch (data) {
      return api.post('/seriesSearch', data)
    },
    seriesDelete (data) {
      return api.post('/seriesDelete', data)
    },
    comicsCreateOrEdit (data) {
      return api.post('/comicsCreateOrEdit', data)
    },
    comicsSearch (data) {
      return api.post('/comicsSearch', data)
    },
    comicsDelete (data) {
      return api.post('/comicsDelete', data)
    },
    optionsCreate (data) {
      return api.post('/optionsCreate', data)
    },
    optionsSearch (data) {
      return api.post('/optionsSearch', data)
    },
    optionsEdit (data) {
      return api.post('/optionsEdit', data)
    },
    optionsDelete (data) {
      return api.post('/optionsDelete', data)
    },
    checkadmin () {
      return api.get('/checkadmin')
    },
  }
}
