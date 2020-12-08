const comicsUtils = require('../mongodb/utils/comics');
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
    const publishingHouse = String(req.body.publishingHouse || '');//出版社
    const status = String(req.body.status || '');//状态
    const progress = Number(req.body.progress || 0);//进度
    const score = Number(req.body.score || 0);//评分
    const introduce = String(req.body.introduce || '');//介绍
    const startDate = req.body.startDate;//开始时间
    const endDate = req.body.endDate;//结束时间
    const show = req.body.show ? true : false; //是否显示
    let original = req.body.original;//原作
    let author = req.body.author;//作者
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
    // 校验漫画表单
    // 校验原作数组是否为字符串数组
    if (!_.isArray(original)) {
        res.send({
            code: 0,
            msg: "原作数据类型有误！"
        });
        return false
    }
    original = _.uniq(original);
    original.forEach((item, index) => {
        original[index] = String(item);
    });
    // 校验作者是否为字符串数组
    if (!_.isArray(author)) {
        res.send({
            code: 0,
            msg: "作者数据类型有误！"
        });
        return false
    }
    author = _.uniq(author);
    author.forEach((item, index) => {
        author[index] = String(item);
    });
    // 校验进度是否为0-100的正整数
    const progressString = progress + '';
    if (!validator.isInt(progressString, { min: 0, max: 100 })) {
        return '进度数据有误!';
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
    // 写入数据
    const saveParams = {
        title: title,//标题
        originalName: originalName,//原名
        comment: comment,//点评
        remarks: remarks,//备注
        seriesId: seriesId,//系列
        publishingHouse: publishingHouse,//出版社
        status: status,//状态
        progress: progress,//进度
        score: score,//评分
        introduce: introduce,//介绍
        startDate: startDate,//开始时间
        endDate: endDate,//结束时间
        show: show, //是否显示
        original: original,//原作
        author: author//作者
    }
    let saveData = null;
    if (type === 'edit') {
        await comicsUtils.updateOne({ _id: _id }, saveParams);
    } else {
        saveData = await comicsUtils.save(saveParams);
    }
    // console.log(seriesData);
    // 写入封面文件
    if (base64) {
        if (saveData) {
            const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFileSync(`./cover/comic/${saveData._id}.jpg`, base64Data, 'base64');
        } else {
            const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFileSync(`./cover/comic/${_id}.jpg`, base64Data, 'base64');
        }

    }
    res.send({
        code: 1,
        msg: 'ok'
    });
};