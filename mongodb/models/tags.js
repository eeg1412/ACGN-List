var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var tags = new Schema({
    name: { type: String, default: "" },//标题
    creatDate: {
        type: Date,
        default: Date.now
    },//录入时间
});

module.exports = mongoose.model('tags', tags);