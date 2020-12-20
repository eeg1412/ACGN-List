import React, { Component } from 'react';
import { Button, Table, Switch, Modal, Form, Tag, Slider, Input, Image, message, Pagination, Select } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown/with-html';
import BaseFormItem from '../../components/baseFormItem'
import EditableTagGroup from '../../components/editableTagGroup'
import Filter from '../../components/filter'
import moment from 'moment';
import { authApi } from "../../api";
const _ = require('lodash');
const { Option } = Select;

const rawForm = {
    _id: '',
    base64: '',
    title: '',
    seriesName: '',
    seriesId: '',
    originalName: '',
    publishingHouse: '',
    status: 'doing',
    // tags: [],
    score: 0,
    comment: '',
    introduce: '',
    remarks: '',
    creatDate: "",
    startDate: "",
    endDate: "",
    show: true,

    progress: 0,
    original: [],
    author: [],
}
const sortOption = (
    <>
        <Option value="0">创建时间从新到旧</Option>
        <Option value="1">创建时间从旧到新</Option>
        <Option value="2">评分从高到低</Option>
        <Option value="3">评分从低到高</Option>
        <Option value="4">进度从高到低</Option>
        <Option value="5">进度从低到高</Option>
    </>
);
class adminComic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'all',
            filterOpen: false,
            showMode: '0',
            keyword: '',
            sort: "0",
            total: 0,
            page: 1,
            timestamp: new Date().getTime(),
            editForm: _.cloneDeep(rawForm),

            editModel: false,
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
                    title: '系列',
                    dataIndex: ['series', 'title'],
                },
                {
                    title: '原名',
                    dataIndex: 'originalName',
                },
                {
                    title: '原作',
                    dataIndex: 'original',
                    render: original => (
                        <>
                            {original.map(original => {
                                return (
                                    <Tag key={original}>
                                        {original}
                                    </Tag>
                                );
                            })}
                        </>
                    ),
                },
                {
                    title: '作者',
                    dataIndex: 'author',
                    render: author => (
                        <>
                            {author.map(author => {
                                return (
                                    <Tag key={author}>
                                        {author}
                                    </Tag>
                                );
                            })}
                        </>
                    ),
                },
                {
                    title: '出版社',
                    dataIndex: 'publishingHouse',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    render: status => (
                        <>
                            {
                                (() => {
                                    if (status === 'doing') {
                                        return <span>在看</span>
                                    } else if (status === 'want') {
                                        return <span>想看</span>
                                    } else if (status === 'out') {
                                        return <span>舍弃</span>
                                    } else if (status === 'complete') {
                                        return <span>看完</span>
                                    }
                                })()
                            }
                        </>
                    ),
                },
                {
                    title: '进度',
                    dataIndex: 'progress',
                    render: progress => <span>{progress}%</span>
                },
                {
                    title: '评分',
                    dataIndex: 'score',
                    render: score => <span>{score}分</span>,
                },
                {
                    title: '点评',
                    dataIndex: 'comment',
                    render: comment => (comment && <Button type="link" onClick={() => this.showText(comment, '点评')}>点击查看</Button>),
                },
                {
                    title: '介绍',
                    dataIndex: 'introduce',
                    render: introduce => (introduce && <Button type="link" onClick={() => this.showText(introduce, '介绍')}>点击查看</Button>),
                },
                {
                    title: '备注',
                    dataIndex: 'remarks',
                    render: remarks => (remarks && <Button type="link" onClick={() => this.showText(remarks, '备注')}>点击查看</Button>),
                },
                {
                    title: '录入时间',
                    dataIndex: 'creatDate',
                    render: creatDate => <div>{moment(creatDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '开始时间',
                    dataIndex: 'startDate',
                    render: startDate => <div>{startDate && moment(startDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '结束时间',
                    dataIndex: 'endDate',
                    render: endDate => <div>{endDate && moment(endDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '显示',
                    width: 75,
                    dataIndex: 'show',
                    render: show => <Switch checked={show} />,
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 65,
                    key: 'action',
                    render: (text, record) => <Button type="link" onClick={() => this.showModal(record)}>修改</Button>,
                },
            ],
            data: [],
        };

    }
    componentDidMount () {
        this.searchComics();
    }
    searchComics = () => {
        const params = {
            page: this.state.page,
            keyword: this.state.keyword,
            sort: this.state.sort,
            showMode: this.state.showMode,
            status: this.state.status
        }
        authApi.comicsSearch(params).then((res) => {
            console.log(res);
            if (res.data.code === 1) {
                this.setState({
                    data: res.data.info.data,
                    total: res.data.info.total,
                });
            }
        });
    }
    showModal = (editForm) => {
        let newEditForm = Object.assign({}, _.cloneDeep(rawForm), editForm);
        // 如果有系列数据
        if (newEditForm["series"]) {
            newEditForm["seriesName"] = newEditForm["series"]["title"];
            newEditForm["seriesId"] = newEditForm["series"]["_id"]
        }
        // 如果有ID为修改,定义一个URL 
        if (newEditForm["_id"]) {
            newEditForm["base64"] = `/api/cover?type=comic&id=${newEditForm["_id"]}&t=${this.state.timestamp}`;
        }
        this.setState({
            editModel: true,
            editForm: _.cloneDeep(newEditForm)
        });
    };

    handleOk = e => {
        let params = _.cloneDeep(this.state.editForm);
        if (!this.state.editForm.base64) {
            message.error('请选择封面');
            return false;
        }
        if (!this.state.editForm.title) {
            message.error('请填写标题');
            return false;
        }
        if (params.base64.indexOf('/api/cover') !== -1) {
            params.base64 = '';
        }
        if (params['_id']) {
            params['type'] = 'edit';
        } else {
            params['type'] = 'create';
        }
        authApi.comicsCreateOrEdit(params).then((res) => {
            const code = res.data.code;
            if (code === 0) {
                message.error(res.data.msg);
            } else if (code === 1) {
                message.success('提交成功');
                this.setState({
                    editModel: false,
                    editForm: _.cloneDeep(rawForm)
                });
                this.baseFormItem.initSeries();
                //重新获取列表
                this.searchComics();
            }
        });
    };

    handleCancel = e => {
        this.setState({
            editModel: false,
            editForm: _.cloneDeep(rawForm)
        });
        this.baseFormItem.initSeries()
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
    formChange = async (key, value, asyncMode) => {
        let newObj = {};
        newObj[key] = value;
        const editForm = Object.assign({}, this.state.editForm, newObj);
        // console.log(editForm, newObj);
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
    inputChange = _.throttle(async (key, e) => {
        const newText = e.target ? e.target.value : e;
        this.formChange(key, newText);
    }, 20, {
        leading: true,
        trailing: false
    });
    onTagChange = async (key, tags) => {
        this.formChange(key, tags);
    }
    onRef = (ref) => {
        this.baseFormItem = ref
    }
    pageChange = (page) => {
        this.setState({
            page: page
        }, () => {
            this.searchComics();
        });
    }
    setFilterOpen = () => {
        this.setState({
            filterOpen: !this.state.filterOpen
        });
    }
    filterChange = (params) => {
        this.setState(params, () => {
            this.searchComics();
        });
    }
    render () {
        return (
            <div className="acgnlist_admin_r_body">
                <div className="clearfix">
                    <div className="fl"><Button type="primary" icon={<FilterFilled />} onClick={() => this.setFilterOpen()} /></div>
                    <div className="fr">
                        <Button type="primary" onClick={() => this.showModal(rawForm)}>新增</Button>
                    </div>
                </div>
                <div style={{ "display": this.state.filterOpen ? 'block' : 'none' }} className="mt10">

                    <Filter sortOption={sortOption} showSelect={true} showMode={this.state.showMode} keyword={this.state.keyword} sort={this.state.sort} status={this.state.status} onSearch={(params) => this.filterChange(params)} onClear={(params) => this.filterChange(params)} />
                </div>

                <div className="mt10">
                    <Table rowKey="_id"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.data} scroll={{ x: 2000 }} sticky
                        pagination={false}
                    />
                    <div className="tr mt10">
                        <Pagination current={this.state.page}
                            total={this.state.total}
                            onChange={this.pageChange}
                            pageSize={20} />
                    </div>
                </div>
                <Modal
                    className="acgnlist_admin_edit_modal"
                    title="漫画增改"
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
                            <BaseFormItem onRef={this.onRef} editForm={this.state.editForm} formChange={(key, value) => this.formChange(key, value)} />
                            <Form.Item label="原作">
                                <EditableTagGroup type={"input"} tags={this.state.editForm.original} onTagChange={(tags) => this.onTagChange("original", tags)} />
                            </Form.Item>
                            <Form.Item label="作者">
                                <EditableTagGroup type={"input"} tags={this.state.editForm.author} onTagChange={(tags) => this.onTagChange("author", tags)} />
                            </Form.Item>
                            <Form.Item label="出版社">
                                <Input value={this.state.editForm.publishingHouse} onChange={(e) => this.inputChange("publishingHouse", e)} />
                            </Form.Item>
                            <Form.Item label="进度" className="acgnlist-form-item-required">
                                <Slider defaultValue={0} value={this.state.editForm.progress} onChange={(value) => this.inputChange("progress", value)} className="acgnlist_admin_edit_slider" />
                                <div>{this.state.editForm.progress}%</div>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>

            </div>
        );
    }
}

export default adminComic