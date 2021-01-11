const adminUtils = require('../mongodb/utils/admins');
const utils = require('../utils/utils');
var jwt = require('jsonwebtoken');
var chalk = require('chalk');
const md5 = require('md5');

module.exports = async function (req, res, next) {
  const password = req.body.password;
  const account = req.body.account;
  const captcha = req.body.captcha;
  const save = req.body.save;
  const IP = utils.getUserIp(req);
  if (password && account && captcha) {
    if (req.session.captcha != captcha || !captcha) {
      req.session.destroy((err) => {
        if (err) {
          console.info(
            chalk.red(IP + '验证码清理失败' + '，' + err)
          );
        }
      })
      res.send({
        code: 0,
        msg: '验证码有误！'
      });
      return false;
    }

    const hasUser = await adminUtils.findOne({ account: account, password: md5(password) });
    if (hasUser) {
      let content = { account: account }; // 要生成token的主题信息
      let secretOrPrivateKey = process.env.JWT_SECRET_KEY || 'test'; // 这是加密的key（密钥）
      let remTime = 60 * 60 * 24;
      if (save) {
        remTime = '365d';
      }
      let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: remTime
      });
      const IP = utils.getUserIp(req);
      const params = { token: token, IP: IP };
      await adminUtils.updateOne({ account: account }, params);
      res.send({
        code: 1,
        token: token,
        msg: '登录成功！'
      });
    } else {
      res.send({
        code: 0,
        msg: '账户或密码不正确！'
      });
    }

  } else {
    res.send({
      code: 0,
      msg: '登录信息有误！'
    });
  }

};