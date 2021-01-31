import React, { Component } from 'react';
import { Row, Col, Tag, Divider, Image, Popover, Button, Rate, Pagination, Empty, Select, Modal } from 'antd';
import { authApi } from "../api";
import ReactMarkdown from 'react-markdown/with-html';
import Filter from './filter'
import { FilterFilled } from '@ant-design/icons';
import moment from 'moment';
import BaseDetailItem from './baseDetailItem'

const { Option } = Select;

class seriesCompent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailShow: false,
            detailData: null,
            seriesContentAnimesData: [],
            seriesContentComicsData: [],
            seriesContentGamesData: [],
            seriesContentNovelsData: [],

            seriesContentAnimesTotal: 0,
            seriesContentComicsTotal: 0,
            seriesContentGamesTotal: 0,
            seriesContentNovelsTotal: 0,

            seriesPageList: {
                "animes": 1,
                "comics": 1,
                "games": 1,
                "novels": 1
            },
            filterParams: {
                "animes": {
                    keyword: '',
                    sort: '0'
                },
                "comics": {
                    keyword: '',
                    sort: '0'
                },
                "games": {
                    keyword: '',
                    sort: '0'
                },
                "novels": {
                    keyword: '',
                    sort: '0'
                }
            },
        }
    };
    componentDidMount () {
        this.onSeriesInit();
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
    onSeriesInit = () => {
        this.initAnimes();
        this.initComics();
        this.initGames();
        this.initNovels();
    }
    initAnimes = () => {
        const paramsAnimes = {
            page: this.state.seriesPageList["animes"],
            keyword: this.state.filterParams["animes"].keyword,
            sort: this.state.filterParams["animes"].sort,
            seriesId: this.props.seriesData._id
        }
        this.searchAnimes(paramsAnimes);
    }
    searchAnimes = (paramsAnimes) => {
        authApi.animesSearch(paramsAnimes).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    seriesContentAnimesData: res.data.info.data,
                    seriesContentAnimesTotal: res.data.info.total
                });
            }
        });
    }
    // comic
    initComics = () => {
        const paramsComics = {
            page: this.state.seriesPageList["comics"],
            keyword: this.state.filterParams["comics"].keyword,
            sort: this.state.filterParams["comics"].sort,
            seriesId: this.props.seriesData._id
        }
        this.searchComics(paramsComics);
    }
    searchComics = (paramsComics) => {
        authApi.comicsSearch(paramsComics).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    seriesContentComicsData: res.data.info.data,
                    seriesContentComicsTotal: res.data.info.total
                });
            }
        });
    }
    // game
    initGames = () => {
        const paramsGames = {
            page: this.state.seriesPageList["games"],
            keyword: this.state.filterParams["games"].keyword,
            sort: this.state.filterParams["games"].sort,
            seriesId: this.props.seriesData._id
        }
        this.searchGames(paramsGames);
    }
    searchGames = (paramsGames) => {
        authApi.gamesSearch(paramsGames).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    seriesContentGamesData: res.data.info.data,
                    seriesContentGamesTotal: res.data.info.total
                });
            }
        });
    }
    // novel
    initNovels = () => {
        const paramsNovels = {
            page: this.state.seriesPageList["novels"],
            keyword: this.state.filterParams["novels"].keyword,
            sort: this.state.filterParams["novels"].sort,
            seriesId: this.props.seriesData._id
        }
        this.searchNovels(paramsNovels);
    }
    searchNovels = (paramsNovels) => {
        authApi.novelsSearch(paramsNovels).then((res) => {
            if (res.data.code === 1) {
                this.setState({
                    seriesContentNovelsData: res.data.info.data,
                    seriesContentNovelsTotal: res.data.info.total
                });
            }
        });
    }

    secondInfo = (type, data) => {
        let res = "";
        console.log(data);
        switch (type) {
            case "novel":
            case "comic":
                res = data.publishingHouse || "--";
                break;
            case "anime":
                const animeType = data.animeType;
                if (animeType) {
                    res = animeType.name
                }
                break;
            case "game":
                const platform = data.platform;
                if (platform) {
                    res = platform.name
                }
                break;
            default:
                break;
        }
        return res;
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
            seriesPageList: newPageObj
        }, () => {
            this.initSingleData(status);
        });
    }
    initSingleData = (status) => {
        switch (status) {
            case "animes":
                this.initAnimes(status);
                break;

            default:
                break;
        }
    }
    creatNewPage = (page, status) => {
        let newPage = {};
        newPage[status] = page;
        const newPageObj = Object.assign({}, this.state.seriesPageList, newPage);
        return newPageObj;
    }
    pageChange = (page, status) => {
        const newPageObj = this.creatNewPage(page, status);
        this.setState({
            page: newPageObj
        }, () => {
            this.initSingleData(status);
        });
    }
    openDetail = (data) => {
        this.setState({
            detailData: data,
            detailShow: true
        });
    }
    statusList = () => {
        switch (this.state.detailData.type) {
            case "novel":
                return {
                    "doing": "正在读",
                    "want": "想读",
                    "out": "弃坑",
                    "complete": "读完",
                }
            case "comic":
                return {
                    "doing": "正在读",
                    "want": "想读",
                    "out": "弃坑",
                    "complete": "读完",
                }
            case "game":
                return {
                    "doing": "正在玩",
                    "want": "想玩",
                    "out": "弃坑",
                    "complete": "通关",
                }

            case "anime":
                return {
                    "doing": "正在看",
                    "want": "想看",
                    "out": "弃坑",
                    "complete": "看完",
                }
            default:
                break;
        }
    }
    render () {
        const sortOption = (type) => {
            switch (type) {
                case "novel":
                case "comic":
                case "game":
                    return <>
                        <Option value="0">创建时间从新到旧</Option>
                        <Option value="1">创建时间从旧到新</Option>
                        <Option value="2">评分从高到低</Option>
                        <Option value="3">评分从低到高</Option>
                        <Option value="4">进度从高到低</Option>
                        <Option value="5">进度从低到高</Option>
                    </>
                case "anime":
                    return <>
                        <Option value="0">创建时间从新到旧</Option>
                        <Option value="1">创建时间从旧到新</Option>
                        <Option value="2">评分从高到低</Option>
                        <Option value="3">评分从低到高</Option>
                    </>
                default:
                    break;
            }

        };
        const DetailRow = (type, types, total, dataName, detailName) => {
            return <>
                {(this.state[dataName].length > 0 || this.state.filterParams[types].keyword !== "") && <div>
                    <div className="clearfix mb10">
                        <h2 className="fb fl">相关{detailName}：</h2>
                        <div className="fr">
                            <Popover
                                content={
                                    <Filter sortOption={sortOption(type)} showShowSelect={false} showStatusSelect={false} keyword={this.state.filterParams[types].keyword} sort={this.state.filterParams[types].sort} onSearch={(params) => this.filterChange(params, types)} onClear={(params) => this.filterChange(params, types)} />
                                }
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button type="primary" size="small" icon={<FilterFilled />} />
                            </Popover>
                        </div>
                    </div>
                    {this.state[dataName].length > 0 ?
                        <div>
                            <Row gutter={[12, 12]}>
                                {this.state[dataName].map((data) => {
                                    return <Col lg={24} md={24} sm={24} xs={24} key={data._id}>
                                        <div className="bangumItem" onClick={() => this.openDetail(data)}>
                                            <Row>
                                                <Col flex="65px">
                                                    <img alt={data.title} src={`/api/cover?type=${data.type}&id=${data._id}`} />
                                                </Col>
                                                <Col flex="auto">
                                                    <div className="textBox">
                                                        <p>{data.title}</p>
                                                        <p>{this.secondInfo(data.type, data)}</p>
                                                        {data.score ? <div><Rate className="acgnlist_rate" disabled allowHalf defaultValue={data.score / 20} /> {data.score}分</div> : <div>暂未评分</div>}
                                                        <p>于{moment(data.creatDate).format("YYYY年MM月DD日")}添加</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>;
                                })}
                            </Row>
                            <div className="tc mt10"><Pagination size="small" showSizeChanger={false} pageSize={20} current={this.state.seriesPageList[types]} total={this.state[total]} onChange={(page) => this.pageChange(page, types)} /></div>
                        </div> :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    <Divider />
                </div>}
            </>
        }
        const detailInfo = () => {
            let detailInfo = null;
            switch (this.state.detailData.type) {
                case "novel":
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
            return detailInfo;
        }
        return (

            <div>
                <Row gutter={16}>
                    <Col md={12} sm={24} xs={24}>
                        <div className="mb10">
                            <Image
                                src={`/api/cover?type=series&id=${this.props.seriesData._id}`} className="w_10 acgnlist_mouse_pointer" alt={this.props.seriesData.title}
                            />
                        </div>
                        <Row>
                            <Col flex="45px">
                                <div className="acgnlist_detail_series_label">标题：</div>
                            </Col>
                            <Col flex="auto" className="acgnlist_detail_series_modal_content">
                                <span>{this.props.seriesData.title}</span>
                            </Col>
                        </Row>
                        <Divider className="acgnlist_divider_6px" />
                        <Row>
                            <Col flex="45px">
                                <div className="acgnlist_detail_series_label">原名：</div>
                            </Col>
                            <Col flex="auto" className="acgnlist_detail_series_modal_content">
                                <span>{this.props.seriesData.originalName || '--'}</span>
                            </Col>
                        </Row>
                        <Divider className="acgnlist_divider_6px" />
                        {this.props.seriesData.seriesTags.length > 0 && <><Row>
                            <Col flex="45px">
                                <div className="acgnlist_detail_series_label">标签：</div>
                            </Col>
                            <Col flex="auto" className="acgnlist_detail_series_modal_content">
                                {
                                    this.props.seriesData.seriesTags.map((tag, index) => {
                                        return <Tag color="blue" key={tag._id}>{tag.name}</Tag>
                                    })
                                }
                            </Col>
                        </Row>
                            <Divider className="acgnlist_divider_6px" />
                        </>}
                        {this.props.seriesData.remarks && <><Row>
                            <Col span={24}>
                                <div className="acgnlist_detail_series_label">备注：</div>
                            </Col>
                            <Col span={24} className="mt5">
                                <div className="nomargin acgnlist_baseDetailItem_borderBox">
                                    <ReactMarkdown
                                        source={this.props.seriesData.remarks}
                                        escapeHtml={false}
                                    />
                                </div>
                            </Col>
                        </Row>
                            <Divider className="acgnlist_divider_6px" />
                        </>}
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        {DetailRow("anime", "animes", "seriesContentAnimesTotal", "seriesContentAnimesData", "动画")}
                        {DetailRow("comic", "comics", "seriesContentComicsTotal", "seriesContentComicsData", "漫画")}
                        {DetailRow("game", "games", "seriesContentGamesTotal", "seriesContentGamesData", "游戏")}
                        {DetailRow("novel", "novels", "seriesContentNovelsTotal", "seriesContentNovelsData", "小说")}
                    </Col>
                </Row>
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
                        <BaseDetailItem onSeriesBtnClick={this.onSeriesBtnClick} detailData={this.state.detailData} statusList={this.statusList()} detailInfo={detailInfo()} seriesBtnShow={false} />

                    </div>
                </Modal>}
            </div>
        );
    }
}

export default seriesCompent;