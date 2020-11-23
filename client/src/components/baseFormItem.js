import React, { Component } from 'react';
import Crop from './crop';
import { Button, Switch, Form, Input, Upload, Image, Select, Slider, DatePicker, Modal, Table } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
const { TextArea } = Input;

class baseFormItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seriesVisible: false,
            cropFile: null,
            cropDialogShow: false,
            fileList: [],
            series: [
                {
                    _id: "vxase",
                    title: "数码宝贝",
                    creatDate: "2020-11-07T11:50:06.116Z",
                },
                {
                    _id: "vxa",
                    title: "神奇宝贝",
                    creatDate: "2020-11-07T11:50:06.116Z",
                },
            ],
            columns: [
                {
                    title: '封面',
                    key: 'image',
                    width: 82,
                    render: (text, record, index) => <Image className="acgnlist_admin_post_img" src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" alt="封面" />,
                },
                {
                    title: '标题',
                    dataIndex: 'title',
                },
                {
                    title: '录入时间',
                    dataIndex: 'creatDate',
                    render: creatDate => <div>{moment(creatDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 72,
                    key: 'action',
                    render: (text, record) => <Button type="link" onClick={() => this.selectSeries(record)}>选择</Button>,
                },
            ],
        }
    }
    componentDidMount () {
        this.props.onRef(this)
    }
    selectSeries = async (data) => {
        console.log(data);
        await this.formChange('seriesName', data.title);
        await this.formChange('seriesId', data._id);
        this.setState({
            seriesVisible: false,
        });
    }
    showSeriesModal = () => {
        this.setState({
            seriesVisible: true,
        });
    };
    seriesModalhandleOk = e => {
        this.setState({
            seriesVisible: false,
        });
    }
    seriesModalhandleCancel = e => {
        this.setState({
            seriesVisible: false,
        });
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
    formChange = async (key, value) => {
        await this.props.formChange(key, value);
    }
    handleCropOk = async (base64) => {
        // console.log(base64);
        this.setState({
            cropFile: null,
            cropDialogShow: false,
            fileList: []
        });
        await this.formChange('base64', base64);
        console.log(this.state);
    };

    inputChange = async (key, e) => {
        const newText = e.target ? e.target.value : e;
        console.log(newText);
        await this.formChange(key, newText);
    }

    handleCropCancel = e => {
        console.log(e);
        this.setState({
            cropFile: null,
            cropDialogShow: false,
            fileList: []
        });
    };
    initSeries = () => {
        // TODO:清空系列数据
        console.log('清空系列数据');
    }
    render () {
        return (
            <>
                <Form.Item label="封面" className="acgnlist-form-item-required">
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
                    <Input type="hidden" value={this.props.editForm.base64} />
                </Form.Item>
                <Form.Item label="标题" className="acgnlist-form-item-required">
                    <Input value={this.props.editForm.title} onChange={(e) => this.inputChange('title', e)} />
                </Form.Item>
                <Form.Item label="原名">
                    <Input value={this.props.editForm.originalName} onChange={(e) => this.inputChange('originalName', e)} />
                </Form.Item>
                <Form.Item label="系列" className="acgnlist-form-item-required">
                    {this.props.editForm.seriesName} <Button onClick={() => { this.showSeriesModal() }}>{this.props.editForm.seriesId ? '重新选择' : '选择系列'}</Button>
                    <Input type="hidden" value={this.props.editForm.seriesId} />
                </Form.Item>
                <Form.Item label="状态" className="acgnlist-form-item-required">
                    <Select style={{ width: 120 }} value={this.props.editForm.status} onChange={(value) => this.inputChange('status', value)}>
                        <Option value="doing">正在</Option>
                        <Option value="want">想要</Option>
                        <Option value="giveUp">舍弃</Option>
                        <Option value="done">完毕</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="评分">
                    <Slider defaultValue={0} className="acgnlist_admin_edit_slider" value={this.props.editForm.score} onChange={(value) => this.inputChange('score', value)} />
                    <div>{this.props.editForm.score}分</div>
                </Form.Item>
                <Form.Item label="点评">
                    <TextArea rows={4} placeholder="支持Markdown格式" value={this.props.editForm.comment} onChange={(e) => this.inputChange('comment', e)} />
                </Form.Item>
                <Form.Item label="介绍">
                    <TextArea rows={4} placeholder="支持Markdown格式" value={this.props.editForm.introduce} onChange={(e) => this.inputChange('introduce', e)} />
                </Form.Item>
                <Form.Item label="备注">
                    <TextArea rows={4} placeholder="支持Markdown格式" value={this.props.editForm.remarks} onChange={(e) => this.inputChange('remarks', e)} />
                </Form.Item>
                <Form.Item label="开始时间">
                    <DatePicker locale={locale} showTime placeholder="请选择开始时间" value={this.props.editForm.startDate ? moment(this.props.editForm.startDate, "YYYY-MM-DD h:mm:ss") : ""} onChange={(value) => this.inputChange('startDate', value ? value.toISOString() : "")} />
                </Form.Item>
                <Form.Item label="结束时间">
                    <DatePicker locale={locale} showTime placeholder="请选择结束时间" value={this.props.editForm.endDate ? moment(this.props.editForm.endDate, "YYYY-MM-DD h:mm:ss") : ""} onChange={(value) => this.inputChange('endDate', value ? value.toISOString() : "")} />
                </Form.Item>
                <Form.Item label="是否显示" value={this.props.editForm.show} className="acgnlist-form-item-required">
                    <Switch checked={this.props.editForm.show} onChange={(value) => this.inputChange('show', value)} />
                </Form.Item>
                <Crop cropDialogShow={this.state.cropDialogShow} cropFile={this.state.cropFile} onOk={(base64) => this.handleCropOk(base64)} onCancel={() => this.handleCropCancel()} />
                <Modal
                    title="选择系列"
                    centered={true}
                    maskClosable={false}
                    visible={this.state.seriesVisible}
                    onOk={this.seriesModalhandleOk}
                    onCancel={this.seriesModalhandleCancel}
                >
                    <div>
                        <Table rowKey="_id"
                            bordered
                            columns={this.state.columns}
                            dataSource={this.state.series}
                        />
                    </div>
                </Modal>
            </>
        );
    }
}

export default baseFormItem;