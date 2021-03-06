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
    animesCreateOrEdit (data) {
      return api.post('/animesCreateOrEdit', data)
    },
    animesSearch (data) {
      return api.post('/animesSearch', data)
    },
    animesDelete (data) {
      return api.post('/animesDelete', data)
    },
    gamesCreateOrEdit (data) {
      return api.post('/gamesCreateOrEdit', data)
    },
    gamesSearch (data) {
      return api.post('/gamesSearch', data)
    },
    gamesDelete (data) {
      return api.post('/gamesDelete', data)
    },
    novelsCreateOrEdit (data) {
      return api.post('/novelsCreateOrEdit', data)
    },
    novelsSearch (data) {
      return api.post('/novelsSearch', data)
    },
    novelsDelete (data) {
      return api.post('/novelsDelete', data)
    },
    tagDelete (data) {
      return api.post('/tagDelete', data)
    },
    tagEdit (data) {
      return api.post('/tagEdit', data)
    },
    adminChangePassword (data) {
      return api.post('/adminChangePassword', data)
    },
    quickImportSearch (data) {
      return api.post('/quickImportSearch', data)
    },
    quickImportGetData (data) {
      return api.post('/quickImportGetData', data)
    },
    checkadmin () {
      return api.get('/checkadmin')
    },
  }
}
