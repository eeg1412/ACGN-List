const seriesModel = require('../models/series');

exports.save = async function (parmas) {
    // document作成
    const series = new seriesModel(parmas);
    // document保存
    return await series.save();
}


exports.findOne = async function (parmas) {
    // document查询
    return await seriesModel.findOne(parmas);
}

exports.updateOne = async function (filters, parmas) {
    // document查询
    return await seriesModel.updateOne(filters, parmas);
}