/**
 * 项目：运单管理信息系统---小程序部分
 * 描述：司机运单到达确认及回执上传，中心工作人员进行审核、查询
 * 作者：杨晓东 Youngxiaodong@hotmail.com 13811085365
 * 日期：2020年6月28日
 *
 */

import Taro, { Component, Config } from "@tarojs/taro";
import Index from "./pages/index";
import "taro-ui/dist/style/index.scss";
import "./app.scss";
import "./icon.scss";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/camera/camera",
      "pages/camera/verify",
      "pages/user/userinfo",
      "pages/user/Login",
      "pages/sheet/query",
      "pages/sheet/index",
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#a50034",
      navigationBarTitleText: "TIMS",
      navigationBarTextStyle: "white",
    },
    permission: {
      "scope.userLocation": {
        desc: "您的位置信息将用于确认运单正确送达",
      },
    },
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
