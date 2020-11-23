import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

class adminRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: ''
    };
  }
  render () {
    return (
      <div className="acgnlist_admin_login_body">
        <div className="tc mt20 mb20"><h1>注册</h1></div>
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

          <Form.Item {...tailLayout}>
            <Button type="primary">
              注册
                    </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

}

export default adminRegister;