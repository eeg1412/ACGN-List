import React, { Component } from 'react';
import { Button } from 'antd';

class adminGame extends Component {
    render () {
        return (
            <div>
                <div className="clearfix">
                    <div className="fr">
                        <Button type="primary">新增</Button>
                    </div>
                </div>
                <div></div>
            </div>
        );
    }
}

export default adminGame