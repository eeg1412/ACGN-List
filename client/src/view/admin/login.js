import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

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
            src: 'https://nodejs.wikimoe.com:667/api/captcha?time=' + new Date().getTime()
        }
    }
    componentDidMount () {
        // TODO:判断当前是否存在管理员账户，如果没有跳转到注册
    }
    reflushCaptcha = () => {
        this.setState(state => ({
            src: 'https://nodejs.wikimoe.com:667/api/captcha?time=' + new Date().getTime()
        }))
    }
    render () {
        return (
            <div className="acgnlist_admin_login_body">
                <div className="tc mt20 mb20"><h1>请登录</h1></div>
                <Form
                    {...layout}
                    name="basic"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                        name="captcha"
                    >
                        <Input addonAfter={<img className="acgnlist_captcha" src={this.state.src} onClick={() => this.reflushCaptcha()} alt="验证码" />} />
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>保持登录状态</Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default adminLogin;