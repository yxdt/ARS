import { getWaybill, getWbPhotos } from "./rest";
import {
  wbData,
  TimsResponse,
  WaybillResult,
  Waybill,
  photoListData,
} from "../types/ars";

async function loadWaybill(wbno: string): Promise<WaybillResult> {
  //console.log('controllers.user.doLogin:', cellphone, password);

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
    shipItems: [],
    photos: [],
  };
  try {
    restRet = await getWaybill(wbno);
  } catch (err) {
    console.log("get waybill error:", err);
    //restRet = { code: "0500", data: null };
  }
  try {
    photoRet = await getWbPhotos(wbno);
    //console.log("waybill.loadWaybill.photoRet:", photoRet);
  } catch (err) {
    console.log("get photo list error:", err);
  }
  //console.log('controllers.users.doLogin.res:', restRet);

  if (restRet && restRet.code === "0000" && restRet.data) {
    const retData = <wbData>restRet.data;
    let status: string = "loaded";
    switch (retData.status) {
      case 1:
        status = "arrived";
        break;
      case 2:
        status = "uploaded";
        break;
      case 3:
        status = "rejected";
        break;
      case 4:
        status = "reup";
        break;
      case 8:
        status = "confirmed";
        break;
      default:
        status = "loaded";
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
    };
    success = true;
    //console.log("....wb loaded....");
  }
  if (photoRet && photoRet.code === "0000" && photoRet.data) {
    ret.photos = (<photoListData>photoRet.data).photos.map((item) => ({
      url: item.url,
      status: item.status,
      caption:
        item.status === 2 ? "驳回" : item.status === 1 ? "通过" : "已上传",
      wbNum: wbno,
    }));
    //console.log("....photos loaded....");
  }
  return new Promise((res, rej) => {
    if (success) {
      res({ result: "success", waybill: ret });
    } else {
      //console.log('controllers.users.doLogin.res.rej:', restRet);
      rej({ result: "fail", waybill: null });
    }
  });
}

export { loadWaybill };
