import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui";
import "./index.scss";

import NavBar from "../../components/navbar";
import ArsTabBar from "../../components/tabbar";
import { scanBarcode } from "../../controllers/camera";
import { Fragment } from "react";
export default function Index(props) {
  const [manual, setManual] = useState(true);
  const [waybillNum, setWaybillNum] = useState("");
  const [rdcNum, setRdcNum] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [isScan, setIsScan] = useState(false);

  //console.log("$router.params:", props, this.$router);

  if (this.$router.params.wbno) {
    setIsScan(true);
    setWaybillNum(this.$router.params.wbno);
    setManual(true);
  }
  function handleClick() {
    //console.log("you clicked me.");
    Taro.navigateTo({
      url: "/pages/sheet/index",
    });
  }
  function openManual() {
    if (!manual) {
      setManual(true);
    } else {
      Taro.navigateTo({
        url:
          "/pages/sheet/index?wbno=" +
          waybillNum +
          "&rdc=" +
          rdcNum +
          "&cell=" +
          cellphone,
      });
    }
  }

  return (
    <View className="index">
      <NavBar handleClick={this.handleClick} style="font-size:0.8rem" />
      <View className="home-title-span">
        <Text className="home-title">
          欢迎使用 <Text className="home-title-hilite">TIMS</Text>\n
          <Text className="home-title-sub">配送信息管理系统</Text>
        </Text>
      </View>
      <View className="home-button-span">
        <View>
          <View style={{ flexDirection: "row", display: "flex" }}>
            <AtInput
              className="home-input"
              name="waybillNum"
              title="*运单号"
              type="text"
              value={waybillNum}
              onChange={(val: string) => {
                console.log(val);
                setWaybillNum(val);
              }}
              placeholder="扫码或手工输入运单编号"
            />
            <Button onClick={scanBarcode} className="cam-button">
              <AtIcon
                prefixClass="fa"
                value="qrcode"
                size="26"
                color="#ffffff"
              ></AtIcon>
            </Button>
          </View>
          <View style={{ flexDirection: "row", display: "flex" }}>
            <View style={{ flex: 3 }}>
              <AtInput
                className="home-input-semi-left"
                name="rdcNum"
                title="*接货号"
                type="text"
                value={rdcNum}
                customStyle={{ flex: 3, display: "flex" }}
                onChange={(val: string) => {
                  console.log(val);
                  setRdcNum(val);
                }}
                placeholder="4位序号"
              />
            </View>
            <View style={{ flex: 4 }}>
              <AtInput
                customStyle={{ marginLeft: "0.2rem" }}
                className="home-input-semi-right"
                name="cellphone"
                title="手机"
                type="text"
                value={cellphone}
                onChange={(val: string) => {
                  console.log(val);
                  setCellphone(val);
                }}
                placeholder="您的手机号码"
              />
            </View>
          </View>
        </View>
        <Button className="home-button" onClick={openManual}>
          <div>
            <AtIcon
              prefixClass="fa"
              value="search"
              size="20"
              color="#ffffff"
              customStyle="margin-right:10px;"
            ></AtIcon>
            获取运单信息
          </div>
        </Button>
        <View className="home-prompt-span">
          <Text>您可以扫码输入运单号，输入接货号后查询运单</Text>
        </View>
      </View>

      <ArsTabBar current={0} />
    </View>
  );
}
