const adminUtils = require('../mongodb/utils/admins');
const utils = require('../utils/utils');
var chalk = require('chalk');
const md5 = require('md5');

module.exports = async function (req, res, next) {
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const token = req.header('token');
    if (password && newPassword && token) {
        if ((newPassword + '').length < 8) {
            res.send({
                code: 0,
                msg: '密码必须大于8位！'
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
                chalk.yellow('管理员密码修改,管理员验证失败!')
            );
            return false;
        }
        const hasUser = await adminUtils.findOne({ token: token, password: md5(password) });
        if (!hasUser) {
            res.send({
                code: 0,
                msg: '原密码有误！'
            });
            return false;
        }
        await adminUtils.updateOne({ token: token }, { password: md5(newPassword), token: '' });
        res.send({
            code: 1,
            msg: '修改成功请重新登陆！'
        });
    } else {
        res.send({
            code: 0,
            msg: '请填写信息！'
        });
    }

};