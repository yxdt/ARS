import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import { AtButton, AtModal, AtGrid } from "taro-ui";
import "./index.scss";
import Loading from "../../components/loading";
import {
  getWaybill,
  confirmWaybill,
  getWbPhotos,
} from "../../controllers/rest";
import { getDriverLocation } from "../../controllers/users";
import ShipItems from "../../components/shipitems";
import { WaybillResult, Waybill, Result, PhotosResult } from "../../types/ars";

export interface SheetState {
  loading: boolean;
  waybill: Waybill;
  itemCount: number;
  arrived: boolean; //司机确认到达
  confirmArrive: boolean; //司机到达确认的确认
  confirmed: boolean; //中心已确认到达
  valid: boolean; //是否是有效的运单号
  //photos: Array<string>; //uploaded photos
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    this.state = {
      loading: true,

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
      confirmArrive: false,
      confirmed: false,
      valid: false,
    };
    console.log("sheet", this.$router.params);
  }

  componentWillMount() {}

  componentDidMount() {
    console.log("componentDidMount.props:", this.props, this.$router.params);
    const wbno = this.$router.params.wbno;
    const rdcno = this.$router.params.rdc;
    const cell = this.$router.params.cell;
    getWaybill(wbno, rdcno, cell).then((ret: WaybillResult) => {
      console.log("getWaybill.ret:", ret);
      if (ret.result === "success") {
        const iCnt = ret.waybill.shipItems.length;
        ret.waybill.rdcCode = rdcno; //todo: update here for dbl-check
        getWbPhotos(wbno).then((pret: PhotosResult) => {
          ret.waybill.photos = pret.photos.map(
            (item) => "http://192.168.0.100:8765/" + item
          );
          this.setState({
            loading: false,
            waybill: ret.waybill,
            itemCount: iCnt,
            arrived: ret.waybill.status === "arrived",
            confirmed: ret.waybill.status === "confirmed",
            valid: true,
          });
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
      url: "/pages/driver/index",
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
    } = this.state;
    console.log("loading:", loading);
    if (loading) {
      return <Loading />;
    }
    const confirmString =
      "当前日期时间为" +
      new Date().toLocaleString("zh-CN") +
      ", 确认本运单已送达？请注意，一旦确认将无法修改。";

    const gridData = waybill.photos.map((item, index) => ({
      image: item,
      value: "图片" + index,
    }));
    return (
      <View className="index">
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
              {arrived || confirmed ? null : (
                <AtButton
                  className="right-button"
                  onClick={() => {
                    this.setState({ confirmArrive: true });
                    getDriverLocation(waybill.sheetNum, (res) => {
                      console.log("driver loc:", res);
                    });
                  }}
                >
                  点击确认到达
                </AtButton>
              )}
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
              <AtModal
                isOpened={confirmArrive}
                title="确认运单到达"
                content={confirmString}
                cancelText="取消"
                confirmText="确认"
                onClose={() => {
                  console.log("closed");
                }}
                onCancel={() => {
                  this.setState({ confirmArrive: false });
                }}
                onConfirm={() => {
                  console.log("confirmed!");
                  this.setState({ loading: true });
                  confirmWaybill(waybill.sheetNum).then((ret: Result) => {
                    if (ret.result === "success") {
                      this.setState({
                        arrived: true,
                        loading: false,
                        waybill: {
                          ...waybill,
                          status: "arrived",
                          statusCaption: "已送达",
                        },
                      });
                    }
                  });
                  this.setState({ confirmArrive: false });
                }}
              />
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
            <AtGrid data={gridData} />
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
