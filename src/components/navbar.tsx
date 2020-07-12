import Taro from "@tarojs/taro";
import { AtNavBar } from "taro-ui";

export default function NavBar(props) {
  let loggedIn = Taro.getStorageSync("roleName").toString().length > 0;
  return (
    <AtNavBar
      customStyle={{
        backgroundColor: "#ababab",
      }}
      onClickRgIconSt={() => {
        console.log("onClickRgIconSt");
        if (loggedIn) {
          Taro.removeStorage({
            key: "roleName",
            success: () => {
              Taro.redirectTo({ url: "/pages/index/index" });
            },
          });
          Taro.removeStorage({ key: "userName" });
        } else {
          //not logged in yet
          Taro.redirectTo({ url: "/pages/user/Login" });
        }
      }}
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
              size: "24",
              color: "#ffffff",
            }
      }
      rightSecondIconType=""
    />
  );
}
