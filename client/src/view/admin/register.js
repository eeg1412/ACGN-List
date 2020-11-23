import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { authApi } from "../../api";

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
      password: '',
      password2: ''
    };
  }
  componentDidMount () {
    // 判断当前是否存在管理员账户，如果没有跳转到注册
    this.checkAdmin();
  }
  checkAdmin = () => {
    authApi.checkadmin().then(res => {
      const haveAccount = res.data.haveAccount;
      if (haveAccount) {
        this.props.history.replace('/admin/login');
      }
    });
  }
  onChangeAccount = (e) => {
    this.setState({
      account: e.target.value
    })
  }
  onChangePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  onChangePassword2 = (e) => {
    this.setState({
      password2: e.target.value
    })
  }
  register = (e) => {
    if (!this.state.account) {
      message.error('请输入用户名');
      return false;
    }
    if (!this.state.password) {
      message.error('请输入密码');
      return false;
    }
    if (this.state.password !== this.state.password2) {
      message.error('两次密码不一样');
      return false;
    }
    const params = {
      account: this.state.account,
      password: this.state.password
    }
    authApi.adminregister(params).then(res => {
      const code = res.data.code;
      if (code === 1) {
        message.success(res.data.msg);
        this.props.history.replace('/admin/login');
      } else if (code === 0) {
        message.error(res.data.msg);
      }
    });
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
          >
            <Input value={this.state.account} onChange={this.onChangeAccount} />
          </Form.Item>

          <Form.Item
            label="密码"
          >
            <Input.Password value={this.state.password} onChange={this.onChangePassword} />
          </Form.Item>
          <Form.Item
            label="确认密码"
          >
            <Input.Password value={this.state.password2} onChange={this.onChangePassword2} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" onClick={this.register}>
              注册
                    </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

}

export default adminRegister;