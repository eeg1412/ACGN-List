import React, { Component } from 'react';
import { Image, Rate, Divider, Col, Row } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ReactMarkdown from 'react-markdown/with-html';

class baseDetailItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render () {
        return (
            <div className="acgnlist_base_detail_body">
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">封面：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        <Image
                            src={`/api/cover?type=${this.props.detailData.type}&id=${this.props.detailData._id}`} width="240px" className="mb5 acgnlist_mouse_pointer" alt="封面"
                        />
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">标题：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        <span>{this.props.detailData.title}</span>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">原名：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        <span>{this.props.detailData.originalName || '--'}</span>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">系列：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        <span>{this.props.detailData.series.title}</span>
                    </Col>
                </Row>
                <Divider />
                {this.props.detailInfo}
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">状态：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        <span>{this.props.statusList[this.props.detailData.status]}</span>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">评分：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        {this.props.detailData.score ? <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={this.props.detailData.score / 20} /> {this.props.detailData.score}分</div> : <div>暂未评分</div>}
                    </Col>
                </Row>
                <Divider />
                {this.props.detailData.comment && <div>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">个人点评：</div>
                        </Col>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <div className="acgnlist_baseDetailItem_borderBox">
                                <ReactMarkdown
                                    source={this.props.detailData.comment}
                                    escapeHtml={false}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                </div>}
                {this.props.detailData.introduce && <div>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">作品介绍：</div>
                        </Col>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <div className="acgnlist_baseDetailItem_borderBox">
                                <ReactMarkdown
                                    source={this.props.detailData.introduce}
                                    escapeHtml={false}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                </div>}
                {this.props.detailData.remarks && <div>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">备注信息：</div>
                        </Col>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <div className="acgnlist_baseDetailItem_borderBox">
                                <ReactMarkdown
                                    source={this.props.detailData.remarks}
                                    escapeHtml={false}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                </div>}
                <Row>
                    <Col lg={4} md={4} sm={4} xs={24}>
                        <div className="acgnlist_detail_label">添加时间：</div>
                    </Col>
                    <Col lg={20} md={20} sm={20} xs={24}>
                        <div>{moment(this.props.detailData.creatDate).format("YYYY年MM月DD日 HH时mm分ss秒")}</div>
                    </Col>
                </Row>
                <Divider />
                {this.props.detailData.startDate && <div>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">开始时间：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            <div>{moment(this.props.detailData.startDate).format("YYYY年MM月DD日 HH时mm分ss秒")}</div>
                        </Col>
                    </Row>
                    <Divider />
                </div>}
                {this.props.detailData.endDate && <div>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">结束时间：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            <div>{moment(this.props.detailData.endDate).format("YYYY年MM月DD日 HH时mm分ss秒")}</div>
                        </Col>
                    </Row>
                    <Divider />
                </div>}

            </div>
        );
    }
}

export default baseDetailItem;