import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Picker, Button } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import "./index.scss";
import NavBar from "../../components/navbar";
import ArsTabBar from "../../components/tabbar";

export default function UserInfo() {
  const [curAvatar, setAvatar] = useState("/assets/img/user.png");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("注册司机");
  const [cellphone, setCellphone] = useState("13823803380");
  const [plateNum, setPlateNum] = useState("京A-876543");
  const [truckType, setTruckType] = useState(1);
  const [init, setInit] = useState(true);
  const userAuth: boolean = Taro.getStorageSync("userAuth");

  console.log("UserInfo:", this);

  function setUserInfo(userInfo) {
    setAvatar(userInfo.avatarUrl);
    setUserName(userInfo.nickName);
  }

  function onGotUserInfo(res) {
    //const {isWx, isBd, isTt} = this.state;
    console.log("user info got return:", res);
    const isWx = true;
    Taro.setStorage({ key: "userAuth", data: true });
    if (isWx) {
      Taro.getUserInfo().then((ret) => {
        if (isWx) {
          Taro.setStorage({ key: "userName", data: ret.userInfo.nickName });
          Taro.setStorage({ key: "avatar", data: ret.userInfo.avatarUrl });
        }
        setUserInfo(ret.userInfo);
      });
    }
  }
  if (init) {
    setInit(false);
    console.log(this.$router.params);

    if (this.$router.params) {
      setUserInfo(this.$router.params);
    }
  }

  return (
    <View className="index">
      <NavBar
        handleClick={() => {
          console.log("click", this.state);
        }}
      />
      <View className="user-info-span">
        <View className="user-avatar">
          <AtAvatar image={curAvatar} size="normal" />
        </View>
        <View className="user-info">
          {!userAuth ? (
            <View className="user-detail">
              <View className="user-detail-1">
                {userName}（{userType}）
              </View>
              <View className="user-detail-2">
                {plateNum}（手机：{cellphone}）
              </View>
            </View>
          ) : (
            <Button
              openType="getUserInfo"
              onGetUserInfo={onGotUserInfo}
              className="login-button"
            >
              登录/注册
            </Button>
          )}
        </View>
      </View>
      <ArsTabBar current={2} />
    </View>
  );
}
