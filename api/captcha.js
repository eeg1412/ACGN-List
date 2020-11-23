const svgCaptcha = require('svg-captcha');
const _ = require('lodash')
module.exports = function (req, res, next) {
    let noiseRadom = _.random(3, 5);
    var captcha = svgCaptcha.createMathExpr({ noise: noiseRadom, color: false });
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
}