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
const apiAnimesCreateOrEdit = require('../api/animesCreateOrEdit');
const apiAnimesSearch = require('../api/animesSearch');
const apiAnimesDelete = require('../api/animesDelete');
const apiGamesCreateOrEdit = require('../api/gamesCreateOrEdit');
const apiGamesSearch = require('../api/gamesSearch');
const apiGamesDelete = require('../api/gamesDelete');
const apiNovelsCreateOrEdit = require('../api/novelsCreateOrEdit');
const apiNovelsSearch = require('../api/novelsSearch');
const apiNovelsDelete = require('../api/novelsDelete');

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
router.post('/animesCreateOrEdit', apiAnimesCreateOrEdit);
router.post('/animesSearch', apiAnimesSearch);
router.post('/animesDelete', apiAnimesDelete);
router.post('/gamesCreateOrEdit', apiGamesCreateOrEdit);
router.post('/gamesSearch', apiGamesSearch);
router.post('/gamesDelete', apiGamesDelete);
router.post('/novelsCreateOrEdit', apiNovelsCreateOrEdit);
router.post('/novelsSearch', apiNovelsSearch);
router.post('/novelsDelete', apiNovelsDelete);




// get
router.get('/checkadmin', apiCheckAdmin);
router.get('/captcha', apiCaptcha);
router.get('/cover', apiCover);

module.exports = router;
