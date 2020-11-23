const adminsModel = require('../models/admins');

exports.save = async function (parmas) {
    // document作成
    const admins = new adminsModel(parmas);
    // document保存
    return await admins.save()
}


exports.findOne = async function (parmas) {
    // document查询
    return await adminsModel.findOne(parmas);
}

exports.updateOne = async function (filters, parmas) {
    // document查询
    return await adminsModel.updateOne(filters, parmas);
}