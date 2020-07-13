import Taro from '@tarojs/taro';
import React, { useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import { AtInput, AtMessage, AtList, AtListItem, AtRadio, AtButton } from 'taro-ui';
import './index.scss';

import ArsTabBar from '../../components/tabbar';
import { queryParams, Waybill } from '../../types/ars';
import { queryWaybills } from '../../controllers/waybill';

export default function Query() {
  const [startDate, setStartDatetime] = useState(new Date(new Date().valueOf() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'));
  const [endDate, setEndDatetime] = useState(new Date().toLocaleDateString('zh-CN'));
  const [rdcCode, setRdcCode] = useState('');
  const [wbStatus, setWbStatus] = useState(0);
  const [stsVisble, setStsVisble] = useState(false);
  const [wbNum, setWbNum] = useState('');
  const [waybills, setWaybills] = useState<Array<Waybill> | null>([]);
  const [queryed, setQueryed] = useState(false);
  //function doLogin() {}

  return (
    <View className="index">
      <AtMessage />
      <Text className="form-title">交货单查询</Text>

      <View className="sheet-info-span">
        <View className="page-section">
          {queryed ? null : (
            <View>
              <View>
                <Picker
                  mode="date"
                  onChange={(dateVal) => {
                    console.log('start date:', dateVal);
                    setStartDatetime(dateVal.detail.value);
                  }}
                  value={startDate}>
                  <AtList>
                    <AtListItem title="起始出门时间" extraText={startDate} customStyle="font-size:1rem" />
                  </AtList>
                </Picker>
              </View>
              <View>
                <Picker
                  mode="date"
                  onChange={(dateVal) => {
                    console.log('end Date:', dateVal);
                    setEndDatetime(dateVal.detail.value);
                  }}
                  value={endDate}>
                  <AtList>
                    <AtListItem title="截止出门时间" extraText={endDate} />
                  </AtList>
                </Picker>
              </View>
              <View>
                <AtInput
                  className="query-input"
                  name="wbNum"
                  title="装车号"
                  type="text"
                  value={wbNum}
                  placeholder="请输入装车号"
                  placeholderClass="small-ph"
                  onChange={(val) => {
                    console.log('装车号：', val);
                    setWbNum(val);
                  }}
                />
              </View>
              <View>
                <AtInput
                  className="query-input"
                  name="rdcCode"
                  title="接货处代码"
                  type="text"
                  value={rdcCode}
                  placeholder="请输入接货处代码"
                  placeholderClass="small-ph"
                  onChange={(val) => {
                    console.log('接货处代码：', val);
                    setRdcCode(val);
                  }}
                />
              </View>
              <View>
                <AtInput
                  className="query-input"
                  editable={false}
                  name="wbStatus"
                  title="单据状态"
                  type="text"
                  value={wbStatus + ''}
                  placeholder="请选择单据状态"
                  placeholderClass="small-ph"
                  onChange={(val) => {
                    console.log('单据状态：', val);
                    //setWbStatus(val);
                  }}
                  onClick={() => {
                    setStsVisble(true);
                  }}
                />
                {stsVisble ? (
                  <AtRadio
                    options={[
                      { label: '未送达', value: '0', desc: '未完成到达时间' },
                      { label: '已到达', value: '1', desc: '已完成到达时间' },
                      {
                        label: '已上传待确认',
                        value: '2',
                        desc: '司机已经回传回执等待确认',
                      },
                      { label: '回执驳回', value: '3', desc: '回执被驳回' },
                      {
                        label: '回执重传待确认',
                        value: '4',
                        desc: '司机重新上传回执',
                      },
                      { label: '已确认IOD', value: '8', desc: '回执已经确认通过' },
                    ]}
                    value={wbStatus}
                    onClick={(val) => {
                      console.log('status selected:', val);
                      setStsVisble(false);
                      setWbStatus(val);
                    }}></AtRadio>
                ) : null}
              </View>
            </View>
          )}
          <View>
            <AtButton
              className="right-button"
              onClick={() => {
                if (queryed) {
                  setQueryed(false);
                } else {
                  console.log('query the waybills');
                  const query: queryParams = {
                    beginDate: new Date(startDate),
                    endDate: new Date(endDate),
                    ordNo: wbNum,
                    cdcCode: rdcCode,
                    wbStatus,
                  };
                  console.log('queryParams:', query);
                  queryWaybills(query)
                    .then((ret) => {
                      console.log('querywaybills.ret:', ret);
                      if (ret.result === 'success' && ret.count > 0) {
                        setWaybills(ret.waybills);
                      }
                    })
                    .finally(() => {
                      setQueryed(true);
                    });
                }
              }}
              customStyle="margin-top:1rem;margin-bottom:-1rem">
              {queryed ? '再次查询' : '查询'}
            </AtButton>
          </View>
        </View>
      </View>
      {queryed ? (
        <View className="user-reg-span" style="margin-top:-2rem;margin-bottom:5rem;">
          查询结果：
          <AtList>
            {waybills && waybills.length > 0 ? (
              waybills.map((item) => (
                <AtListItem
                  onClick={() => {
                    Taro.navigateTo({ url: '/pages/sheet/index?wbno=' + item.wbNum });
                  }}
                  title={item.wbNum}
                  note={item.shiptoCode + '(' + item.shiptoName + ')'}
                  extraText={item.statusCaption}
                  arrow="right"
                />
              ))
            ) : (
              <Text>没有满足条件的记录</Text>
            )}
          </AtList>
        </View>
      ) : null}
      <ArsTabBar current={2} />
    </View>
  );
}
