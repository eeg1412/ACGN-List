import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

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
    render () {
        return (
            <div className="acgnlist_admin_body">
                <Layout>
                    <Header>动漫游戏轻小说后台管理系统</Header>
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
                                    <Menu.Item key="/admin/serie">系列</Menu.Item>
                                    <Menu.Item key="/admin/anime">动画</Menu.Item>
                                    <Menu.Item key="/admin/comic">漫画</Menu.Item>
                                    <Menu.Item key="/admin/game">游戏</Menu.Item>
                                    <Menu.Item key="/admin/lightnovel">轻小说</Menu.Item>
                                </Menu>
                            </div>
                        </Sider>
                        <Content className="p20">Content</Content>
                    </Layout>
                    <Footer>
                        <div className="tc">Powered by <a href="https://www.wikimoe.com" target="_blank">wikimoe</a></div>
                    </Footer>
                </Layout>

            </div>
        );
    }
}

export default adminIndex;