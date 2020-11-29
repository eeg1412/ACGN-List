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

// post
router.post('/adminregister', apiAdminRegister);
router.post('/adminlogin', apiAdminLogin);
router.post('/tagcreate', apiTagCreate);
router.post('/tagsearch', apiTagSearch);
router.post('/seriesCreateOrEdit', apiSeriesCreateOrEdit);
router.post('/seriesSearch', apiSeriesSearch);
router.post('/seriesDelete', apiSeriesDelete);


// get
router.get('/checkadmin', apiCheckAdmin);
router.get('/captcha', apiCaptcha);
router.get('/cover', apiCover);

module.exports = router;
