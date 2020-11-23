var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var admins = new Schema({
    account: String,
    password: String,
    token: String,
    IP: String,
});

module.exports = mongoose.model('admins', admins);