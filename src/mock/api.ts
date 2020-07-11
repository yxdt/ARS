import {
  loginData,
  loginParam,
  TimsResponse,
  wbData,
  photoListData,
  WaybillConfirmParams,
  WaybillConfirmData,
  msgSentData,
  verifyParams,
  verifyData,
  queryParams,
  queryData,
  msgQueryData,
  msgQueryParams,
  wbStatusData,
  wbStatus,
  uvPhotoListData,
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
  {
    ordNo: "1",
    logCd: "0102",
    logName: "天津中心",
    totalPage: 1,
    shpToCd: "03",
    shpToName: "赤峰国美",
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
    ],
  },
  {
    ordNo: "2",
    logCd: "0102",
    logName: "天津国美",
    totalPage: 1,
    shpToCd: "04",
    shpToName: "石家庄国美",
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
    ],
  },
  {
    ordNo: "1093",
    logCd: "0101",
    logName: "北京国美",
    totalPage: 1,
    shpToCd: "01",
    shpToName: "张家口国美",
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
    ],
  },
];

const pics = [
  "r_asdf_1592546904641.jpg",
  "r_ffsd_1592540841762.jpg",
  "r_qwe_1592462754442.jpg",
  "r_qwer_1592538896117.jpg",
  "r_1_1592547360459.jpg",
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

const messages = [
  {
    msgId: 10,
    title: "货物送达确认",
    content: "司机：139398828已送达",
    ordNo: "1",
    cdc: "0101",
    sentTime: new Date(
      new Date().valueOf() - 3 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    status: 0,
    toOpenid: "sjlajdfaslkfda",
  },
  {
    msgId: 30,
    title: "货物送达确认",
    content: "司机：133203828已送达",
    ordNo: "2",
    cdc: "0001",
    sentTime: new Date(
      new Date().valueOf() - 4 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    status: 0,
    toOpenid: "sa223jlajdfaslkfda",
  },
  {
    msgId: 320,
    title: "回执已上传",
    content: "司机：139398828回执完成上传",
    ordNo: "1",
    cdc: "0101",
    sentTime: new Date(
      new Date().valueOf() - 2.5 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    status: 0,
    toOpenid: "sjlajdfaslkfda",
  },
  {
    msgId: 40,
    title: "回执已退回",
    content: "原因：不清晰，请重拍",
    ordNo: "2",
    cdc: "0001",
    sentTime: new Date(
      new Date().valueOf() - 4 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    status: 0,
    toOpenid: "sa223jlajdfaslkfda",
  },
];
const statusList: Array<wbStatus> = [
  {
    status: 1,
    doneDate: new Date(),
    caption: "确认到达",
    comment: "司机1383832003",
    seq: 0,
  },
  {
    status: 2,
    doneDate: new Date(),
    caption: "回执已上传",
    comment: "合计：3张",
    seq: 1,
  },
  {
    status: 4,
    doneDate: null,
    caption: "回执审核",
    comment: "审核中",
    seq: 2,
  },
  { status: 8, doneDate: null, caption: "运单完成", comment: "", seq: 3 },
];

async function wbStatusRequest(url: string) {
  const wbno = url.substr(url.indexOf("wbno=") + 5);
  let data = { statusList };
  let success = true;
  if (wbno === "000") {
    data = { statusList: [] };
  } else if (wbno === "999") {
    success = false;
  }
  return request<wbStatusData>(data, success);
}
async function markMsgRequest(url: string) {
  const msgid = url.substr(
    url.indexOf("msgid=") + 6,
    url.indexOf("&") - url.indexOf("msgid=") - 6
  );
  const mark = url.substr(url.indexOf("mark=" + 5));

  //console.log('mock.api.markMsgRequest.url, msgid, mark:', url, msgid, mark);
  let data = "success";
  let success = true;
  if (mark !== "2" && mark !== "3") {
    success = false;
  } else if (msgid === "0") {
    //sim a refuse receive one
    data = "fail";
  } else if (msgid === "999") {
    //sim a fail one
    success = false;
  }
  return request<string>(data, success);
}
async function queryMsgRequest(
  queryData: msgQueryParams
): Promise<TimsResponse<msgQueryData>> {
  const data: msgQueryData = {
    messages: messages,
  };
  let success = true;
  if (queryData.ordNo === "000") {
    data.messages = null;
  } else if (queryData.ordNo === "999") {
    success = false;
  }
  return request<msgQueryData>(data, success);
}

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
  //console.log("mock.api.msgRequest.url, wbno:", url, wbno);
  const msgData: msgSentData = {
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
  return request<msgSentData>(msgData, success);
}

function verifyRequest(data: verifyParams) {
  const vData: verifyData = {
    result: "",
  };
  let success = true;
  if (data.ordNo === "999") {
    //模拟外部错误
    success = false;
  } else if (data.openid === "000000") {
    //模拟没有权限
    vData.result = "noperm";
  } else if (data.status === 1) {
    //回执审核不通过
    vData.result = "reject";
  } else if (data.status === 0) {
    //回执审核通过
    vData.result = "approve";
  }
  return request<verifyData>(vData, success);
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

async function unVerifiedRequest(url: string) {
  const openid = url.substr(url.lastIndexOf("/") + 1);
  let success = true;
  let photos: uvPhotoListData | null = {
    photos: pics //返回3条记录
      .filter((item) => item.indexOf("_1_") > 0)
      .map((item) => ({
        url: item,
        status: 0,
        ordNo: "1",
        shpToCd: "0101",
        cdcName: "北京中心",
        state: 0,
      })),
  };
  if (openid === "999") {
    success = false;
  } else if (openid === "000") {
    photos = null;
  }
  return request<uvPhotoListData>(photos, success);
}

function photosRequest(url: string) {
  const wbno = url.substr(url.lastIndexOf("/") + 1);
  let success = true;

  const photos: photoListData = {
    photos: pics
      .filter((item) => item.indexOf("_" + wbno + "_") > 0)
      .map((item, index) => ({ url: item, status: index % 3, remark: "" })),
  };
  if (wbno === "999") {
    success = false;
  }
  return request<photoListData>(photos, success);
}

function queryRequest(data: queryParams) {
  let success = true;
  let qData: queryData = {
    waybills: waybillDataList,
  };
  if (data.ordNo === "999") {
    success = false;
  } else if (data.ordNo === "000") {
    qData.waybills = null;
    success = true;
  }
  return request<queryData>(qData, success);
}

function waybillRequest(url: string) {
  const wbNum = url.substr(url.lastIndexOf("/") + 1);
  let success = true;
  let wbDat: wbData | null = waybillDataList[0];
  wbDat.ordNo = wbNum;
  wbDat.status = 0;
  //console.log('waybillRequest.wbNum:', wbNum, url);
  if (wbNum === "2") {
    wbDat.status = 8; //模拟中心已确认
    success = true;
  } else if (wbNum === "1") {
    wbDat.status = 1; //模拟已到达
    wbDat.arrivalTime = new Date(1594345716128);
    success = true;
  } else if (wbNum === "000") {
    wbDat = null; //模拟错误运单号
    success = true;
  } else if (wbNum === "999") {
    success = false; //模拟错误网络连接
  }
  return request<wbData>(wbDat, success);
}
function loginRequest(data: loginParam) {
  const retVal: loginData = {
    userName: "",
    roleName: "",
  };
  let success = true;

  if (data.phone === "1390000" && data.pwd !== "") {
    retVal.userName = users[0].userName;
    retVal.roleName = users[0].roleName;
  } else if (data.phone === "000000") {
    //fail
    success = false;
  }
  return request(retVal, success);
}

function request<T>(data: T | null, success: boolean) {
  //console.log("mock.api.request.data,success:", data, success);
  return new Promise<TimsResponse<T>>((res, rej) => {
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
    }, 30);
  });
}
export {
  loginRequest,
  waybillRequest,
  wbStatusRequest,
  photosRequest,
  unVerifiedRequest,
  wbcRequest,
  arriveMsgRequest,
  uploadMsgRequest,
  rejectMsgRequest,
  queryMsgRequest,
  verifyRequest,
  queryRequest,
  markMsgRequest,
};
