import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Button, Camera } from "@tarojs/components";
import { AtNavBar, AtIcon } from "taro-ui";
import "./camera.scss";

export interface CameraStates {
  src: string;
  preview: boolean;
}

export default class Index extends Component<null, CameraStates> {
  constructor() {
    super(...arguments);
    this.state = {
      src: "",
      preview: false,
    };
    this.takePic.bind(this);
  }
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
    navigationBarTitleText: "首页",
  };

  handleClick() {
    console.log("you clicked me.");
  }
  takePic() {
    const ctx = Taro.createCameraContext();
    ctx.takePhoto({
      quality: "high",
      success: (res) => {
        this.setState({
          src: res.tempImagePath,
          preview: true,
        });
      },
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
            prefixClass: "fa",
            value: "truck",
            size: "30",
            color: "#fff",
          }}
          rightFirstIconType="bullet-list"
          rightSecondIconType=""
        />
        {this.state.preview ? null : (
          <View className="camera-span expand">
            <Camera
              devicePosition="back"
              flash="auto"
              style="width:100%; height: 100%;"
            ></Camera>
          </View>
        )}
        {this.state.preview ? (
          <View className="preview-span">
            <View>照片预览</View>
            <Image mode="widthFix" src={this.state.src}></Image>
            <Button>确认上传</Button>
          </View>
        ) : null}
        {this.state.preview ? null : (
          <View className="camera-button-span">
            <Button className="camera-button" onClick={this.takePic}>
              <AtIcon
                prefixClass="fa"
                value="camera"
                size="20"
                color="#ffffff"
                customStyle="margin-right:10px;"
              ></AtIcon>
              点击拍照
            </Button>
            <Button className="camera-button">
              <AtIcon
                prefixClass="fa"
                value="picture-o"
                size="20"
                color="#ffffff"
                customStyle="margin-right:10px;"
              ></AtIcon>
              选取图片
            </Button>
          </View>
        )}
      </View>
    );
  }
}
