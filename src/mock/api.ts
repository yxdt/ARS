import {
  loginData,
  loginParam,
  TimsResponse,
  wbData,
  photoListData,
  WaybillConfirmParams,
  WaybillConfirmData,
  messageData,
} from "../types/ars";

const users = [
  {
    userName: "何燕员",
    roleName: "中心核验员",
    cellphone: "1390000",
    password: "0000",
  },
];

const waybillDataList: Array<wbData> = [
  {
    ordNo: "999",
    logCd: "0101",
    logName: "北京国美",
    totalPage: 2,
    shpToCd: "02",
    shpToName: "呼和浩特国美",
    arrivalTime: new Date(new Date().valueOf() - 22 * 60 * 60 * 1000),
    status: 0,
    ordDetailList: [
      {
        id: 20,
        seq: 1,
        page: 1,
        orderNum: "KDP_ord-123",
        model: "model-02039",
        qty: 1,
      },
      {
        id: 21,
        seq: 2,
        page: 1,
        orderNum: "12-OUYD-124",
        model: "AA-model-102039",
        qty: 2,
      },
      {
        id: 22,
        seq: 3,
        page: 1,
        orderNum: "KDEA-124NBG",
        model: "KSO-model-022339",
        qty: 10,
      },
      {
        id: 23,
        seq: 4,
        page: 1,
        orderNum: "zxcvKDP_ord-123",
        model: "adsf-model-02039",
        qty: 1,
      },
      {
        id: 24,
        seq: 5,
        page: 1,
        orderNum: "asahfgh-12-OUYD-124",
        model: "ncvb-AA-model-102039",
        qty: 2,
      },
      {
        id: 25,
        seq: 6,
        page: 2,
        orderNum: "vzxcvKDEA-12asd4NBG",
        model: "asdfasKSO-moasdel-022339",
        qty: 10,
      },
      {
        id: 26,
        seq: 7,
        page: 2,
        orderNum: "asaasdfhfgh-12-OUYD-124",
        model: "ncvb-AA-model-102039",
        qty: 2,
      },
      {
        id: 27,
        seq: 8,
        page: 2,
        orderNum: "884-vzxcvKDEA-12asd4NBG",
        model: "asdfasKSO-moasdel-022339",
        qty: 10,
      },
    ],
  },
];

const pics = [
  "r_asdf_1592546904641.jpg",
  "r_ffsd_1592540841762.jpg",
  "r_qwe_1592462754442.jpg",
  "r_qwer_1592538896117.jpg",
  "r_rrryyy_1592547360459.jpg",
  "r_wert_1592547945057.jpg",
  "r_lsks_1592547556687.jpg",
  "r_rtyy_1592541405051.jpg",
  "r_wert_1592547631111.jpg",
  "r_0_1592539609615.jpg",
  "r_1_1592538897931.jpg",
  "r_1_1592547360459.jpg",
  "r_2_239393930.png",
  "r_2_1592539521819.jpg",
];

function rejectMsgRequest(url: string) {
  return msgRequest(url);
}

function uploadMsgRequest(url: string) {
  //url = 'message/upload?wbno=xxx&shpToCd=yyy&phone=xxxxx"
  return msgRequest(url);
}

function arriveMsgRequest(url: string) {
  //url = "/message/arrive?wbno=xxx&shpToCd=yyy&phone=xxxxx"
  return msgRequest(url);
}

function msgRequest(url: string) {
  const wbno = url.substr(
    url.indexOf("wbno=") + 5,
    url.indexOf("&") - url.indexOf("wbno=") - 5
  );
  console.log("mock.api.msgRequest.url, wbno:", url, wbno);
  const msgData: messageData = {
    errcode: "0",
    errmsg: "ok",
  };
  let success = true;
  if (wbno === "000") {
    //sim a refuse receive one
    msgData.errcode = "43101";
    msgData.errmsg = "user refuse to accept the msg";
  } else if (wbno === "999") {
    //sim a fail one
    success = false;
  }
  return request(msgData, success);
}

function wbcRequest(data: WaybillConfirmParams) {
  const ret: WaybillConfirmData = {
    result: "success",
  };
  let success = true;
  if (data.ordNo === "1") {
    //confirmed already
    ret.result = "fail";
  } else if (data.ordNo === "999") {
    //fake server fail
    success = false;
  }
  //console.log("mock.api.wbcRequest.data, result:", data, ret);
  return request(ret, success);
}

function photosRequest(url: string) {
  const wbno = url.substr(url.lastIndexOf("/") + 1);
  const photos: photoListData = {
    photos: pics
      .filter((item) => item.indexOf("_" + wbno + "_") > 0)
      .map((item, index) => ({ url: item, status: index % 3 })),
  };
  return request(photos, true);
}

function waybillRequest(url: string) {
  const wbNum = url.substr(url.lastIndexOf("/") + 1);
  let success = true;
  let wbDat: wbData | null = waybillDataList[0];
  wbDat.ordNo = wbNum;
  wbDat.status = 0;
  //console.log('waybillRequest.wbNum:', wbNum, url);
  if (wbNum === "2") {
    wbDat.status = 8;
    success = true;
  } else if (wbNum === "1") {
    wbDat.status = 1;
    success = true;
  } else if (wbNum === "000") {
    wbDat = null;
    success = true;
  } else if (wbNum === "999") {
    success = false;
  }
  return request<wbData>(wbDat, success);
}
function loginRequest(data: loginParam) {
  const retVal: loginData = {
    userName: "",
    roleName: "",
    result: false,
  };
  let success = true;

  if (data.phone === "1390000" && data.pwd !== "") {
    retVal.userName = users[0].userName;
    retVal.roleName = users[0].roleName;
    retVal.result = true;
  } else if (data.phone === "000000") {
    //fail
    success = false;
  }
  return request(retVal, success);
}

function request<T>(data: T | null, success: boolean) {
  //console.log("mock.api.request.data,success:", data, success);
  return new Promise((res, rej) => {
    setTimeout(() => {
      const timsRet: TimsResponse<T> = {
        messageId: "abcd1234asdfasdfas9876",
        code: "0000",
        message: "successful operation",
        sentTime: new Date(new Date().valueOf() - 5000), //5 seconds ago
        responseTime: new Date(),
        data,
      };
      if (success) {
        res(timsRet);
      } else {
        timsRet.code = "0400";
        timsRet.message = "error";
        timsRet.data = null;
        rej(timsRet);
      }
    }, 1000);
  });
}
export {
  loginRequest,
  waybillRequest,
  photosRequest,
  wbcRequest,
  arriveMsgRequest,
  uploadMsgRequest,
  rejectMsgRequest,
};
