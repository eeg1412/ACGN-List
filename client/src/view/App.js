import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { authApi } from "../api";
import { Layout, Menu } from 'antd';
import anime from './anime'
import comic from './comic'
import game from './game'
import lightnovel from './lightnovel'

const { Header, Footer, Content } = Layout;


class app extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'anime',
    };
  }
  componentDidMount () {
    console.log(this);
    const path = this.props.location.pathname;
    if (path === '/') {
      console.log("跳转anime");
      this.props.history.replace('/anime');
    } else {
      this.setState({
        current: path
      });
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const path = this.props.location.pathname;
      this.setState({
        current: path
      });
    }
  }
  handleClick = e => {
    // console.log('click ', e);
    this.setState({ current: e.key });
    this.props.history.push(e.key);
  };
  render () {
    return (
      <div className="acgnlist_body">
        <Layout>
          <Header>
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
              <Menu.Item key="/anime">
                动画
              </Menu.Item>
              <Menu.Item key="/comic">
                漫画
              </Menu.Item>
              <Menu.Item key="/game">
                游戏
              </Menu.Item>
              <Menu.Item key="/lightnovel">
                轻小说
              </Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Switch>
              <Route path="/anime" exact component={anime}></Route>
              <Route path="/comic" exact component={comic}></Route>
              <Route path="/game" exact component={game}></Route>
              <Route path="/lightnovel" exact component={lightnovel}></Route>
            </Switch>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    )


  }
}


export default app