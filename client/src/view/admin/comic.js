import React, { Component } from 'react';
import { Button, Table, Switch, Modal, Form, Tag, Slider, Input, Image } from 'antd';
import ReactMarkdown from 'react-markdown/with-html';
import BaseFormItem from '../../components/baseFormItem'
import EditableTagGroup from '../../components/editableTagGroup'
import moment from 'moment';
const _ = require('lodash');

const rawForm = {
    _id: '',
    base64: '',
    title: '',
    seriesName: '',
    seriesId: '',
    originalName: '',
    publishingHouse: '',
    status: 'doing',
    progress: 0,
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

class adminComic extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                                    } else if (status === 'giveUp') {
                                        return <span>舍弃</span>
                                    } else if (status === 'done') {
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
                    render: comment => <Button type="link" onClick={() => this.showText(comment, '点评')}>点击查看</Button>,
                },
                {
                    title: '介绍',
                    dataIndex: 'introduce',
                    render: introduce => <Button type="link" onClick={() => this.showText(introduce, '介绍')}>点击查看</Button>,
                },
                {
                    title: '备注',
                    dataIndex: 'remarks',
                    render: remarks => <Button type="link" onClick={() => this.showText(remarks, '备注')}>点击查看</Button>,
                },
                {
                    title: '录入时间',
                    dataIndex: 'creatDate',
                    render: creatDate => <div>{moment(creatDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '开始时间',
                    dataIndex: 'startDate',
                    render: startDate => <div>{moment(startDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '结束时间',
                    dataIndex: 'endDate',
                    render: endDate => <div>{moment(endDate).format('YYYY-MM-DD h:mm:ss')}</div>
                },
                {
                    title: '显示',
                    fixed: 'right',
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
            data: [
                {
                    _id: 'a15454as',
                    series: {
                        title: "数码宝贝"
                    },
                    original: ['原作'],
                    author: ['作者'],
                    tag: ['热血', '进化'],
                    show: true,
                    publishingHouse: 'Bandai',
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    creatDate: "2020-11-07T11:50:06.116Z",
                    status: "doing",
                    startDate: "2020-11-07T11:50:06.116Z",
                    endDate: "2020-11-07T11:50:10.262Z",
                    tags: [],
                    progress: 90,
                    score: 20,
                    comment: `# 見出し
测试  
测试
                    `,
                },
                {
                    _id: 'a154542as',
                    series: {
                        _id: "asassa",
                        title: "数码宝贝"
                    },
                    original: ['原作'],
                    author: ['作者'],
                    tag: ['热血', '进化'],
                    show: true,
                    publishingHouse: 'Bandai',
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    creatDate: "2020-11-07T11:50:06.116Z",
                    status: "giveUp",
                    startDate: "2020-11-07T11:50:06.116Z",
                    endDate: "2020-11-07T11:50:10.262Z",
                    tags: ['数码宝贝'],
                    progress: 30,
                    score: 10,
                }
            ],
        };

    }

    showModal = (editForm) => {
        let newEditForm = Object.assign({}, _.cloneDeep(rawForm), editForm);
        // 如果有系列数据
        if (newEditForm["series"]) {
            newEditForm["seriesName"] = newEditForm["series"]["title"];
            newEditForm["seriesId"] = newEditForm["series"]["_id"]
        }
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
        this.setState({
            editModel: false,
            editForm: _.cloneDeep(rawForm)
        });
        this.baseFormItem.initSeries()
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
    formChange = async (key, value) => {
        let newObj = {};
        newObj[key] = value;
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
    onTagChange = async (key, tags) => {
        await this.formChange(key, tags);
    }
    onRef = (ref) => {
        this.baseFormItem = ref
    }
    render () {
        return (
            <div className="acgnlist_admin_r_body">
                <div className="clearfix">
                    <div className="fr">
                        <Button type="primary" onClick={() => this.showModal(rawForm)}>新增</Button>
                    </div>
                </div>
                <div className="mt10">
                    <Table rowKey="_id"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.data} scroll={{ x: 2000 }} sticky
                    />
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
                            <Form.Item label="作者" className="acgnlist-form-item-required">
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