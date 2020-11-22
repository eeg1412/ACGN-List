import React, { Component } from 'react';
import { Button, Table, Switch, Modal, Form, Input, Upload, Tag, Image, Select, Slider, DatePicker } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown/with-html';
import Crop from './crop';
const { Option } = Select;
const { TextArea } = Input;
class adminComic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editForm: {
                base64: ''
            },
            cropFile: null,
            cropDialogShow: false,
            editModel: false,
            columns: [
                {
                    title: '封面',
                    key: 'image',
                    width: 82,
                    fixed: 'left',
                    render: src => <img className="acgnlist_admin_post_img" src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" alt="封面" />,
                },
                {
                    title: '标题',
                    fixed: 'left',
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
                    title: '标签',
                    dataIndex: 'tags',
                    render: tags => (
                        <>
                            {tags.map(tag => {
                                return (
                                    <Tag key={tag}>
                                        {tag}
                                    </Tag>
                                );
                            })}
                        </>
                    ),
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
                },
                {
                    title: '开始时间',
                    dataIndex: 'startDate',
                },
                {
                    title: '结束时间',
                    dataIndex: 'endDate',
                },
                {
                    title: '是否显示',
                    fixed: 'right',
                    width: 90,
                    dataIndex: 'show',
                    render: show => <Switch checked={show} />,
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 72,
                    key: 'action',
                    render: (text, record) => <Button type="primary" icon={<EditOutlined />}></Button>,
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
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "doing",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
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
                        title: "数码宝贝"
                    },
                    original: ['原作'],
                    author: ['作者'],
                    tag: ['热血', '进化'],
                    show: true,
                    publishingHouse: 'Bandai',
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "giveUp",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
                    tags: ['数码宝贝'],
                    progress: 30,
                    score: 10,
                }
            ],
            fileList: [],
        };

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
    showModal = () => {
        this.setState({
            editModel: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            editModel: false,
        });
    };

    handleCancel = e => {
        this.setState({
            editModel: false,
        });
    };

    handleCropOk = (base64) => {
        const editForm = Object.assign({}, this.state.editForm, { base64: base64 })
        // console.log(base64);
        this.setState({
            cropFile: null,
            cropDialogShow: false,
            editForm: editForm
        });
        console.log(this.state);
    };

    handleCropCancel = e => {
        console.log(e);
        this.setState({
            cropFile: null,
            cropDialogShow: false,
        });
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
    render () {
        return (
            <div className="acgnlist_admin_r_body">
                <div className="clearfix">
                    <div className="fr">
                        <Button type="primary" onClick={this.showModal}>新增</Button>
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
                        >
                            <Form.Item label="封面">
                                {this.state.editForm.base64 && <Image
                                    src={this.state.editForm.base64} width="100%" className="mb5" alt="封面"
                                />}
                                <Upload
                                    fileList={this.state.fileList}
                                    beforeUpload={this.beforeUpload}
                                >
                                    <Button>{this.state.editForm.base64 ? '重新选择' : '选择封面'}</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="标题">
                                <Input />
                            </Form.Item>
                            <Form.Item label="原名">
                                <Input />
                            </Form.Item>
                            <Form.Item label="系列">
                                数码宝贝系列 <Button>{this.state.editForm.base64 ? '重新选择' : '选择系列'}</Button>
                            </Form.Item>
                            <Form.Item label="原作">
                                <Tag>原作</Tag>
                            </Form.Item>
                            <Form.Item label="作者">
                                <Tag>原作</Tag>
                            </Form.Item>
                            <Form.Item label="出版社">
                                <Input />
                            </Form.Item>
                            <Form.Item label="状态">
                                <Select defaultValue="doing" style={{ width: 120 }}>
                                    <Option value="doing">在看</Option>
                                    <Option value="want">想看</Option>
                                    <Option value="giveUp">舍弃</Option>
                                    <Option value="done">看完</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="进度">
                                <Slider defaultValue={0} className="acgnlist_admin_edit_slider" />
                                <div>0%</div>
                            </Form.Item>
                            <Form.Item label="标签">
                                <Tag>标签</Tag>
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
                        </Form>
                    </div>
                </Modal>
                <Crop cropDialogShow={this.state.cropDialogShow} cropFile={this.state.cropFile} onOk={(base64) => this.handleCropOk(base64)} onCancel={() => this.handleCropCancel()} />
            </div>
        );
    }
}

export default adminComic