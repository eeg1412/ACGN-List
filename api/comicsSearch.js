const comicsUtils = require('../mongodb/utils/comics');
const _ = require('lodash');
const utils = require('../utils/utils');
const validator = require('validator');


module.exports = async function (req, res, next) {
    // 数据读取
    const keyword = String(req.body.keyword || '');
    let sort = String(req.body.sort || '0');
    let page = Number(req.body.page || 1);
    // 显示区分，0为全部，1为仅显示，2为仅不显示
    let showMode = String(req.body.showMode || '1');
    const status = String(req.body.status || '');
    if (!_.isInteger(page) || page < 1) {
        page = 1;
    }
    if (!validator.isInt(showMode, { min: 0, max: 3 })) {
        showMode = '1';
    }
    if (!validator.isInt(sort, { min: 0, max: 5 })) {
        sort = '0';
    }
    if (showMode === '0' || showMode === '2') {
        // 如果为全部或者不显示则需要管理员认证
        const token = req.header('token');
        // 验证token
        const IP = utils.getUserIp(req);
        const adminInfo = await utils.checkAdmin(token, IP);
        if (!adminInfo) {
            res.send({
                code: 403,
                msg: '管理员验证失败!'
            });
            console.error(
                chalk.yellow('创建标签,管理员验证失败!')
            );
            return false;
        }
    }
    let sortData = { '_id': -1 };
    switch (sort) {
        case '0':
            sortData = { "creatDate": -1 }
            break;
        case '1':
            sortData = { "creatDate": 1 }
            break;
        case '2':
            sortData = { "score": -1 }
            break;
        case '3':
            sortData = { "score": 1 }
            break;
        case '4':
            sortData = { "progress": -1 }
            break;
        case '5':
            sortData = { "progress": 1 }
            break;
    }

    // 查询数据
    const params = {};
    if (keyword) {
        const keywordReg = new RegExp(keyword, 'i');
        params["$or"] = [
            { title: { $regex: keywordReg } },
            { originalName: { $regex: keywordReg } },
            { "seriesTags.name": { $regex: keywordReg } },
            { "series.title": { $regex: keywordReg } },
        ]
    }
    // 状态
    const statusDivList = ['doing', 'want', 'out', 'complete'];
    if (statusDivList.indexOf(status) !== -1) {
        params['status'] = status;
    }
    switch (showMode) {
        case '1':
            params["show"] = true;
            break;
        case '2':
            params["show"] = false;
    }
    const data = await comicsUtils.findByKeyWords(params, 20, page, '', sortData);

    res.send({
        code: 1,
        info: data,
        msg: 'ok'
    });
};