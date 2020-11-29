import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, message, Spin } from 'antd';
import { authApi } from "../../api";
import { connect } from 'react-redux'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};
class adminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: '/api/captcha?time=' + new Date().getTime(),
            loginForm: {
                account: '',
                password: '',
                captcha: '',
                save: false,
            }
        }
    }
    componentDidMount () {
        // 判断当前是否存在管理员账户，如果没有跳转到注册
        this.checkAdmin();
    }
    checkAdmin = () => {
        authApi.checkadmin().then(res => {
            const haveAccount = res.data.haveAccount;
            if (!haveAccount) {
                this.props.history.replace('/admin/register');
            }
            // 检测是否有登录账户
            if (this.props.adminToken) {
                this.props.history.replace('/admin/series');
            }
        });
    }
    reflushCaptcha = () => {
        this.setState(state => ({
            src: '/api/captcha?time=' + new Date().getTime()
        }))
    }
    onChangeForm = (key, value) => {
        let newObj = {};
        newObj[key] = value;
        const loginForm = Object.assign({}, this.state.loginForm, newObj);
        console.log(loginForm, newObj);
        this.setState({
            loginForm: loginForm
        });
    }
    login = () => {
        authApi.adminlogin(this.state.loginForm).then(res => {
            console.log(res);
            const code = res.data.code;
            if (code === 0) {
                message.error(res.data.msg);
            } else if (code === 1) {
                if (this.state.loginForm.save) {
                    localStorage.setItem("adminToken", res.data.token);
                } else {
                    sessionStorage.setItem("adminToken", res.data.token);
                }
                console.log(this);
                this.props.setAdminToken();
                setTimeout(() => {
                    this.props.history.replace('/admin/series');
                }, 20);

            }
            this.reflushCaptcha();
        });
    }
    render () {
        return (
            <div className="acgnlist_admin_login_body">
                {this.props.loading && (<div className="acgnlist_loading_body"><Spin delay={500} /></div>)}
                <div className="tc mt20 mb20"><h1>请登录</h1></div>
                <Form
                    {...layout}
                    name="basic"
                >
                    <Form.Item
                        label="用户名"
                    >
                        <Input value={this.state.loginForm.account} onChange={(e) => this.onChangeForm('account', e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                    >
                        <Input.Password value={this.state.loginForm.password} onChange={(e) => this.onChangeForm('password', e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                    >
                        <Input value={this.state.loginForm.captcha} onChange={(e) => this.onChangeForm('captcha', e.target.value)} addonAfter={<img className="acgnlist_captcha" src={this.state.src} onClick={() => this.reflushCaptcha()} alt="验证码" />} />
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox checked={this.state.loginForm.save} onChange={(e) => this.onChangeForm('save', e.target.checked)}>保持登录状态</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button onClick={this.login} type="primary">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
//将state映射到props函数
function mapStateToProps (state) {
    return { ...state }
}


//将修改state数据的方法，映射到props,默认会传入store里的dispach方法
function mapDispatchToProps (dispatch) {
    return {
        setAdminToken: () => { dispatch({ type: 'setAdminToken' }) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(adminLogin);