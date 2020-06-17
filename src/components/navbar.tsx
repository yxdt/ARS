import Taro, { useState } from "@tarojs/taro";
import { AtNavBar } from "taro-ui";

export default function NavBar(props) {
  return (
    <AtNavBar
      customStyle={{
        backgroundColor: "#a50034",
        color: "#ffffff",
        fontSize: "0.2rem",
      }}
      onClickRgIconSt={this.props.handleClick}
      onClickRgIconNd={this.props.handleClick}
      onClickLeftIcon={this.props.handleClick}
      color="#ffffff"
      title={props.title || "中心人员登录"}
      leftText=""
      fixed={true}
      rightFirstIconType={
        props.hideRightIcon
          ? ""
          : {
              prefixClass: "fa",
              value: "id-badge",
              size: "30",
              color: "#fff",
            }
      }
      rightSecondIconType=""
    />
  );
}
