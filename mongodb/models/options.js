var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var options = new Schema({
    name: { type: String, default: "" },//标题
    type: { type: String, default: "" },//选项类型
    creatDate: {
        type: Date,
        default: Date.now
    },//录入时间
});

module.exports = mongoose.model('options', options);