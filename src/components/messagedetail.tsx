import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { MessageDetailProps } from "../types/ars";
export default function MessageDetail(props: MessageDetailProps) {
  return (
    <View style=" padding:0.5rem; margin-top:0.1rem; margin-left:1.2rem; margin-right:1.2rem;">
      <Text style="display:block; text-align:justify; font-size:0.8rem; line-height:1.5rem; margin-bottom:2rem">
        运单号：{props.ordNo} ， 接货处：{props.cdc}
      </Text>
      <Text style="display:block; text-align:justify; font-size:1rem; ">
        {props.content}
      </Text>
      <Text style="display:block; text-align:right; font-size:1rem; margin-top:2rem; margin-bottom:1rem;">
        {props.sentTime}
      </Text>
      <AtButton
        className="home-button"
        formType="reset"
        onClick={() => {
          props.markFunc(props.msgId);
        }}
      >
        标记已读
      </AtButton>
    </View>
  );
}
