import React, { Component } from 'react';
import Crop from './crop';
import EditableTagGroup from './editableTagGroup';
import { Button, Switch, Form, Input, Upload, Image, Select, Slider, DatePicker } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

class baseFormItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cropFile: null,
            cropDialogShow: false,
            fileList: [],
        }
    }
    beforeUpload = file => {
        console.log(file);
        this.setState(state => ({
            fileList: [file]
        }));
        const reader = new FileReader();
        reader.addEventListener("load", () =>
            this.setState(state => ({
                cropFile: reader.result,
                cropDialogShow: true,
            }))
        );
        reader.readAsDataURL(file);
        return false;
    };
    formChange = (key, value) => {
        this.props.formChange(key, value);
    }
    handleCropOk = (base64) => {
        // console.log(base64);
        this.setState({
            cropFile: null,
            cropDialogShow: false
        });
        this.formChange('base64', base64);
        console.log(this.state);
    };

    handleCropCancel = e => {
        console.log(e);
        this.setState({
            cropFile: null,
            cropDialogShow: false,
        });
    };
    render () {
        return (
            <>
                <Form.Item label="封面">
                    <div>
                        {this.props.editForm.base64 && <Image
                            src={this.props.editForm.base64} width="88px" className="mb5" alt="封面"
                        />}
                    </div>
                    <Upload
                        fileList={this.state.fileList}
                        beforeUpload={this.beforeUpload}
                    >
                        <Button>{this.props.editForm.base64 ? '重新选择' : '选择封面'}</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="标题">
                    <Input />
                </Form.Item>
                <Form.Item label="原名">
                    <Input />
                </Form.Item>
                <Form.Item label="系列">
                    数码宝贝系列 <Button>{this.props.editForm.base64 ? '重新选择' : '选择系列'}</Button>
                </Form.Item>
                <Form.Item label="状态">
                    <Select defaultValue="doing" style={{ width: 120 }}>
                        <Option value="doing">正在</Option>
                        <Option value="want">想要</Option>
                        <Option value="giveUp">舍弃</Option>
                        <Option value="done">完毕</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="标签">
                    <EditableTagGroup />
                </Form.Item>
                <Form.Item label="评分">
                    <Slider defaultValue={0} className="acgnlist_admin_edit_slider" />
                    <div>0分</div>
                </Form.Item>
                <Form.Item label="点评">
                    <TextArea rows={4} placeholder="支持Markdown格式" />
                </Form.Item>
                <Form.Item label="介绍">
                    <TextArea rows={4} placeholder="支持Markdown格式" />
                </Form.Item>
                <Form.Item label="备注">
                    <TextArea rows={4} placeholder="支持Markdown格式" />
                </Form.Item>
                <Form.Item label="开始时间">
                    <DatePicker showTime placeholder="请选择开始时间" />
                </Form.Item>
                <Form.Item label="结束时间">
                    <DatePicker showTime placeholder="请选择结束时间" />
                </Form.Item>
                <Form.Item label="是否显示">
                    <Switch />
                </Form.Item>
                <Crop cropDialogShow={this.state.cropDialogShow} cropFile={this.state.cropFile} onOk={(base64) => this.handleCropOk(base64)} onCancel={() => this.handleCropCancel()} />
            </>
        );
    }
}

export default baseFormItem;