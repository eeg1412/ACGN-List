const seriesUtils = require('../mongodb/utils/series');
const utils = require('../utils/utils');
var chalk = require('chalk');
const validator = require('validator');
const _ = require('lodash');

module.exports = async function (req, res, next) {
    // 数据读取
    const _id = String(req.body._id);
    const token = req.header('token');
    if (!validator.isMongoId(_id)) {
        res.send({
            code: 0,
            msg: '系列ID有误！'
        });
        console.error(
            chalk.yellow('系列ID有误！')
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
    // TODO:校验是否有依赖于这个系列的ACGN

    // 删除数据
    await seriesUtils.deleteOne({ _id: _id });
    res.send({
        code: 1,
        msg: 'ok'
    });

    // 删除封面图
    utils.deleteCover('series', _id);
};