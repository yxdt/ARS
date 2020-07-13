import Taro from '@tarojs/taro';
import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtMessage, AtList, AtListItem, AtModal, AtModalHeader, AtModalContent, AtInput, AtModalAction } from 'taro-ui';
import './camera.scss';

import ArsTabBar from '../../components/tabbar';
import { SERVER_URL } from '../../controllers/rest';

import { queryUnVerifiedPhotos, approvePicture, rejectPicture } from '../../controllers/camera';
import { photoData, uvPhotoData } from '../../types/ars';

export default function Verify() {
  const [selPic, setSelPic] = useState('');
  const [preview, setPreview] = useState(false);
  const [days, setDays] = useState(1);

  const [photos, setPhotos] = useState<Array<uvPhotoData> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [remark, setRemark] = useState('');
  const [curWbno, setCurWbno] = useState('');
  const [curImgid, setCurImgid] = useState('');
  const [curPhoto, setCurPhoto] = useState<uvPhotoData>({
    url: '',
    ordNo: '',
    shpToCd: '',
    cdcName: '',
    state: 0,
  });

  if (!loaded) {
    queryUnVerifiedPhotos(Taro.getStorageSync('userOpenId'))
      .then((res) => {
        if (res.result === 'success' && res.photos) {
          setPhotos(res.photos);
        }
      })
      .finally(() => {
        setLoaded(true);
      });
  }

  function handleClick(url) {
    console.log('handleClick:', url);
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
                  console.log('success');
                },
                fail: () => {
                  console.log('fail');
                },
              });
            }}></Image>
          <View style="display:flex; flex-direction:row">
            <Button
              className="preview-confirm-button"
              onClick={() => {
                approvePicture(curWbno, curImgid, Taro.getStorageSync('userOpenId'))
                  .then((ret) => {
                    if (ret.result === 'approve') {
                      curPhoto.state = 1;
                      Taro.atMessage({
                        message: '照片审核通过',
                        type: 'success',
                      });
                    } else {
                      Taro.atMessage({
                        message: '照片审核操作失败，请重试',
                        type: 'error',
                      });
                    }
                    console.log('approvePicture.result:', ret);
                  })
                  .catch(() => {
                    Taro.atMessage({
                      message: '照片审核操作失败，请重试',
                      type: 'error',
                    });
                  })
                  .finally(() => {
                    setPreview(false);
                    console.log('confirmed!');
                  });
              }}>
              通过
            </Button>
            <Button
              className="preview-confirm-button"
              onClick={() => {
                console.log('verify.confirmreject:', confirmReject);
                setConfirmReject(true);
              }}>
              退回
            </Button>
          </View>
          {confirmReject ? (
            <AtModal isOpened={confirmReject}>
              <AtModalHeader>退回操作</AtModalHeader>
              <AtModalContent>
                <View className="toast-main">
                  <View className="confirm-info">请给出退回原因</View>
                  <AtInput
                    key={'reject-reason'}
                    type="text"
                    className="modal-input"
                    title="原因："
                    value={remark}
                    name="remark"
                    placeholder="写出退回原因"
                    onChange={(theval) => {
                      console.log('remark:', theval);
                      setRemark(theval);
                    }}></AtInput>
                </View>
              </AtModalContent>
              <AtModalAction>
                <Button
                  className="home-input-semi-left"
                  onClick={() => {
                    //Taro.navigateBack();
                    setConfirmReject(false);
                  }}>
                  取消
                </Button>
                <Button
                  className="home-input-semi-right"
                  onClick={() => {
                    rejectPicture(curWbno, curImgid, remark, Taro.getStorageSync('userOpenId'))
                      .then((ret) => {
                        console.log('rejectPicture.result:', ret);
                        if (ret.result === 'reject') {
                          curPhoto.state = 2;
                          Taro.atMessage({
                            message: '照片审核退回成功',
                            type: 'success',
                          });
                        } else {
                          Taro.atMessage({
                            message: '照片审核操作失败，请重试',
                            type: 'error',
                          });
                        }
                      })
                      .catch(() => {
                        Taro.atMessage({
                          message: '照片审核操作失败，请重试',
                          type: 'error',
                        });
                      })
                      .finally(() => {
                        setPreview(false);
                        console.log('rejected!');
                      });
                  }}>
                  确认退回
                </Button>
              </AtModalAction>
            </AtModal>
          ) : null}
        </View>
      ) : (
        <View className="sheet-info-span">
          <AtList>
            {photos && photos.length > 0 ? (
              photos
                .filter((item) => item.state === 0)
                .map((item, index) => {
                  return (
                    <AtListItem
                      title={item.ordNo}
                      note={item.shpToCd + '(' + item.cdcName + ')'}
                      extraText={'第' + index + '项'}
                      arrow="right"
                      thumb={SERVER_URL + item.url}
                      key={SERVER_URL + item.url + '_1'}
                      onClick={(val) => {
                        setCurImgid(item.url);
                        setCurWbno(item.ordNo + item.shpToCd);
                        setCurPhoto(item);
                        handleClick(SERVER_URL + item.url);
                      }}></AtListItem>
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
