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
    /*-----------------以上为共通----------------*/
    platform: { _id: '', name: '' },
    gameCompany: '',
    isLongGame: false,
    progress: 0
}
class adminGame extends Component {
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
                <AdminPageCompent type="game" rawForm={rawForm} />
            </div>
        );
    }
}

export default adminGame