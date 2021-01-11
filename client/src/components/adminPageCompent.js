import React, { Component } from 'react';
import { Button, Table, Switch, Modal, Form, Tag, Slider, Input, Image, message, Pagination, Select, InputNumber, Radio, Checkbox, Tooltip } from 'antd';
import { FilterFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown/with-html';
import BaseFormItem from './baseFormItem'
import EditableTagGroup from './editableTagGroup'
import Animetype from '../view/admin/animetype'
import Platform from '../view/admin/platform'
import Filter from './filter'
import moment from 'moment';
import { authApi } from "../api";
const _ = require('lodash');
const { Option } = Select;
const { confirm } = Modal;

class adminPageCompent extends Component {
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
            editForm: _.cloneDeep(this.props.rawForm),

            editModel: false,
            columns: [],
            data: [],

            typeOptions: [],
            optionsDialog: false
        };

    }
    componentDidMount () {
        this.setColumsData();
        this.searchDataList();
    }
    findInfoData = (data, infoArr) => {
        return data.infoData.find((item) => {
            return infoArr.indexOf(item.tip) !== -1;
        });
    }
    searchTypeOptions = () => {
        switch (this.props.type) {
            case "game":
            case "anime":
                const params = {
                    optionsType: this.props.type,
                    searchAll: true
                }
                authApi.optionsSearch(params).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        this.setState({
                            typeOptions: res.data.options.data,
                        });
                    }
                });
                break;

            default:
                break;
        }
    }
    setColumsData = () => {
        let columsData = [];
        switch (this.props.type) {
            case "novel":
            case "comic":
                columsData = [
                    {
                        title: '原作',
                        dataIndex: 'original',
                        render: original => (
                            <>
                                {original.map((original, index) => {
                                    return (
                                        <Tooltip title={original} key={original + index} ><Tag className="acgnlist_tag_max80">
                                            {original}
                                        </Tag></Tooltip>
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
                                {author.map((author, index) => {
                                    return (
                                        <Tooltip title={author} key={author + index}><Tag className="acgnlist_tag_max80">
                                            {author}
                                        </Tag></Tooltip>
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
                        title: '进度',
                        dataIndex: 'progress',
                        render: progress => <span>{progress}%</span>
                    },
                ]
                break;
            case "anime":
                columsData = [
                    {
                        title: '动画类型',
                        dataIndex: ["animeType", "name"],
                    },
                    {
                        title: '原作',
                        dataIndex: 'original',
                        render: original => (
                            <>
                                {original.map((original, index) => {
                                    return (
                                        <Tooltip title={original} key={original + index}><Tag className="acgnlist_tag_max80">
                                            {original}
                                        </Tag></Tooltip>
                                    );
                                })}
                            </>
                        ),
                    },
                    {
                        title: '导演',
                        dataIndex: 'directed',
                        render: directed => (
                            <>
                                {directed.map((directed, index) => {
                                    return (
                                        <Tooltip title={directed} key={directed + index}><Tag className="acgnlist_tag_max80">
                                            {directed}
                                        </Tag></Tooltip>
                                    );
                                })}
                            </>
                        ),
                    },
                    {
                        title: '动画公司',
                        dataIndex: 'animationCompany',
                    },
                    {
                        title: '已看集数',
                        dataIndex: 'watched',
                        render: watched => <span>{watched}集</span>
                    },
                ]
                break;
            case "game":
                columsData = [
                    {
                        title: '游戏平台',
                        dataIndex: ["platform", "name"],
                    },
                    {
                        title: '游戏公司',
                        dataIndex: 'gameCompany',
                    },
                    {
                        title: '进度',
                        render: (text, record, index) => record.isLongGame ? <span>长期游戏</span> : <span>{record.progress}%</span>,
                    },
                ]
                break;
            default:
                break;
        }
        const frontColumsData = [
            {
                title: '封面',
                key: 'image',
                width: 82,
                fixed: 'left',
                render: (text, record, index) => <Image className="acgnlist_admin_post_img" src={`/api/cover?type=${record.type}&id=${record._id}&t=${this.state.timestamp}`} alt="封面" />,
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
                title: '状态',
                dataIndex: 'status',
                render: status => (
                    <>
                        {
                            (() => {
                                if (status === 'doing') {
                                    return <span>正在</span>
                                } else if (status === 'want') {
                                    return <span>想要</span>
                                } else if (status === 'out') {
                                    return <span>舍弃</span>
                                } else if (status === 'complete') {
                                    return <span>完毕</span>
                                }
                            })()
                        }
                    </>
                ),
            },
        ]
        const backColumsData = [
            {
                title: '评分',
                dataIndex: 'score',
                render: score => score > 0 ? <span>{score}分</span> : <span>暂未评分</span>,
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
                width: 214,
                dataIndex: 'creatDate',
                render: creatDate => <div>{moment(creatDate).format('YYYY年MM月DD日 HH:mm:ss')}</div>
            },
            {
                title: '开始时间',
                width: 214,
                dataIndex: 'startDate',
                render: startDate => <div>{startDate && moment(startDate).format('YYYY年MM月DD日 HH:mm:ss')}</div>
            },
            {
                title: '结束时间',
                width: 214,
                dataIndex: 'endDate',
                render: endDate => <div>{endDate && moment(endDate).format('YYYY年MM月DD日 HH:mm:ss')}</div>
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
                render: (text, record) => <div><Button type="link" onClick={() => this.showModal(record)}>修改</Button> <Button type="link" onClick={() => this.showDeleteConfirm(record._id)}>删除</Button></div>,
            },
        ]
        const newColumsData = [...frontColumsData, ...columsData, ...backColumsData];
        this.setState({
            columns: newColumsData,
        });
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
                switch (this.props.type) {
                    case "comic":
                        authApi.comicsDelete({ _id: id }).then((res) => {
                            const code = res.data.code;
                            if (code === 0) {
                                message.error(res.data.msg);
                            } else if (code === 1) {
                                this.searchDataList();
                            }
                        });
                        break;
                    case "anime":
                        authApi.animesDelete({ _id: id }).then((res) => {
                            const code = res.data.code;
                            if (code === 0) {
                                message.error(res.data.msg);
                            } else if (code === 1) {
                                this.searchDataList();
                            }
                        });
                        break;
                    case "game":
                        authApi.gamesDelete({ _id: id }).then((res) => {
                            const code = res.data.code;
                            if (code === 0) {
                                message.error(res.data.msg);
                            } else if (code === 1) {
                                this.searchDataList();
                            }
                        });
                        break;
                    case "novel":
                        authApi.novelsDelete({ _id: id }).then((res) => {
                            const code = res.data.code;
                            if (code === 0) {
                                message.error(res.data.msg);
                            } else if (code === 1) {
                                this.searchDataList();
                            }
                        });
                        break;
                    default:
                        break;
                }
                console.log('OK', id);
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    }
    searchDataList = () => {
        const params = {
            page: this.state.page,
            keyword: this.state.keyword,
            sort: this.state.sort,
            showMode: this.state.showMode,
            status: this.state.status
        }
        switch (this.props.type) {
            case "comic":
                authApi.comicsSearch(params).then((res) => {
                    console.log(res);
                    if (res.data.code === 1) {
                        this.setState({
                            data: res.data.info.data,
                            total: res.data.info.total,
                            timestamp: new Date().getTime(),
                        });
                    }
                });
                break;
            case "anime":
                authApi.animesSearch(params).then((res) => {
                    console.log(res);
                    if (res.data.code === 1) {
                        this.setState({
                            data: res.data.info.data,
                            total: res.data.info.total,
                            timestamp: new Date().getTime(),
                        });
                    }
                });
                break;
            case "game":
                authApi.gamesSearch(params).then((res) => {
                    console.log(res);
                    if (res.data.code === 1) {
                        this.setState({
                            data: res.data.info.data,
                            total: res.data.info.total,
                            timestamp: new Date().getTime(),
                        });
                    }
                });
                break;
            case "novel":
                authApi.novelsSearch(params).then((res) => {
                    console.log(res);
                    if (res.data.code === 1) {
                        this.setState({
                            data: res.data.info.data,
                            total: res.data.info.total,
                            timestamp: new Date().getTime(),
                        });
                    }
                });
                break;
            default:
                break;
        }

    }
    showModal = (editForm) => {
        let newEditForm = Object.assign({}, _.cloneDeep(this.props.rawForm), editForm);
        switch (this.props.type) {
            case "anime":
                newEditForm["animeType"] = newEditForm["animeType"]["_id"];
                break;
            case "game":
                newEditForm["platform"] = newEditForm["platform"]["_id"];
                break;
            default:
                break;
        }
        // 如果有系列数据
        if (newEditForm["series"]) {
            newEditForm["seriesName"] = newEditForm["series"]["title"];
            newEditForm["seriesId"] = newEditForm["series"]["_id"]
        }
        // 如果有ID为修改,定义一个URL 
        if (newEditForm["_id"]) {
            newEditForm["base64"] = `/api/cover?type=${this.props.type}&id=${newEditForm["_id"]}&t=${this.state.timestamp}`;
        }
        this.searchTypeOptions();
        this.setState({
            editModel: true,
            editForm: _.cloneDeep(newEditForm)
        });
    };

    sendQuickData = (data) => {
        // const newForm = _.cloneDeep(this.state.editForm);
        const quickData = {};
        quickData["originalName"] = data["originalName"] || '';
        quickData["introduce"] = data["introduce"] || '';
        quickData["base64"] = data["imgBase64"] ? 'data:image/jpeg;base64,' + data["imgBase64"] : '';
        const titleData = this.findInfoData(data, ['中文名']);
        if (titleData) {
            quickData["title"] = titleData.text;
        }

        /* 以下为类型数据 */
        switch (this.props.type) {
            case "anime":
                // 查询原作
                const originalData = this.findInfoData(data, ['原作']);
                if (originalData) {
                    quickData["original"] = originalData.text.split('、');
                }
                // 查询导演
                const directedData = this.findInfoData(data, ['导演', '总导演']);
                if (directedData) {
                    quickData["directed"] = directedData.text.split('、');
                }
                // 动画制作
                const animationCompanyData = this.findInfoData(data, ['动画制作']);
                if (animationCompanyData) {
                    quickData["animationCompany"] = animationCompanyData.text;
                }
                // 已看集数
                const watchedData = this.findInfoData(data, ['话数']);
                if (watchedData) {
                    quickData["watched"] = Number(watchedData.text);
                }
                break;
            case "novel":
            case "comic":
                quickData["author"] = [];
                // 查询原作
                const ncoriginalData = this.findInfoData(data, ['原作']);
                if (ncoriginalData) {
                    quickData["original"] = ncoriginalData.text.split('、');
                }
                // 查询作者
                const ncauthordData = this.findInfoData(data, ['作者']);
                if (ncauthordData) {
                    quickData["author"] = [...ncauthordData.text.split('、')];
                }
                // 查询插画
                const illData = this.findInfoData(data, ['插图']);
                if (illData) {
                    quickData["author"] = [...illData.text.split('、')];
                }
                // 出版社
                const publishingHouseData = this.findInfoData(data, ['出版社']);
                if (publishingHouseData) {
                    quickData["publishingHouse"] = publishingHouseData.text;
                }
                break;
            case "game":
                // 游戏公司
                const gameCompanyData = this.findInfoData(data, ['开发']);
                if (gameCompanyData) {
                    quickData["gameCompany"] = gameCompanyData.text;
                }
                break;
            default:
                break;
        }

        const editForm = Object.assign({}, this.state.editForm, quickData);
        this.setState({
            editForm: editForm
        }, () => {
            console.log(this.state.editForm)
        });
    }

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
        switch (this.props.type) {
            case "comic":
                authApi.comicsCreateOrEdit(params).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        message.success('提交成功');
                        this.setState({
                            editModel: false
                        });
                        this.baseFormItem.initSeries();
                        //重新获取列表
                        this.searchDataList();
                    }
                });
                break;
            case "anime":
                authApi.animesCreateOrEdit(params).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        message.success('提交成功');
                        this.setState({
                            editModel: false
                        });
                        this.baseFormItem.initSeries();
                        //重新获取列表
                        this.searchDataList();
                    }
                });
                break;
            case "game":
                authApi.gamesCreateOrEdit(params).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        message.success('提交成功');
                        this.setState({
                            editModel: false
                        });
                        this.baseFormItem.initSeries();
                        //重新获取列表
                        this.searchDataList();
                    }
                });
                break;
            case "novel":
                authApi.novelsCreateOrEdit(params).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        message.success('提交成功');
                        this.setState({
                            editModel: false
                        });
                        this.baseFormItem.initSeries();
                        //重新获取列表
                        this.searchDataList();
                    }
                });
                break;
            default:
                break;
        }

    };

    handleCancel = e => {
        this.setState({
            editModel: false
        });
        this.baseFormItem.initSeries();
    };

    handleAfterClose = () => {
        this.setState({
            editForm: _.cloneDeep(this.props.rawForm)
        });
    }

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
            this.searchDataList();
        });
    }
    setFilterOpen = () => {
        this.setState({
            filterOpen: !this.state.filterOpen
        });
    }
    filterChange = (params) => {
        const stateData = { ...params };
        stateData["page"] = 1;
        this.setState(stateData, () => {
            this.searchDataList();
        });
    }
    optionsDialogClose = () => {
        this.setState({
            optionsDialog: false
        });
        this.searchTypeOptions();
    }
    optionsDialogShow = () => {
        this.setState({
            optionsDialog: true
        });
    }
    render () {
        const sortOption = () => {
            switch (this.props.type) {
                case "novel":
                case "comic":
                case "game":
                    return <>
                        <Option value="0">创建时间从新到旧</Option>
                        <Option value="1">创建时间从旧到新</Option>
                        <Option value="2">评分从高到低</Option>
                        <Option value="3">评分从低到高</Option>
                        <Option value="4">进度从高到低</Option>
                        <Option value="5">进度从低到高</Option>
                    </>
                case "anime":
                    return <>
                        <Option value="0">创建时间从新到旧</Option>
                        <Option value="1">创建时间从旧到新</Option>
                        <Option value="2">评分从高到低</Option>
                        <Option value="3">评分从低到高</Option>
                    </>
                default:
                    break;
            }

        };
        const otherForm = () => {
            let form = <></>;
            switch (this.props.type) {
                case "novel":
                case "comic":
                    form = <>
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
                    </>
                    break;
                case "anime":
                    form = <>
                        <Form.Item label="动画类型" className="acgnlist-form-item-required">
                            <Radio.Group onChange={(e) => this.inputChange("animeType", e)} value={this.state.editForm.animeType}>
                                {this.state.typeOptions.map((data) => {
                                    return <Radio value={data._id} key={data._id}>{data.name}</Radio>
                                })}
                            </Radio.Group>
                            <Button size="small" className="acgnlist_option_button" onClick={this.optionsDialogShow}>选项管理</Button>
                        </Form.Item>
                        <Form.Item label="原作">
                            <EditableTagGroup type={"input"} tags={this.state.editForm.original} onTagChange={(tags) => this.onTagChange("original", tags)} />
                        </Form.Item>
                        <Form.Item label="导演">
                            <EditableTagGroup type={"input"} tags={this.state.editForm.directed} onTagChange={(tags) => this.onTagChange("directed", tags)} />
                        </Form.Item>
                        <Form.Item label="动画公司">
                            <Input value={this.state.editForm.animationCompany} onChange={(e) => this.inputChange("animationCompany", e)} />
                        </Form.Item>
                        <Form.Item label="已看集数">
                            <InputNumber min={0} value={this.state.editForm.watched} onChange={(value) => this.inputChange("watched", value)} />
                        </Form.Item>
                    </>
                    break;
                case "game":
                    form = <>
                        <Form.Item label="游戏平台" className="acgnlist-form-item-required">
                            <Radio.Group onChange={(e) => this.inputChange("platform", e)} value={this.state.editForm.platform}>
                                {this.state.typeOptions.map((data) => {
                                    return <Radio value={data._id} key={data._id}>{data.name}</Radio>
                                })}
                            </Radio.Group>
                            <Button size="small" className="acgnlist_option_button" onClick={this.optionsDialogShow}>选项管理</Button>
                        </Form.Item>
                        <Form.Item label="游戏公司">
                            <Input value={this.state.editForm.gameCompany} onChange={(e) => this.inputChange("gameCompany", e)} />
                        </Form.Item>
                        <Form.Item label="进度" className="acgnlist-form-item-required">
                            <div><Checkbox checked={this.state.editForm.isLongGame} onChange={(e) => this.inputChange("isLongGame", e.target.checked)}>长期游戏</Checkbox></div>
                            {!this.state.editForm.isLongGame && <div>
                                <Slider value={this.state.editForm.progress} onChange={(value) => this.inputChange("progress", value)} className="acgnlist_admin_edit_slider" />
                                <div>{this.state.editForm.progress}%</div>
                            </div>}
                        </Form.Item>
                    </>
                    break;
                default:
                    break;
            }
            return form;
        }
        return (
            <div>
                <div className="clearfix">
                    <div className="fl"><Button type="primary" icon={<FilterFilled />} onClick={() => this.setFilterOpen()} /></div>
                    <div className="fr">
                        <Button type="primary" onClick={() => this.showModal(this.props.rawForm)}>新增</Button>
                    </div>
                </div>
                <div style={{ "display": this.state.filterOpen ? 'block' : 'none' }} className="mt10">

                    <Filter sortOption={sortOption()} showShowSelect={true} showStatusSelect={true} showMode={this.state.showMode} keyword={this.state.keyword} sort={this.state.sort} status={this.state.status} onSearch={(params) => this.filterChange(params)} onClear={(params) => this.filterChange(params)} />
                </div>
                <div className="mt10">
                    <Table rowKey="_id"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.data} scroll={{ x: 2500 }} sticky
                        pagination={false}
                    />
                    <div className="tr mt10">
                        <Pagination current={this.state.page} showSizeChanger={false}
                            total={this.state.total}
                            onChange={this.pageChange}
                            pageSize={20} />
                    </div>
                </div>
                <Modal
                    className="acgnlist_admin_edit_modal acgnlist_modal"
                    title="内容编辑"
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
                            <BaseFormItem onRef={this.onRef} type={this.props.type} editForm={this.state.editForm} formChange={(key, value) => this.formChange(key, value)} sendQuickData={(data) => this.sendQuickData(data)} />
                            {otherForm()}
                        </Form>
                    </div>
                </Modal>
                <Modal
                    className="acgnlist_admin_edit_modal acgnlist_modal"
                    title="选项管理"
                    okText="确认"
                    cancelText="取消"
                    footer={null}
                    destroyOnClose={true}
                    centered={true}
                    maskClosable={false}
                    visible={this.state.optionsDialog}
                    onCancel={this.optionsDialogClose}
                >
                    <div>
                        {this.props.type === "anime" && <Animetype />}
                        {this.props.type === "game" && <Platform />}
                    </div>
                </Modal>

            </div>
        );
    }
}

export default adminPageCompent