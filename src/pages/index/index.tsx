import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtInput, AtIcon, AtButton } from 'taro-ui';
import './index.scss';

import NavBar from '../../components/navbar';
import ArsTabBar from '../../components/tabbar';
import { scanBarcode } from '../../controllers/camera';
//import { getWxOpenId } from '../../controllers/users';
const current = getCurrentInstance();
export default function Index() {
  //const [manual, setManual] = useState(true);
  const [waybillNum, setWaybillNum] = useState(Taro.getStorageSync('waybill'));
  //const [rdcNum, setRdcNum] = useState('');
  //const [cellphone, setCellphone] = useState('');
  //const [isScan, setIsScan] = useState(false);
  //const [loggedIn, setLoggedIn] = useState(false);

  //const current = getCurrentInstance();

  console.log('current.router.params:', current.router.params);

  if (current.router.params.wbno && waybillNum !== current.router.params.wbno) {
    //setIsScan(true);
    setWaybillNum(current.router.params.wbno);
    //setManual(true);
  } else {
    let curwbno = Taro.getStorageSync('waybill');
    const wbnodate: number = Taro.getStorageSync('waybilldate') || new Date().valueOf();

    const today = new Date();
    console.log('localcurwbno, wbnodate:', curwbno, wbnodate);
    if (wbnodate && today.valueOf() - wbnodate > 24 * 60 * 60 * 1000) {
      //本地运单信息超过一天自动清除
      curwbno = '';
      Taro.removeStorageSync('waybill');
      Taro.removeStorageSync('waybilldate');
    }
    if (curwbno !== waybillNum) {
      setWaybillNum(curwbno);
    }
  }

  function gotBarcode(bcVal: string) {
    //bcVal = waybillNum + rdcNum
    console.log('index.index.gotBarcode:', bcVal);
    Taro.navigateTo({
      url: '/pages/sheet/index?wbno=' + bcVal,
    });
  }

  function openSheet() {
    //if (!manual) {
    //  setManual(true);
    //} else {
    //console.log("openSheet.waybillNum:", waybillNum);

    Taro.navigateTo({
      url: '/pages/sheet/index?wbno=' + waybillNum,
      //+
      //"&rdc=" +
      //rdcNum, //+
      //"&cell=" +
      //cellphone,
    });
    //}
  }

  return (
    <View className="index">
      <NavBar />
      <View className="home-title-span">
        <Text className="home-title">
          <Text style="flex:1">
            欢迎使用 <Text className="home-title-hilite">TIMS</Text>
          </Text>
          <Text className="home-title-sub" style="flex:1">
            配送信息管理系统
          </Text>
        </Text>
      </View>
      <View className="home-button-span">
        <View>
          <View style={{ flexDirection: 'row', display: 'flex' }}>
            <AtInput
              className="home-input"
              name="waybillNum"
              title="装车号"
              type="text"
              value={waybillNum}
              onChange={(val: string) => {
                //console.log("new wbNum:", val);
                setWaybillNum(val);
                Taro.setStorage({ key: 'waybill', data: val });
                Taro.setStorage({
                  key: 'waybilldate',
                  data: new Date().valueOf(),
                });
              }}
              placeholder="扫码或手工输入装车号及验证码"
              placeholderStyle="font-size:0.8rem;"
            />
            <AtButton
              onClick={() => {
                scanBarcode(gotBarcode);
              }}
              className="cam-button">
              <AtIcon prefixClass="fa" value="qrcode" size="26" color="#ffffff"></AtIcon>
            </AtButton>
          </View>
        </View>
        <AtButton className="home-button" onClick={openSheet}>
          <AtIcon prefixClass="fa" value="search" size="20" color="#ffffff" customStyle="margin-right:10px;"></AtIcon>
          获取交货单信息
        </AtButton>
        <View className="home-prompt-span">
          <Text>您可以扫描往来表上的二维码，或输入装车序列号及验证码。</Text>
        </View>
      </View>
      <ArsTabBar current={0} />
    </View>
  );
}
