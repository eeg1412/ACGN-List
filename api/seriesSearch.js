const seriesUtils = require('../mongodb/utils/series');
const _ = require('lodash');


module.exports = async function (req, res, next) {
    // 数据读取
    const keyword = String(req.body.keyword || '');
    const sort = String(req.body.sort || '');
    let page = Number(req.body.page || 1);
    if (!_.isInteger(page) || page < 1) {
        page = 1;
    }
    // 查询数据
    const params = {};
    if (keyword) {
        const keywordReg = new RegExp(keyword, 'i');
        params["$or"] = [
            { title: { $regex: keywordReg } },
            // { "tags.name": { $regex: keywordReg } },
        ]
    }
    const data = await seriesUtils.findInPage(params, 20, page, '');

    res.send({
        code: 1,
        info: data,
        msg: 'ok'
    });
};