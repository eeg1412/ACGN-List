import React, { Component } from 'react';
import { Row, Col, Rate, Divider, Pagination, Button, Popover, Select } from 'antd';
import { withRouter } from 'react-router-dom';
import { authApi } from "../api";
import moment from 'moment';
import { FilterFilled } from '@ant-design/icons';
import Filter from '../components/filter'
const { Option } = Select;

const sortOption = (
    <>
        <Option value="0">创建时间从新到旧</Option>
        <Option value="1">创建时间从旧到新</Option>
        <Option value="2">评分从高到低</Option>
        <Option value="3">评分从低到高</Option>
        <Option value="4">进度从高到低</Option>
        <Option value="5">进度从低到高</Option>
    </>
);

class comic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doingList: [],
            wantList: [],
            outList: [],
            completeList: [],
            filterParams: {
                doing: {
                    keyword: '',
                    sort: '0'
                },
                want: {
                    keyword: '',
                    sort: '0'
                },
                out: {
                    keyword: '',
                    sort: '0'
                },
                complete: {
                    keyword: '',
                    sort: '0'
                },
            },
            page: {
                doing: 1,
                want: 1,
                out: 1,
                complete: 1,
            },
            total: {
                doing: 1,
                want: 1,
                out: 1,
                complete: 1,
            }
        };
    }
    componentDidMount () {
        this.searchComics("doing");
        this.searchComics("want");
        this.searchComics("out");
        this.searchComics("complete");
    }
    creatNewTotal = (total, status) => {
        let newTotal = {};
        newTotal[status] = total;
        const newTotalObj = Object.assign({}, this.state.total, newTotal);
        return newTotalObj;
    }
    creatNewPage = (page, status) => {
        let newPage = {};
        newPage[status] = page;
        const newPageObj = Object.assign({}, this.state.page, newPage);
        return newPageObj;
    }
    searchComics = (status) => {
        const params = {
            page: this.state.page[status],
            keyword: this.state.filterParams[status].keyword,
            sort: this.state.filterParams[status].sort,
            status: status
        }
        authApi.comicsSearch(params).then((res) => {
            console.log(res);
            let newTotalObj = this.creatNewTotal(res.data.info.total, status);
            if (res.data.code === 1) {
                switch (status) {
                    case "doing":
                        this.setState({
                            doingList: res.data.info.data,
                            total: newTotalObj,
                        });
                        break;
                    case "want":
                        this.setState({
                            wantList: res.data.info.data,
                            total: newTotalObj,
                        });
                        break;
                    case "out":
                        this.setState({
                            outList: res.data.info.data,
                            total: newTotalObj,
                        });
                        break;
                    case "complete":
                        this.setState({
                            completeList: res.data.info.data,
                            total: newTotalObj,
                        });
                        break;
                    default:
                        break;
                }

            }
        });
    }
    filterChange = (params, status) => {
        const { sort, keyword } = params;
        let newParams = {};
        newParams[status] = {
            keyword: keyword,
            sort: sort
        }
        const newParamsObj = Object.assign({}, this.state.filterParams, newParams);
        const newPageObj = this.creatNewPage(1, status);
        this.setState({
            filterParams: newParamsObj,
            page: newPageObj
        }, () => {
            this.searchComics(status);
        });
    }
    pageChange = (page, status) => {
        const newPageObj = this.creatNewPage(page, status);
        this.setState({
            page: newPageObj
        }, () => {
            this.searchComics(status);
        });
    }
    render () {
        return (
            <div className="p20 mt5" key="comic">
                {this.state.doingList.length > 0 && <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">正在看：</h2>
                        <div className="fr">
                            <Popover
                                content={
                                    <Filter sortOption={sortOption} showShowSelect={false} showStatusSelect={false} keyword={this.state.filterParams['doing'].keyword} sort={this.state.filterParams['doing'].sort} onSearch={(params) => this.filterChange(params, 'doing')} onClear={(params) => this.filterChange(params, 'doing')} />
                                }
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button type="primary" size="small" icon={<FilterFilled />} />
                            </Popover>
                        </div>
                    </div>
                    <Row gutter={[12, 12]}>
                        {this.state.doingList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName || '--'}</p>
                                                <p>已看{data.progress}%</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                    <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['doing']} total={this.state.total['doing']} onChange={(page) => this.pageChange(page, 'doing')} /></div>
                </div>}
                {this.state.wantList.length > 0 && <Divider />}
                {this.state.wantList.length > 0 && <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">想看：</h2>
                        <div className="fr">
                            <Popover
                                content={
                                    <Filter sortOption={sortOption} showShowSelect={false} showStatusSelect={false} keyword={this.state.filterParams['want'].keyword} sort={this.state.filterParams['want'].sort} onSearch={(params) => this.filterChange(params, 'want')} onClear={(params) => this.filterChange(params, 'want')} />
                                }
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button type="primary" size="small" icon={<FilterFilled />} />
                            </Popover>
                        </div>
                    </div>
                    <Row gutter={[12, 12]}>
                        {this.state.wantList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName || '--'}</p>
                                                <p>于{moment(data.creatDate).format("YYYY年MM月DD日")}添加</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                    <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['want']} total={this.state.total['want']} onChange={(page) => this.pageChange(page, 'want')} /></div>
                </div>}
                {this.state.completeList.length > 0 && <Divider />}
                {this.state.completeList.length > 0 && <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">看完：</h2>
                        <div className="fr">
                            <Popover
                                content={
                                    <Filter sortOption={sortOption} showShowSelect={false} showStatusSelect={false} keyword={this.state.filterParams['complete'].keyword} sort={this.state.filterParams['complete'].sort} onSearch={(params) => this.filterChange(params, 'complete')} onClear={(params) => this.filterChange(params, 'complete')} />
                                }
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button type="primary" size="small" icon={<FilterFilled />} />
                            </Popover>
                        </div>
                    </div>
                    <Row gutter={[12, 12]}>
                        {this.state.completeList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName || '--'}</p>
                                                {data.endDate ? <p>于{moment(data.endDate).format("YYYY年MM月DD日")}看完</p> : '暂未添加看完时间'}
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                    <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['complete']} total={this.state.total['complete']} onChange={(page) => this.pageChange(page, 'complete')} /></div>
                </div>}
                {this.state.outList.length > 0 && <Divider />}
                {this.state.outList.length > 0 && <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">弃坑：</h2>
                        <div className="fr">
                            <Popover
                                content={
                                    <Filter sortOption={sortOption} showShowSelect={false} showStatusSelect={false} keyword={this.state.filterParams['out'].keyword} sort={this.state.filterParams['out'].sort} onSearch={(params) => this.filterChange(params, 'out')} onClear={(params) => this.filterChange(params, 'out')} />
                                }
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button type="primary" size="small" icon={<FilterFilled />} />
                            </Popover>
                        </div>
                    </div>
                    <Row gutter={[12, 12]}>
                        {this.state.outList.map((data) => {
                            return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                <div className="bangumItem">
                                    <Row>
                                        <Col flex="65px">
                                            <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                        </Col>
                                        <Col flex="auto">
                                            <div className="textBox">
                                                <p>{data.title}</p>
                                                <p>{data.originalName || '--'}</p>
                                                <p>已看{data.progress}%</p>
                                                <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>;
                        })}
                    </Row>
                    <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['out']} total={this.state.total['out']} onChange={(page) => this.pageChange(page, 'out')} /></div>
                </div>}
            </div>
        );
    }
}

export default withRouter(comic);