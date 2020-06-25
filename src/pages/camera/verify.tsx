import Taro, { useState } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import {
  AtInput,
  AtMessage,
  AtList,
  AtListItem,
  AtRadio,
  AtButton,
} from "taro-ui";
import "./camera.scss";

import ArsTabBar from "../../components/tabbar";
import { SERVER_URL } from "../../controllers/rest";

export default function Verify() {
  const [selPic, setSelPic] = useState("");
  const [preview, setPreview] = useState(false);

  function handleClick(val) {
    console.log("handleClick:", val);
    setSelPic(val);
    setPreview(true);
  }

  return (
    <View className="index">
      <AtMessage />
      <Text className="form-title">待审核回执列表</Text>
      {preview ? (
        <View className="preview-span">
          <Image
            mode="aspectFit"
            src={selPic}
            className="preview-img"
            onClick={() => {
              //do preview
              Taro.previewImage({
                urls: [selPic],
                success: () => {
                  console.log("success");
                },
                fail: () => {
                  console.log("fail");
                },
              });
            }}
          ></Image>
          <View style="display:flex; flex-direction:row">
            <Button
              className="preview-confirm-button"
              onClick={() => {
                setPreview(false);
                console.log("confirmed!");
              }}
            >
              通过
            </Button>
            <Button
              className="preview-confirm-button"
              onClick={() => {
                setPreview(false);
                console.log("rejected!");
              }}
            >
              退回
            </Button>
          </View>
        </View>
      ) : (
        <View className="sheet-info-span">
          <AtList>
            <AtListItem
              title="BJ02003033"
              note="0001(北京收货中心)"
              extraText="第1页"
              arrow="right"
              thumb={SERVER_URL + "/r_2_239393930.png"}
              key={SERVER_URL + "/r_2_239393930.png" + "_1"}
              onClick={(val) => {
                handleClick(SERVER_URL + "/r_2_239393930.png");
              }}
            ></AtListItem>
            <AtListItem
              key={SERVER_URL + "/r_2_239393930.png" + "_2"}
              title="BJ0203303033"
              note="0101(天津收货中心)"
              extraText="第2页"
              arrow="right"
              thumb={SERVER_URL + "/r_2_239393930.png"}
              onClick={(val) => {
                handleClick(SERVER_URL + "/r_2_239393930.png");
              }}
            ></AtListItem>
            <AtListItem
              key={SERVER_URL + "/r_2_239393930.png" + "_3"}
              title="BJ02003033"
              note="0001(北京收货中心)"
              extraText="第3页"
              arrow="right"
              thumb={SERVER_URL + "/r_2_239393930.png"}
              onClick={(val) => {
                handleClick(SERVER_URL + "/r_2_239393930.png");
              }}
            ></AtListItem>
          </AtList>
        </View>
      )}
      <ArsTabBar current={2} />
    </View>
  );
}
