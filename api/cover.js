const _ = require('lodash');
const fs = require("fs");
module.exports = function (req, res, next) {
    const type = req.query.type || '';
    const id = req.query.id || '';
    const typeList = ['series', 'anime', 'comic', 'game', 'novel'];
    if (typeList.indexOf(type) === -1) {
        res.status(404).send('参数有误！');
        return false;
    }
    if (!id) {
        res.status(404).send('参数有误！');
        return false;
    }
    let coverState = null;
    const path = `./cover/${type}/${id}.jpg`;
    try {
        coverState = fs.statSync(path);
    } catch (err) {
        if (err.code !== "ENOENT") {
            throw err;
        }
        coverState = null;
    }
    if (!coverState) {
        res.status(404).send('参数有误！');
        return false;
    }
    const data = fs.readFileSync(path);
    res.status(200).send(data);
}