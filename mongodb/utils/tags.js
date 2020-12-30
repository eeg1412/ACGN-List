const tagsModel = require('../models/tags');

exports.save = async function (parmas) {
    // document作成
    const tags = new tagsModel(parmas);
    // document保存
    return await tags.save();
}


exports.findOne = async function (parmas) {
    // document查询
    return await tagsModel.findOne(parmas);
}
exports.findMany = async function (parmas) {
    // document查询
    return await tagsModel.find(parmas);
}

exports.updateOne = async function (filters, parmas) {
    // document查询
    return await tagsModel.updateOne(filters, parmas);
}

exports.findInPage = async function (parmas = {}, pageSize_ = 20, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = tagsModel.find(parmas, getParams).sort(sortData);
    let total = await query.countDocuments();
    let data = await query
        .find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    let res = {
        total: total,
        data: data
    };
    return res;
}

exports.deleteOne = async function (params) {
    // document查询
    return await tagsModel.deleteOne(params);
}