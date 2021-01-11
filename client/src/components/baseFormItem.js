import React, { Component } from 'react';
import Crop from './crop';
import { Button, Switch, Form, Input, Upload, Image, Select, Slider, DatePicker, Modal, message, Empty, Divider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Series from '../view/admin/series';
import { authApi } from "../api";
const _ = require('lodash');
const { Option } = Select;
const { TextArea, Search } = Input;

class baseFormItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seriesVisible: false,
      cropFile: null,
      cropDialogShow: false,
      fileList: [],
      speedImportVisible: false,
      speedImportantInput: '',
      speedImportantPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      speedImportantData: [],
    }
  }
  componentDidMount () {
    this.props.onRef(this);
  }
  speedImportantInputChange = (e) => {
    this.setState({
      speedImportantInput: e.target.value,
    });
  }
  showSeriesModal = () => {
    this.setState({
      seriesVisible: true,
    });
  };
  seriesModalhandleOk = e => {
    this.setState({
      seriesVisible: false,
    });
  }
  seriesModalhandleCancel = e => {
    this.setState({
      seriesVisible: false,
    });
  }
  showSpeedImportModal = () => {
    this.setState({
      speedImportVisible: true,
    }, () => {
      this.initSpeedImportant();
    });
  };
  speedImportModalhandleOk = e => {
    this.setState({
      speedImportVisible: false,
    });
  }
  speedImportModalhandleCancel = e => {
    this.setState({
      speedImportVisible: false,
    });
  }
  beforeUpload = file => {
    console.log(file);
    this.setState(state => ({
      fileList: [file]
    }));
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      this.setState(state => ({
        cropFile: reader.result,
        cropDialogShow: true,
      }))
    );
    reader.readAsDataURL(file);
    return false;
  };
  formChange = async (key, value, asyncMode = false) => {
    if (asyncMode) {
      await this.props.formChange(key, value, asyncMode);
    } else {
      this.props.formChange(key, value, asyncMode);
    }

  }
  handleCropOk = async (base64) => {
    // console.log(base64);
    this.setState({
      cropFile: null,
      cropDialogShow: false,
      fileList: []
    });
    this.formChange('base64', base64);
    console.log(this.state);
  };

  inputChange = _.throttle(async (key, e) => {
    const newText = e.target ? e.target.value : e;
    console.log(newText);
    this.formChange(key, newText);
  }, 20, {
    leading: true,
    trailing: false
  });

  handleCropCancel = e => {
    console.log(e);
    this.setState({
      cropFile: null,
      cropDialogShow: false,
      fileList: []
    });
  };
  initSeries = () => {
  }
  onSeriesSelect = async (record) => {
    console.log(record);
    await this.formChange('seriesName', record.title, true);
    await this.formChange('seriesId', record._id, true);
    this.setState({
      seriesVisible: false,
    });
  }
  onSearch = (clear) => {
    if (clear) {
      this.initSpeedImportantData();
    }
    const params = {
      keyword: this.state.speedImportantInput,
      type: this.props.type,
      page: this.state.speedImportantPage
    }
    authApi.quickImportSearch(params).then(res => {
      const code = res.data.code;
      if (code === 0) {
        message.error(res.data.msg);
      } else if (code === 1) {
        this.setState({
          speedImportantData: res.data.list,
          hasPrevPage: res.data.hasPrevPage,
          hasNextPage: res.data.hasNextPage,
        });
      }
    });
  }
  selectImport = (url) => {
    const params = {
      url: url
    }
    authApi.quickImportGetData(params).then(res => {
      const code = res.data.code;
      if (code === 0) {
        message.error(res.data.msg);
      } else if (code === 1) {
        this.props.sendQuickData(res.data.data);
        this.speedImportModalhandleCancel();
      }
    });
  }
  initSpeedImportant = () => {
    this.setState({
      speedImportantInput: '',
      speedImportantPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      speedImportantData: [],
    });
  }
  initSpeedImportantData = () => {
    this.setState({
      speedImportantPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      speedImportantData: [],
    });
  }
  prevImporantPage = () => {
    let newPage = this.state.speedImportantPage - 1;
    if (newPage <= 0) {
      newPage = 1;
    }
    this.setState({
      speedImportantPage: newPage
    }, () => {
      this.onSearch();
    });
  }
  nextImporantPage = () => {
    let newPage = this.state.speedImportantPage + 1;
    this.setState({
      speedImportantPage: newPage
    }, () => {
      this.onSearch();
    });
  }
  showSpeedImportSeries = () => {
    if (!this.props.editForm.base64) {
      message.error('请选择封面');
      return false;
    }
    if (!this.props.editForm.title) {
      message.error('请填写标题');
      return false;
    }
    const params = {
      base64: this.props.editForm.base64,
      title: this.props.editForm.title,
      originalName: this.props.editForm.originalName,
      type: 'create'
    };
    authApi.seriesCreateOrEdit(params).then(async res => {
      console.log(res);
      const code = res.data.code;
      if (code === 0) {
        message.error(res.data.msg);
      } else if (code === 1) {
        await this.formChange('seriesName', res.data.seriesData.title, true);
        await this.formChange('seriesId', res.data.seriesData._id, true);
      }
    });

  }
  render () {
    const speedImportFoot = <>
      {this.state.hasPrevPage && <Button type="link" onClick={() => { this.prevImporantPage() }}>上一页</Button>}
      {this.state.hasNextPage && <Button type="link" onClick={() => { this.nextImporantPage() }}>下一页</Button>}
    </>
    return (
      <>
        <Form.Item label="快速导入">
          <Button type="link" onClick={() => { this.showSpeedImportModal() }}>从bangumi导入</Button>
          <Input type="hidden" value={this.props.editForm.seriesId} />
        </Form.Item>
        <Form.Item label="封面" className="acgnlist-form-item-required">
          <div>
            {this.props.editForm.base64 && <Image
              src={this.props.editForm.base64} width="88px" className="mb5" alt="封面"
            />}
          </div>
          <Upload
            fileList={this.state.fileList}
            beforeUpload={this.beforeUpload}
          >
            <Button type={this.props.editForm.base64 ? "default" : "primary"}>{this.props.editForm.base64 ? '重新选择' : '选择封面'}</Button>
          </Upload>
          <Input type="hidden" value={this.props.editForm.base64} />
        </Form.Item>
        <Form.Item label="标题" className="acgnlist-form-item-required">
          <Input value={this.props.editForm.title} onChange={(e) => this.inputChange('title', e)} />
        </Form.Item>
        <Form.Item label="原名">
          <Input value={this.props.editForm.originalName} onChange={(e) => this.inputChange('originalName', e)} />
        </Form.Item>
        <Form.Item label="系列" className="acgnlist-form-item-required">
          {this.props.editForm.seriesName} <Button type={this.props.editForm.seriesId ? "default" : "primary"} onClick={() => { this.showSeriesModal() }}>{this.props.editForm.seriesId ? '重新选择' : '选择系列'}</Button>
          <Button className="ml5" type="link" onClick={() => { this.showSpeedImportSeries() }}>快速添加</Button>
          <Input type="hidden" value={this.props.editForm.seriesId} />
        </Form.Item>
        <Form.Item label="状态" className="acgnlist-form-item-required">
          <Select style={{ width: 120 }} value={this.props.editForm.status} onChange={(value) => this.inputChange('status', value)}>
            <Option value="doing">正在</Option>
            <Option value="want">想要</Option>
            <Option value="out">舍弃</Option>
            <Option value="complete">完毕</Option>
          </Select>
        </Form.Item>
        <Form.Item label="评分">
          <Slider defaultValue={0} className="acgnlist_admin_edit_slider" value={this.props.editForm.score} onChange={(value) => this.inputChange('score', value)} />
          <div>{this.props.editForm.score}分</div>
          <div className="cGray666 f12">※0分为暂未评分</div>
        </Form.Item>
        <Form.Item label="点评">
          <TextArea rows={4} placeholder="支持Markdown格式" value={this.props.editForm.comment} onChange={(e) => this.inputChange('comment', e)} />
        </Form.Item>
        <Form.Item label="介绍">
          <TextArea rows={4} placeholder="支持Markdown格式" value={this.props.editForm.introduce} onChange={(e) => this.inputChange('introduce', e)} />
        </Form.Item>
        <Form.Item label="备注">
          <TextArea rows={4} placeholder="支持Markdown格式" value={this.props.editForm.remarks} onChange={(e) => this.inputChange('remarks', e)} />
        </Form.Item>
        <Form.Item label="开始时间">
          <DatePicker locale={locale} showTime placeholder="请选择开始时间" style={{ "width": "230px" }} format="YYYY年MM月DD日 HH:mm:ss" value={this.props.editForm.startDate ? moment(this.props.editForm.startDate) : ""} onChange={(value) => this.inputChange('startDate', value ? value.toISOString() : "")} />
        </Form.Item>
        <Form.Item label="结束时间">
          <DatePicker locale={locale} showTime placeholder="请选择结束时间" style={{ "width": "230px" }} format="YYYY年MM月DD日 HH:mm:ss" value={this.props.editForm.endDate ? moment(this.props.editForm.endDate) : ""} onChange={(value) => this.inputChange('endDate', value ? value.toISOString() : "")} />
        </Form.Item>
        <Form.Item label="是否显示" value={this.props.editForm.show} className="acgnlist-form-item-required">
          <Switch checked={this.props.editForm.show} onChange={(value) => this.inputChange('show', value)} />
        </Form.Item>
        <Crop cropDialogShow={this.state.cropDialogShow} cropFile={this.state.cropFile} onOk={(base64) => this.handleCropOk(base64)} onCancel={() => this.handleCropCancel()} />
        <Modal
          className="acgnlist_modal"
          title="选择系列"
          okText="确认"
          cancelText="取消"
          centered={true}
          maskClosable={false}
          destroyOnClose={true}
          visible={this.state.seriesVisible}
          onOk={this.seriesModalhandleOk}
          onCancel={this.seriesModalhandleCancel}
          footer={[]}
        >
          <Series selectMode={true} onSelect={this.onSeriesSelect} />
        </Modal>
        <Modal
          className="acgnlist_modal"
          title="输入关键词"
          okText="确认"
          cancelText="取消"
          centered={true}
          maskClosable={false}
          destroyOnClose={true}
          visible={this.state.speedImportVisible}
          onOk={this.speedImportModalhandleOk}
          onCancel={this.speedImportModalhandleCancel}
          footer={speedImportFoot}
        >
          <Search value={this.state.speedImportantInput} onSearch={(value) => this.onSearch(true)} onChange={this.speedImportantInputChange} />
          <ul className="mt10">
            {this.state.speedImportantData.length > 0 ? this.state.speedImportantData.map((item, index) => {
              return (
                <li key={item.title + index}>
                  <Divider />
                  <Button type="link" onClick={() => this.selectImport(item.url)}>{item.title}</Button>
                  <div>{item.infoTip}</div>
                </li>
              );
            }) :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </ul>
        </Modal>
      </>
    );
  }
}

export default baseFormItem;