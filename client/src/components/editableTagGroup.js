import React, { Component } from 'react'
import { Tag, Input, Tooltip, AutoComplete, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { authApi } from "../api";
import store from '../store/data'
const { Option } = AutoComplete;
const _ = require('lodash');

export default class editableTagGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            // tags: [],
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
        };
        this.searchTimer = null;
    }

    searchTag = (name) => {
        if (this.props["type"] === 'tags' && name) {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                console.log(name);
                authApi.tagsearch({ name: name }).then(res => {
                    const code = res.data.code;
                    if (code === 0) {
                        message.error(res.data.msg);
                    } else if (code === 1) {
                        const newOptions = res.data.tags.data;
                        this.setState({ options: newOptions });
                    }
                });
            }, 300);
        }
    }

    handleClose = removedTag => {
        if (this.props["type"] === 'tags') {
            const tags = this.props.tags.filter(tag => tag.name !== removedTag);
            console.log(tags);
            this.props.onTagChange(_.cloneDeep(tags));
            // this.setState({ tags });
        } else {
            const tags = this.props.tags.filter(tag => tag !== removedTag);
            console.log(tags);
            this.props.onTagChange(tags);
            // this.setState({ tags });
        }
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    tagcreate = (name, key) => {
        const params = {
            name: name,
        }
        authApi.tagcreate(params).then(res => {
            const code = res.data.code;
            if (key === 'editInputValue') {
                this.setState({ editInputValue: '' });
            } else if (key === 'inputValue') {
                this.setState({ inputValue: '' });
            }
            if (code === 0) {
                message.error(res.data.msg);
            } else if (code === 1) {
                this.state.options.push(res.data.tag);
                const newName = res.data.tag.name;
                if (key === 'editInputValue') {
                    this.setState({ editInputValue: newName }, () => this.handleEditInputConfirm());
                } else if (key === 'inputValue') {
                    this.setState({ inputValue: newName }, () => this.handleInputConfirm());
                }
            }
        });
    }

    onSelect = (value, option, name, key) => {
        if (value === '创建中...') {
            this.tagcreate(name, key);
        } else {
            if (key === 'editInputValue') {
                setTimeout(() => {
                    this.handleEditInputConfirm();
                }, 50);
            } else if (key === 'inputValue') {
                setTimeout(() => {
                    this.handleInputConfirm();
                }, 50);
            }
        }
    }

    handleInputChange = e => {
        const newText = e.target ? e.target.value : e;
        this.setState({ inputValue: newText }, () => {
            this.searchTag(newText);
        });
    };

    handleInputConfirm = () => {
        if (store.getState().loading) {
            return false;
        }
        clearTimeout(this.searchTimer);
        const { inputValue } = this.state;
        let { tags } = this.props;
        if (this.props["type"] === 'tags') {
            const valueTags = this.props.tags.filter(tag => tag.name === inputValue);
            if (inputValue && valueTags.length === 0) {
                let newTagInfo = null;
                if (inputValue === '创建中...') {
                    // 如果是创建
                    console.log('去创建!');
                } else {
                    // 不是创建
                    newTagInfo = this.state.options.find((item) => {
                        return item.name === inputValue;
                    })
                }
                if (newTagInfo) {
                    tags = [...tags, newTagInfo];
                    this.props.onTagChange(tags);
                }
            }
        } else {
            if (inputValue && tags.indexOf(inputValue) === -1) {
                tags = [...tags, inputValue];
            }
            this.props.onTagChange(tags);
        }
        this.setState({
            // tags,
            inputVisible: false,
            inputValue: '',
        });
        console.log(tags);
    };

    handleEditInputChange = e => {
        const newText = e.target ? e.target.value : e;
        this.setState({ editInputValue: newText }, () => {
            this.searchTag(newText);
        });
    };

    handleEditInputConfirm = () => {
        if (store.getState().loading) {
            return false;
        }
        clearTimeout(this.searchTimer);
        const tags = this.props.tags;
        this.setState(({ editInputIndex, editInputValue }) => {
            if (editInputValue) {
                const newTags = _.cloneDeep(tags);
                if (this.props["type"] === 'tags') {
                    const valueTags = this.props.tags.filter(tag => tag.name === editInputValue);
                    if (valueTags.length === 0) {
                        let newTagInfo = null;
                        if (editInputValue === '创建中...') {
                            // 如果是创建
                            console.log('去创建!');
                        } else {
                            // 不是创建
                            newTagInfo = this.state.options.find((item) => {
                                return item.name === editInputValue;
                            })
                        }
                        if (newTagInfo) {
                            newTags[editInputIndex] = newTagInfo;
                        }
                    }
                } else {
                    if (tags.indexOf(editInputValue) === -1) {
                        newTags[editInputIndex] = editInputValue;
                    }
                }
                this.props.onTagChange(newTags);
            }
            return {
                editInputIndex: -1,
                editInputValue: '',
            };

        });


    };

    saveInputRef = input => {
        this.input = input;
    };

    saveEditInputRef = input => {
        this.editInput = input;
    };

    render () {
        const { inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
        const { tags } = this.props;
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
                    } else if (editInputIndex === index && this.props["type"] === 'tags') {
                        return (
                            <AutoComplete
                                dropdownMatchSelectWidth={252}
                                ref={this.saveEditInputRef}
                                size="small"
                                key={tag + index}
                                className="tag-input"
                                value={editInputValue}
                                onChange={this.handleEditInputChange}
                                onBlur={this.handleEditInputConfirm}
                                onSelect={(value, option) => this.onSelect(value, option, editInputValue, 'editInputValue')}
                            >
                                {this.state.options.map((tag) => (
                                    <Option key={tag._id} value={tag.name}>
                                        {tag.name}
                                    </Option>
                                ))}
                                {(editInputValue && <Option key="创建中..." value="创建中...">
                                    创建标签【{editInputValue}】
                                </Option>)}
                            </AutoComplete>

                        );
                    }
                    const isLongTag = this.props["type"] === 'tags' ? tag.name.length > 20 : tag.length > 20;
                    const tagName = this.props["type"] === 'tags' ? tag.name : tag;
                    const tagElem = (
                        <Tag
                            color="blue"
                            className="edit-tag"
                            key={tagName + index}
                            closable={true}
                            onClose={() => this.handleClose(tagName)}
                        >
                            <span
                                onDoubleClick={e => {
                                    this.setState({ editInputIndex: index, editInputValue: tagName }, () => {
                                        this.editInput.focus();
                                    });
                                    e.preventDefault();
                                }}
                            >

                                {isLongTag ? `${tagName.slice(0, 20)}...` : tagName}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (this.props["type"] === 'tags' ?
                        (<Tooltip title={tag.name} key={tag.name}>
                            {tagElem}
                        </Tooltip>) :
                        (<Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>)
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
                {(inputVisible && this.props["type"] === 'tags') && (
                    <AutoComplete
                        dropdownMatchSelectWidth={252}
                        ref={this.saveInputRef}
                        size="small"
                        className="tag-input"
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onSelect={(value, option) => this.onSelect(value, option, inputValue, 'inputValue')}
                    >
                        {this.state.options.map((tag) => (
                            <Option key={tag._id} value={tag.name}>
                                {tag.name}
                            </Option>
                        ))}
                        {(inputValue && <Option key="创建中..." value="创建中...">
                            创建标签【{inputValue}】
                        </Option>)}
                    </AutoComplete>
                )}
                {!inputVisible && (
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> 添加
                    </Tag>
                )}
            </>
        );
    }
}
