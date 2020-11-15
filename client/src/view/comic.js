import React, { Component } from 'react';
import { Row, Col, Rate, Divider, Pagination } from 'antd';
import { withRouter } from 'react-router-dom';

class comic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'mail',
            doingList: [
                {
                    _id: 'a15454as',
                    series: {
                        title: "数码宝贝"
                    },
                    type: "anime",
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "doing",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
                },
                {
                    _id: 'a15454a1',
                    series: {
                        title: "数码宝贝"
                    },
                    type: "anime",
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "doing",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
                },
                {
                    _id: 'a15454a2',
                    series: {
                        title: "数码宝贝"
                    },
                    type: "anime",
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "doing",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
                },
                {
                    _id: 'a15454a3',
                    series: {
                        title: "数码宝贝"
                    },
                    type: "anime",
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "doing",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
                },
                {
                    _id: 'a15454a4',
                    series: {
                        title: "数码宝贝"
                    },
                    type: "anime",
                    title: '数码宝贝大冒险',
                    originalName: 'デジモンアドベンチャー',
                    star: 35,
                    creatDate: "2020-08-08",
                    status: "doing",
                    startDate: "2020-08-08",
                    endDate: "2020-08-08",
                },
            ],
        };
    }
    render () {
        return (
            <div className="p20 mt5" key="comic">
                <div>
                    <h2 className="fb">正在看：</h2>
                    <Row gutter={[12, 12]}>
                        {this.state.doingList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName}</p>
                                                <p>已看50%</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.star / 10} /> {data.star / 10}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                </div>
                <Divider />
                <div>
                    <h2 className="fb">想看：</h2>
                    <Row gutter={[12, 12]}>
                        {this.state.doingList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName}</p>
                                                <p>于2020年12月12日添加</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.star / 10} /> {data.star / 10}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                </div>
                <Divider />
                <div>
                    <h2 className="fb">看完：</h2>
                    <Row gutter={[12, 12]}>
                        {this.state.doingList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName}</p>
                                                <p>于2020年12月12日看完</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.star / 10} /> {data.star / 10}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                    <div className="tc mt5"><Pagination size="small" total={50} /></div>
                </div>
                <Divider />
                <div>
                    <h2 className="fb">弃坑：</h2>
                    <Row gutter={[12, 12]}>
                        {this.state.doingList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src="https://lain.bgm.tv/pic/cover/c/50/28/298451_AHqgU.jpg" />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName}</p>
                                                <p>已看50%</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.star / 10} /> {data.star / 10}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                    <div className="tc mt5"><Pagination size="small" total={50} /></div>
                </div>
            </div>
        );
    }
}

export default withRouter(comic);