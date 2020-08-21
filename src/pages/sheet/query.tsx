import Taro, { useState } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import {
  AtInput,
  AtMessage,
  AtList,
  AtListItem,
  AtRadio,
  AtButton,
} from "taro-ui";
import "./index.scss";

import ArsTabBar from "../../components/tabbar";
import { queryParams, Waybill } from "../../types/ars";
import { queryWaybills } from "../../controllers/waybill";

export default function Query() {
  const isReturn = this.$router.params.rtn === "1";

  const start = new Date(new Date().valueOf() - 7 * 24 * 60 * 60 * 1000);
  const today = new Date();
  const [startDate, setStartDatetime] = useState(
    start.getFullYear() +
      "-" +
      (start.getMonth() < 9
        ? "0" + (start.getMonth() + 1)
        : start.getMonth() + 1 + "") +
      "-" +
      (start.getDate() < 10 ? "0" + start.getDate() : start.getDate() + "")
  );
  const [endDate, setEndDatetime] = useState(
    today.getFullYear() +
      "-" +
      (today.getMonth() < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1 + "") +
      "-" +
      (today.getDate() < 10 ? "0" + today.getDate() : today.getDate() + "")
  );
  const [rdcCode, setRdcCode] = useState("");
  const [wbStatus, setWbStatus] = useState("");
  const [stsVisble, setStsVisble] = useState(false);
  const [wbNum, setWbNum] = useState("");
  const [waybills, setWaybills] = useState<Array<Waybill> | null>(
    isReturn ? Taro.getStorageSync("queryWaybills") : []
  );
  const [wbCount, setWbCount] = useState(
    isReturn ? Taro.getStorageSync("queryWaybillCount") : 0
  );
  const [queryed, setQueryed] = useState(isReturn);
  const statusOptions = [
    { label: "全部", value: "", desc: "不做状态条件过滤" },
    { label: "未到达", value: "0", desc: "未完成到达时间" },
    { label: "已到达", value: "1", desc: "已完成到达时间" },
    {
      label: "已上传待确认",
      value: "2",
      desc: "司机已经回传回执等待确认",
    },
    { label: "回执驳回", value: "3", desc: "回执被驳回" },
    {
      label: "回执重传待确认",
      value: "4",
      desc: "司机重新上传回执",
    },
    {
      label: "中心已确认",
      value: "8",
      desc: "回执已经确认通过",
    },
  ];

  return (
    <View className="home-title-span">
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
                    setStartDatetime(dateVal.detail.value);
                  }}
                  value={startDate}
                >
                  <AtList>
                    <AtListItem
                      title="起始出门时间"
                      extraText={startDate}
                      customStyle="font-size:1rem"
                    />
                  </AtList>
                </Picker>
              </View>
              <View>
                <Picker
                  mode="date"
                  onChange={(dateVal) => {
                    //consolelog('end Date:', dateVal);
                    setEndDatetime(dateVal.detail.value);
                  }}
                  value={endDate}
                >
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
                    //consolelog('装车号：', val);
                    setWbNum(val + "");
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
                    //consolelog('接货处代码：', val);
                    setRdcCode(val + "");
                  }}
                />
              </View>
              <View>
                <AtInput
                  className="query-input"
                  name="wbStatus"
                  title="单据状态"
                  type="text"
                  editable={false}
                  value={
                    (
                      statusOptions.find(
                        (item) => item.value === wbStatus + ""
                      ) || { label: "未知" }
                    ).label
                  }
                  placeholder="请选择单据状态"
                  placeholderClass="small-ph"
                  onClick={() => {
                    setStsVisble(true);
                  }}
                  onChange={() => {}}
                />
                {stsVisble ? (
                  <AtRadio
                    options={statusOptions}
                    value={wbStatus}
                    onClick={(val) => {
                      //consolelog('status selected:', val);
                      setStsVisble(false);
                      setWbStatus(val);
                    }}
                  ></AtRadio>
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
                  //consolelog("query the waybills");
                  const query: queryParams = {
                    pgYmdStart: startDate,
                    pgYmdEnd: endDate,
                    shpToCd: rdcCode,
                    status: wbStatus,
                    carAllocNo: wbNum,
                    openId: Taro.getStorageSync("userOpenId"),
                  };
                  //consolelog("queryParams:", query);
                  queryWaybills(query)
                    .then((ret) => {
                      //consolelog("querywaybills.ret:", ret);
                      if (ret.result === "success" && ret.count > 0) {
                        setWaybills(ret.waybills);
                        setWbCount(ret.count);
                        Taro.setStorage({
                          key: "queryWaybills",
                          data: ret.waybills,
                        });
                        Taro.setStorage({
                          key: "queryWaybillCount",
                          data: ret.count,
                        });
                      } else {
                        setWaybills([]);
                        setWbCount(0);
                        Taro.removeStorage({ key: "queryWaybills" });
                        Taro.removeStorage({ key: "queryWaybillCount" });
                      }

                      setQueryed(true);
                    })
                    .catch(() => {
                      setWaybills([]);
                      setWbCount(0);
                      Taro.removeStorage({ key: "queryWaybills" });
                      Taro.removeStorage({ key: "queryWaybillCount" });

                      setQueryed(true);
                    });
                }
              }}
              customStyle="margin-top:1rem;margin-bottom:-1rem"
            >
              {queryed ? "[查询结果：" + wbCount + "条] 再次查询" : "查询"}
            </AtButton>
          </View>
        </View>
      </View>
      {queryed ? (
        <View
          className="user-reg-span"
          style="margin-top:-2rem;margin-bottom:5rem;"
        >
          查询结果：
          <AtList>
            {waybills && waybills.length > 0 ? (
              waybills.map((item) => (
                <AtListItem
                  onClick={() => {
                    if (item.wbNum && item.wbNum.length > 0) {
                      Taro.navigateTo({
                        url:
                          "/pages/sheet/index?wbno=" + item.wbNum + "&pidx=1",
                      });
                    }
                  }}
                  title={item.wbNum}
                  note={
                    item.shiptoName === "合计" && item.wbNum === ""
                      ? item.shiptoName
                      : "[" +
                        item.pgYmd +
                        "-" +
                        item.shiptoCode +
                        "]" +
                        item.shiptoName
                  }
                  extraText={item.statusCaption}
                  arrow={
                    item.shiptoName === "合计" && item.wbNum === ""
                      ? undefined
                      : "right"
                  }
                  key={item.wbNum + item.status}
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
