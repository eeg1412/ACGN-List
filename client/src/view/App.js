import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { authApi } from "../api";
import { Layout, Menu, Spin } from 'antd';
import anime from './anime'
import comic from './comic'
import game from './game'
import novel from './novel'
import { connect } from 'react-redux'

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
        {this.props.loading && (<div className="acgnlist_loading_body"><Spin delay={500} /></div>)}
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
              <Menu.Item key="/novel">
                小说
              </Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Switch>
              <Route path="/anime" exact component={anime}></Route>
              <Route path="/comic" exact component={comic}></Route>
              <Route path="/game" exact component={game}></Route>
              <Route path="/novel" exact component={novel}></Route>
            </Switch>
          </Content>
          <Footer>
            <div className="tc">Powered by <a rel="noopener noreferrer" href="https://www.wikimoe.com" target="_blank">wikimoe</a></div>
          </Footer>
        </Layout>
      </div>
    )


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
export default connect(mapStateToProps, mapDispatchToProps)(app);