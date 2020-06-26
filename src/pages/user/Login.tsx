import Taro, { useState, login } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./index.scss";

import ArsTabBar from "../../components/tabbar";

export default function Login() {
  //const [manual, setManual] = useState(true);
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  const [openId, setOpenId] = useState("");
  const [loging, setLoging] = useState(false);
  //console.log("$router.params:", props, this.$router);

  if (this.$router.params.cellphone) {
    setCellphone(this.$router.params.cellphone);
    //setManual(true);
  }

  function doLogin() {
    console.log("user cellphone, password:", cellphone, password);
  }

  return (
    <View className="user-reg-span">
      <Text className="form-caption" style="margin-bottom:2rem">
        欢迎登录到 <Text className="home-title-hilite">TIMS</Text>\n
        <Text className="home-title-sub">配送信息管理系统</Text>
      </Text>

      <View>
        <View style={{ flexDirection: "row", display: "flex" }}>
          <AtInput
            className="home-input"
            name="cellphone"
            title="手机号"
            type="text"
            onChange={(val: string) => {
              //console.log(val);
              setCellphone(val);
            }}
            placeholder="请输入您的手机号"
          />
        </View>
        <View style={{ flexDirection: "row", display: "flex" }}>
          <AtInput
            className="home-input"
            name="password"
            title="密 码"
            type="password"
            onChange={(val: string) => {
              //console.log(val);
              setPassword(val);
            }}
            placeholder="请输入您的密码"
          />
        </View>
      </View>
      <View style="display:flex; flex-direction:row">
        <Button
          className="home-button preview-confirm-button"
          onClick={doLogin}
          disabled={loging}
        >
          {loging ? "登录中..." : "登录"}
        </Button>
        <Button
          className="home-button preview-confirm-button"
          onClick={() => {
            setLoging(false);
            Taro.navigateBack();
          }}
          disabled={loging}
        >
          返回
        </Button>
      </View>
      <Text className="caption">
        本功能只面向配送中心工作人员，请输入您的注册手机号及密码进行登录。
      </Text>
      <ArsTabBar current={2} />
    </View>
  );
}
