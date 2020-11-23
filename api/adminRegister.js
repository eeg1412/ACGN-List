const adminUtils = require('../mongodb/utils/admins');
const md5 = require('md5');

module.exports = async function (req, res, next) {
    const password = req.body.password;
    const account = req.body.account;
    if (password && account) {
        if ((password + '').length < 8) {
            res.send({
                code: 0,
                msg: '密码必须大于8位！'
            });
            return false;
        }
        const userInfo = {
            account: account,
            password: md5(password),
        }
        const hasUser = await adminUtils.findOne({});
        if (hasUser) {
            res.send({
                code: 0,
                msg: '已存在管理员账户，禁止注册！'
            });
            return false;
        }
        await adminUtils.save(userInfo);
        res.send({
            code: 1,
            msg: '注册成功！'
        });
    } else {
        res.send({
            code: 0,
            msg: '信息不能为空！'
        });
    }

};