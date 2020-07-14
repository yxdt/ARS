import {
  getWaybill,
  getWbPhotos,
  confirmWaybill,
  queryWaybill,
  queryWbStatus,
} from "./rest";
import {
  wbData,
  TimsResponse,
  WaybillResult,
  Waybill,
  photoListData,
  WaybillConfirmParams,
  Result,
  queryParams,
  queryResult,
  wbStatusResult,
} from "../types/ars";
import { getDriverInfo } from "./users";

function getStatusCaption(status: number): string {
  let retStr = "未知";
  switch (status) {
    case 0:
      retStr = "未到达";
      break;
    case 1:
      retStr = "已到达";
      break;
    case 2:
      retStr = "已上传待确认";
      break;
    case 3:
      retStr = "回执驳回";
      break;
    case 4:
      retStr = "回执重传待确认";
      break;
    case 8:
      retStr = "已确认IOD";
      break;
  }
  return retStr;
}

async function loadWaybill(wbno: string): Promise<WaybillResult> {
  ////consolelog('controllers.user.doLogin:', cellphone, password);

  let success = false;
  let restRet: TimsResponse<wbData> | null = null;
  let photoRet: TimsResponse<photoListData> | null = null;
  let ret: Waybill = {
    wbNum: "",
    rdcCode: "",
    rdcName: "",
    totalPages: 0,
    shiptoCode: "",
    shiptoName: "",
    arriveTime: new Date(),
    status: "loaded",
    statusCaption: "已装车",
    shipItems: [],
    photos: [],
  };
  if (wbno && wbno.length > 0) {
    try {
      restRet = await getWaybill(wbno);
    } catch (err) {
      ////consolelog("get waybill error:", err);
      //err = null;
      restRet = err;
      //restRet = { code: "0500", data: null };
    }
    try {
      photoRet = await getWbPhotos(wbno);
      ////consolelog("waybill.loadWaybill.photoRet:", photoRet);
    } catch (err) {
      ////consolelog("get photo list error:", err);
      photoRet = err;
    }

    ////consolelog('controllers.users.doLogin.res:', restRet);

    if (restRet && restRet.code === "0000" && restRet.data) {
      const retData = <wbData>restRet.data;
      let status: string = "loaded";
      let statusCaption: string = "已装车";
      switch (retData.status) {
        case 1:
          status = "arrived";
          statusCaption = "司机已确认到达";
          break;
        case 2:
          status = "uploaded";
          statusCaption = "回执已上传";
          break;
        case 3:
          status = "rejected";
          statusCaption = "上传回执未通过";
          break;
        case 4:
          status = "reup";
          statusCaption = "回执已重新上传";

          break;
        case 8:
          status = "confirmed";
          statusCaption = "中心已确认";
          break;
        default:
          status = "loaded";
          statusCaption = "已装车";
          retData.arrivalTime = restRet.responseTime;
          break;
      }
      ret = {
        wbNum: retData.ordNo,
        rdcCode: retData.logCd,
        rdcName: retData.logName,
        totalPages: retData.totalPage,
        shiptoCode: retData.shpToCd,
        shiptoName: retData.shpToName,
        arriveTime: retData.arrivalTime,
        photos: [],
        shipItems: retData.ordDetailList.map((item) => ({
          id: item.id,
          orderNum: item.orderNum,
          model: item.model,
          seq: item.seq,
          page: item.page,
          qty: item.qty,
        })),
        status,
        statusCaption,
      };
      success = true;
      ////consolelog("....wb loaded....");
    }
    if (photoRet && photoRet.code === "0000" && photoRet.data) {
      ret.photos = (<photoListData>photoRet.data).photos.map((item) => ({
        url: item.url,
        status: item.status,
        caption:
          item.status === 2 ? "驳回" : item.status === 1 ? "通过" : "已上传",
        wbNum: wbno,
      }));
      ////consolelog("....photos loaded....");
    }
  }
  return new Promise((res, rej) => {
    if (success) {
      res({ result: "success", waybill: ret });
    } else {
      ////consolelog('controllers.users.doLogin.res.rej:', restRet);
      rej({ result: "fail", waybill: null });
    }
  });
}

