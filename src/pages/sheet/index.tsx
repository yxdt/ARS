import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Picker, CoverView, Button } from "@tarojs/components";
import {
  AtButton,
  AtModal,
  AtGrid,
  AtInput,
  AtMessage,
  AtModalContent,
  AtModalHeader,
  AtModalAction,
} from "taro-ui";
import "./index.scss";
import Loading from "../../components/loading";
import {
  getWaybill,
  confirmWaybill,
  getWbPhotos,
  SERVER_URL,
} from "../../controllers/rest";
import { getDriverLocation } from "../../controllers/users";
import ShipItems from "../../components/shipitems";
import { WaybillResult, Waybill, Result, PhotosResult } from "../../types/ars";
import InfoCard from "../../components/infocard";
import ArriveConfirm from "../../components/arriveConfirm";

export interface SheetState {
  loading: boolean;
  waybill: Waybill;
  itemCount: number;
  arrived: boolean; //司机确认到达
  confirmArrive: boolean; //司机到达确认的确认
  confirmed: boolean; //中心已确认到达
  valid: boolean; //是否是有效的运单号
  failed: boolean; //是否操作失败
  //photos: Array<string>; //uploaded photos
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    this.state = {
      loading: true,
      failed: false,
      waybill: {
        shiptoCode: "",
        rdcCode: "",
        startDatetime: new Date(),
        plateNum: "",
        totalPages: 1,
        status: "",
        statusCaption: "",
        sheetNum: "",
        shiptoName: "",
        shiptoTel: "",
        rdcName: "",
        driverName: "",
        shipItems: [],
        photos: [],
      },
      itemCount: 0,
      arrived: false,
      confirmArrive: true,
      confirmed: false,
      valid: false,
    };
    console.log("sheet:", this.$router.params);
  }

  componentWillMount() {}

  componentDidMount() {
    console.log("componentDidMount.props:", this.props, this.$router.params);
    const wbno = this.$router.params.wbno;
    const rdcno = this.$router.params.rdc;
    const cell = this.$router.params.cell;
    getWaybill(wbno, rdcno, cell)
      .then((ret: WaybillResult) => {
        console.log("getWaybill.ret:", ret);
        if (ret.result === "success") {
          const iCnt = ret.waybill.shipItems.length;
          ret.waybill.rdcCode = rdcno; //todo: update here for dbl-check
          getWbPhotos(wbno)
            .then((pret: PhotosResult) => {
              ret.waybill.photos = pret.photos.map((item, index) => ({
                url: SERVER_URL + "/" + item.url,
                caption:
                  item.status === "rejected"
                    ? "已拒收,需重新上传"
                    : "图片" + index,
              }));
              this.setState({
                loading: false,
                waybill: ret.waybill,
                itemCount: iCnt,
                arrived: ret.waybill.status === "arrived",
                confirmed: ret.waybill.status === "confirmed",
                valid: true,
              });
            })
            .catch((err) => {
              console.log("err:", err);
              Taro.atMessage({
                message: "运单信息获取失败，请重试！",
                type: "error",
                duration: 8000,
              });
              this.setState({
                loading: false,
                failed: true,
                valid: false,
                itemCount: 0,
                arrived: false,
                confirmArrive: false,
              });
              throw err;
            });
        } else {
          this.setState({
            loading: false,
            valid: false,
            itemCount: 0,
            arrived: false,
            confirmArrive: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
          valid: false,
          failed: true,
          itemCount: 0,
          arrived: false,
          confirmArrive: false,
        });
        console.log("Err", err);
        Taro.atMessage({
          message: "运单信息获取失败，请重试！",
          type: "error",
          duration: 8000,
        });
      });
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
    navigationBarTitleText: "货运单",
  };

  openCamera() {
    Taro.navigateTo({
      url: "/pages/camera/camera?isScan=true",
    });
  }
  openManual() {
    Taro.navigateTo({
      url: "/pages/user/index",
    });
  }

  handleChange(val) {
    console.log("something has been changed:", val);
  }
  render() {
    const {
      loading,
      waybill,
      confirmArrive,
      arrived,
      confirmed,
      valid,
      failed,
    } = this.state;
    console.log("loading:", loading);
    if (loading) {
      return (
        <View>
          <AtMessage />
          <Loading />
        </View>
      );
    }
    if (failed) {
      return (
        <InfoCard
          title="操作未成功"
          message="请确保您的手机处于联网状态，再次尝试操作。如果还不成功，请与中心工作人员联系。"
          extMessage="请点击“返回”按钮。"
          backFunc={() => {
            Taro.navigateBack();
          }}
        />
      );
    }
    const confirmString = "当前时间：" + new Date().toLocaleString("zh-CN");
    const confirmString2 = "请输入接货码、手机号确认送达";
    const confirmString3 = "请注意，一旦确认将无法修改。";
    console.log("waybill:", waybill);
    const gridData = waybill.photos.map((item, index) => ({
      image: item.url,
      value: item.caption,
    }));
    console.log("sheet.gridData:", gridData);
    return (
      <View className="index">
        <AtMessage />

        <Text className="form-title">
          {valid ? "货运单详细信息" : "未找到运单"}
        </Text>
        {valid ? (
          <View className="sheet-info-span">
            <View className="form-caption-split">
              运单状态：
              <Text
                className={arrived || confirmed ? "arrived" : "notarrive"}
                style="flex:1"
              >
                {waybill.statusCaption}
              </Text>
              {arrived && !confirmed ? (
                <AtButton
                  className="right-button-1"
                  onClick={() => {
                    Taro.redirectTo({ url: "/pages/camera/camera" });
                  }}
                >
                  点击上传回执
                </AtButton>
              ) : null}
              <AtModal isOpened={confirmArrive}>
                <AtModalHeader>确认到达</AtModalHeader>
                <AtModalContent>
                  <CoverView className="toast-main">
                    <View className="confirm-info">{confirmString}</View>
                    <View className="confirm-info">{confirmString2}</View>
                    <View className="confirm-info">{confirmString3}</View>

                    <CoverView className="toast-input">
                      <AtInput
                        type="number"
                        className="home-input"
                        title="*接货码"
                        name="arsCode"
                        placeholder="四位接货码"
                        z-index={1000}
                        onChange={(val) => {
                          console.log("changed:", val);
                        }}
                      ></AtInput>
                    </CoverView>
                    <CoverView className="toast-input">
                      <AtInput
                        type="number"
                        name="cellphone"
                        className="home-input"
                        title="手机号"
                        placeholder="您的手机号"
                        z-index={1000}
                        onChange={(val) => {
                          console.log("changed:", val);
                        }}
                      ></AtInput>
                    </CoverView>
                  </CoverView>
                </AtModalContent>
                <AtModalAction>
                  <Button className="home-input-semi-left">取消</Button>
                  <Button className="home-input-semi-right">确认</Button>
                </AtModalAction>
              </AtModal>
            </View>
            <Text className="form-caption">运单编号：{waybill.sheetNum}</Text>
            <Text className="form-caption">
              发行时间：
              {new Date(waybill.startDatetime).toLocaleString("zh-CN")}
            </Text>
            <Text className="form-caption">往来单位：{waybill.shiptoName}</Text>
            <Text className="form-caption">联系电话：{waybill.shiptoTel}</Text>
            <Text className="form-divider">-</Text>
            <Text className="form-caption">
              物流中心：{waybill.rdcCode}（{waybill.rdcName}）
            </Text>
            <Text className="form-caption">
              接货单位：{waybill.shiptoCode} （{waybill.shiptoName}）
            </Text>
            <Text className="form-caption">
              车辆编号：{waybill.plateNum}（{waybill.driverName}）
            </Text>
            <AtGrid
              onClick={(item, index) => {
                //do preview
                console.log("atgrid.item:", item, gridData[index]);
                if (item.value.indexOf("已拒收") >= 0) {
                  Taro.atMessage({
                    message: "该照片已被中心拒收，请重新拍照上传",
                    type: "error",
                  });
                } else {
                  Taro.previewImage({
                    urls: [gridData[index].image],
                    success: () => {
                      console.log("success");
                    },
                    fail: () => {
                      console.log("fail");
                    },
                  });
                }
              }}
              data={gridData}
            />
            <View className="form-detail-span">
              <View className="form-detail-header">
                <Text className="form-detail-title">货运清单</Text>
              </View>
              <ShipItems
                current={0}
                pageCount={waybill.totalPages}
                shipItems={waybill.shipItems}
              />
            </View>
            {arrived || confirmed ? null : (
              <AtButton className="home-button" formType="submit">
                点击确认到达
              </AtButton>
            )}
            <AtButton
              className="home-button"
              formType="reset"
              onClick={() => {
                Taro.navigateBack();
              }}
            >
              返回
            </AtButton>
          </View>
        ) : (
          <View style="height:400px; margin-top:5rem; margin-left:2rem; margin-right:2rem;">
            <Text style="display:block; text-align:center; font-size:1.2rem; margin-top:3rem">
              您的-运单号-或-接货中心码-不正确
            </Text>
            <Text style="display:block; text-align:center; font-size:1.2rem; margin-top:3rem; margin-bottom:3rem;">
              请返回重新输入
            </Text>

            <AtButton
              className="home-button"
              formType="reset"
              onClick={() => {
                Taro.navigateBack();
              }}
            >
              返回
            </AtButton>
          </View>
        )}
      </View>
    );
  }
}
