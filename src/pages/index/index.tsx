import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtNavBar, AtIcon } from 'taro-ui';
import './index.scss';

import NavBar from '../../components/navbar';
import ArsTabBar from '../../components/tabbar';
import { scanBarcode } from '../../controllers/camera';
export default function Index() {
  const config: Config = {
    navigationBarTitleText: '首页',
  };

  function handleClick() {
    console.log('you clicked me.');
    Taro.navigateTo({
      url: '/pages/sheet/index',
    });
  }
  function openManual() {
    Taro.navigateTo({
      url: '/pages/driver/Register',
    });
  }
  return (
    <View className="index">
      <NavBar handleClick={this.handleClick} />
      <Image
        mode="scaleToFill"
        style="width:100%; height: 100%; left:0;top:0; position:fixed; background-size: 100%, 100%; z-index: -1"
        src="../../assets/img/back.png"></Image>
      <View className="home-title-span">
        <Text className="home-title">
          欢迎使用 <Text className="home-title-hilite">A.R.S.</Text>\n 司机专属版
        </Text>
      </View>
      <View className="home-button-span">
        <Button onClick={scanBarcode} className="home-button">
          <AtIcon prefixClass="fa" value="camera" size="20" color="#ffffff" customStyle="margin-right:10px;"></AtIcon>
          扫码输入交货单
        </Button>
        <Button className="home-button" onClick={openManual}>
          <AtIcon prefixClass="fa" value="pencil" size="20" color="#ffffff" customStyle="margin-right:10px;"></AtIcon>
          手工录入交货单
        </Button>
      </View>
      <View className="home-prompt-span">
        <Text>请点击上面的按钮进行交货单确认操作</Text>
      </View>
      <ArsTabBar current={0} />
    </View>
  );
}
