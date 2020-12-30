var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var novels = new Schema({
    title: { type: String, default: "" },//标题
    originalName: { type: String, default: "" },//原名
    comment: { type: String, default: "" },//点评
    remarks: { type: String, default: "" },//备注
    type: { type: String, default: "comic" },//类型
    series: { type: Schema.Types.ObjectId, ref: 'series' },//系列
    publishingHouse: { type: String, default: "" },//出版社
    status: { type: String, default: "doing" },//状态
    progress: { type: Number, default: 0 },//进度
    score: { type: Number, default: 0 },//评分
    introduce: { type: String, default: "" },//介绍
    startDate: Date,//开始时间
    endDate: Date,//结束时间
    show: { type: Boolean, default: true },//是否显示
    original: { type: [String], default: [] },//原作
    author: { type: [String], default: [] },//作者
    creatDate: {
        type: Date,
        default: Date.now
    },//录入时间
});

module.exports = mongoose.model('novels', novels);