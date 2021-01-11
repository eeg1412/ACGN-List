const _ = require('lodash');
const utils = require('../utils/utils');
const request = require("request")
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jquery = require('jquery');

module.exports = async function (req, res, next) {
    const url = String(req.body.url || '');
    const token = req.header('token');
    if (url === '') {
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

    const bangumiurl = `https://bangumi.tv${url}`;
    const options = {
        url: bangumiurl,
        encoding: null,
        timeout: 15000
    };
    request.get(options, async (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const dom = new JSDOM(body);
            const $ = jquery(dom.window);
            const originalName = $('.nameSingle a').text();
            const introduceDataArr = $('#subject_summary').text().split("\n");
            introduceDataArr.forEach((item, index) => {
                introduceDataArr[index] = $.trim(item);
            });
            introduceDataArr
            const introduce = introduceDataArr.join("\n").replace(/\n/g, `  \n`);
            const imgSrc = $('.thickbox.cover .cover').attr('src').replace('/pic/cover/c/', '/pic/cover/l/').replace('//', 'https://');
            let imgBase64 = '';
            const imgOptions = {
                url: imgSrc,
                encoding: null,
                timeout: 15000
            }
            await new Promise((resolve, reject) => {
                request.get(imgOptions, async (error, response, body) => {
                    if (error) {
                        reject("无法获取");
                    } else {
                        imgBase64 = Buffer.from(body, 'binary').toString('base64');
                        resolve("获取成功");
                    }
                })
            });
            const infobox = $('#infobox li');
            const infoData = [];
            infobox.each((index, element) => {
                const text = $(element).text();
                const textArr = text.split(": ");
                const textArrCopy = _.cloneDeep(textArr).splice(1, textArr.length - 1).join(": ");
                const data = {
                    tip: textArr[0],
                    text: textArrCopy
                };
                infoData.push(data);
            });
            res.send({
                code: 1,
                data: {
                    originalName: originalName,
                    introduce: introduce,
                    imgBase64: imgBase64,
                    infoData: infoData
                },
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