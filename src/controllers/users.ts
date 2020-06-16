import Taro from "@tarojs/taro";

function getDriverLocation(resolve) {
  Taro.getLocation({
    type: "wgs84",
    success: (res) => {
      resolve(res);
    },
  });
}

export { getDriverLocation };
