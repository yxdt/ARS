import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { MessageDetailProps } from "../types/ars";
export default function MessageDetail(props: MessageDetailProps) {
  return (
    <View style=" padding:0.5rem; margin-top:0.1rem; margin-left:1.2rem; margin-right:1.2rem;">
      <Text style="display:block; text-align:justify; font-size:1rem; ">
        {props.content}
      </Text>
      <Text style="display:block; text-align:right; font-size:1rem; margin-top:2rem; margin-bottom:1rem;">
        {props.sentTime && props.sentTime !== "null" ? props.sentTime : ""}
      </Text>
      {props.isRead ? (
        <AtButton
          className="home-button"
          onClick={() => {
            props.closeMe();
          }}
        >
          返回
        </AtButton>
      ) : (
        <AtButton
          className="home-button"
          formType="reset"
          onClick={() => {
            props.markFunc(props.msgId);
          }}
        >
          隐藏本消息
        </AtButton>
      )}
    </View>
  );
}
