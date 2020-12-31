import React, { Component } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { authApi } from "../../api";
import store from '../../store/data';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};
class adminChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                password: '',
                newPassword: '',
                checkPassword: '',
            }
        }
    }
    onChangeForm = (key, value) => {
        let newObj = {};
        newObj[key] = value;
        const form = Object.assign({}, this.state.form, newObj);
        console.log(form, newObj);
        this.setState({
            form: form
        });
    }
    changePassword = () => {
        if (!this.state.form.password) {
            message.error("请输入原密码");
            return false;
        } else if (!this.state.form.newPassword) {
            message.error("请输入新密码");
            return false;
        } else if (this.state.form.newPassword !== this.state.form.checkPassword) {
            message.error("两次密码输入不一样");
            return false;
        }
        const params = {
            password: this.state.form.password,
            newPassword: this.state.form.newPassword
        }
        authApi.adminChangePassword(params).then((res) => {
            const code = res.data.code;
            if (code === 0) {
                message.error(res.data.msg);
            } else if (code === 1) {
                Modal.info({
                    title: '密码修改成功',
                    content: (
                        <div>
                            <p>{res.data.msg}</p>
                        </div>
                    ),
                    onOk () {
                        setTimeout(() => {
                            sessionStorage.removeItem("adminToken");
                            localStorage.removeItem("adminToken");
                            store.dispatch({ type: 'setAdminToken' });
                        }, 500);
                    },
                });
            }
        });
    }
    render () {
        return (
            <div className="acgnlist_admin_r_body">
                <Form
                    {...layout}
                    name="basic"
                >
                    <Form.Item
                        label="原密码"
                    >
                        <Input.Password value={this.state.form.password} onChange={(e) => this.onChangeForm('password', e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="新密码"
                    >
                        <Input.Password value={this.state.form.newPassword} onChange={(e) => this.onChangeForm('newPassword', e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="确认密码"
                    >
                        <Input.Password value={this.state.form.checkPassword} onChange={(e) => this.onChangeForm('checkPassword', e.target.value)} />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button onClick={this.changePassword} type="primary">
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default adminChangePassword;