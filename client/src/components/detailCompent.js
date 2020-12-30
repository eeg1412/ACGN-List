import React, { Component } from 'react';
import { Row, Col, Rate, Divider, Pagination, Button, Popover, Select, Empty, Modal } from 'antd';
import { authApi } from "../api";
import moment from 'moment';
import { FilterFilled } from '@ant-design/icons';
import Filter from './filter'
import BaseDetailItem from './baseDetailItem'
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

class detailCompent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailData: null,
            detailShow: false,
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
        this.searchItemList("doing");
        this.searchItemList("want");
        this.searchItemList("out");
        this.searchItemList("complete");
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
    setListData = (status, res, newTotalObj) => {
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
    searchItemList = (status) => {
        const params = {
            page: this.state.page[status],
            keyword: this.state.filterParams[status].keyword,
            sort: this.state.filterParams[status].sort,
            status: status
        }
        switch (this.props.type) {
            case "comic":
                authApi.comicsSearch(params).then((res) => {
                    console.log(res);
                    const newTotalObj = this.creatNewTotal(res.data.info.total, status);
                    if (res.data.code === 1) {
                        this.setListData(status, res, newTotalObj);
                    }
                });
                break;
            case "anime":
                authApi.animesSearch(params).then((res) => {
                    console.log(res);
                    const newTotalObj = this.creatNewTotal(res.data.info.total, status);
                    if (res.data.code === 1) {
                        this.setListData(status, res, newTotalObj);
                    }
                });
                break;
            case "game":
                authApi.gamesSearch(params).then((res) => {
                    console.log(res);
                    const newTotalObj = this.creatNewTotal(res.data.info.total, status);
                    if (res.data.code === 1) {
                        this.setListData(status, res, newTotalObj);
                    }
                });
                break;
            default:
                break;
        }
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
            this.searchItemList(status);
        });
    }
    pageChange = (page, status) => {
        const newPageObj = this.creatNewPage(page, status);
        this.setState({
            page: newPageObj
        }, () => {
            this.searchItemList(status);
        });
    }
    openDetail = (data) => {
        this.setState({
            detailData: data,
            detailShow: true
        });
    }
    handleCancel = (e) => {
        this.setState({
            detailShow: false
        });
    }
    detailAfterClose = () => {
        this.setState({
            detailData: null
        });
    }
    secondInfo = (data) => {
        let res = "";
        switch (this.props.type) {
            case "comic":
                res = data.originalName || "--";
                break;
            case "anime":
                res = data.animeType.name
                break;
            case "game":
                res = data.platform.name
            default:
                break;
        }
        return res;
    }
    progressInfo = (data) => {
        let res = "";
        switch (this.props.type) {
            case "game":
            case "comic":
                res = data.isLongGame ? "长期游戏" : data.progress + "%";
                break;
            case "anime":
                res = data.watched + "集";
            default:
                break;
        }
        return res;
    }
    render () {
        let detailInfo = null;
        switch (this.props.type) {
            case "comic":
                detailInfo = (this.state.detailData && <>
                    {this.state.detailData.original.length > 0 && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">原作：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                {
                                    this.state.detailData.original.map((original, index) => {
                                        return <span className="pr5" key={original + index}>{original}</span>
                                    })
                                }
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    {this.state.detailData.author.length > 0 && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">作者：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                {
                                    this.state.detailData.author.map((author, index) => {
                                        return <span className="pr5" key={author + index}>{author}</span>
                                    })
                                }
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    {this.state.detailData.publishingHouse && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">出版社：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                <span>{this.state.detailData.publishingHouse}</span>
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">进度：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            <span>{this.state.detailData.progress}%</span>
                        </Col>
                    </Row>
                    <Divider />
                </>)
                break;
            case "anime":
                detailInfo = (this.state.detailData && <>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">动画类型：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            <span>{this.state.detailData.animeType.name}</span>
                        </Col>
                    </Row>
                    <Divider />
                    {this.state.detailData.original.length > 0 && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">原作：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                {
                                    this.state.detailData.original.map((original, index) => {
                                        return <span className="pr5" key={original + index}>{original}</span>
                                    })
                                }
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    {this.state.detailData.directed.length > 0 && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">导演：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                {
                                    this.state.detailData.directed.map((directed, index) => {
                                        return <span className="pr5" key={directed + index}>{directed}</span>
                                    })
                                }
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    {this.state.detailData.animationCompany && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">动画公司：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                <span>{this.state.detailData.animationCompany}</span>
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">已看集数：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            <span>{this.state.detailData.watched}集</span>
                        </Col>
                    </Row>
                    <Divider />
                </>)
                break;

            case "game":
                detailInfo = (this.state.detailData && <>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">游戏平台：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            <span>{this.state.detailData.platform.name}</span>
                        </Col>
                    </Row>
                    <Divider />
                    {this.state.detailData.gameCompany && <div>
                        <Row>
                            <Col lg={4} md={4} sm={4} xs={24}>
                                <div className="acgnlist_detail_label">游戏公司：</div>
                            </Col>
                            <Col lg={20} md={20} sm={20} xs={24}>
                                <span>{this.state.detailData.gameCompany}</span>
                            </Col>
                        </Row>
                        <Divider />
                    </div>}
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={24}>
                            <div className="acgnlist_detail_label">进度：</div>
                        </Col>
                        <Col lg={20} md={20} sm={20} xs={24}>
                            {this.state.detailData.isLongGame ? <span>长期游戏</span> : <span>{this.state.detailData.progress}%</span>}
                        </Col>
                    </Row>
                    <Divider />
                </>)
                break;


            default:
                break;
        }
        return (
            <div>
                <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">{this.props.statusList["doing"]}：</h2>
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
                    {this.state.doingList.length > 0 ?
                        <div>
                            <Row gutter={[12, 12]}>
                                {this.state.doingList.map((data) => {
                                    return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                        <div className="bangumItem" onClick={() => this.openDetail(data)}>
                                            <Row>
                                                <Col flex="65px">
                                                    <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                                </Col>
                                                <Col flex="auto">
                                                    <div className="textBox">
                                                        <p>{data.title}</p>
                                                        <p>{this.secondInfo(data)}</p>
                                                        <p>{this.progressInfo(data)}</p>
                                                        {data.score ? <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div> : <div>暂未评分</div>}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>;
                                })}
                            </Row>
                            <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['doing']} total={this.state.total['doing']} onChange={(page) => this.pageChange(page, 'doing')} /></div>
                        </div> :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </div>
                <Divider />
                <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">{this.props.statusList["want"]}：</h2>
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
                    {this.state.wantList.length > 0 ? <div>
                        <Row gutter={[12, 12]}>
                            {this.state.wantList.map((data) => {
                                return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                    <div className="bangumItem" onClick={() => this.openDetail(data)}>
                                        <Row>
                                            <Col flex="65px">
                                                <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                            </Col>
                                            <Col flex="auto">
                                                <div className="textBox">
                                                    <p>{data.title}</p>
                                                    <p>{this.secondInfo(data)}</p>
                                                    <p>于{moment(data.creatDate).format("YYYY年MM月DD日")}添加</p>
                                                    {data.score ? <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div> : <div>暂未评分</div>}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>;
                            })}
                        </Row>
                        <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['want']} total={this.state.total['want']} onChange={(page) => this.pageChange(page, 'want')} /></div>
                    </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </div>
                <Divider />
                <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">{this.props.statusList["complete"]}：</h2>
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
                    {this.state.completeList.length > 0 ? <div>
                        <Row gutter={[12, 12]}>
                            {this.state.completeList.map((data) => {
                                return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                    <div className="bangumItem" onClick={() => this.openDetail(data)}>
                                        <Row>
                                            <Col flex="65px">
                                                <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                            </Col>
                                            <Col flex="auto">
                                                <div className="textBox">
                                                    <p>{data.title}</p>
                                                    <p>{this.secondInfo(data)}</p>
                                                    {data.endDate ? <p>于{moment(data.endDate).format("YYYY年MM月DD日")}{this.props.statusList["complete"]}</p> : '暂未添加看完时间'}
                                                    {data.score ? <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div> : <div>暂未评分</div>}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>;
                            })}
                        </Row>
                        <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['complete']} total={this.state.total['complete']} onChange={(page) => this.pageChange(page, 'complete')} /></div>
                    </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </div>
                <Divider />
                <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">{this.props.statusList["out"]}：</h2>
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
                    {this.state.outList.length > 0 ? <div>
                        <Row gutter={[12, 12]}>
                            {this.state.outList.map((data) => {
                                return <Col lg={6} md={24} sm={24} xs={24} key={data._id}>
                                    <div className="bangumItem" onClick={() => this.openDetail(data)}>
                                        <Row>
                                            <Col flex="65px">
                                                <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                            </Col>
                                            <Col flex="auto">
                                                <div className="textBox">
                                                    <p>{data.title}</p>
                                                    <p>{this.secondInfo(data)}</p>
                                                    <p>{this.progressInfo(data)}</p>
                                                    {data.score ? <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div> : <div>暂未评分</div>}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>;
                            })}
                        </Row>
                        <div className="tc mt10"><Pagination size="small" pageSize={20} current={this.state.page['out']} total={this.state.total['out']} onChange={(page) => this.pageChange(page, 'out')} /></div>
                    </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </div>
                {this.state.detailData && <Modal
                    className="acgnlist_detail_modal acgnlist_modal"
                    title={this.state.detailData.title}
                    centered={true}
                    maskClosable={true}
                    destroyOnClose={true}
                    footer={null}
                    visible={this.state.detailShow}
                    onCancel={this.handleCancel}
                    afterClose={this.detailAfterClose}
                >
                    <div>
                        <BaseDetailItem detailData={this.state.detailData} statusList={this.props.statusList} detailInfo={detailInfo} />

                    </div>
                </Modal>}
            </div>
        );
    }
}

export default detailCompent;