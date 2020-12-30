import React, { Component } from 'react';
import { Button, Tag, Empty, message, Pagination, Modal, Input } from 'antd';
import {
    CloseOutlined,
    EditOutlined
} from '@ant-design/icons';
import { authApi } from "../api";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

class tagsOptionsCompent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            total: 0,
            name: '',
            editId: '',
            nameInputDialogShow: false
        };

    }
    componentDidMount () {
        this.searchData();
    }
    pageChange = (page) => {
        this.setState({
            page: page
        }, () => {
            this.searchData();
        });
    }
    searchData = () => {
        const params = {
            page: this.state.page
        };
        switch (this.props.type) {
            case "game":
            case "anime":
                params["optionsType"] = this.props.type;
                authApi.optionsSearch(params).then((res) => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        this.setState({
                            list: res.data.options.data,
                            total: res.data.options.total,
                        });
                    }
                });
                break;

            default:
                break;
        }
    }
    handleOk = () => {
        // this.searchData();
        if (this.state.editId) {
            // 编辑
            const params = {};
            switch (this.props.type) {
                case "game":
                case "anime":
                    params["name"] = this.state.name;
                    params["id"] = this.state.editId;
                    authApi.optionsEdit(params).then((res) => {
                        const code = res.data.code;
                        if (code === 0) {
                            message.error(res.data.msg);
                        } else if (code === 1) {
                            message.success('提交成功');
                            this.afterSubmitData();
                        }
                    });
                default:
                    break;
            }
        } else {
            // 新建
            const params = {};
            switch (this.props.type) {
                case "game":
                case "anime":
                    params["optionsType"] = this.props.type;
                    params["name"] = this.state.name;
                    authApi.optionsCreate(params).then((res) => {
                        const code = res.data.code;
                        if (code === 0) {
                            message.error(res.data.msg);
                        } else if (code === 1) {
                            message.success('提交成功');
                            this.afterSubmitData();
                        }
                    });
                    break;

                default:
                    break;
            }
        }
    }
    afterSubmitData = () => {
        this.setState({
            nameInputDialogShow: false
        }, () => {
            this.searchData();
        });
    }
    handleCancel = () => {
        this.setState({
            nameInputDialogShow: false
        });
    }
    showNameInputDialog = (id, name) => {
        this.setState({
            nameInputDialogShow: true,
            editId: id || '',
            name: name || ''
        });
    }
    handleAfterClose = () => {
        this.setState({
            name: '',
            editId: ''
        });
    }
    nameChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }
    deleteContent = (id) => {
        confirm({
            title: '是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后将无法恢复！',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                console.log('OK', id);
                switch (this.props.type) {
                    case "game":
                    case "anime":
                        authApi.optionsDelete({ id: id }).then((res) => {
                            const code = res.data.code;
                            if (code === 0) {
                                message.error(res.data.msg);
                            } else if (code === 1) {
                                this.searchData();
                            }
                        });
                        break;

                    default:
                        break;
                }

            },
            onCancel () {
                console.log('Cancel');
            },
        });
    }
    render () {
        return (
            <div>
                <div className="clearfix">
                    <div className="fr">
                        <Button type="primary" onClick={() => this.showNameInputDialog()}>新增</Button>
                    </div>
                </div>
                <div className="mt10">
                    {this.state.list.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    {this.state.list.map((data) => {
                        return <Tag color="blue" key={data._id}>{data.name} <EditOutlined className="acgnlist_mouse_pointer" onClick={() => this.showNameInputDialog(data._id, data.name)} /><CloseOutlined className="acgnlist_mouse_pointer acgnlist_icon_ml4" onClick={() => this.deleteContent(data._id)} /></Tag>
                    })}

                </div>
                <div className="tr mt10">
                    <Pagination current={this.state.page}
                        total={this.state.total}
                        onChange={this.pageChange}
                        pageSize={20} />
                </div>
                <Modal
                    className="acgnlist_modal"
                    title={this.state.editId ? '修改' : '新建'}
                    okText="确认"
                    cancelText="取消"
                    centered={true}
                    destroyOnClose={true}
                    maskClosable={false}
                    visible={this.state.nameInputDialogShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    afterClose={this.handleAfterClose}
                >
                    <div>
                        <Input placeholder="请输入内容" value={this.state.name} onChange={this.nameChange} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default tagsOptionsCompent;