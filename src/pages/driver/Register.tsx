import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtList, AtListItem } from "taro-ui";
import "./index.scss";
import NavBar from "../../components/navbar";
import User from "src/models/user";

export const TruckTypes: string[] = [
  "微型面包车",
  "面包车",
  "厢式货车2.5吨",
  "厢式货车5吨",
  "厢式货车10吨",
];

export interface DriverStates {
  //driver: User;
  userName: string;
  cellphone: string;
  plateNum: string;
  truckType: number;
}

export default function Register(props) {
  const [userName, setUserName] = useState("1");
  const [cellphone, setCellphone] = useState("2");
  const [plateNum, setPlateNum] = useState("3");
  const [truckType, setTruckType] = useState(1);

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
    console.log("truckType:", truckType, TruckTypes[truckType]);
  }

  return (
    <View className="index">
      <NavBar
        handleClick={() => {
          console.log("click", this.state);
        }}
      />
      <Image
        mode="scaleToFill"
        style="top:0;left:0; width:100%; height: 100%; position:fixed; background-size: 100%, 100%; z-index: -1"
        src="../../assets/img/back.png"
      ></Image>
      <View className="user-info-span">
        <Text className="form-title">成为注册司机</Text>
        <Text className="form-caption">请输入您的信息</Text>
        <Text className="form-comment">
          本系统只对LG注册司机开放，
          请输入您的个人信息提交管理员审核。审核通过后，您就可以访问相关功能。
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
            title="车牌号"
            type="text"
            placeholder="请输入您的车牌号"
            value={plateNum}
            onChange={handleChange.bind(this, "plateNum")}
          />
          <Picker
            className="picker"
            mode="selector"
            range={TruckTypes}
            value={truckType}
            onChange={handleChange.bind(this, "truckType")}
          >
            <AtList>
              <AtListItem title="货车类型" />
            </AtList>
          </Picker>
          <AtButton className="home-button" formType="submit">
            提交
          </AtButton>
          <AtButton className="home-button" formType="reset">
            重置
          </AtButton>
        </AtForm>
      </View>
    </View>
  );
}
