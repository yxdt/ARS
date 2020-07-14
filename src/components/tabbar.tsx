import Taro, { useState } from "@tarojs/taro";
import { AtTabBar } from "taro-ui";

export default function ArsTabBar(props) {
  const [current, setCurrent] = useState(props.current);
  return (
    <AtTabBar
      tabList={[
        {
          title: "到达确认",
          iconPrefixClass: "fa",
          iconType: current === 0 ? "camera" : "qrcode",
        },
        {
          title: "回执上传",
          iconPrefixClass: "fa",
          iconType: current === 1 ? "file-text" : "file-text-o",
        },
        {
          title: "个人信息",
          iconPrefixClass: "fa",
          iconType: current === 2 ? "user" : "user-o",
        },
      ]}
      onClick={(val) => {
        //consolelog("click Menu:", val);
        setCurrent(val);
        let url = "/pages/index/index";
        if (val === 1) {
          url = "/pages/camera/camera";
        } else if (val === 2) {
          const userName = Taro.getStorageSync("userName");
          const avatar = Taro.getStorageSync("avatar");
          url =
            "/pages/user/userinfo?nickName=" +
            userName +
            "&avatarUrl=" +
            avatar;
        }
        Taro.redirectTo({ url });
      }}
      iconSize={20}
      current={current}
      fixed={true}
      backgroundColor="#ffffff"
      color="#6b6b6b"
      selectedColor="#f50034"
      fontSize={11}
    />
  );
}
