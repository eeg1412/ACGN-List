var jwt = require('jsonwebtoken');
var chalk = require('chalk');
const adminUtils = require('../mongodb/utils/admins');
const validator = require('validator');
const seriesUtils = require('../mongodb/utils/series');
const fs = require('fs');

// 删除封面图
exports.deleteCover = function (type, id) {
    fs.unlink(`./cover/${type}/${id}.jpg`, function (err) {
        if (err) {
            console.info(
                chalk.red(err)
            );
        };
    });
}
// 基础表单验证
exports.checkBaseForm = async function (baseForm, type) {
    const { base64, title, seriesId, status, score, startDate, endDate, _id } = baseForm;
    // 校验新建必填选项（base64）
    if (type === 'create') {
        if (!base64) {
            return '请上传封面!';
        }
    }
    if (type === 'edit') {
        if (!validator.isMongoId(_id)) {
            return 'ID有误！';
        }
    }
    // 校验系列ID
    if (!validator.isMongoId(seriesId)) {
        return '系列ID有误!'
    }
    // 校验系列ID是否存在
    const series = await seriesUtils.findOne({ '_id': seriesId });
    if (!series) {
        return '该系列不存在!'
    }
    // 校验状态值是否在状态列表
    const statusDiv = ['doing', 'want', 'out', 'complete'];
    if (statusDiv.indexOf(status) === -1) {
        return '不存在该状态!';
    }
    // 校验评分是否在0-100分之间
    const scoreString = score + '';
    if (!validator.isInt(scoreString, { min: 0, max: 100 })) {
        return '评分输入有误!';
    }
    // 校验开始时间格式是否为ISO
    if (startDate) {
        if (!validator.isISO8601(startDate)) {
            return '开始时间有误!';
        }
    }
    // 校验结束时间是否为ISO
    if (endDate) {
        if (!validator.isISO8601(endDate)) {
            return '结束时间有误!';
        }
    }
    // 判断结束时间不能再开始时间前面
    if (endDate && startDate) {
        if (new Date(endDate) < new Date(startDate)) {
            return '结束时间不能再开始时间之前';
        }
    }
    // 校验必填选项
    if (!title) {
        return '请输入系列标题！';
    }
    // 校验选填选项
    if (base64) {
        let jpgReg = new RegExp("data:image/jpeg;base64,");
        let isJpg = jpgReg.test(base64);
        if (!isJpg) {
            return '图片上传失败！';
        }
    }
    return null;
}

//获取用户IP
exports.getUserIp = function (req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    ip = ip.match(/\d+.\d+.\d+.\d+/);
    ip = ip ? ip.join('.') : 'No IP';
    return ip;
};
//检查token
exports.tokenCheck = async function (token) {
    let secretOrPrivateKey = process.env.JWT_SECRET_KEY || 'test'; // 这是加密的key（密钥）
    return await new Promise((resolve, reject) => {
        jwt.verify(token, secretOrPrivateKey, function (err, decode) {
            if (err) {  //  时间失效的时候/ 伪造的token 
                console.info(
                    chalk.yellow('token有误！')
                );
                reject(err);
            } else {
                console.info(
                    chalk.green('token解密成功！')
                );
                resolve(decode);
            }
        });
    });
};
exports.checkAdmin = async function (token, IP) {
    let tokenDecode = await this.tokenCheck(token).catch((err) => {
        console.info(
            chalk.yellow('登录信息已失效！')
        );
        return false;
    });
    if (!tokenDecode.account) {
        console.info(
            chalk.yellow('登录信息有误！')
        );
        return false;
    }
    let account = tokenDecode.account;
    let params = {
        account: account
    }
    let result = await adminUtils.findOne(params).catch((err) => {
        console.error(
            chalk.red('数据库查询错误！')
        );
        throw err;
    })
    if (!result) {
        return false;
    }
    if ((result.token != token) || (result.token == '')) {
        console.info(
            chalk.yellow(account + '和数据库的token对不上,IP为：' + IP)
        )
        return false;
    } else {
        return result;
    }
}