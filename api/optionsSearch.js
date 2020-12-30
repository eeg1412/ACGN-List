const optionsUtils = require('../mongodb/utils/options');
const utils = require('../utils/utils');
var chalk = require('chalk');
const _ = require('lodash');


module.exports = async function (req, res, next) {
    // 数据读取
    const optionsType = String(req.body.optionsType) || '';
    let page = Number(req.body.page || 1);
    const searchAll = req.body.searchAll ? true : false;
    const token = req.header('token');
    if (!_.isInteger(page) || page < 1) {
        page = 1;
    }
    const optionsTypeList = ['anime', 'game'];
    if (optionsTypeList.indexOf(optionsType) === -1) {
        res.send({
            code: 0,
            msg: '类型信息有误！'
        });
        console.error(
            chalk.yellow('选择项类型有误！')
        );
        return false;
    }
    // 验证token
    const IP = utils.getUserIp(req);
    const adminInfo = await utils.checkAdmin(token, IP);
    if (!adminInfo) {
        res.send({
            code: 403,
            msg: '管理员验证失败!'
        });
        console.error(
            chalk.yellow('查询选择项,管理员验证失败!')
        );
        return false;
    }
    const params = {
        type: optionsType
    };
    let optionsData = {};
    if (searchAll) {
        optionsData['data'] = await optionsUtils.findMany(params);
    } else {
        optionsData = await optionsUtils.findInPage(params, 20, page);
    }
    res.send({
        code: 1,
        options: optionsData,
        msg: 'ok'
    });
};