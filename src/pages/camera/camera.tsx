import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Button, Camera } from "@tarojs/components";
import { AtIcon, AtButton, AtFab, AtMessage } from "taro-ui";
import "./camera.scss";
import {
  takePicture,
  scanBarcode,
  uploadPicture,
} from "../../controllers/camera";
import ArsTabBar from "../../components/tabbar";
import { NavBar } from "../../components/navbar";
import { InfoCard } from "../../components/infocard";
export interface CameraStates {
  src: string;
  preview: boolean;
  curwbno: string;
  uploading: boolean;
}

export interface CameraProps {
  isScan: boolean;
}

export default class Index extends Component<CameraProps, CameraStates> {
  constructor() {
    super(...arguments);
    let curwbno = Taro.getStorageSync("waybill");
    const wbnodate: Date = new Date(Taro.getStorageSync("waybilldate"));
    const today = new Date();
    if (today.valueOf() - wbnodate.valueOf() > 24 * 60 * 60 * 1000) {
      curwbno = "";
      Taro.removeStorage("waybill");
      Taro.removeStorage("waybilldate");
    }

    this.state = {
      src: "",
      preview: false,
      curwbno,
      uploading: false,
    };
    this.takePic.bind(this);
    //this.scanCode.bind(this);
  }
  componentWillMount() {}

  componentDidMount() {
    console.log("camera.params:", this.$router.params);
    console.log("camera.state:", this.state);
  }

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
    navigationBarTitleText: "回执上传",
  };

  handleClick() {
    console.log("you clicked me.");
  }
  takePic() {
    takePicture((res) => {
      console.log("takePicture.res:", res);
      this.setState({
        src: res.tempImagePath,
        preview: true,
      });
    });
  }
  uploadPic() {
    //console.log("camera.uploadPic:", this.state.curwbno, this.state.src);
    this.setState({ uploading: true });
    uploadPicture(
      this.state.curwbno,
      this.state.src,
      (res) => {
        //console.log("upload-result:", res);
        //{data: "{"result":"success","id":"5eec3ea936aabb13a43fa9d1"}",
        // statusCode: 200,
        // header: {…},
        // cookies: Array(0), errMsg: "uploadFile:ok"}
        this.setState({ uploading: false });
        let isSuccess = false;
        //成功上传
        if (res.statusCode === 200) {
          const result = JSON.parse(res.data);

          //成功记录
          if (result.result === "success") {
            isSuccess = true;
            Taro.atMessage({
              message: "照片上传成功",
              type: "success",
            });
            this.setState({ preview: false });
          }
        }
        if (!isSuccess) {
          this.setState({ uploading: false });
          Taro.atMessage({
            message: "照片上传失败，请重试！",
            type: "error",
          });
        }
      },
      (err) => {
        this.setState({ uploading: false });
        Taro.atMessage({
          message: "回执上传失败，请重试：" + err.errMsg,
          type: "error",
        });
      }
    );
  }

  render() {
    console.log("props, router:", this.props, this.$router.params);

    const isScan = this.$router.params.isScan;
    const { curwbno } = this.state;
    console.log("curwbno:", curwbno, this.state);
    if (curwbno.length <= 0) {
      return (
        <InfoCard
          title="请先确认运单"
          message="您还没有输入运单信息，不能上传回执扫描，请先扫描运单二维码或手工输入运单号。"
          extMessage="点击“返回”按钮继续。"
          backFunc={() => {
            Taro.redirectTo({ url: "/pages/index/index" });
          }}
        />
      );
    }
    return (
      <View className="index">
        <NavBar title={"当前运单：" + curwbno} hideRightIcon />
        <AtMessage />
        {this.state.preview ? null : (
          <View className="camera-span expand">
            <Camera
              frameSize="large"
              devicePosition="back"
              flash="auto"
              style="width:100%; height: 100%; left:0;top:0; position:fixed; background-size: 100%, 100%; z-index: -1"
            ></Camera>
          </View>
        )}
        {this.state.preview ? (
          <View className="preview-span">
            <Image
              mode="aspectFit"
              src={this.state.src}
              className="preview-img"
              style="width:100%; height: 100%; left:0;top:0; position:fixed; background-size: 100%, 100%; z-index: -1"
              onClick={() => {
                //do preview
                Taro.previewImage({
                  urls: [this.state.src],
                  success: () => {
                    console.log("success");
                  },
                  fail: () => {
                    console.log("fail");
                  },
                });
              }}
            ></Image>
            <View style="display:flex; flex-direction:row">
              <Button
                className="preview-confirm-button"
                onClick={this.uploadPic}
                disabled={this.state.uploading}
              >
                {this.state.uploading ? "上传中..." : "确认上传"}
              </Button>
              <Button
                className="preview-confirm-button"
                onClick={() => {
                  this.setState({ preview: false });
                }}
                disabled={this.state.uploading}
              >
                返回
              </Button>
            </View>
          </View>
        ) : null}
        {this.state.preview ? null : (
          <View className="camera-button-span">
            {isScan ? (
              <Button className="camera-button" onClick={scanBarcode}>
                <AtIcon
                  prefixClass="fa"
                  value="refresh fa-spin"
                  size="30"
                  color="#ffffff"
                ></AtIcon>
                扫描货运单条码
              </Button>
            ) : (
              <AtFab
                onClick={() => {
                  this.takePic();
                }}
              >
                <Text className="at-fab__icon at-icon at-icon-camera"></Text>
              </AtFab>
            )}
          </View>
        )}
        <ArsTabBar current={1} />
      </View>
    );
  }
}
