import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { InfoCardProps } from "../types/ars";
export default function InfoCard(props: InfoCardProps) {
  return (
    <View style="margin-top:3rem; margin-left:1.5rem; margin-right:1.5rem;margin-bottom:4.5rem;">
      <Text style="font-size:1.6rem; font-weight: bold; color:#666;">
        {props.title}
      </Text>
      <View style="border:solid 1px #ffa3b2; padding:1.5rem; border-radius: 10px; margin-top:1rem; margin-left:1.2rem; margin-right:1.2rem;">
        <Text style="display:block; text-align:justify; font-size:1.2rem; margin-top:1.2rem">
          {props.message}
        </Text>
        <Text style="display:block; text-align:justify; font-size:1rem; margin-top:3rem; margin-bottom:3rem;">
          {props.extMessage}
        </Text>
        <AtButton
          className="home-button"
          formType="reset"
          onClick={() => {
            props.backFunc();
          }}
        >
          返回
        </AtButton>
      </View>
    </View>
  );
}
