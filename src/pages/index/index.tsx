import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui";
import "./index.scss";

import NavBar from "../../components/navbar";
import ArsTabBar from "../../components/tabbar";
import { scanBarcode } from "../../controllers/camera";
import { Fragment } from "react";
export default function Index() {
  const [manual, setManual] = useState(false);
  const [waybillNum, setWaybillNum] = useState("");

  function handleClick() {
    console.log("you clicked me.");
    Taro.navigateTo({
      url: "/pages/sheet/index",
    });
  }
  function openManual() {
    if (!manual) {
      setManual(true);
    } else {
      Taro.navigateTo({
        url: "/pages/sheet/index?wbno=" + waybillNum,
      });
    }
  }

  return (
    <View className="index">
      <NavBar
        handleClick={this.handleClick}
        title="首页"
        style="font-size:0.8rem"
      />
      <Image
        mode="scaleToFill"
        style="width:100%; height: 100%; left:0;top:0; position:fixed; background-size: 100%, 100%; z-index: -1"
        src="../../assets/img/back.png"
      ></Image>
      <View className="home-title-span">
        <Text className="home-title">
          欢迎使用 <Text className="home-title-hilite">A.R.S.</Text>\n
          司机专属版
        </Text>
      </View>
      <View className="home-button-span">
        {manual ? (
          <AtInput
            className="home-input"
            name="waybillNum"
            title="运单编号"
            type="text"
            value={waybillNum}
            onChange={(val: string) => {
              console.log(val);
              setWaybillNum(val);
            }}
            placeholder="请输入运单编号"
          />
        ) : (
          <Button onClick={scanBarcode} className="home-button">
            <AtIcon
              prefixClass="fa"
              value="barcode"
              size="20"
              color="#ffffff"
              customStyle="margin-right:10px;"
            ></AtIcon>
            扫码输入交货单
          </Button>
        )}
        <Button className="home-button" onClick={openManual}>
          {manual ? (
            <div>确认</div>
          ) : (
            <div>
              <AtIcon
                prefixClass="fa"
                value="pencil"
                size="20"
                color="#ffffff"
                customStyle="margin-right:10px;"
              ></AtIcon>
              手工录入交货单
            </div>
          )}
        </Button>
      </View>
      <View className="home-prompt-span">
        <Text>请点击上面的按钮进行交货单确认操作</Text>
      </View>
      <ArsTabBar current={0} />
    </View>
  );
}
