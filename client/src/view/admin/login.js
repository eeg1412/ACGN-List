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