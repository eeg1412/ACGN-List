import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import { Modal } from 'antd';
import 'react-image-crop/dist/ReactCrop.css';

class crop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            base64: '',
            crop: {
                unit: "%",
                width: 100,
                height: 100,
                // aspect: 3 / 4
            }
        }
        this.cropMaxWidth = 1920;
    };
    reSetCrop = () => {
        const crop = {
            unit: "%",
            width: 100,
            height: 100,
        }
        this.setState({ crop });
    }
    handleOk = (base64) => {
        this.reSetCrop();
        return this.props.onOk(base64);
    }
    handleCancel = () => {
        this.reSetCrop();
        return this.props.onCancel();
    }

    // If you setState the crop in here you should return false.
    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    makeClientCrop (crop) {
        console.log(crop);
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({
                base64: croppedImageUrl
            });
        }
    }

    getCroppedImg (image, crop, fileName) {
        console.log(image, crop);
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        console.log(image.naturalWidth);
        if (image.naturalWidth > this.cropMaxWidth) {
            canvas.width = this.cropMaxWidth;
            const bili = image.naturalHeight / image.naturalWidth;
            canvas.height = Math.floor(this.cropMaxWidth * bili);
        } else {
            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;
        }

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const cropedImg = canvas.toDataURL('image/jpeg', 0.9);
        return cropedImg;
    }
    render () {
        return (
            <>
                <Modal
                    className="acgnlist_modal"
                    title="选择封面"
                    okText="确认"
                    cancelText="取消"
                    centered={true}
                    destroyOnClose={true}
                    maskClosable={false}
                    visible={this.props.cropDialogShow}
                    onOk={() => this.handleOk(this.state.base64)}
                    onCancel={this.handleCancel}
                >
                    <div className="acgnlist_crop_body">
                        {this.props.cropFile && (<ReactCrop
                            src={this.props.cropFile}
                            crop={this.state.crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />)}
                    </div>
                </Modal>
            </>
        );
    }
}

export default crop;