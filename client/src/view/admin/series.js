import React, { Component } from 'react';
import { Button, Table, message, Modal, Form, Tag, Input, Image, Upload, Pagination, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import ReactMarkdown from 'react-markdown/with-html';
import EditableTagGroup from '../../components/editableTagGroup'
import Crop from '../../components/crop';
import { authApi } from "../../api";
const _ = require('lodash');
const { TextArea } = Input;
const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

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
            keyword: '',
            total: 0,
            page: 1,
            sort: "0",
            timestamp: new Date().getTime(),
            fileList: [],
            cropFile: null,
            cropDialogShow: false,
            editForm: _.cloneDeep(rawForm),
            editModel: false,
            creatDateSortOrder: 'descend',
            columns: [
                {
                    title: '封面',
                    key: 'image',
                    width: 82,
                    fixed: 'left',
                    render: (text, record, index) => <Image className="acgnlist_admin_post_img" src={`/api/cover?type=${record.type}&id=${record._id}&t=${new Date().getTime()}`} alt="封面" />,
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
                    render: comment => (comment && <Button type="link" onClick={() => this.showText(comment, '点评')}>点击查看</Button>),
                },
                {
                    title: '备注',
                    dataIndex: 'remarks',
                    width: 100,
                    render: remarks => (remarks && <Button type="link" onClick={() => this.showText(remarks, '备注')}>点击查看</Button>),
                },
                {
                    title: '录入时间',
                    dataIndex: 'creatDate',
                    render: creatDate => <div>{moment(creatDate).format('YYYY年MM月DD日 HH:mm:ss')}</div>,
                    sorter: true,
                    sortOrder: "descend",
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 65,
                    key: 'action',
                    render: (text, record) => {
                        const selMode = <div><Button type="link" onClick={() => this.showModal(record)}>修改</Button> <Button type="link" onClick={() => this.sendRecord(record)}>选择</Button></div>
                        const noSelMode = <div><Button type="link" onClick={() => this.showModal(record)}>修改</Button> <Button type="link" onClick={() => this.showDeleteConfirm(record._id)}>删除</Button></div>
                        return this.props.selectMode ? selMode : noSelMode;
                    },
                },
            ],
            data: [],
        }
    }
    componentDidMount () {
        this.searchSeries();
    }
    sendRecord = (record) => {
        this.props.onSelect(record);
    }
    showDeleteConfirm = (id) => {
        confirm({
            title: '是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后将无法恢复！',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                console.log('OK', id);
                authApi.seriesDelete({ _id: id }).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        this.searchSeries();
                    }
                });
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    }
    searchSeries = () => {
        const params = {
            page: this.state.page,
            keyword: this.state.keyword,
            sort: this.state.sort
        }
        authApi.seriesSearch(params).then((res) => {
            console.log(res);
            if (res.data.code === 1) {
                this.setState({
                    data: res.data.info.data,
                    total: res.data.info.total,
                });
            }
        });
    }
    onTagChange = async (key, tags) => {
        await this.formChange(key, tags);
    }
    formChange = async (key, value, asyncMode) => {
        let newObj = {};
        newObj[key] = _.cloneDeep(value);
        const editForm = Object.assign({}, this.state.editForm, newObj);
        console.log(editForm, newObj);
        if (asyncMode) {
            await new Promise((resolve, reject) => {
                this.setState({
                    editForm: editForm
                }, () => {
                    resolve('ok')
                });
            });
        } else {
            this.setState({
                editForm: editForm
            });
        }
    }
    inputChange = async (key, e) => {
        const newText = e.target ? e.target.value : e;
        // console.log(newText);
        this.formChange(key, newText, false);
    }
    showModal = (editForm) => {
        let newEditForm = Object.assign({}, _.cloneDeep(rawForm), editForm);
        // 如果有ID为修改,定义一个URL TODO:到时候要改成服务器的图片地址
        if (newEditForm["_id"]) {
            newEditForm["base64"] = `/api/cover?type=series&id=${newEditForm["_id"]}&t=${this.state.timestamp}`;
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
        if (params.base64.indexOf('/api/cover') !== -1) {
            params.base64 = '';
        }
        if (params['_id']) {
            params['type'] = 'edit';
        } else {
            params['type'] = 'create';
        }
        authApi.seriesCreateOrEdit(params).then(res => {
            console.log(res);
            const code = res.data.code;
            if (code === 0) {
                message.error(res.data.msg);
            } else if (code === 1) {
                this.setState({
                    editModel: false,
                    timestamp: new Date().getTime(),
                });
                message.success('提交成功');
                this.searchSeries();
            }
        });
    };

    handleAfterClose = () => {
        this.setState({
            editForm: _.cloneDeep(rawForm)
        });
    }

    handleCancel = e => {
        this.setState({
            editModel: false
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
    pageChange = (page) => {
        this.setState({
            page: page
        }, () => {
            this.searchSeries();
        });
    }
    onKeywordChange = (e) => {
        this.setState({
            keyword: e.target.value,
        });
    }
    onKeywordSearch = (value) => {
        this.setState({
            page: 1,
        }, () => {
            this.searchSeries();
        });

    }
    tableChange = (pagination, filters, sorter, extra) => {
        const colName = sorter["field"];
        if (colName === "creatDate") {
            const sorterType = sorter.order || 'descend';
            let sortTypeDiv = '0';
            if (sorterType !== 'descend') {
                sortTypeDiv = '1';
            }
            this.setState({
                sort: sortTypeDiv
            }, () => {
                this.searchSeries();
                let columns = _.cloneDeep(this.state.columns);
                const columnsIndex = columns.findIndex((item) => {
                    return item["dataIndex"] === colName;
                });
                if (columnsIndex > -1) {
                    columns[columnsIndex]["sortOrder"] = sorterType;
                    this.setState({
                        columns: columns
                    });
                }
            });
        }

        console.log('params', pagination, filters, sorter, extra);

    }
    render () {
        return (
            <div>
                <div className="clearfix">
                    <div className='fl'>
                        <div className="dib">
                            <Search placeholder="输入关键词" style={{ width: '180px' }} value={this.state.keyword} onChange={this.onKeywordChange} onSearch={this.onKeywordSearch} />
                        </div>
                    </div>
                    <div className="fr">
                        <Button type="primary" onClick={() => this.showModal(rawForm)}>新增</Button>
                    </div>
                </div>
                <div className="mt10">
                    <Table rowKey="_id"
                        showSorterTooltip={false}
                        bordered
                        onChange={this.tableChange}
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        scroll={{ x: 1000 }} sticky
                        pagination={false} />
                    <div className="tr mt10">
                        <Pagination current={this.state.page}
                            total={this.state.total}
                            onChange={this.pageChange}
                            pageSize={20} />
                    </div>

                </div>
                <Modal
                    className="acgnlist_admin_edit_modal acgnlist_modal"
                    title="系列增改"
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}
                    centered={true}
                    maskClosable={false}
                    visible={this.state.editModel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    afterClose={this.handleAfterClose}
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