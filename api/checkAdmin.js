const adminUtils = require('../mongodb/utils/admins');

module.exports = async function (req, res, next) {

    const account = await adminUtils.findOne({});
    if (account) {
        res.send({
            code: 1,
            haveAccount: true,
            msg: '存在管理员账户'
        });
    } else {
        res.send({
            code: 1,
            haveAccount: false,
            msg: '不存在管理员账户'
        });
    }

};