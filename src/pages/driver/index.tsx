import Taro, { Component, Config, hideToast } from "@tarojs/taro";
import { View, Text, Image, Picker } from "@tarojs/components";
import {
  AtForm,
  AtNavBar,
  AtInput,
  AtButton,
  AtList,
  AtListItem,
} from "taro-ui";
import "./index.scss";

export const TruckTypes: string[] = [
  "微型面包车",
  "面包车",
  "厢式货车2.5吨",
  "厢式货车5吨",
  "厢式货车10吨",
];

export interface DriverStates {
  userName: string;
  cellphone: string;
  platenumber: string;
  trucktype: string;
}

export default class Index extends Component<null, DriverStates> {
  constructor() {
    super(...arguments);
    this.state = {
      userName: "",
      cellphone: "",
      platenumber: "",
      trucktype: TruckTypes[0],
    };
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
    navigationBarTitleText: "用户注册",
  };

  handleClick() {
    console.log("you clicked me.");
  }
  handleChange(val) {
    console.log("something has been changed:", val);
  }

  render() {
    return (
      <View className="index">
        <AtNavBar
          onClickRgIconSt={this.handleClick}
          onClickRgIconNd={this.handleClick}
          onClickLeftIcon={this.handleClick}
          color="#ffffff"
          fixed={true}
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
        <Image
          mode="scaleToFill"
          style="top:0;left:0; width:100%; height: 100%; position:fixed; background-size: 100%, 100%; z-index: -1"
          src="../../assets/img/back.png"
        ></Image>
        <View className="user-info-span">
          <Text className="form-title">成为注册司机</Text>
          <Text className="form-caption">请输入您的信息</Text>
          <Text className="form-comment">
            本系统只对LG注册司机开放，
            请输入您的个人信息提交管理员审核。审核通过后，您就可以访问相关功能。
          </Text>
          <AtForm className="form-userinfo">
            <AtInput
              className="input-text"
              name="userName"
              title="姓名"
              type="text"
              placeholder="请输入您的姓名"
              value={this.state.userName}
              onChange={this.handleChange.bind(this, "userName")}
            />
            <AtInput
              className="input-text"
              name="cellphone"
              title="手机"
              type="text"
              placeholder="请输入您的手机号码"
              value={this.state.cellphone}
              onChange={this.handleChange.bind(this, "cellphone")}
            />
            <AtInput
              className="input-text"
              name="platenumber"
              title="车牌号"
              type="text"
              placeholder="请输入您的车牌号"
              value={this.state.platenumber}
              onChange={this.handleChange.bind(this, "platenumber")}
            />
            <Picker
              className="picker"
              mode="selector"
              range={TruckTypes}
              onChange={this.handleChange.bind(this, "trucktypes")}
            >
              <AtList>
                <AtListItem title="货车类型" />
              </AtList>
            </Picker>
            <AtButton className="home-button" formType="submit">
              提交
            </AtButton>
            <AtButton className="home-button" formType="reset">
              重置
            </AtButton>
          </AtForm>
        </View>
      </View>
    );
  }
}
