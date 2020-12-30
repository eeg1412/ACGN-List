var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var games = new Schema({
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
    // 平台
    platform: { type: Schema.Types.ObjectId, ref: 'options' },
    // 游戏公司
    gameCompany: { type: String, default: "" },
    // 长期游戏
    isLongGame: { type: Boolean, default: false },
    // 进度
    progress: { type: Number, default: 0 },
});

module.exports = mongoose.model('games', games);