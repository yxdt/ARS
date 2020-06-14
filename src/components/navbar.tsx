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
      title={props.title}
      leftText=""
      fixed={true}
      leftIconType={{
        prefixClass: "fa",
        value: "truck",
        size: "30",
        color: "#fff",
      }}
      rightFirstIconType="bullet-list"
      rightSecondIconType=""
    />
  );
}
