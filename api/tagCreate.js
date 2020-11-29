const tagsUtils = require('../mongodb/utils/tags');
const utils = require('../utils/utils');
var jwt = require('jsonwebtoken');
var chalk = require('chalk');


module.exports = async function (req, res, next) {
    // 数据读取
    const name = req.body.name ? String(req.body.name) : '';
    const token = req.header('token');
    // 校验必填选项
    if (!name) {
        res.send({
            code: 0,
            msg: '请输入内容！'
        });
        console.error(
            chalk.yellow('标签内容为空！')
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
            chalk.yellow('创建标签,管理员验证失败!')
        );
        return false;
    }
    // 校验内容是否存在
    const params = {
        name: name
    }
    const tag = await tagsUtils.findOne(params);
    if (tag) {
        res.send({
            code: 0,
            msg: '该标签已存在!'
        });
        console.error(
            chalk.yellow('创建标签,该标签已存在!')
        );
        return false;
    }
    // 写入数据
    const newTag = await tagsUtils.save(params);
    res.send({
        code: 1,
        tag: newTag,
        msg: 'ok'
    });
};