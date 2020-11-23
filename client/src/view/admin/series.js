import React, { Component } from 'react';
import { Button } from 'antd';

const rawForm = {
    base64: '',//图片bas64 或者 URL
    title: '',//标题
    originalName: '',//原名
    tags: [],//标签
    comment: '',//点评
    remarks: '',//备注
    creatDate: "",//录入时间
}
class adminSeries extends Component {
    render () {
        return (
            <div>
                <div className="clearfix">
                    <div className="fr">
                        <Button type="primary">新增</Button>
                    </div>
                </div>
                <div></div>
            </div>
        );
    }
}

export default adminSeries