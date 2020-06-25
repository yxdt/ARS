import Taro, { useState } from "@tarojs/taro";
import { AtNavBar } from "taro-ui";

export default function NavBar(props) {
  return (
    <AtNavBar
      customStyle={{
        backgroundColor: "#ababab",
      }}
      onClickRgIconSt={this.props.handleClick}
      onClickRgIconNd={this.props.handleClick}
      onClickLeftIcon={this.props.handleClick}
      title={props.title || "配送中心人员登录"}
      color="#ffffff"
      leftText=""
      fixed={true}
      rightFirstIconType={
        props.hideRightIcon
          ? ""
          : {
              prefixClass: "fa",
              value: props.ricon || "id-badge",
              size: "24",
              color: "#ffffff",
            }
      }
      rightSecondIconType=""
    />
  );
}
