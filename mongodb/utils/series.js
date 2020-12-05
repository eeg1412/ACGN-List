const seriesModel = require('../models/series');

exports.save = async function (params) {
    // document作成
    const series = new seriesModel(params);
    // document保存
    return await series.save();
}


exports.findOne = async function (params) {
    // document查询
    return await seriesModel.findOne(params);
}

exports.updateOne = async function (filters, params) {
    // document查询
    return await seriesModel.updateOne(filters, params);
}

exports.findInPage = async function (params = {}, pageSize_ = 20, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = seriesModel.find(params, getParams).populate('tags').sort(sortData);
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
    return await seriesModel.deleteOne(params);
}

exports.findByKeyWords = async function (params = {}, pageSize_ = 20, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = await seriesModel.aggregate([
        // Unwind the source
        {
            "$unwind": {
                "path": "$tags",
                "preserveNullAndEmptyArrays": true
            }
        },
        // Do the lookup matching
        {
            "$lookup": {
                "from": "tags",
                "localField": "tags",
                "foreignField": "_id",
                "as": "tags"
            }
        },
        {
            "$unwind": {
                "path": "$tags",
                "preserveNullAndEmptyArrays": true
            }
        },
        // Group back to arrays
        {
            "$group": {
                "_id": "$_id",
                "comment": { "$first": "$comment" },
                "creatDate": { "$first": "$creatDate" },
                "originalName": { "$first": "$originalName" },
                "remarks": { "$first": "$remarks" },
                "title": { "$first": "$title" },
                "type": { "$first": "$type" },
                "tags": { "$push": "$tags" },
            }
        },
        { "$match": params },
        { "$sort": sortData },
        {
            '$facet': {
                total: [{ $count: "total" }],
                data: [{ $skip: pageSize * (page - 1) }, { $limit: pageSize }] // add projection here wish you re-shape the docs
            }
        }
    ]);
    const res = {
        total: query[0].total[0] ? query[0].total[0].total : 0,
        data: query[0].data
    }
    return res;
}