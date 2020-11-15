import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from "../api";

class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: ''
    };
    this.setAccount = this.setAccount.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }
  setAccount (event) {
    this.setState({ account: event.target.value });
  }
  setPassword (event) {
    this.setState({ password: event.target.value });
  }
  render () {
    const { account, password } = this.state;
    return (
      <div>
        <h1>注册</h1>
        <div>
          <p>账号：<input type="text" value={account} onChange={this.setAccount} /></p>
          <p>密码：<input type="password" value={password} onChange={this.setPassword} /></p>
        </div>
        <div><button onClick={this.goReg}>注册</button><Link to="/">返回</Link></div>
      </div>
    );
  }
  goReg = () => {
    const params = {
      account: this.state.account,
      password: this.state.password
    }
    authApi.register(params).then(res => {
      alert(res.data.msg);
      if (res.data.code === 1) {
        this.props.history.push('/');
      }
    });
  }
}

export default register;