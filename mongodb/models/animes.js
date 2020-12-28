var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var animes = new Schema({
    title: { type: String, default: "" },//标题
    originalName: { type: String, default: "" },//原名
    comment: { type: String, default: "" },//点评
    remarks: { type: String, default: "" },//备注
    type: { type: String, default: "anime" },//类型
    series: { type: Schema.Types.ObjectId, ref: 'series' },//系列
    status: { type: String, default: "doing" },//状态
    score: { type: Number, default: 0 },//评分
    introduce: { type: String, default: "" },//介绍
    startDate: Date,//开始时间
    endDate: Date,//结束时间
    show: { type: Boolean, default: true },//是否显示
    creatDate: {
        type: Date,
        default: Date.now
    },//录入时间
    // 动画类型
    animeType: { type: Schema.Types.ObjectId, ref: 'animeTypes' },//系列
    // 原作
    original: { type: [String], default: [] },
    // 导演
    directed: { type: [String], default: [] },
    // 动画制作
    animationCompany: { type: String, default: "" },
    // 已看集数
    watched: { type: Number, default: 0 },
});

module.exports = mongoose.model('animes', animes);