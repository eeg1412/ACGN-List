const _ = require('lodash');
const utils = require('../utils/utils');
const request = require("request")
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jquery = require('jquery');

module.exports = async function (req, res, next) {
    const type = String(req.body.type || 'all');
    let page = Number(req.body.page || 1);
    const keyword = String(req.body.keyword || '');
    const token = req.header('token');
    if (!_.isInteger(page) || page < 1) {
        page = 1;
    }
    if (keyword === '') {
        res.send({
            code: 0,
            msg: '请输入关键词!'
        });
        return false;
    }
    // 验证token
    const IP = utils.getUserIp(req);
    const adminInfo = await utils.checkAdmin(token, IP);
    if (!adminInfo) {
        res.send({
            code: 403,
            msg: '管理员验证失败!'
        });
        console.error(
            chalk.yellow('快速导入查询失败，管理员验证失败！')
        );
        return false;
    }
    let cat = 'all';
    switch (type) {
        case "anime":
            cat = "2";
            break;
        case "novel":
        case "comic":
            cat = "1";
            break;
        case "game":
            cat = "4";
            break;
        default:
            break;
    }

    const url = `https://bangumi.tv/subject_search/${encodeURI(keyword.replace(/ /g, "+"))}?cat=${cat}&page=${page}`;
    const options = {
        url: url,
        encoding: null,
        timeout: 15000
    };
    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const dom = new JSDOM(body);
            const $ = jquery(dom.window);
            const elementList = $("#browserItemList").find("li");
            const itemList = [];
            elementList.each((index, element) => {
                const aTag = $(element).find('h3 a');
                const itemData = {
                    url: $(aTag).attr("href"),
                    title: $(aTag).text(),
                    infoTip: $(element).find('.info.tip').text()
                };
                itemList.push(itemData);
            });
            res.send({
                code: 1,
                list: itemList,
                hasPrevPage: $("#multipage .page_inner .p_cur").prev('.p').length > 0,
                hasNextPage: $("#multipage .page_inner .p_cur").next('.p').length > 0,
                msg: 'ok'
            });
        } else {
            res.send({
                code: 0,
                msg: '信息获取错误!'
            });
        }
    });
}