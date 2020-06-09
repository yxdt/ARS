import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { AtNavBar, AtIcon } from "taro-ui";
import "./index.scss";

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
    navigationBarTitleText: "货运单",
  };

  handleClick() {
    console.log("you clicked me.");
  }
  openCamera() {
    Taro.navigateTo({
      url: "/pages/camera/camera?isScan=true",
    });
  }
  openManual() {
    Taro.navigateTo({
      url: "/pages/driver/index",
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
          fixed={true}
          leftText=""
          leftIconType={{
            prefixClass: "fa",
            value: "truck",
            size: "30",
            color: "#fff",
          }}
          rightFirstIconType="bullet-list"
          rightSecondIconType=""
        />
        <View className="sheet-span">
          <Text>请点击上面的按钮进行交货单确认操作</Text>
        </View>
      </View>
    );
  }
}
