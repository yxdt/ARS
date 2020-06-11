import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtList, AtListItem, AtButton } from "taro-ui";
import "./index.scss";
import NavBar from "../../components/navbar";
export interface SheetState {
  checked: boolean;
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    this.state = {
      checked: false,
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

  handleChange(val) {
    console.log("something has been changed:", val);
  }
  render() {
    return (
      <View className="index">
        <NavBar handleClick={this.handleClick} />
        <Text className="form-title">货运单详细信息</Text>
        <View className="sheet-info-span">
          <Text className="form-caption">
            运单状态： <Text className="form-hilite">尚未到达</Text>
          </Text>
          <Text className="form-caption">运单编号：11234568</Text>
          <Text className="form-caption">发行时间：2020/06/12 17:18:20</Text>
          <Text className="form-caption">往来单位：国美电器内蒙古有限公司</Text>
          <Text className="form-caption">联系电话：0471-9387793</Text>
          <Text
            style={{
              color: "#f5f5f5",
              height: "33px",
              margin: "0 auto",
            }}
          >
            ---
          </Text>
          <Text className="form-caption">物流中心：01（北京物流中心）</Text>
          <Text className="form-caption">接货单位：0020 呼和浩特国美电器</Text>
          <Text className="form-caption">车辆编号：京A 332238（张强）</Text>
          <AtList>
            <AtListItem
              onClick={() => {
                this.setState({ checked: !this.state.checked });
              }}
              title="M09BJZ011288-1-1bj-1（样机）"
              note="GT-S25NPD.CASWPLGD"
              extraText="1"
              iconInfo={{
                prefixClass: "fa",
                value: this.state.checked ? "check-square-o" : "square-o",
                size: "25",
                color: "#666",
              }}
            ></AtListItem>
          </AtList>
          <AtButton className="home-button" formType="submit">
            确认到达
          </AtButton>
          <AtButton className="home-button" formType="reset">
            取消
          </AtButton>
        </View>
      </View>
    );
  }
}
