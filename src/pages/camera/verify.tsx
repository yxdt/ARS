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
import { uvPhotoData } from "../../types/ars";

export default function Verify() {
  const [selPic, setSelPic] = useState("");
  const [preview, setPreview] = useState(false);
  //const [days, setDays] = useState(1);

  const [photos, setPhotos] = useState<Array<uvPhotoData>>([]);
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
        if (res.result === "success" && res.photos) {
          setPhotos(res.photos);
          setLoaded(true);
        }
      })
      .catch((e) => {
        console.warn("error unverfiedPhotos:", e);
        setLoaded(true);
      });
  }

  function handleClick(url) {
    //consolelog("handleClick:", url);
    setSelPic(url);
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
                  //consolelog("success");
                },
                fail: () => {
                  //consolelog("fail");
                },
              });
            }}
          ></Image>
          <View style="display:flex; flex-direction:row">
            <Button
              className="preview-confirm-button"
              onClick={() => {
                approvePicture(
                  curWbno,
                  curImgid,
                  Taro.getStorageSync("userOpenId")
                )
                  .then((ret) => {
                    if (ret.result === "success") {
                      curPhoto.status = 1;
                      Taro.atMessage({
                        message: "照片审核通过",
                        type: "success",
                      });
                    } else {
                      Taro.atMessage({
                        message: "照片审核操作失败，请重试",
                        type: "error",
                      });
                    }
                    setPreview(false);
                  })
                  .catch(() => {
                    Taro.atMessage({
                      message: "照片审核操作失败，请重试",
                      type: "error",
                    });
                    setPreview(false);
                  });
              }}
            >
              通过
            </Button>
            <Button
              className="preview-confirm-button"
              onClick={() => {
                setConfirmReject(true);
              }}
            >
              驳回
            </Button>
          </View>
          <AtModal isOpened={confirmReject}>
            <AtModalHeader>驳回操作</AtModalHeader>
            <AtModalContent>
              <View className="toast-main">
                <View className="confirm-info">请给出驳回原因</View>
                <AtInput
                  key={"reject-reason"}
                  type="text"
                  className="modal-input"
                  title="原因："
                  value={remark}
                  name="remark"
                  placeholder=""
                  onChange={(theval) => {
                    //consolelog("remark:", theval);
                    setRemark(theval);
                  }}
                ></AtInput>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button
                className="home-input-semi-left"
                onClick={() => {
                  //Taro.navigateBack();
                  setConfirmReject(false);
                }}
              >
                取消
              </Button>
              <Button
                className="home-input-semi-right"
                onClick={() => {
                  rejectPicture(
                    curWbno,
                    curImgid,
                    remark,
                    Taro.getStorageSync("userOpenId")
                  )
                    .then((ret) => {
                      //consolelog("rejectPicture.result:", ret);
                      if (ret.result === "success") {
                        curPhoto.status = 0;
                        Taro.atMessage({
                          message: "照片审核驳回成功",
                          type: "success",
                        });
                      } else {
                        Taro.atMessage({
                          message: "照片审核操作失败，请重试",
                          type: "error",
                        });
                      }
                      setPreview(false);
                    })
                    .catch(() => {
                      Taro.atMessage({
                        message: "照片审核操作失败，请重试",
                        type: "error",
                      });
                      setPreview(false);
                    });
                }}
              >
                确认驳回
              </Button>
            </AtModalAction>
          </AtModal>
        </View>
      ) : (
        <View className="sheet-info-span">
          <AtList>
            {photos && photos.length > 0 ? (
              photos
                .filter((item) => !item.status && item.status !== 0)
                .map((item, index) => {
                  return (
                    <AtListItem
                      title={item.carAllocNo + item.shptoSeq}
                      note={item.createTime}
                      extraText={"第" + (1 + index) + "项"}
                      arrow="right"
                      thumb={SERVER_URL + item.filePath}
                      key={SERVER_URL + item.filePath + "_1"}
                      onClick={(val) => {
                        setCurImgid(item.id);
                        setCurWbno(item.carAllocNo + item.shptoSeq);
                        setCurPhoto(item);
                        handleClick(SERVER_URL + item.filePath);
                      }}
                    ></AtListItem>
                  );
                })
            ) : (
              <Text>没有待审核回执</Text>
            )}
          </AtList>
        </View>
      )}
      <ArsTabBar current={2} />
    </View>
  );
}
