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
import {
  loadWaybill,
  confirmArrive,
  confirmComplete,
} from "../../controllers/waybill";

import {
  approvePicture,
  rejectPicture,
  deletePicture,
} from "../../controllers/camera";
import ShipItems from "../../components/shipitems";
import { WaybillResult, Waybill } from "../../types/ars";
import InfoCard from "../../components/infocard";

export interface SheetState {
  loading: boolean;
  waybill: Waybill;
  itemCount: number;
  arrived: boolean; //司机确认到达
  confirmed: boolean; //中心已确认到达
  confirmTime: string;
  confirmedArrive: boolean; //司机到达确认的确认
  confirmedComplete: boolean; //中心人员完成的确认
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
  arriveTimeStr: string; //到达时间格式化字符串
  //gridData: Array<{ image: string; value: string; imageId: string }>; //当前照片
  deleting: boolean;
  pIdx: number; //调用返回页面idx 1：query 2：verify
  //photos: Array<string>; //uploaded photos
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    const Today = new Date();
    const today =
      Today.getFullYear() +
      "-" +
      (Today.getMonth() < 9
        ? "0" + (Today.getMonth() + 1)
        : Today.getMonth() + 1 + "");
    "-" + (Today.getDate() < 10 ? "0" + Today.getDate() : Today.getDate() + "");
    this.state = {
      loading: true,
      failed: false,
      rdcNum: "",
      cellphone: "",
      isSuper: false,
      confirmedComplete: false,
      waybill: {
        shiptoCode: "",
        rdcCode: "",
        arriveTime: today,
        totalPages: 1,
        status: "",
        statusCaption: "",
        statusNum: 0,
        wbNum: "",
        shiptoName: "",
        rdcName: "",
        shipItems: [],
        photos: [],
        arsCode: "",
        address: "",
        latitude: "",
        longitude: "",
        phone: "",
        remark: "",
      },
      itemCount: 0,
      arrived: false,
      confirmedArrive: false,
      confirmTime: today,
      confirming: false,
      confirmed: false,
      valid: false,
      preview: false,
      selPic: "",
      selPicId: "",
      confirmReject: false,
      remark: "",
      selCaption: "",
      deleting: false,
      arriveTimeStr: today,
      pIdx: 0,
    };
    //consolelog("sheet:", this.$router.params);
    this.driverConfirmArrive.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {}
  componentDidShow() {
    //consolelog("sheet.params:", this.$router.params);
    let wbno = this.$router.params.wbno;
    let parentIdx = this.$router.params.pidx; //1: query, 2: verify
    if (this.$router.params.q && this.$router.params.q.length > 0) {
      const wbnos = this.$router.params.q.split("%2F");
      wbno = wbnos[wbnos.length - 1];
      //consolelog("wbno from qrcode:", wbno);
    }
    Taro.setStorage({ key: "waybill", data: wbno });
    Taro.setStorage({
      key: "waybilldate",
      data: new Date().valueOf(),
    });
    //const rdcno = this.$router.params.rdc;
    //const cell = this.$router.params.cell;
    let isSuper = this.$router.params.super === "1";
    if (!isSuper) {
      isSuper = Taro.getStorageSync("roleName").toString().length > 0;
    }

    loadWaybill(wbno)
      .then((ret: WaybillResult) => {
        console.log("getWaybill.ret:", ret, ret.waybill);
        if (ret.result === "success") {
          const iCnt = ret.waybill.shipItems.length;
          //ret.waybill.rdcCode = rdcno;
          //todo: update here for dbl-check
          const arrDate = ret.waybill.arriveTime
            ? ret.waybill.arriveTime.split(".")[0]
            : "";
          console.log("arrDate-arriveTime:", arrDate, ret.waybill.arriveTime);
          Taro.setStorage({
            key: "waybillStatus",
            data: ret.waybill.statusNum,
          });
          this.setState({
            loading: false,
            waybill: ret.waybill,
            itemCount: iCnt,
            arrived: ret.waybill.status === "arrived",
            confirmed: ret.waybill.status === "confirmed",
            confirmTime: arrDate,
            valid: true,
            isSuper,
            preview: false,
            selPic: "",
            arriveTimeStr: arrDate,
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

        Taro.atMessage({
          message: "运单信息获取失败，请重试！",
          type: "error",
          duration: 8000,
        });
      });
  }

  componentWillUnmount() {}

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

  superConfirmComplete() {
    const { wbNum, shiptoCode, remark } = this.state.waybill;
    const openid = Taro.getStorageSync("userOpenId");
    confirmComplete(wbNum, shiptoCode, remark, openid)
      .then((ret) => {
        //consolelog("superConfirmComplete,ret:", ret);
        if (ret.result === "success") {
          this.setState({
            arrived: true,
            confirmed: true,
            loading: false,
            confirmedArrive: false,
            confirming: false,
            confirmedComplete: false,
            waybill: {
              ...this.state.waybill,
              status: "confirmed",
              statusCaption: "中心已确认",
              statusNum: 8,
              photos: this.state.waybill.photos.map((item) => ({
                url: item.url,
                caption: "通过",
                wbNum: item.wbNum,
                status: 1,
                id: item.id,
              })),
            },
          });
          Taro.setStorage({
            key: "waybillStatus",
            data: "8",
          });
        } else {
          Taro.atMessage({
            message: "IOD到达确认失败，请重试。",
            type: "error",
            duration: 8000,
          });
          this.setState({ confirmedComplete: false });
        }
      })
      .catch((ret) => {
        this.setState({ confirmedComplete: false });

        Taro.atMessage({
          message: "操作失败，错误原因：" + ret.message,
          type: "error",
          duration: 8000,
        });
      });
  }

  driverConfirmArrive() {
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
                statusCaption: "已到达",
                statusNum: 1,
              },
            });
            Taro.setStorage({
              key: "waybillStatus",
              data: "1",
            });
            sendArriveMessage(this.state.waybill.wbNum, openid);
          } else {
            Taro.atMessage({
              message: "操作失败：订单信息有误，请重试。",
              type: "error",
              duration: 8000,
            });
            this.setState({ confirming: false });
          }
        })
        .catch((ret) => {
          Taro.atMessage({
            message: "操作失败，错误原因：" + ret.message,
            type: "error",
            duration: 8000,
          });
          this.setState({ confirming: false });
        });
    } else {
      //wrong rdcNumber input
      ////consolelog("wrong rdc code input");
      Taro.atMessage({
        message: "验证码输入错误，请重试！",
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
      arriveTimeStr,
      confirmed,
      confirming,
      valid,
      failed,
      isSuper,
      confirmedComplete,
      preview,
      selPicId,
      selPic,
      selCaption,
      remark,
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
    //this.setState({
    const gridData = waybill.photos.map((item) => ({
      image: item.url,
      value: item.caption,
      imageId: item.id,
    }));
    //});
    //consolelog("sheet.gridData:", gridData);

    return (
      <View className="index">
        <AtMessage />
        {preview ? (
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
            <View style="display:flex; flex-direction:row">
              {(selCaption === "已上传" && waybill.statusNum === 3) ||
              waybill.statusNum === 1 ||
              (isSuper && waybill.statusNum < 8) ? (
                <Button
                  className="preview-confirm-button"
                  onClick={() => {
                    deletePicture(
                      waybill.wbNum + waybill.shiptoCode,
                      this.state.selPicId,
                      Taro.getStorageSync("userOpenId")
                    ).then((ret) => {
                      for (let idx = 0; idx < waybill.photos.length; idx++) {
                        if (waybill.photos[idx].id === this.state.selPicId) {
                          waybill.photos.splice(idx, 1);
                          break;
                        }
                      }
                      this.setState({ preview: false });
                    });
                  }}
                >
                  删除
                </Button>
              ) : null}
              <Button
                className="preview-confirm-button brown-btn"
                onClick={() => {
                  this.setState({ preview: false });
                }}
              >
                返回
              </Button>
            </View>
            <View style="display:flex; flex-direction:row">
              {selCaption !== "已上传" || !isSuper ? null : (
                <View style="display:flex; flex-direction:row;flex:4">
                  <Button
                    className="preview-confirm-button green-btn"
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
                            if (ret.closed === 0) {
                              this.setState({
                                arrived: true,
                                confirmed: true,
                                loading: false,
                                confirmedArrive: false,
                                confirming: false,
                                confirmedComplete: false,
                                waybill: {
                                  ...this.state.waybill,
                                  status: "confirmed",
                                  statusCaption: "中心已确认",
                                  statusNum: 8,
                                },
                              });
                              Taro.setStorage({
                                key: "waybillStatus",
                                data: "8",
                              });
                            }
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
                    className="preview-confirm-button purple-btn"
                    onClick={() => {
                      this.setState({ confirmReject: true });
                    }}
                  >
                    驳回
                  </Button>
                </View>
              )}
            </View>
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
                    value={remark}
                    name="remark"
                    placeholder="  "
                    placeholderClass="small-hd-ph"
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
                  disabled={!remark || remark.trim().length <= 0}
                  className={
                    !remark || remark.trim().length <= 0
                      ? "disabled-semi-right"
                      : "home-input-semi-right"
                  }
                  onClick={() => {
                    rejectPicture(
                      waybill.wbNum + waybill.shiptoCode,
                      selPicId,
                      this.state.remark,
                      Taro.getStorageSync("userOpenId")
                    )
                      .then((ret) => {
                        //consolelog("rejectPicture.result:", ret);
                        this.setState({ confirmReject: false });

                        if (ret.result === "success") {
                          Taro.atMessage({
                            message: "照片审核驳回成功",
                            type: "success",
                          });

                          for (let i = 0; i < waybill.photos.length; i++) {
                            if (waybill.photos[i].id === this.state.selPicId) {
                              waybill.photos[i].caption =
                                "驳回:" + this.state.remark;
                            }
                          }
                          this.setState({ preview: false });
                          this.setState({ remark: "" });
                        } else {
                          Taro.atMessage({
                            message: "照片审核操作失败，请重试",
                            type: "error",
                          });
                          this.setState({ preview: false });
                        }
                      })
                      .catch(() => {
                        Taro.atMessage({
                          message: "照片审核操作失败，请重试",
                          type: "error",
                        });
                        this.setState({ preview: false });
                      });
                  }}
                >
                  {remark && remark.length > 0 ? "确认驳回" : "请先输入"}
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
                  <Text className="form-caption">单据状态：</Text>
                  <Text
                    className={
                      confirmed ? "arrived form-item" : "notarrive form-item"
                    }
                  >
                    {confirming ? "更新中..." : waybill.statusCaption}
                  </Text>
                </View>
                <View className="form-caption-split">
                  <Text className="form-caption">装车号：</Text>
                  <Text className="form-item">{waybill.wbNum}</Text>
                </View>
                {waybill.statusNum > 0 ? (
                  <View className="form-caption-split">
                    <Text className="form-caption">到达时间：</Text>
                    <Text className="form-item">{arriveTimeStr}</Text>
                  </View>
                ) : null}
                <View className="form-caption-split">
                  <Text className="form-caption">物流中心：</Text>
                  <Text className="form-item">
                    {waybill.rdcCode}（{waybill.rdcName}）
                  </Text>
                </View>
                <View className="form-caption-split">
                  <Text className="form-caption">接货处码：</Text>
                  <Text className="form-item">
                    {waybill.shpToCd}（{waybill.shiptoCode}）
                  </Text>
                </View>
                <View className="form-caption-split">
                  <Text className="form-caption">接货处名：</Text>
                  <Text className="form-item">{waybill.shiptoName}</Text>
                </View>
                <View className="form-caption-split">
                  <Text className="form-caption">总页数：</Text>
                  <Text className="form-item">{waybill.totalPages}</Text>
                </View>

                {waybill.statusNum > 0 && isSuper ? (
                  <View className="form-caption-split">
                    <Text className="form-caption">司机手机：</Text>
                    <Text className="form-item">{waybill.phone || ""}</Text>
                  </View>
                ) : null}
                {waybill.statusNum > 0 && isSuper ? (
                  <View className="form-caption-split">
                    <Text className="form-caption">确认地址：</Text>
                    <Text className="form-item">{waybill.address || ""}</Text>
                  </View>
                ) : null}
                {waybill.statusNum > 0 ? (
                  <View className="form-detail-span">
                    <View className="form-detail-header">
                      <Text className="form-detail-title">回执列表</Text>
                      <View className="form-detail-title-right">
                        {(!confirmed || isSuper) &&
                        (waybill.statusNum < 8 || arriveTimeStr.length > 0) ? (
                          <AtButton
                            className="right-button"
                            onClick={() => {
                              const pidx = this.$router.params.pidx || "0";

                              Taro.navigateTo({
                                url: "/pages/camera/camera?pidx=" + pidx,
                              });
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
                    pageCount={waybill.maxPage}
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
                {isSuper && waybill.statusNum > 0 && waybill.statusNum < 8 ? (
                  <AtButton
                    className="home-button"
                    formType="submit"
                    onClick={() => {
                      this.setState({ confirmedComplete: true });
                    }}
                  >
                    IOD完成
                  </AtButton>
                ) : null}
                <AtButton
                  className="home-button"
                  formType="reset"
                  onClick={() => {
                    const pidx = this.$router.params.pidx || "0";

                    //consolelog("pIdx:", pidx);

                    if (pidx === "1") {
                      const wb: Array<Waybill> = Taro.getStorageSync(
                        "queryWaybills"
                      );
                      const curWbNum = Taro.getStorageSync("waybill");
                      //consolelog("before back.wb:", wb);
                      for (let i = 0; i < wb.length; i++) {
                        if (
                          wb[i].wbNum ===
                          waybill.wbNum + waybill.shiptoCode
                        ) {
                          wb[i].statusNum = waybill.statusNum;
                          wb[i].status = waybill.status;
                          wb[i].statusCaption = waybill.statusCaption;
                          //consolelog("found and updated:", waybill.statusNum);
                          break;
                        }
                      }
                      Taro.setStorageSync("queryWaybills", wb);

                      Taro.reLaunch({ url: "/pages/sheet/query?rtn=1" });
                    } else if (pidx === "2") {
                      Taro.reLaunch({ url: "/pages/camera/verify" });
                    } else if (Taro.getCurrentPages().length > 1) {
                      Taro.navigateBack();
                    } else {
                      Taro.reLaunch({ url: "/pages/index/index" });
                    }
                  }}
                >
                  返回
                </AtButton>
              </View>
            </View>

            <AtModal isOpened={confirmedComplete}>
              <AtModalHeader>确认运单IOD完成</AtModalHeader>
              <AtModalContent>
                <View className="toast-main">
                  <View className="confirm-info-1">
                    注意：确认后，该运单将直接标记为“IOD完成状态”。
                  </View>
                  <View className="confirm-info-1">
                    当前运单的全部已上传回执将被标记为“通过”。
                  </View>
                </View>
              </AtModalContent>
              <AtModalAction>
                <Button
                  className="home-input-semi-left"
                  onClick={() => {
                    //Taro.navigateBack();
                    this.setState({ confirmedComplete: false });
                  }}
                >
                  取消
                </Button>
                <Button
                  className="home-input-semi-right"
                  onClick={this.superConfirmComplete}
                >
                  确认
                </Button>
              </AtModalAction>
            </AtModal>
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
                      placeholder="  "
                      placeholderClass="small-hd-ph"
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
                      placeholder="  "
                      placeholderClass="small-hd-ph"
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
