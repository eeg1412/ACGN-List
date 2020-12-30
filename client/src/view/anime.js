import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailCompent from '../components/detailCompent';

const statusList = {
    "doing": "正在看",
    "want": "想看",
    "out": "看完",
    "complete": "弃坑",
}

class anime extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount () {

    }
    render () {
        return (
            <div className="p20 mt5" key="anime">
                <DetailCompent statusList={statusList} type={"anime"} />
            </div>
        );
    }
}

export default withRouter(anime);