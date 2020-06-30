import Taro from "@tarojs/taro";

import { AtActivityIndicator } from "taro-ui";

export default function Loading() {
  //return <div />;
  return (
    <AtActivityIndicator
      mode="center"
      size={60}
      color="#a50034"
      content="数据加载中..."
    />
  );
}
