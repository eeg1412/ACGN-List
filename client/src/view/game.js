import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DetailCompent from '../components/detailCompent';

const statusList = {
    "doing": "正在玩",
    "want": "想玩",
    "out": "弃坑",
    "complete": "通关",
}

class game extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount () {

    }
    render () {
        return (
            <div className="p20 mt5" key="game">
                <DetailCompent statusList={statusList} type={"game"} />
            </div>
        );
    }
}

export default withRouter(game);