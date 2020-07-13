import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { AtButton, AtModal, AtGrid, AtInput, AtMessage, AtModalContent, AtModalHeader, AtModalAction } from 'taro-ui';
import './index.scss';
import Loading from '../../components/loading';
import { sendArriveMessage } from '../../controllers/rest';
import { loadWaybill, confirmArrive } from '../../controllers/waybill';

import ShipItems from '../../components/shipitems';
import { WaybillResult, Waybill } from '../../types/ars';
import InfoCard from '../../components/infocard';

export interface SheetState {
  loading: boolean;
  waybill: Waybill;
  itemCount: number;
  arrived: boolean; //司机确认到达
  confirmTime: Date;
  confirmArrive: boolean; //司机到达确认的确认
  confirming: boolean; //司机到达确认中
  confirmed: boolean; //中心已确认到达
  valid: boolean; //是否是有效的运单号
  failed: boolean; //是否操作失败
  rdcNum: string; //司机输入接货码
  cellphone: string; //driver cellphone
  isSuper: boolean; //是否是中心人员
  //photos: Array<string>; //uploaded photos
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    this.state = {
      loading: true,
      failed: false,
      rdcNum: '',
      cellphone: '',
      isSuper: false,
      waybill: {
        shiptoCode: '',
        rdcCode: '',
        arriveTime: new Date(),
        totalPages: 1,
        status: '',
        statusCaption: '',
        wbNum: '',
        shiptoName: '',
        rdcName: '',
        shipItems: [],
        photos: [],
      },
      itemCount: 0,
      arrived: false,
      confirmArrive: false,
      confirmTime: new Date(),
      confirming: false,
      confirmed: false,
      valid: false,
    };
    //console.log('sheet:', this.$router.params);
    this.driverConfirmArrive.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    const current = getCurrentInstance();
    const wbno = current.router.params.wbno;
    //const rdcno = this.$router.params.rdc;
    //const cell = this.$router.params.cell;
    const isSuper = current.router.params.super === '1';
    console.log('sheet.index.componentDidMount.props:', this.props, current.router.params);

