const tagsUtils = require('../mongodb/utils/tags');
const utils = require('../utils/utils');
var chalk = require('chalk');
const validator = require('validator');

module.exports = async function (req, res, next) {
    // 数据读取
    const id = String(req.body.id) || '';
    const token = req.header('token');

    if (!validator.isMongoId(id)) {
        res.send({
            code: 0,
            msg: "id有误！"
        });
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
        _id: id
    }
    const tags = await tagsUtils.findOne(params);
    if (!tags) {
        res.send({
            code: 0,
            msg: '该标签不存在!'
        });
        console.error(
            chalk.yellow('修改标签,该标签不存在!')
        );
        return false;
    }
    // TODO:判断标签是否被占用

    // 写入数据
    const deleteParams = {
        _id: id,

    };
    await tagsUtils.deleteOne(deleteParams);
    res.send({
        code: 1,
        msg: 'ok'
    });
};