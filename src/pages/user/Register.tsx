import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtList, AtListItem } from "taro-ui";
import "./index.scss";
import { getUserInfo, getWxOpenId } from "../../controllers/users";
import { WxUserInfo } from "src/types/ars";
import userpng from "../../assets/img/user.png";
// export const TruckTypes: string[] = [
//   "微型面包车",
//   "面包车",
//   "厢式货车2.5吨",
//   "厢式货车5吨",
//   "厢式货车10吨",
// ];

export default function Register() {
  console.log("");
  let userInfo: WxUserInfo = {
    nickName: "匿名用户",
    avatarUrl: userpng,
    gender: 1,
    city: "Beijing",
    province: "Beijing",
    country: "China",
    language: "zh-CN",
  };

  const [userName, setUserName] = useState("测试员");
  const [cellphone, setCellphone] = useState("13901390139");
  const [plateNum, setPlateNum] = useState("北京配送中心");
  const [avatar, setAvatar] = useState("");

  getUserInfo().then((res: WxUserInfo) => {
    console.log("Register.getUserInfo.res:", res);
    //userInfo = res || {};
    if (res) {
      userInfo = res;
      Taro.setStorage({ key: "nickName", data: res.nickName });
      Taro.setStorage({ key: "avatar", data: res.avatarUrl });
    }
    console.log("userInfo:", userInfo);
    setUserName(userInfo.nickName || "匿名用户");
    setAvatar(userInfo.avatarUrl || userpng);
  });

  getWxOpenId((openid) => {
    console.log("Register.getWxOpenId.openId:", openid);
  });

  function handleChange(target: string, newVal) {
    console.log("handleChange:", target, newVal);
    switch (target) {
      case "userName":
        setUserName(newVal);
        console.log("userName:", userName);
        break;
      case "cellphone":
        setCellphone(newVal);
        break;
      case "plateNum":
        setPlateNum(newVal);
        break;
      case "truckType":
        setTruckType(parseInt(newVal.detail.value));
        break;
      default:
        console.log("something has been changed:", target, newVal);
        break;
    }
  }

  function onFormSubmit(event) {
    console.log("submit:", event);
    console.log("userName:", userName);
    console.log("cellphone:", cellphone);
    console.log("plateNum:", plateNum);
    //console.log("truckType:", truckType, TruckTypes[truckType]);
  }

  return (
    <View className="index">
      <View className="user-reg-span">
        <Text className="form-title">您的相关信息</Text>
        <Text className="form-comment">
          本功能只对LG配送中心员工开放，用户登录后可以查看相关信息。
        </Text>
        <AtForm className="form-userinfo" onSubmit={onFormSubmit.bind(this)}>
          <AtInput
            className="input-text"
            name="userName"
            title="姓名"
            type="text"
            placeholder="请输入您的姓名"
            value={userName}
            onChange={handleChange.bind(this, "userName")}
          />
          <AtInput
            className="input-text"
            name="cellphone"
            title="手机"
            type="text"
            placeholder="请输入您的手机号码"
            value={cellphone}
            onChange={handleChange.bind(this, "cellphone")}
          />
          <AtInput
            className="input-text"
            name="platenumber"
            title="配送中心"
            type="text"
            placeholder="请输入您的车牌号"
            value={plateNum}
            onChange={handleChange.bind(this, "plateNum")}
          />
          <AtButton className="home-button" formType="submit">
            提交
          </AtButton>
          <AtButton
            className="home-button"
            formType="reset"
            onClick={() => {
              Taro.navigateBack();
            }}
          >
            返回
          </AtButton>
        </AtForm>
      </View>
    </View>
  );
}
