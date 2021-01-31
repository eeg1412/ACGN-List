import React, { Component } from 'react';
import { Modal } from 'antd';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

class mdEditor extends Component {
    render () {
        return (
            <>
                <Modal
                    className="acgnlist_modal"
                    title="MarkDown编辑器"
                    okText="确认"
                    cancelText="取消"
                    width={"100%"}
                    centered={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    visible={this.props.mdModalShow}
                    onOk={this.props.onOk}
                    onCancel={this.props.onCancel}
                >
                    <SimpleMDE options={{ minHeight: "230px", maxHeight: "calc(100vh - 330px)", status: false }} />
                </Modal>
            </>
        );
    }
}

export default mdEditor;