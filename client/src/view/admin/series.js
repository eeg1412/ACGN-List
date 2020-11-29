import React, { Component } from 'react';
import { Button, Table, message, Modal, Form, Tag, Input, Image, Upload } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown/with-html';
import EditableTagGroup from '../../components/editableTagGroup'
import Crop from '../../components/crop';
import { authApi } from "../../api";
const _ = require('lodash');
const { TextArea } = Input;

const rawForm = {
    _id: '',
    base64: '',//图片bas64 或者 URL
    title: '',//标题
    originalName: '',//原名
    tags: [],//标签
    comment: '',//点评
    remarks: '',//备注
    creatDate: "",//录入时间
}
class adminSeries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            cropFile: null,
            cropDialogShow: false,
            editForm: _.cloneDeep(rawForm),
            editModel: false,
            columns: [
                {
                    title: '封面',
                    key: 'image',
                    width: 82,
                    fixed: 'left',
                    render: (text, record, index) => <Image className="acgnlist_admin_post_img" src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" alt="封面" />,
                },
                {
                    title: '标题',
                    dataIndex: 'title',
                },
                {
                    title: '原名',
                    dataIndex: 'originalName',
                },
                {
                    title: '标签',
                    dataIndex: 'tags',
                    render: tags => (
                        <>
                            {tags.map(tag => {
                                return (
                                    <Tag key={tag._id}>
                                        {tag.name}
                                    </Tag>
                                );
                            })}
                        </>
                    ),
                },
                {
                    title: '点评',
                    dataIndex: 'comment',
                    width: 100,
                    render: comment => <Button type="link" onClick={() => this.showText(comment, '点评')}>点击查看</Button>,
                },
                {
                    title: '备注',
                    dataIndex: 'remarks',
                    width: 100,
                    render: remarks => <Button type="link" onClick={() => this.showText(remarks, '备注')}>点击查看</Button>,
                },
                {
                    title: '录入时间',
                    dataIndex: 'creatDate',
                    render: creatDate => <div>{moment(creatDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 65,
                    key: 'action',
                    render: (text, record) => <Button type="link" onClick={() => this.showModal(record)}>修改</Button>,
                },
            ],
            data: [
                {
                    _id: 'vasas',
                    title: '物语系列',//标题
                    originalName: '物語シリーズ',//原名
                    tags: [
                        {
                            _id: '111',
                            name: '萌'
                        },
                        {
                            _id: '222',
                            name: '恐怖'
                        }],//标签
                    comment: `# 見出し
测试  
测试`,//点评
                    remarks: '',//备注
                    creatDate: "2020-11-07T11:50:10.262Z",//录入时间
                }
            ],
        }
    }
    onTagChange = async (key, tags) => {
        await this.formChange(key, tags);
    }
    formChange = async (key, value) => {
        let newObj = {};
        newObj[key] = _.cloneDeep(value);
        const editForm = Object.assign({}, this.state.editForm, newObj);
        console.log(editForm, newObj);
        await new Promise((resolve, reject) => {
            this.setState({
                editForm: editForm
            }, () => {
                resolve('ok')
            });
        });
    }
    inputChange = async (key, e) => {
        const newText = e.target ? e.target.value : e;
        // console.log(newText);
        await this.formChange(key, newText);
    }
    showModal = (editForm) => {
        let newEditForm = Object.assign({}, _.cloneDeep(rawForm), editForm);
        // 如果有ID为修改,定义一个URL TODO:到时候要改成服务器的图片地址
        if (newEditForm["_id"]) {
            newEditForm["base64"] = "https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg";
        }
        this.setState({
            editModel: true,
            editForm: _.cloneDeep(newEditForm)
        });
    };
    handleOk = e => {
        console.log(e);
        if (!this.state.editForm.base64) {
            message.error('请选择封面');
            return false;
        }
        if (!this.state.editForm.title) {
            message.error('请填写标题');
            return false;
        }
        let params = _.cloneDeep(this.state.editForm);
        let newTags = [];
        this.state.editForm.tags.forEach((item) => {
            newTags.push(item._id);
        })
        params['tags'] = newTags;
        authApi.seriesCreateOrEdit(params).then(res => {
            console.log(res);
            const code = res.data.code;
            if (code === 0) {
                message.error(res.data.msg);
            } else if (code === 1) {
                this.setState({
                    editModel: false,
                    editForm: _.cloneDeep(rawForm)
                });
                message.success('提交成功');
            }
        });
    };

    handleCancel = e => {
        this.setState({
            editModel: false,
            editForm: _.cloneDeep(rawForm)
        });
    };
    beforeUpload = file => {
        console.log(file);
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
    showText = (text, title) => {
        Modal.info({
            title: title,
            content: (
                <div>
                    <ReactMarkdown
                        source={text}
                        escapeHtml={false}
                    />
                </div>
            ),
            onOk () { },
        });
    }
    handleCropCancel = e => {
        console.log(e);
        this.setState({
            cropFile: null,
            cropDialogShow: false,
            fileList: []
        });
    };
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
    render () {
        return (
            <div>
                <div className="clearfix">
                    <div className="fr">
                        <Button type="primary" onClick={() => this.showModal(rawForm)}>新增</Button>
                    </div>
                </div>
                <div className="mt10">
                    <Table rowKey="_id"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        scroll={{ x: 1000 }} sticky />
                </div><Modal
                    className="acgnlist_admin_edit_modal"
                    title="系列增改"
                    okText="确认"
                    cancelText="取消"
                    centered={true}
                    maskClosable={false}
                    visible={this.state.editModel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div>
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                            layout="horizontal"
                            className="acgnlist_admin_form"
                        >
                            <Form.Item label="封面" className="acgnlist-form-item-required">
                                <div>
                                    {this.state.editForm.base64 && <Image
                                        src={this.state.editForm.base64} width="88px" className="mb5" alt="封面"
                                    />}
                                </div>
                                <Upload
                                    fileList={this.state.fileList}
                                    beforeUpload={this.beforeUpload}
                                >
                                    <Button>{this.state.editForm.base64 ? '重新选择' : '选择封面'}</Button>
                                </Upload>
                                <Input type="hidden" value={this.state.editForm.base64} />
                            </Form.Item>
                            <Form.Item label="标题" className="acgnlist-form-item-required">
                                <Input value={this.state.editForm.title} onChange={(e) => this.inputChange('title', e)} />
                            </Form.Item>
                            <Form.Item label="原名">
                                <Input value={this.state.editForm.originalName} onChange={(e) => this.inputChange('originalName', e)} />
                            </Form.Item>
                            <Form.Item label="标签">
                                <EditableTagGroup tags={this.state.editForm.tags} onTagChange={(tags) => this.onTagChange("tags", tags)} type="tags" />
                            </Form.Item>
                            <Form.Item label="点评">
                                <TextArea rows={4} placeholder="支持Markdown格式" value={this.state.editForm.comment} onChange={(e) => this.inputChange('comment', e)} />
                            </Form.Item>
                            <Form.Item label="备注">
                                <TextArea rows={4} placeholder="支持Markdown格式" value={this.state.editForm.remarks} onChange={(e) => this.inputChange('remarks', e)} />
                            </Form.Item>
                        </Form>
                        <Crop cropDialogShow={this.state.cropDialogShow} cropFile={this.state.cropFile} onOk={(base64) => this.handleCropOk(base64)} onCancel={() => this.handleCropCancel()} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default adminSeries