import Taro from "@tarojs/taro";
import { Text, CoverView } from "@tarojs/components";
import { AtButton, AtInput } from "taro-ui";

import "./arriveConfirm.scss";

export default function ArriveConfirm() {
  return (
    <CoverView className="toast-box">
      <CoverView className="toastbg"></CoverView>
      <CoverView className="showToast">
        <CoverView className="toast-title">
          <Text>确认到达</Text>
        </CoverView>
        <CoverView className="toast-main">
          <CoverView className="toast-input">
            <AtInput
              type="number"
              name="arsCode"
              placeholder="四位接货码"
              z-index={1000}
              onChange={(val) => {
                console.log("changed:", val);
              }}
            ></AtInput>
          </CoverView>
          <CoverView className="toast-input">
            <AtInput
              type="number"
              name="cellphone"
              placeholder="手机号"
              z-index={1000}
              onChange={(val) => {
                console.log("changed:", val);
              }}
            ></AtInput>
          </CoverView>
        </CoverView>
        <CoverView className="toast-AtButton">
          <CoverView className="AtButton1">
            <AtButton z-index={1000}>取消</AtButton>
          </CoverView>
          <CoverView className="AtButton2">
            <AtButton>确定</AtButton>
          </CoverView>
        </CoverView>
      </CoverView>
    </CoverView>
  );
}
