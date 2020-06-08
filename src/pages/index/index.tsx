import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtNavBar, AtIcon } from 'taro-ui';
import './index.scss';

export default class Index extends Component {
  componentWillMount() {}

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
    navigationBarTitleText: '首页',
  };

  handleClick() {
    console.log('you clicked me.');
  }
  openCamera() {
    Taro.navigateTo({
      url: '/pages/camera/camera',
    });
  }
  render() {
    return (
      <View className="index">
        <AtNavBar
          onClickRgIconSt={this.handleClick}
          onClickRgIconNd={this.handleClick}
          onClickLeftIcon={this.handleClick}
          color="#ffffff"
          title="LGECH A.R.S."
          leftText=""
          leftIconType={{
            prefixClass: 'fa',
            value: 'truck',
            size: '30',
            color: '#fff',
          }}
          rightFirstIconType="bullet-list"
          rightSecondIconType=""
        />
        <Image
          mode="scaleToFill"
          style="width:100%; height: 100%; position:fixed; background-size: 100%, 100%; z-index: -1"
          src="../../assets/img/back.png"></Image>
        <View className="home-title-span">
          <Text className="home-title">
            欢迎使用 <Text className="home-title-hilite">A.R.S.</Text>\n 司机专属版
          </Text>
        </View>
        <View className="home-button-span">
          <Button onClick={this.openCamera} className="home-button">
            <AtIcon prefixClass="fa" value="camera" size="20" color="#ffffff" customStyle="margin-right:10px;"></AtIcon>
            拍照上传交货单
          </Button>
          <Button className="home-button">
            <AtIcon prefixClass="fa" value="pencil" size="20" color="#ffffff" customStyle="margin-right:10px;"></AtIcon>
            手工录入交货单
          </Button>
        </View>
        <View className="home-prompt-span">
          <Text>请点击上面的按钮进行交货单确认操作</Text>
        </View>
      </View>
    );
  }
}
