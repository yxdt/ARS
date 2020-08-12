import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
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
import { sendArriveMessage } from "../../controllers/rest";
import { loadWaybill, confirmArrive } from "../../controllers/waybill";

import { approvePicture, rejectPicture } from "../../controllers/camera";
import ShipItems from "../../components/shipitems";
import { WaybillResult, Waybill } from "../../types/ars";
import InfoCard from "../../components/infocard";

export interface SheetState {
  loading: boolean;
  waybill: Waybill;
  itemCount: number;
  arrived: boolean; //司机确认到达
  confirmed: boolean; //中心已确认到达
  confirmTime: Date;
  confirmedArrive: boolean; //司机到达确认的确认
  confirming: boolean; //司机到达确认中
  valid: boolean; //是否是有效的运单号
  failed: boolean; //是否操作失败
  rdcNum: string; //司机输入接货码
  cellphone: string; //driver cellphone
  isSuper: boolean; //是否是中心人员
  preview: boolean; //是否查看选定照片
  selPic: string; //当前选定照片
  selPicId: string; //选定照片ID
  confirmReject: boolean; //确定驳回
  remark: string; //驳回原因
  selCaption: string; //当前照片状态
  //photos: Array<string>; //uploaded photos
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    this.state = {
      loading: true,
      failed: false,
      rdcNum: "",
      cellphone: "",
      isSuper: false,
      waybill: {
        shiptoCode: "",
        rdcCode: "",
        arriveTime: new Date(),
        totalPages: 1,
        status: "",
        statusCaption: "",
        statusNum: 0,
        wbNum: "",
        shiptoName: "",
        rdcName: "",
        shipItems: [],
        photos: [],
      },
      itemCount: 0,
      arrived: false,
      confirmedArrive: false,
      confirmTime: new Date(),
      confirming: false,
      confirmed: false,
      valid: false,
      preview: false,
      selPic: "",
      selPicId: "",
      confirmReject: false,
      remark: "",
      selCaption: "",
    };
    //consolelog("sheet:", this.$router.params);
    this.driverConfirmArrive.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    //consolelog("sheet.index.componentDidMount.props:",this.props,this.$router.params);
    const wbno = this.$router.params.wbno;
    //const rdcno = this.$router.params.rdc;
    //const cell = this.$router.params.cell;
    let isSuper = this.$router.params.super === "1";
    if (!isSuper) {
      isSuper = Taro.getStorageSync("roleName").toString().length > 0;
    }
    loadWaybill(wbno)
      .then((ret: WaybillResult) => {
        //consolelog("getWaybill.ret:", ret, ret.waybill);
        if (ret.result === "success") {
          const iCnt = ret.waybill.shipItems.length;
          //ret.waybill.rdcCode = rdcno;
          //todo: update here for dbl-check
          this.setState({
            loading: false,
            waybill: ret.waybill,
            itemCount: iCnt,
            arrived: ret.waybill.status === "arrived",
            confirmed: ret.waybill.status === "confirmed",
            confirmedArrive: ret.waybill.status === "loaded",
            confirmTime: ret.waybill.arriveTime,
            valid: true,
            isSuper,
            preview: false,
            selPic: "",
          });
        } else {
          this.setState({
            loading: false,
            valid: false,
            itemCount: 0,
            arrived: false,
            confirmedArrive: false,
            isSuper,
            preview: false,
            selPic: "",
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
          valid: false,
          failed: err.code === "5000" ? true : false,
          itemCount: 0,
          arrived: false,
          confirmedArrive: false,
          isSuper,
          preview: false,
          selPic: "",
        });

        //consolelog("Error:", err);
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
    //consolelog("something has been changed:", val);
  }

  driverConfirmArrive() {
    //consolelog("driver confirm arrive");
    //consolelog("sheetNum:", this.state.waybill.wbNum);
    // consolelog(
    //   "rdcNum, shipToCode, rdcCode:",
    //   this.state.rdcNum,
    //   this.state.waybill.shiptoCode,
    //   this.state.waybill.rdcCode
    // );
    //dirver position address openid
    const openid = Taro.getStorageSync("userOpenId");
    //consolelog("sheet.index.driverConfirmArrive.openid:", openid);
    if (this.state.cellphone) {
      Taro.setStorage({ key: "cellphone", data: this.state.cellphone });
    }
    if (this.state.rdcNum === this.state.waybill.shiptoCode) {
      //you can confirm with the waybill
      this.setState({ confirming: true, confirmedArrive: false });

      confirmArrive(
        this.state.waybill.wbNum,
        this.state.waybill.shiptoCode,
        this.state.cellphone,
        this.state.confirmTime
      )
        .then((ret) => {
          //consolelog("taro.confirmArrive.then");
          if (ret.result === "success") {
            this.setState({
              arrived: true,
              loading: false,
              confirmedArrive: false,
              confirming: false,
              waybill: {
                ...this.state.waybill,
                status: "arrived",
                statusCaption: "司机已确认到达",
                statusNum: 1,
              },
            });
            sendArriveMessage(this.state.waybill.wbNum, openid);
          } else {
            Taro.atMessage({
              message: "操作失败：订单信息有误，请重试。",
              type: "error",
              duration: 8000,
            });
          }
        })
        .catch((ret) => {
          Taro.atMessage({
            message: "操作失败，错误原因：" + ret.message,
            type: "error",
            duration: 8000,
          });
        })
        .finally(() => {
          this.setState({ confirming: false });
          //consolelog("confirmArrive.finally:", this.state.confirming);
        });
    } else {
      //wrong rdcNumber input
      ////consolelog("wrong rdc code input");
      Taro.atMessage({
        message: "接收码输入错误，请重试！",
        type: "error",
      });
    }
  }

  render() {
    const {
      loading,
      waybill,
      confirmedArrive,
      confirmTime,
      arrived,
      confirmed,
      confirming,
      valid,
      failed,
      isSuper,
      preview,
      selPicId,
      selPic,
      selCaption,
    } = this.state;
    //consolelog("loading:", loading);
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
    if (!valid) {
      return (
        <InfoCard
          title="未找到交货单"
          message="您输入的【装车序列号】【验证码】不正确"
          extMessage="请点击“返回”按钮重新输入"
          backFunc={() => {
            Taro.navigateBack();
          }}
        />
      );
    }
    const confirmString = "时间：" + confirmTime.toLocaleString("zh-CN");
    const confirmString2 = "请输入验证码、手机号确认送达";
    const confirmString3 = "请注意，一旦确认将无法修改。";
    //consolelog("waybill:", waybill);
    const gridData = waybill.photos.map((item, index) => ({
      image: item.url,
      value: item.caption,
      imageId: item.id,
    }));
    //consolelog("sheet.gridData:", gridData);

    return (
      <View className="index">
        <AtMessage />
        {isSuper && preview ? (
          <View className="preview-span">
            <Image
              mode="aspectFit"
              src={selPic}
              className="preview-img"
              onClick={() => {
                //do preview
                Taro.previewImage({
                  urls: [selPic],
                  success: () => {
                    //consolelog("success");
                  },
                  fail: () => {
                    //consolelog("fail");
                  },
                });
              }}
            ></Image>
            {selCaption !== "已上传" ? (
              <View style="display:flex; flex-direction:row">
                <Button
                  className="preview-confirm-button"
                  onClick={() => {
                    this.setState({ preview: false });
                  }}
                >
                  返回
                </Button>
              </View>
            ) : (
              <View style="display:flex; flex-direction:row">
                <Button
                  className="preview-confirm-button"
                  disabled={selCaption !== "已上传"}
                  onClick={() => {
                    approvePicture(
                      waybill.wbNum + waybill.shiptoCode,
                      this.state.selPicId,
                      Taro.getStorageSync("userOpenId")
                    )
                      .then((ret) => {
                        //consolelog("wb-approve:", ret);
                        if (ret.result === "success") {
                          Taro.atMessage({
                            message: "照片审核通过",
                            type: "success",
                          });
                          this.setState({ preview: false });
                          for (
                            let idx = 0;
                            idx < waybill.photos.length;
                            idx++
                          ) {
                            if (
                              waybill.photos[idx].id === this.state.selPicId
                            ) {
                              waybill.photos[idx].caption = "通过";
                            }
                          }
                        } else {
                          Taro.atMessage({
                            message: "照片审核操作失败，请重试",
                            type: "error",
                          });
                        }
                        //consolelog("approvePicture.result:", ret);
                      })
                      .catch(() => {
                        Taro.atMessage({
                          message: "照片审核操作失败，请重试",
                          type: "error",
                        });
                      });
                  }}
                >
                  通过
                </Button>
                <Button
                  disabled={selCaption !== "已上传"}
                  className="preview-confirm-button"
                  onClick={() => {
                    this.setState({ confirmReject: true });
                  }}
                >
                  驳回
                </Button>
              </View>
            )}
            <AtModal isOpened={this.state.confirmReject}>
              <AtModalHeader>驳回操作</AtModalHeader>
              <AtModalContent>
                <View className="toast-main">
                  <View className="confirm-info">请给出驳回原因</View>
                  <AtInput
                    key={"reject-reason"}
                    type="text"
                    className="modal-input"
                    title="原因："
                    value={this.state.remark}
                    name="remark"
                    placeholder=""
                    onChange={(theval) => {
                      //consolelog("remark:", theval);
                      this.setState({ remark: theval.toString() });
                    }}
                  ></AtInput>
                </View>
              </AtModalContent>
              <AtModalAction>
                <Button
                  className="home-input-semi-left"
                  onClick={() => {
                    //Taro.navigateBack();
                    this.setState({ confirmReject: false });
                  }}
                >
                  取消
                </Button>
                <Button
                  className="home-input-semi-right"
                  onClick={() => {
                    rejectPicture(
                      waybill.wbNum + waybill.shiptoCode,
                      selPicId,
                      this.state.remark,
                      Taro.getStorageSync("userOpenId")
                    )
                      .then((ret) => {
                        //consolelog("rejectPicture.result:", ret);
                        if (ret.result === "success") {
                          Taro.atMessage({
                            message: "照片审核驳回成功",
                            type: "success",
                          });
                          this.setState({ preview: false });
                          for (let i = 0; i < waybill.photos.length; i++) {
                            if (waybill.photos[i].id === this.state.selPicId) {
                              waybill.photos[i].caption =
                                "驳回:" + this.state.remark;
                            }
                          }
                        } else {
                          Taro.atMessage({
                            message: "照片审核操作失败，请重试",
                            type: "error",
                          });
                        }
                      })
                      .catch(() => {
                        Taro.atMessage({
                          message: "照片审核操作失败，请重试",
                          type: "error",
                        });
                      })
                      .finally(() => {
                        this.setState({ preview: false });
                        //consolelog("rejected!");
                      });
                  }}
                >
                  确认驳回
                </Button>
              </AtModalAction>
            </AtModal>
          </View>
        ) : (
          <View>
            <View className="sheet-detail-index">
              <Text className="form-title">交货单详细信息</Text>
              <View className="sheet-info-span">
                <View className="form-caption-split">
                  单据状态：
                  <Text
                    className={confirmed ? "arrived" : "notarrive"}
                    style="flex:1"
                  >
                    {confirming ? "更新中..." : waybill.statusCaption}
                  </Text>
                </View>
                <Text className="form-caption"> 装 车 号：{waybill.wbNum}</Text>
                {waybill.statusNum > 0 ? (
                  <Text className="form-caption">
                    到达时间：
                    {new Date(waybill.arriveTime).toLocaleString("zh-CN")}
                  </Text>
                ) : null}
                <Text className="form-caption">
                  物流中心：{waybill.rdcCode}（{waybill.rdcName}）
                </Text>
                <Text className="form-caption">
                  接 货 处：{waybill.shiptoCode} （{waybill.shiptoName}）
                </Text>

                {waybill.statusNum > 0 ? (
                  <View className="form-detail-span">
                    <View className="form-detail-header">
                      <Text className="form-detail-title">回执列表</Text>
                      <View className="form-detail-title-right">
                        {!confirmed ? (
                          <AtButton
                            className="right-button"
                            onClick={() => {
                              Taro.redirectTo({ url: "/pages/camera/camera" });
                            }}
                          >
                            {isSuper ? "替司机上传回执" : "点击上传回执"}
                          </AtButton>
                        ) : null}
                      </View>
                    </View>
                    <AtGrid
                      onClick={(item, index) => {
                        //do preview
                        //consolelog("atgrid.item:", item, gridData[index]);
                        this.setState({
                          selPic: item.image || "",
                          selPicId: item.imageId || "",
                          selCaption: item.value || "",
                          preview: true,
                        });
                        if (item.value && item.value.indexOf("驳回") >= 0) {
                          Taro.atMessage({
                            message: "该照片已被中心驳回，请重新拍照上传",
                            type: "error",
                          });
                        } else {
                          if (!isSuper) {
                            Taro.previewImage({
                              urls: [gridData[index].image],
                              success: () => {
                                //consolelog("success");
                              },
                              fail: () => {
                                //consolelog("fail");
                              },
                            });
                          }
                        }
                      }}
                      data={gridData}
                    />
                  </View>
                ) : null}

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
                {waybill.statusNum > 0 ? null : (
                  <AtButton
                    className="home-button"
                    formType="submit"
                    onClick={() => {
                      this.setState({ confirmedArrive: true });
                    }}
                  >
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
            </View>
            {waybill.statusNum > 0 ? null : (
              <AtModal isOpened={confirmedArrive}>
                <AtModalHeader>{confirmString}</AtModalHeader>
                <AtModalContent>
                  <View className="toast-main">
                    <View className="confirm-info">{confirmString2}</View>
                    <View className="confirm-info">{confirmString3}</View>
                    <AtInput
                      key={"confirm-arrive-ara-code"}
                      type="text"
                      className="modal-input"
                      title="验证码*"
                      name="arsCode"
                      placeholder=""
                      onChange={(val) => {
                        //consolelog("arscode:", val);
                        this.setState({ rdcNum: val.toString() });
                      }}
                    ></AtInput>
                    <AtInput
                      key={"confirm-arrive-cell-phone"}
                      type="number"
                      name="cellphone"
                      className="modal-input"
                      title="手机号"
                      placeholder=""
                      onChange={(val) => {
                        //consolelog("changed:", val);
                        this.setState({ cellphone: val.toString() });
                      }}
                    ></AtInput>
                  </View>
                </AtModalContent>
                <AtModalAction>
                  <Button
                    className="home-input-semi-left"
                    onClick={() => {
                      //Taro.navigateBack();
                      this.setState({ confirmedArrive: false });
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    className="home-input-semi-right"
                    onClick={this.driverConfirmArrive}
                  >
                    确认到达
                  </Button>
                </AtModalAction>
              </AtModal>
            )}
          </View>
        )}
      </View>
    );
  }
}
