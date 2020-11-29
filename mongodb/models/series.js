var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var series = new Schema({
    title: { type: String, default: "" },//标题
    originalName: { type: String, default: "" },//原名
    tags: { type: [{ type: Schema.Types.ObjectId, ref: 'tags' }], default: [] },//标签
    comment: { type: String, default: "" },//点评
    remarks: { type: String, default: "" },//备注
    type: { type: String, default: "series" },//类型
    creatDate: {
        type: Date,
        default: Date.now
    },//录入时间
});

module.exports = mongoose.model('series', series);