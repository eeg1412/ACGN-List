import React, { Component } from 'react';
import { Layout, Menu, Button, Spin } from 'antd';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import series from './series'
import anime from './anime'
import comic from './comic'
import game from './game'
import novel from './novel'
import animetype from './animetype'
import gameplatform from './platform'
import tags from './tags'

const { SubMenu } = Menu;

const { Header, Footer, Sider, Content } = Layout;

class adminIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '/admin/serie',
        };
    }
    componentDidMount () {
        console.log(this);
        const path = this.props.location.pathname;
        this.setState({
            current: path
        });
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
    quit = () => {
        sessionStorage.removeItem("adminToken");
        localStorage.removeItem("adminToken");
        this.props.setAdminToken();
    }
    render () {
        return (
            <>
                {this.props.loading && (<div className="acgnlist_loading_body"><Spin delay={500} /></div>)}
                {this.props.adminToken ? (<div className="acgnlist_admin_body">
                    <Layout>
                        <Header>动画漫画游戏小说后台管理系统<div className="fr"><Button onClick={() => this.quit()} className="cWhite" type="link" >[退出]</Button></div></Header>
                        <Layout>
                            <Sider
                                breakpoint="lg"
                                collapsedWidth="0">
                                <div className="acgnlist_admin_menu_body">
                                    <Menu
                                        onClick={this.handleClick}
                                        selectedKeys={[this.state.current]}
                                        mode="inline"
                                    >
                                        <Menu.Item key="/admin/series">系列</Menu.Item>
                                        <Menu.Item key="/admin/anime">动画</Menu.Item>
                                        <Menu.Item key="/admin/comic">漫画</Menu.Item>
                                        <Menu.Item key="/admin/game">游戏</Menu.Item>
                                        <Menu.Item key="/admin/novel">小说</Menu.Item>
                                        <Menu.Item key="/admin/tags">标签管理</Menu.Item>
                                        <Menu.Item key="/admin/animetype">动画类型</Menu.Item>
                                        <Menu.Item key="/admin/gameplatform">游戏平台</Menu.Item>
                                    </Menu>
                                </div>
                            </Sider>
                            <Content className="p20">
                                <Switch>
                                    <Route path="/admin/series" exact component={series}></Route>
                                    <Route path="/admin/anime" exact component={anime}></Route>
                                    <Route path="/admin/comic" exact component={comic}></Route>
                                    <Route path="/admin/game" exact component={game}></Route>
                                    <Route path="/admin/novel" exact component={novel}></Route>
                                    <Route path="/admin/animetype" exact component={animetype}></Route>
                                    <Route path="/admin/gameplatform" exact component={gameplatform}></Route>
                                    <Route path="/admin/tags" exact component={tags}></Route>
                                </Switch>
                            </Content>
                        </Layout>
                        <Footer>
                            <div className="tc">Powered by <a rel="noopener noreferrer" href="https://www.wikimoe.com" target="_blank">wikimoe</a></div>
                        </Footer>
                    </Layout>

                </div>) : (<Redirect to="/admin/login" />)}
            </>
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
export default connect(mapStateToProps, mapDispatchToProps)(adminIndex);