import React, { Component } from 'react';
import TagsOptionsCompent from '../../components/tagsOptionsCompent';


class platform extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    componentDidMount () {
    }
    render () {
        return (
            <div className="acgnlist_admin_r_body">
                <TagsOptionsCompent type={"game"} />
            </div>
        );
    }
}

export default platform;