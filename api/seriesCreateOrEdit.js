const seriesUtils = require('../mongodb/utils/series');
const tagsUtils = require('../mongodb/utils/tags');
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
    let tags = req.body.tags || [];//标签
    const comment = String(req.body.comment || '');//点评
    const remarks = String(req.body.remarks || '');//备注
    // const creatDate = req.body.creatDate;//录入时间
    let type = req.body.type;//编辑还是创建
    const token = req.header('token');
    // 校验数据
    if (type !== 'edit') {
        type = 'create';
    }
    // 校验新建必填选项（base64）
    if (type === 'create') {
        if (!base64) {
            res.send({
                code: 0,
                msg: '请上传封面!'
            });
            console.error(
                chalk.yellow('系列上传封面失败!')
            );
            return false
        }
    }
    // 校验选填必填选项(_id)
    if (type === 'edit') {
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
    }
    // 校验必填选项
    if (!title) {
        res.send({
            code: 0,
            msg: '请输入系列标题！'
        });
        console.error(
            chalk.yellow('系列标题为空！')
        );
        return false;
    }
    // 校验选填选项
    if (base64) {
        let jpgReg = new RegExp("data:image/jpeg;base64,");
        let isJpg = jpgReg.test(base64);
        if (!isJpg) {
            res.send({
                code: 0,
                msg: '图片上传失败！'
            });
            console.error(
                chalk.yellow('系列上传封面失败')
            );
            return false
        }
    }
    if (!_.isArray(tags)) {
        res.send({
            code: 0,
            msg: '标签格式有误!'
        });
        console.error(
            chalk.yellow('系列标签格式有误!')
        );
        return false;
    } else {
        if (tags.length > 0) {
            tags = _.uniq(tags);
            let itemTagsId = [];
            for (let i = 0; i < tags.length; i++) {
                const id = tags[i];
                if (!validator.isMongoId(id)) {
                    res.send({
                        code: 0,
                        msg: '标签格式有误!'
                    });
                    console.error(
                        chalk.yellow('系列标签格式有误!')
                    );
                    return false;
                };
                itemTagsId.push(id);
            }
            // 校验这些标签ID是否存在
            const itemTagsParams = { _id: { $in: itemTagsId } };
            const itemTags = await tagsUtils.findMany(itemTagsParams);
            console.log(itemTags);
            if (itemTags.length !== tags.length) {
                res.send({
                    code: 0,
                    msg: '标签数据有误!'
                });
                console.error(
                    chalk.yellow('系列标签数据有误!')
                );
                return false;
            }

        }

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
    const seriesParams = {
        title: title,//标题
        originalName: originalName,//原名
        tags: tags,//标签
        comment: comment,//点评
        remarks: remarks,//备注
    };
    let seriesData = null;
    if (type === 'edit') {
        await seriesUtils.updateOne({ _id: _id }, seriesParams);
    } else {
        seriesData = await seriesUtils.save(seriesParams);
    }
    // console.log(seriesData);
    // 写入封面文件
    if (base64) {
        if (seriesData) {
            const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFileSync(`./cover/series/${seriesData._id}.jpg`, base64Data, 'base64');
        } else {
            const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFileSync(`./cover/series/${_id}.jpg`, base64Data, 'base64');
        }

    }
    res.send({
        code: 1,
        seriesData: seriesData,
        msg: 'ok'
    });
};