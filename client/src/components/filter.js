import React, { Component } from 'react';
import { Button, Input, Select } from 'antd';
const { Option } = Select;

class filter extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    render () {
        return (
            <>
                <div className="clearfix">
                    {
                        this.props.showSelect &&
                        <div className="fl mr10 mt5 mb5">
                            <Select style={{ width: 110 }} value={this.props.showMode}>
                                <Option value="0">全部</Option>
                                <Option value="1">显示状态</Option>
                                <Option value="2">不显示状态</Option>
                            </Select>
                        </div>
                    }
                    <div className="fl mr10 mt5 mb5">
                        <Select style={{ width: 170 }} value={this.props.sort}>
                            {this.props.sortOption}
                        </Select>
                    </div>
                    <div className="fl mr10 mt5 mb5">
                        <Input placeholder="输入关键词" style={{ width: 180 }} value={this.props.keyword} />
                    </div>
                    <div className="fl mr10 mt5 mb5">
                        <Button type="primary">搜索</Button>
                    </div>

                    <div className="fl mt5 mb5">
                        <Button>清空</Button>
                    </div>

                </div>
            </>
        );
    }
}

export default filter;