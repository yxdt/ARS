import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui";
import "./index.scss";

import NavBar from "../../components/navbar";
import ArsTabBar from "../../components/tabbar";
import { scanBarcode } from "../../controllers/camera";

export default function Index() {
  const [waybillNum, setWaybillNum] = useState("");
  const [prompt, setPrompt] = useState(
    "您可以扫描往来表上的二维码，或输入装车序列号及验证码。"
  );
  if (this.$router.params.wbno) {
    setWaybillNum(this.$router.params.wbno);
  } else {
    let curwbno = Taro.getStorageSync("waybill");
    const wbnodate: number =
      Taro.getStorageSync("waybilldate") || new Date().valueOf();
    const today = new Date();
    if (wbnodate && today.valueOf() - wbnodate > 24 * 60 * 60 * 1000) {
      //本地运单信息超过一天自动清除
      curwbno = "";
      Taro.removeStorage({ key: "waybill" });
      Taro.removeStorage({ key: "waybilldate" });
    }
    setWaybillNum(curwbno);
  }

  function gotBarcode(bcVal) {
    const vals = bcVal.result.split("/");
    Taro.setStorage({ key: "waybill", data: vals[vals.length - 1] });
    Taro.setStorage({
      key: "waybilldate",
      data: new Date().valueOf(),
    });
    Taro.navigateTo({
      url: "/pages/sheet/index?wbno=" + vals[vals.length - 1],
    });
  }

  function openSheet() {
    if (waybillNum && waybillNum.length > 0) {
      Taro.navigateTo({
        url: "/pages/sheet/index?wbno=" + waybillNum,
      });
    } else {
      setPrompt("请先输入运单号！");
    }
  }

  return (
    <View className="index">
      <NavBar />
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
              title="装车号"
              type="text"
              value={waybillNum}
              onChange={(val: string) => {
                setWaybillNum(val);
                Taro.setStorage({ key: "waybill", data: val });
                Taro.setStorage({
                  key: "waybilldate",
                  data: new Date().valueOf(),
                });
              }}
              placeholder="扫码或手工输入装车号及验证码"
              placeholderStyle="font-size:0.8rem;"
            />
            <Button
              onClick={() => {
                scanBarcode(gotBarcode);
              }}
              className="cam-button"
            >
              <AtIcon
                prefixClass="fa"
                value="qrcode"
                size="26"
                color="#ffffff"
              ></AtIcon>
            </Button>
          </View>
        </View>
        <Button className="home-button" onClick={openSheet}>
          <div>
            <AtIcon
              prefixClass="fa"
              value="search"
              size="20"
              color="#ffffff"
              customStyle="margin-right:10px;"
            ></AtIcon>
            获取交货单信息
          </div>
        </Button>
        <View className="home-prompt-span">
          <Text>{prompt}</Text>
        </View>
      </View>
      <ArsTabBar current={0} />
    </View>
  );
}
Index.config = {
  navigationBarTitleText: "TIMS-首页",
};
