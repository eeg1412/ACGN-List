var express = require('express');
var router = express.Router();

// var apiReg = require('../api/register');
// var apiLogin = require('../api/login');
const apiCheckAdmin = require('../api/checkAdmin');
const apiAdminRegister = require('../api/adminRegister');
const apiAdminLogin = require('../api/adminLogin');
const apiCaptcha = require('../api/captcha');
const apiTagCreate = require('../api/tagCreate');
const apiTagSearch = require('../api/tagSearch');
const apiSeriesCreateOrEdit = require('../api/seriesCreateOrEdit');
const apiSeriesSearch = require('../api/seriesSearch');
const apiSeriesDelete = require('../api/seriesDelete');
const apiCover = require('../api/cover');
const apiComicsCreateOrEdit = require('../api/comicsCreateOrEdit');
const apiComicsSearch = require('../api/comicsSearch');
const apiComicsDelete = require('../api/comicsDelete');
const apiOptionsCreate = require('../api/optionsCreate');
const apiOptionsSearch = require('../api/optionsSearch');
const apiOptionsEdit = require('../api/optionsEdit');
const apiOptionsDelete = require('../api/optionsDelete');

// post
router.post('/adminregister', apiAdminRegister);
router.post('/adminlogin', apiAdminLogin);
router.post('/tagcreate', apiTagCreate);
router.post('/tagsearch', apiTagSearch);
router.post('/seriesCreateOrEdit', apiSeriesCreateOrEdit);
router.post('/seriesSearch', apiSeriesSearch);
router.post('/seriesDelete', apiSeriesDelete);
router.post('/comicsCreateOrEdit', apiComicsCreateOrEdit);
router.post('/comicsSearch', apiComicsSearch);
router.post('/comicsDelete', apiComicsDelete);
router.post('/optionsCreate', apiOptionsCreate);
router.post('/optionsSearch', apiOptionsSearch);
router.post('/optionsEdit', apiOptionsEdit);
router.post('/optionsDelete', apiOptionsDelete);



// get
router.get('/checkadmin', apiCheckAdmin);
router.get('/captcha', apiCaptcha);
router.get('/cover', apiCover);

module.exports = router;
