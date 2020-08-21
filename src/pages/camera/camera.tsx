import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Button, Camera } from "@tarojs/components";
import { AtFab, AtMessage } from "taro-ui";
import "./camera.scss";
import {
  takePicture,
  uploadPicture,
  confirmPhotoComplete,
} from "../../controllers/camera";
import ArsTabBar from "../../components/tabbar";
import NavBar from "../../components/navbar";
import InfoCard from "../../components/infocard";
import { uploadResult } from "../../types/ars";
import { sendUploadMessage } from "../../controllers/rest";

export interface CameraStates {
  src: string;
  preview: boolean; // 拍完照片预览
  curwbno: string;
  uploading: boolean;
  uploaded: boolean; //是否已上传？
  openid: string;
  wbstatus: number;
  isSuper: boolean;
}

export interface CameraProps {
  isScan: boolean;
}

export default class Index extends Component<CameraProps, CameraStates> {
  constructor() {
    super(...arguments);
    let curwbno = Taro.getStorageSync("waybill");
    let openid = Taro.getStorageSync("userOpenId");
    const wbnodate: Date = new Date(Taro.getStorageSync("waybilldate"));
    const today = new Date();
    const wbstatus = parseInt(Taro.getStorageSync("waybillStatus")) || 0;
    const isSuper = Taro.getStorageSync("roleName").toString().length > 0;

    if (today.valueOf() - wbnodate.valueOf() > 24 * 60 * 60 * 1000) {
      curwbno = "";
      Taro.removeStorageSync("waybill");
      Taro.removeStorageSync("waybilldate");
    }

    const loggedIn = Taro.getStorageSync("roleName").toString().length > 0;
    if (loggedIn) {
      const logindate: Date = new Date(Taro.getStorageSync("tokendate"));
      if (today.valueOf() - logindate.valueOf() > 24 * 60 * 60 * 1000) {
        Taro.removeStorageSync("userName");
        Taro.removeStorageSync("roleName");
        Taro.removeStorageSync("token");
      }
    }

    this.state = {
      src: "",
      preview: false,
      curwbno,
      uploading: false,
      uploaded: false,
      openid,
      wbstatus,
      isSuper,
    };
    this.takePic.bind(this);
    //this.scanCode.bind(this);
  }
  componentWillMount() {}

  componentDidMount() {
    ////consolelog("camera.params:", this.$router.params);
    ////consolelog("camera.state:", this.state);
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
    //consolelog('you clicked me.');
  }
  takePic() {
    takePicture((res) => {
      //consolelog('takePicture.res:', res);
      this.setState({
        src: res.tempImagePath,
        preview: true,
      });
    });
  }
  uploadPic() {
    //consolelog("camera.uploadPic:", this.state.curwbno, this.state.src);
    this.setState({ uploading: true, uploaded: false });
    uploadPicture(this.state.curwbno, this.state.src, this.state.openid)
      .then((res: uploadResult) => {
        //consolelog("upload-result:", res);
        this.setState({ uploading: false });
        let isSuccess = false;
        //成功上传
        if (res.result === "success") {
          isSuccess = true;
          Taro.atMessage({
            message: "上传成功",
            type: "success",
          });
          this.setState({ preview: false, uploaded: true });
        }
        if (!isSuccess) {
          this.setState({ uploading: false });
          Taro.atMessage({
            message: "上传失败：" + res.message,
            type: "error",
          });
        }
      })
      .catch((err) => {
        this.setState({ uploading: false });
        Taro.atMessage({
          message: "上传失败，请重试：" + err.message,
          type: "error",
        });
      });
  }

  render() {
    //consolelog('props, router:', this.props, this.$router.params);

    //const isScan = this.$router.params.isScan;
    const { curwbno, uploaded, openid, wbstatus, isSuper } = this.state;

    //consolelog('curwbno:', curwbno, this.state);

    if (curwbno.length <= 0) {
      return (
        <InfoCard
          title="请先确认运单"
          message="您还没有输入运单信息，不能上传回执扫描，请先扫描运单二维码或手工输入运单号。"
          extMessage="点击“返回”按钮继续。"
          backFunc={() => {
            Taro.reLaunch({ url: "/pages/index/index" });
          }}
        />
      );
    }
    if (wbstatus !== 1 && wbstatus !== 3 && !isSuper) {
      return (
        <InfoCard
          title="该运单不能上传回执"
          message="当前运单不能上传回执，请登录或与中心工作人员联系。"
          extMessage="点击“返回”按钮继续。"
          backFunc={() => {
            Taro.reLaunch({ url: "/pages/index/index" });
          }}
        />
      );
    }
    if (uploaded) {
      return (
        <View style="margin-top:3rem; margin-left:1.5rem; margin-right:1.5rem;margin-bottom:4.5rem;">
          <Text style="font-size:1.6rem; font-weight: bold; color:#666;">
            上传成功
          </Text>
          <View style="border:solid 1px #ffa3b2; padding:1.5rem; border-radius: 10px; margin-top:1rem; margin-left:1.2rem; margin-right:1.2rem;">
            <Text style="display:block; text-align:justify; font-size:1.2rem; margin-top:1.2rem">
              如果继续上传，请点击“继续上传”按钮；如果全部回执都已上传，请点击“全部回执已上传”通知中心工作人员尽快核验。
            </Text>
          </View>
          <Button
            className="preview-confirm-button"
            onClick={() => {
              this.setState({ uploaded: false });
            }}
          >
            继续上传
          </Button>
          <Button
            className="preview-confirm-button"
            onClick={() => {
              this.setState({ preview: false });
              sendUploadMessage(curwbno, openid);
              confirmPhotoComplete(curwbno, openid);
              const pidx = this.$router.params.pidx || "0";

              Taro.reLaunch({
                url: "/pages/sheet/index?wbno=" + curwbno + "&pidx=" + pidx,
              });
            }}
          >
            全部回执已上传
          </Button>
        </View>
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
              style="width:100%; height: 100%; left:0;top:0; position:fixed; z-index:-1; background-size: 100%, 100%,"
            ></Camera>
          </View>
        )}
        {this.state.preview ? (
          <View className="camera-span expand">
            <Image
              mode="aspectFit"
              src={this.state.src}
              style="width:100%; height: 100%; left:0;top:0; position:fixed; z-index:-1; background-size: 100%, 100%,"
              onClick={() => {
                //do preview
                Taro.previewImage({
                  urls: [this.state.src],
                  success: () => {
                    //consolelog('success');
                  },
                  fail: () => {
                    //consolelog('fail');
                  },
                });
              }}
            ></Image>
          </View>
        ) : null}

        {this.state.preview ? (
          <View className="upload-button-span">
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
        ) : (
          <View className="camera-button-span">
            <AtFab
              onClick={() => {
                this.takePic();
              }}
            >
              <Text className="at-fab__icon at-icon at-icon-camera"></Text>
            </AtFab>
          </View>
        )}
        <ArsTabBar current={1} />
      </View>
    );
  }
}
