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
      let shouldNewToken = true;
      if (hasUser.token) {
        //如果有Token则解析
        let tokenDecode = await utils.tokenCheck(hasUser.token).catch((err) => {
          console.info(
            chalk.yellow('登录信息已失效生成新的token！')
          );
        });
        if (tokenDecode) {
          try {
            let timeNow = Math.round(new Date().getTime() / 1000);
            let expiresIn = tokenDecode.exp;
            if (expiresIn - timeNow > 86400) {
              //如果token还有效则不更新token
              console.info(
                chalk.green(hasUser.account + '的token还有效则不更新token')
              );
              shouldNewToken = false;
            }
          } catch (err) {
            console.info(
              chalk.yellow('登录信息解析成功，但是信息却有误！')
            );
          }
        }
      }
      let token = hasUser.token;
      if (shouldNewToken) {
        token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: remTime
        });
      }
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