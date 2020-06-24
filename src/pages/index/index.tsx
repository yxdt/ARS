import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui";
import "./index.scss";

import NavBar from "../../components/navbar";
import ArsTabBar from "../../components/tabbar";
import { scanBarcode } from "../../controllers/camera";
import { getDriverLocation } from "../../controllers/users";

export default function Index() {
  //const [manual, setManual] = useState(true);
  const [waybillNum, setWaybillNum] = useState("");
  const [rdcNum, setRdcNum] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [isScan, setIsScan] = useState(false);

  //console.log("$router.params:", props, this.$router);

  if (this.$router.params.wbno) {
    setIsScan(true);
    setWaybillNum(this.$router.params.wbno);
    //setManual(true);
  }

  function openSheet() {
    //if (!manual) {
    //  setManual(true);
    //} else {
    getDriverLocation(waybillNum, (res) => {
      console.log("driver loc:", res);
    });
    Taro.navigateTo({
      url:
        "/pages/sheet/index?wbno=" +
        waybillNum +
        //"&rdc=" +
        rdcNum +
        "&cell=" +
        cellphone,
    });
    //}
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
              title="*装车号"
              type="text"
              value={waybillNum}
              onChange={(val: string) => {
                //console.log(val);
                setWaybillNum(val);
              }}
              placeholder="扫码或手工输入装车号及序列号"
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
          <Text>您可以扫描往来表上的二维码，或输入装车序列号及验证码。</Text>
        </View>
      </View>

      <ArsTabBar current={0} />
    </View>
  );
}
