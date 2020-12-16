import React, { Component } from 'react';
import { Button, Input, Select } from 'antd';
const { Option } = Select;

class filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMode: false,
            sort: '0',
            status: 'all',
            keyword: ''
        };

    }
    componentDidMount () {
        this.setState({
            showMode: this.props.showMode,
            sort: this.props.sort,
            status: this.props.status,
            keyword: this.props.keyword
        });
    }
    onChange = (value, key) => {
        let params = {};
        params[key] = value;
        this.setState(params);
    }
    onSearch = (e) => {
        const params = {
            showMode: this.state.showMode,
            sort: this.state.sort,
            status: this.state.status,
            keyword: this.state.keyword
        };
        this.props.onSearch(params);
    }
    onClear = (e) => {
        this.setState({
            showMode: '0',
            sort: '0',
            status: 'all',
            keyword: ''
        }, () => {
            const params = {
                showMode: this.state.showMode,
                sort: this.state.sort,
                status: this.state.status,
                keyword: this.state.keyword
            };
            this.props.onClear(params);
        });
    }
    render () {
        return (
            <>
                <div className="clearfix">
                    {
                        this.props.showSelect &&
                        <div className="fl mr10 mt5 mb5">
                            <Select style={{ width: 130 }} value={this.state.showMode} onChange={(value) => this.onChange(value, 'showMode')}>
                                <Option value="0">显示与不显示</Option>
                                <Option value="1">显示</Option>
                                <Option value="2">不显示</Option>
                            </Select>
                        </div>
                    }
                    {
                        this.props.showSelect &&
                        <div className="fl mr10 mt5 mb5">
                            <Select style={{ width: 120 }} value={this.state.status} onChange={(value) => this.onChange(value, 'status')}>
                                <Option value="all">全部状态</Option>
                                <Option value="doing">正在</Option>
                                <Option value="want">想要</Option>
                                <Option value="out">舍弃</Option>
                                <Option value="complete">完毕</Option>
                            </Select>
                        </div>
                    }
                    <div className="fl mr10 mt5 mb5">
                        <Select onChange={(value) => this.onChange(value, 'sort')} style={{ width: 170 }} value={this.state.sort}>
                            {this.props.sortOption}
                        </Select>
                    </div>
                    <div className="fl mr10 mt5 mb5">
                        <Input placeholder="输入关键词" style={{ width: 180 }} value={this.state.keyword} onChange={(e) => this.onChange(e.target.value, 'keyword')} />
                    </div>
                    <div className="fl mr10 mt5 mb5">
                        <Button type="primary" onClick={this.onSearch}>搜索</Button>
                    </div>

                    <div className="fl mt5 mb5">
                        <Button onClick={this.onClear}>清空</Button>
                    </div>

                </div>
            </>
        );
    }
}

export default filter;