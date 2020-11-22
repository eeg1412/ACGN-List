import React, { Component } from 'react'
import { Tag, Input, Tooltip, AutoComplete } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default class editableTagGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [{ value: '1235' }, { value: '2358' }],
            tags: [],
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
        };
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        const newText = e.target ? e.target.value : e;
        this.setState({ inputValue: newText });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    handleEditInputChange = e => {
        const newText = e.target ? e.target.value : e;
        this.setState({ editInputValue: newText });
    };

    handleEditInputConfirm = () => {
        this.setState(({ tags, editInputIndex, editInputValue }) => {
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;

            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: '',
            };
        });
    };

    saveInputRef = input => {
        this.input = input;
    };

    saveEditInputRef = input => {
        console.log(111);
        this.editInput = input;
    };

    onSearch = (searchText) => {
        console.log(searchText);
    }

    render () {
        const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
        return (
            <>
                {tags.map((tag, index) => {
                    if (editInputIndex === index && this.props["type"] === 'input') {
                        return (
                            <Input
                                ref={this.saveEditInputRef}
                                key={tag + index}
                                size="small"
                                className="tag-input"
                                value={editInputValue}
                                onChange={this.handleEditInputChange}
                                onBlur={this.handleEditInputConfirm}
                                onPressEnter={this.handleEditInputConfirm}
                            />
                        );
                    } else if (editInputIndex === index) {
                        return (
                            <AutoComplete
                                ref={this.saveEditInputRef}
                                options={this.state.options}
                                size="small"
                                key={tag + index}
                                className="tag-input"
                                onSearch={this.onSearch}
                                value={editInputValue}
                                onChange={this.handleEditInputChange}
                                onBlur={this.handleEditInputConfirm}
                            />
                        );
                    }

                    const isLongTag = tag.length > 20;

                    const tagElem = (
                        <Tag
                            className="edit-tag"
                            key={tag + index}
                            closable={true}
                            onClose={() => this.handleClose(tag)}
                        >
                            <span
                                onDoubleClick={e => {
                                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                                        this.editInput.focus();
                                    });
                                    e.preventDefault();
                                }}
                            >
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                            tagElem
                        );
                })}
                {(inputVisible && this.props["type"] === 'input') && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        className="tag-input"
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {(inputVisible && this.props["type"] !== 'input') && (
                    <AutoComplete
                        options={this.state.options}
                        ref={this.saveInputRef}
                        size="small"
                        className="tag-input"
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> 新建
                    </Tag>
                )}
            </>
        );
    }
}