async function confirmArrive(
  wbno: string,
  shiptoCode: string,
  cellphone: string,
  arriveTime: Date
): Promise<Result> {
  const driverInfo = await getDriverInfo(cellphone);
  ////consolelog("confirmArrive.wbno,ordNo,shpToCd:", wbno);
  const wbcParam: WaybillConfirmParams = {
    ...driverInfo,
    sysTime: arriveTime,
    ordNo: wbno,
    shpToCd: shiptoCode,
  };
  let result: TimsResponse<Result>;
  let success = false;
  let ret: Result = { result: "success" };
  try {
    result = await confirmWaybill(wbcParam);
    if (result && result.code === "0000" && result.data) {
      success = true;
      ret.result = result.data.result;
    }
  } catch (e) {
    ////consolelog("waybill.confirmArrive.error.e:", e);
    result = e;
    //{
    //  messageId: 'abcd1234asdfasdfas9876',
    //  code: '0400',
    //  message: 'error',
    //  sentTime: 2020-07-03T08:20:14.748Z,
    //  responseTime: 2020-07-03T08:20:19.748Z,
    //  data: null
    //}

    ret.result = "error";
    //result = { result: "error" };
  }

  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      ////consolelog('controllers.users.doLogin.res.rej:', restRet);
      rej(ret);
    }
  });
}

async function queryWaybills(query: queryParams): Promise<queryResult> {
  ////consolelog('controllers.user.doLogin:', cellphone, password);
  let success = false;
  let ret: queryResult = {
    result: "success",
    count: 0,
    waybills: [],
  };
  let restRet;
  try {
    restRet = await queryWaybill(query);
  } catch (err) {
    ////consolelog("login error:", err);
    restRet = { code: "0500", data: null };
  }
  ////consolelog("controllers.users.doLogin.res:", restRet);
  if (restRet.code === "0000") {
    if (restRet.data && restRet.data.waybills) {
      ret.waybills = restRet.data.waybills.map((item: wbData) => ({
        wbNum: item.ordNo,
        rdcCode: item.logCd,
        rdcName: item.logName,
        totalPages: item.totalPage,
        shiptoCode: item.shpToCd,
        shiptoName: item.shpToName,
        arriveTime: item.arrivalTime,
        status: item.status + "",
        statusCaption: getStatusCaption(item.status),
        shipItems: item.ordDetailList,
        photos: null,
      }));
      ret.count = restRet.data.waybills.length;
    } else {
      ret.result = "fail";
      ret.count = 0;
      ret.waybills = null;
    }
    success = true;
  } else {
    ret.result = "error";
    ret.count = 0;
    ret.waybills = null;
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      ////consolelog('controllers.waybill.queryWaybills.res.rej:', restRet);
      rej(ret);
    }
  });
}

async function queryWaybillStatus(wbno: string): Promise<wbStatusResult> {
  let success = false;
  let ret: wbStatusResult = {
    result: "success",
    wbno,
    statusList: [],
  };
  let restRet;
  try {
    restRet = await queryWbStatus(wbno);
  } catch (err) {
    ////consolelog("login error:", err);
    restRet = { code: "0500", data: null };
    success = false;
  }
  ////consolelog('controllers.waybill.queryWaybillStatus.res:', restRet);
  if (restRet.code === "0000") {
    if (restRet.data.statusList && restRet.data.statusList.length > 0) {
      ret.statusList = restRet.data.statusList;
      ret.result = "success";
    } else {
      ret.result = "fail";
      ret.statusList = [];
    }
    success = true;
  } else {
    ret.result = "error";
    ret.statusList = [];
  }
  ////consolelog('controllers.waybill.queryWaybillStatus.ret:', ret);
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      ////consolelog('controllers.waybill.queryWaybills.res.rej:', restRet);
      rej(ret);
    }
  });
}

export { loadWaybill, confirmArrive, queryWaybills, queryWaybillStatus };
