const comicsModel = require('../models/comics');

exports.save = async function (params) {
    // document作成
    const comics = new comicsModel(params);
    // document保存
    return await comics.save();
}


exports.findOne = async function (params) {
    // document查询
    return await comicsModel.findOne(params);
}

exports.updateOne = async function (filters, params) {
    // document查询
    return await comicsModel.updateOne(filters, params);
}

exports.findInPage = async function (params = {}, pageSize_ = 20, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = comicsModel.find(params, getParams).populate('tags').sort(sortData);
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
    return await comicsModel.deleteOne(params);
}

exports.findByKeyWords = async function (params = {}, pageSize_ = 20, page_ = 1, getParams = '', sortData = { '_id': -1 }) {
    // document查询
    let pageSize = pageSize_;
    let page = page_;
    let query = await comicsModel.aggregate([
        {
            "$lookup": {
                "from": "series",
                "localField": "series",
                "foreignField": "_id",
                "as": "series"
            }
        },
        // Unwind the source
        {
            "$unwind": {
                "path": "$series",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$unwind": {
                "path": "$series.tags",
                "preserveNullAndEmptyArrays": true
            }
        },
        // Do the lookup matching
        {
            "$lookup": {
                "from": "tags",
                "localField": "series.tags",
                "foreignField": "_id",
                "as": "series.tags"
            }
        },
        {
            "$unwind": {
                "path": "$series.tags",
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
                "series": { "$first": "$series" },
                "publishingHouse": { "$first": "$publishingHouse" },
                "status": { "$first": "$status" },
                "progress": { "$first": "$progress" },
                "score": { "$first": "$score" },
                "introduce": { "$first": "$introduce" },
                "startDate": { "$first": "$startDate" },
                "endDate": { "$first": "$endDate" },
                "show": { "$first": "$show" },
                "original": { "$first": "$original" },
                "author": { "$first": "$author" },
                "seriesTags": { "$push": "$series.tags" },
            }
        },
        { "$unset": "series.tags" },
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