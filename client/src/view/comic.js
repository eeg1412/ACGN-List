import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailCompent from '../components/detailCompent';

const statusList = {
    "doing": "正在读",
    "want": "想读",
    "out": "弃坑",
    "complete": "读完",
}

class comic extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount () {

    }
    render () {
        return (
            <div className="p20 mt5" key="comic">
                <DetailCompent statusList={statusList} type={"comic"} />
            </div>
        );
    }
}

export default withRouter(comic);