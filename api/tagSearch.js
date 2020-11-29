const tagsUtils = require('../mongodb/utils/tags');
const utils = require('../utils/utils');
var jwt = require('jsonwebtoken');
var chalk = require('chalk');
const _ = require('lodash');


module.exports = async function (req, res, next) {
    // 数据读取
    const name = req.body.name ? String(req.body.name) : '';
    const page = Number(req.body.page || 1);
    if (!_.isInteger(page) || page < 1) {
        res.send({
            code: 0,
            msg: '页码信息有误！'
        });
        console.error(
            chalk.yellow('查询标签，页码信息有误！')
        );
        return false;
    }
    const params = {};
    if (name) {
        const reg = new RegExp(name, 'i');
        params["name"] = { $regex: reg };
    }
    const tagsData = await tagsUtils.findInPage(params, 20, page);
    res.send({
        code: 1,
        tags: tagsData,
        msg: 'ok'
    });
};