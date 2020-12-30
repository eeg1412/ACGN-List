const optionsModel = require('../models/options');

exports.save = async function (parmas) {
    // document作成
    const options = new optionsModel(parmas);
    // document保存
    return await options.save();
}


exports.findOne = async function (parmas) {
    // document查询
    return await optionsModel.findOne(parmas);
}
exports.findMany = async function (parmas) {
    // document查询
    return await optionsModel.find(parmas);
}

exports.updateOne = async function (filters, parmas) {
    // document查询
    return await optionsModel.updateOne(filters, parmas);
}

exports.deleteOne = async function (params) {
    // document查询
    return await optionsModel.deleteOne(params);
}

exports.findInPage = async function (parmas = {}, pageSize_ = 20, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = optionsModel.find(parmas, getParams).sort(sortData);
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