    loadWaybill(wbno)
      .then((ret: WaybillResult) => {
        console.log('getWaybill.ret:', ret);
        if (ret.result === 'success') {
          const iCnt = ret.waybill.shipItems.length;
          //ret.waybill.rdcCode = rdcno;
          //todo: update here for dbl-check
          this.setState({
            loading: false,
            waybill: ret.waybill,
            itemCount: iCnt,
            arrived: ret.waybill.status === 'arrived',
            confirmed: ret.waybill.status === 'confirmed',
            confirmArrive: ret.waybill.status === 'loaded',
            confirmTime: ret.waybill.arriveTime,
            valid: true,
            isSuper,
          });
        } else {
          this.setState({
            loading: false,
            valid: false,
            itemCount: 0,
            arrived: false,
            confirmArrive: false,
            isSuper,
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
          valid: false,
          failed: true,
          itemCount: 0,
          arrived: false,
          confirmArrive: false,
          isSuper,
        });
        console.log('Error:', err);
        Taro.atMessage({
          message: '运单信息获取失败，请重试！',
          type: 'error',
          duration: 8000,
        });
      });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  openCamera() {
    Taro.navigateTo({
      url: '/pages/camera/camera?isScan=true',
    });
  }
  openManual() {
    Taro.navigateTo({
      url: '/pages/user/index',
    });
  }

  handleChange(val) {
    console.log('something has been changed:', val);
  }

  driverConfirmArrive() {
    console.log('confirm arrive');
    console.log('sheetNum:', this.state.waybill.wbNum);
    console.log('rdcNum:', this.state.rdcNum, this.state.waybill.rdcCode);
    //dirver position address openid
    const openid = Taro.getStorageSync('userOpenId');
    console.log('sheet.index.driverConfirmArrive.openid:', openid);
    if (this.state.cellphone) {
      Taro.setStorage({ key: 'cellphone', data: this.state.cellphone });
    }
    if (this.state.rdcNum === this.state.waybill.rdcCode) {
      //you can confirm with the waybill
      this.setState({ confirming: true });

      confirmArrive(this.state.waybill.wbNum, this.state.waybill.rdcCode, this.state.cellphone, this.state.confirmTime)
        .then((ret) => {
          if (ret.result === 'success') {
            this.setState({
              arrived: true,
              loading: false,
              confirmArrive: false,
              confirming: false,
              waybill: {
                ...this.state.waybill,
                status: 'arrived',
                statusCaption: '司机已确认到达',
              },
            });
            sendArriveMessage(this.state.waybill.wbNum, openid);
          } else {
            Taro.atMessage({
              message: '操作失败：订单信息有误，请重试。',
              type: 'error',
              duration: 8000,
            });
          }
        })
        .catch((ret) => {
          Taro.atMessage({
            message: '操作失败，错误原因：' + ret.message,
            type: 'error',
            duration: 8000,
          });
        });
    } else {
      //wrong rdcNumber input
      //console.log("wrong rdc code input");
      Taro.atMessage({
        message: '接收码输入错误，请重试！',
        type: 'error',
      });
    }
  }

  render() {
    const { loading, waybill, confirmArrive, confirmTime, arrived, confirmed, valid, failed } = this.state;
    console.log('loading:', loading);
    if (loading) {
      return (
        <View>
          <AtMessage />
          <Loading />
        </View>
      );
    }
    if (failed) {
      return (
        <InfoCard
          title="操作未成功"
          message="请确保您的手机处于联网状态，再次尝试操作。如果还不成功，请与中心工作人员联系。"
          extMessage="请点击“返回”按钮。"
          backFunc={() => {
            Taro.navigateBack();
          }}
        />
      );
    }
    if (!valid) {
      return (
        <InfoCard
          title="未找到交货单"
          message="您输入的【装车序列号】【验证码】不正确"
          extMessage="请点击“返回”按钮重新输入"
          backFunc={() => {
            Taro.navigateBack();
          }}
        />
      );
    }
    const confirmString = '到达时间：' + waybill.arriveTime.toLocaleString('zh-CN');
    const confirmString2 = '请输入验证码、手机号确认送达';
    const confirmString3 = '请注意，一旦确认将无法修改。';
    console.log('waybill:', waybill);
    const gridData = waybill.photos.map((item, index) => ({
      image: item.url,
      value: item.caption,
    }));
    console.log('sheet.gridData:', gridData);
    return (
      <View className="index">
        <AtMessage />
        <Text className="form-title">交货单详细信息</Text>
        <View className="sheet-info-span">
          <View className="form-caption-split">
            单据状态：
            <Text className={confirmed ? 'arrived' : 'notarrive'} style="flex:1">
              {waybill.statusCaption}
            </Text>
            <AtModal isOpened={confirmArrive}>
              <AtModalHeader>时间：{confirmTime.toLocaleString('zh-CN')}</AtModalHeader>
              <AtModalContent>
                <View className="toast-main">
                  <View className="confirm-info">{confirmString2}</View>
                  <View className="confirm-info">{confirmString3}</View>
                  <AtInput
                    key={'confirm-arrive-ara-code'}
                    type="text"
                    className="modal-input"
                    title="验证码*"
                    name="arsCode"
                    placeholder="四位验证码"
                    onChange={(val) => {
                      console.log('arscode:', val);
                      this.setState({ rdcNum: val.toString() });
                    }}></AtInput>
                  <AtInput
                    key={'confirm-arrive-cell-phone'}
                    type="number"
                    name="cellphone"
                    className="modal-input"
                    title="手机号"
                    placeholder="您的手机号"
                    onChange={(val) => {
                      console.log('changed:', val);
                      this.setState({ cellphone: val.toString() });
                    }}></AtInput>
                </View>
              </AtModalContent>
              <AtModalAction>
                <Button
                  className="home-input-semi-left"
                  onClick={() => {
                    //Taro.navigateBack();
                    this.setState({ confirmArrive: false });
                  }}>
                  取消
                </Button>
                <Button
                  className="home-input-semi-right"
                  onClick={() => {
                    this.driverConfirmArrive();
                  }}>
                  确认到达
                </Button>
              </AtModalAction>
            </AtModal>
          </View>
          <Text className="form-caption"> 装 车 号：{waybill.wbNum}</Text>
          {arrived ? (
            <Text className="form-caption">
              到达时间：
              {new Date(waybill.arriveTime).toLocaleString('zh-CN')}
            </Text>
          ) : null}
          <Text className="form-caption">
            物流中心：{waybill.rdcCode}（{waybill.rdcName}）
          </Text>
          <Text className="form-caption">
            接 货 处：{waybill.shiptoCode} （{waybill.shiptoName}）
          </Text>

          {arrived || confirmed ? (
            <View className="form-detail-span">
              <View className="form-detail-header">
                <Text className="form-detail-title">回执列表</Text>
                <View className="form-detail-title-right">
                  {!confirmed ? (
                    <AtButton
                      className="right-button"
                      onClick={() => {
                        Taro.redirectTo({ url: '/pages/camera/camera' });
                      }}>
                      点击上传回执
                    </AtButton>
                  ) : null}
                </View>
              </View>
              <AtGrid
                onClick={(item, index) => {
                  //do preview
                  console.log('atgrid.item:', item, gridData[index]);
                  if (item.value.indexOf('已拒收') >= 0) {
                    Taro.atMessage({
                      message: '该照片已被中心拒收，请重新拍照上传',
                      type: 'error',
                    });
                  } else {
                    Taro.previewImage({
                      urls: [gridData[index].image],
                      success: () => {
                        console.log('success');
                      },
                      fail: () => {
                        console.log('fail');
                      },
                    });
                  }
                }}
                data={gridData}
              />
            </View>
          ) : null}

          <View className="form-detail-span">
            <View className="form-detail-header">
              <Text className="form-detail-title">货运清单</Text>
            </View>
            <ShipItems current={0} pageCount={waybill.totalPages} shipItems={waybill.shipItems} />
          </View>
          {arrived || confirmed ? null : (
            <AtButton
              className="home-button"
              formType="submit"
              onClick={() => {
                this.setState({ confirmArrive: true });
              }}>
              点击确认到达
            </AtButton>
          )}
          <AtButton
            className="home-button"
            formType="reset"
            onClick={() => {
              Taro.navigateBack();
            }}>
            返回
          </AtButton>
        </View>
      </View>
    );
  }
}
