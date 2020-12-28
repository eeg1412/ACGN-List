import React, { Component } from 'react';
import AdminPageCompent from '../../components/adminPageCompent'

const rawForm = {
    _id: '',
    base64: '',
    title: '',
    seriesName: '',
    seriesId: '',
    originalName: '',
    publishingHouse: '',
    status: 'doing',
    // tags: [],
    score: 0,
    comment: '',
    introduce: '',
    remarks: '',
    creatDate: "",
    startDate: "",
    endDate: "",
    show: true,

    progress: 0,
    original: [],
    author: [],
}
class adminComic extends Component {
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
                <AdminPageCompent type="comic" rawForm={rawForm} />
            </div>
        );
    }
}

export default adminComic