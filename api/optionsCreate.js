const optionsUtils = require('../mongodb/utils/options');
const utils = require('../utils/utils');
var chalk = require('chalk');


module.exports = async function (req, res, next) {
    // 数据读取
    const name = req.body.name ? String(req.body.name) : '';
    const optionsType = String(req.body.optionsType) || '';
    const token = req.header('token');
    // 校验必填选项
    if (!name) {
        res.send({
            code: 0,
            msg: '请输入内容！'
        });
        console.error(
            chalk.yellow('选择项内容为空！')
        );
        return false;
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
            chalk.yellow('创建选择项,管理员验证失败!')
        );
        return false;
    }
    // 校验内容是否存在
    const params = {
        name: name,
        type: optionsType
    }
    const options = await optionsUtils.findOne(params);
    if (options) {
        res.send({
            code: 0,
            msg: '该选择项已存在!'
        });
        console.error(
            chalk.yellow('创建选择项,该选择项已存在!')
        );
        return false;
    }
    // 写入数据
    const newOptions = await optionsUtils.save(params);
    res.send({
        code: 1,
        options: newOptions,
        msg: 'ok'
    });
};