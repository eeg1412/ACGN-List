const gamesUtils = require('../mongodb/utils/games');
const optionsUtils = require('../mongodb/utils/options');
const utils = require('../utils/utils');
var chalk = require('chalk');
const validator = require('validator');
const _ = require('lodash');
const fs = require('fs')

module.exports = async function (req, res, next) {
    // 数据读取
    const _id = String(req.body._id);
    const base64 = String(req.body.base64 || '');
    const title = String(req.body.title || '');//标题
    const originalName = String(req.body.originalName || '');//原名
    const comment = String(req.body.comment || '');//点评
    const remarks = String(req.body.remarks || '');//备注
    // const creatDate = req.body.creatDate;//录入时间
    let type = req.body.type;//编辑还是创建
    const seriesId = String(req.body.seriesId || '');//系列
    const status = String(req.body.status || '');//状态
    const score = Number(req.body.score || 0);//评分
    const introduce = String(req.body.introduce || '');//介绍
    const startDate = req.body.startDate;//开始时间
    const endDate = req.body.endDate;//结束时间
    const show = req.body.show ? true : false; //是否显示
    /*-----------------以上为共通----------------*/
    const platform = String(req.body.platform || '');
    const gameCompany = String(req.body.gameCompany || '');
    const progress = Number(req.body.progress || 0);
    const isLongGame = req.body.isLongGame ? true : false;
    const token = req.header('token');
    // 校验数据
    if (type !== 'edit') {
        type = 'create';
    }
    // 校验基础表单
    const baseForm = {
        base64: base64,
        title: title,
        originalName: originalName,
        seriesId: seriesId,
        status: status,
        score: score,
        comment: comment,
        introduce: introduce,
        remarks: remarks,
        startDate: startDate,
        endDate: endDate,
        _id: _id
    };
    const checkRes = await utils.checkBaseForm(baseForm, type);
    if (checkRes) {
        res.send({
            code: 0,
            msg: checkRes
        });
        return false
    }
    // 校验游戏表单
    // 校验已看集数是否为正整数
    const progressStr = progress + '';
    if (!validator.isInt(progressStr, { min: 0, max: 100 })) {
        res.send({
            code: 0,
            msg: "进度数据有误!"
        });
        return false;
    }
    // 检测游戏平台ID
    if (!validator.isMongoId(platform)) {
        res.send({
            code: 0,
            msg: "游戏平台有误!"
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

    // 检测游戏平台是否存在
    const platformParams = {
        _id: platform,
        type: 'game'
    }
    const options = await optionsUtils.findOne(platformParams);
    if (!options) {
        res.send({
            code: 0,
            msg: '游戏平台不存在!'
        });
        console.error(
            chalk.yellow('创建游戏,游戏平台不存在!')
        );
        return false;
    }

    // 写入数据
    const saveParams = {
        title: title,//标题
        originalName: originalName,//原名
        comment: comment,//点评
        remarks: remarks,//备注
        series: seriesId,//系列
        status: status,//状态
        score: score,//评分
        introduce: introduce,//介绍
        startDate: startDate,//开始时间
        endDate: endDate,//结束时间
        show: show, //是否显示
        /*-----------------以上为共通----------------*/
        platform: platform,
        gameCompany: gameCompany,
        progress: isLongGame ? 0 : progress,
        isLongGame: isLongGame,
    }
    let saveData = null;
    if (type === 'edit') {
        await gamesUtils.updateOne({ _id: _id }, saveParams);
    } else {
        saveData = await gamesUtils.save(saveParams);
    }
    // console.log(seriesData);
    // 写入封面文件
    if (base64) {
        if (saveData) {
            const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFileSync(`./cover/game/${saveData._id}.jpg`, base64Data, 'base64');
        } else {
            const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFileSync(`./cover/game/${_id}.jpg`, base64Data, 'base64');
        }

    }
    res.send({
        code: 1,
        msg: 'ok'
    });
};