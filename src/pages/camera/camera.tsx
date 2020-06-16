import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button, Camera } from '@tarojs/components';
import { AtIcon, AtGrid } from 'taro-ui';
import './camera.scss';
import { takePicture, scanBarcode } from '../../controllers/camera';
import ArsTabBar from '../../components/tabbar';

export interface CameraStates {
  src: string;
  preview: boolean;
}

export interface CameraProps {
  isScan: boolean;
}

export default class Index extends Component<CameraProps, CameraStates> {
  constructor() {
    super(...arguments);
    this.state = {
      src: '',
      preview: false,
    };
    this.takePic.bind(this);
    //this.scanCode.bind(this);
  }
  componentWillMount() {
    console.log(this.$router.params);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '回执上传',
  };

  handleClick() {
    console.log('you clicked me.');
  }
  takePic() {
    takePicture((res) => {
      console.log('takePicture.res:', res);
      this.setState({
        src: res.tempImagePath,
        preview: true,
      });
    });
  }

  render() {
    console.log('props, router:', this.props, this.$router.params);
    const isScan = this.$router.params.isScan;
    return (
      <View className="index">
        {this.state.preview ? null : (
          <View className="camera-span expand">
            <Camera frameSize="large" devicePosition="back" flash="auto" style="width:100%; height: 100%;"></Camera>
          </View>
        )}
        {this.state.preview ? (
          <View className="preview-span">
            <Image mode="aspectFit" src={this.state.src}></Image>
            <Button>确认上传</Button>
          </View>
        ) : null}
        {this.state.preview ? null : (
          <View className="camera-button-span">
            {!isScan ? (
              <Button className="camera-button" onClick={this.takePic}>
                <AtIcon prefixClass="fa" value="camera" size="20" color="#ffffff" customStyle="margin-right:10px;"></AtIcon>
                点击拍照
              </Button>
            ) : (
              <Button className="camera-button" onClick={scanBarcode}>
                <AtIcon prefixClass="fa" value="refresh fa-spin" size="30" color="#ffffff"></AtIcon>
                扫描货运单条码
              </Button>
            )}
          </View>
        )}
        <ArsTabBar current={1} />
      </View>
    );
  }
}
