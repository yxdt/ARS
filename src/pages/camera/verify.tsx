import Taro, { useState } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import {
  AtMessage,
  AtList,
  AtListItem,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtInput,
  AtModalAction,
} from "taro-ui";
import "./camera.scss";

import ArsTabBar from "../../components/tabbar";
import { SERVER_URL } from "../../controllers/rest";

import {
  queryUnVerifiedPhotos,
  approvePicture,
  rejectPicture,
} from "../../controllers/camera";
import { uvPhotoData, Waybill } from "../../types/ars";

export default function Verify() {
  const [selPic, setSelPic] = useState("");
  const [preview, setPreview] = useState(false);
  //const [days, setDays] = useState(1);

  const [photos, setPhotos] = useState<Array<Waybill> | null>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [remark, setRemark] = useState("");
  const [curWbno, setCurWbno] = useState("");
  const [curImgid, setCurImgid] = useState("");
  const [curPhoto, setCurPhoto] = useState<uvPhotoData>({
    carAllocNo: "",
    createBy: "",
    createTime: "",
    delFlag: 0,
    fileName: "",
    filePath: "",
    id: "",
    openId: "",
    remark: "",
    shptoSeq: "",
    status: 0,
    updateBy: "",
    updateTime: "",
  });
  const isSuper = Taro.getStorageSync("roleName").toString().length > 0;

  if (!loaded && isSuper) {
    queryUnVerifiedPhotos(Taro.getStorageSync("userOpenId"))
      .then((res) => {
        console.log("queryUnVerifiedPhotos.res:", res);
        if (res.result === "success" && res.waybills) {
          setPhotos(res.waybills);
          setLoaded(true);
        }
      })
      .catch((e) => {
        console.warn("error unverfiedPhotos:", e);
        setLoaded(true);
      });
  }

  return (
    <View className="index">
      <AtMessage />
      <Text className="form-title">待审核回执列表</Text>

      <View className="sheet-info-span">
        <AtList>
          {photos && photos.length > 0 ? (
            photos.map((item) => {
              return (
                <AtListItem
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/sheet/index?wbno=" + item.wbNum,
                    });
                  }}
                  title={item.wbNum}
                  note={
                    "[" +
                    item.pgYmd +
                    "-" +
                    item.shiptoCode +
                    "]" +
                    item.shiptoName
                  }
                  extraText={item.statusCaption}
                  arrow="right"
                  key={item.wbNum + item.status}
                />
              );
            })
          ) : (
            <Text>没有待审核回执</Text>
          )}
        </AtList>
      </View>

      <ArsTabBar current={2} />
    </View>
  );
}
