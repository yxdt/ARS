import Taro from "@tarojs/taro";
import { AtNavBar } from "taro-ui";
import { View } from "@tarojs/components";
import "./comp.scss";

export default function NavBar(props) {
  let loggedIn = Taro.getStorageSync("roleName").toString().length > 0;
  function doLoginOut() {
    if (loggedIn) {
      Taro.removeStorage({ key: "userName" });
      Taro.removeStorage({ key: "token" });
      Taro.removeStorage({ key: "tokendate" });
      Taro.removeStorage({
        key: "roleName",
        success: () => {
          Taro.redirectTo({ url: "/pages/index/index" });
        },
      });
    } else {
      //not logged in yet
      Taro.redirectTo({ url: "/pages/user/Login" });
    }
  }
  return (
    <View onClick={doLoginOut}>
      <AtNavBar
        onClickRgIconSt={doLoginOut}
        //onClickRgIconNd={this.props.handleClick}
        //onClickLeftIcon={this.props.handleClick}
        title={props.title || (loggedIn ? "点击退出" : "配送中心人员登录")}
        color="#ffffff"
        leftText=""
        fixed={true}
        rightFirstIconType={
          props.hideRightIcon
            ? ""
            : {
                prefixClass: "fa",
                value: props.ricon || (loggedIn ? "sign-out" : "id-badge"),
                size: "28",
                color: "#ffffff",
              }
        }
      />
    </View>
  );
}
