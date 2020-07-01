import { loginData, loginParam, TimsResponse, wbData } from '../types/ars';

const users = [
  {
    userName: '何燕员',
    roleName: '中心核验员',
    cellphone: '1390000',
    password: '0000',
  },
];

const waybillDataList: Array<wbData> = [
  {
    ordNo: '999',
    logCd: '0101',
    logName: '北京国美',
    totalPage: 2,
    shpToCd: '02',
    shpToName: '呼和浩特国美',
    arrivalTime: new Date(new Date().valueOf() - 22 * 60 * 60 * 1000),
    status: 0,
    ordDetailList: [
      {
        id: 20,
        seq: 1,
        page: 1,
        orderNum: 'KDP_ord-123',
        modelNum: 'model-02039',
        qty: 1,
      },
      {
        id: 21,
        seq: 2,
        page: 1,
        orderNum: '12-OUYD-124',
        modelNum: 'AA-model-102039',
        qty: 2,
      },
      {
        id: 22,
        seq: 3,
        page: 1,
        orderNum: 'KDEA-124NBG',
        modelNum: 'KSO-model-022339',
        qty: 10,
      },
      {
        id: 23,
        seq: 4,
        page: 1,
        orderNum: 'zxcvKDP_ord-123',
        modelNum: 'adsf-model-02039',
        qty: 1,
      },
      {
        id: 24,
        seq: 5,
        page: 1,
        orderNum: 'asahfgh-12-OUYD-124',
        modelNum: 'ncvb-AA-model-102039',
        qty: 2,
      },
      {
        id: 25,
        seq: 6,
        page: 2,
        orderNum: 'vzxcvKDEA-12asd4NBG',
        modelNum: 'asdfasKSO-moasdel-022339',
        qty: 10,
      },
      {
        id: 26,
        seq: 7,
        page: 2,
        orderNum: 'asaasdfhfgh-12-OUYD-124',
        modelNum: 'ncvb-AA-model-102039',
        qty: 2,
      },
      {
        id: 27,
        seq: 8,
        page: 2,
        orderNum: '884-vzxcvKDEA-12asd4NBG',
        modelNum: 'asdfasKSO-moasdel-022339',
        qty: 10,
      },
    ],
  },
];
function waybillRequest(url: string) {
  const wbNum = url.substr(url.lastIndexOf('/') + 1);
  let success = true;
  let wbDat: wbData | null = waybillDataList[0];
  wbDat.ordNo = wbNum;
  wbDat.status = 0;
  //console.log('waybillRequest.wbNum:', wbNum, url);
  if (wbNum === '2') {
    wbDat.status = 8;
  } else if (wbNum === '1') {
    wbDat.status = 1;
  } else if (wbNum === '000') {
    wbDat = null;
  } else if (wbNum === '999') {
    success = false;
  }
  return request(wbDat, success);
}
function loginRequest(data: loginParam) {
  const retVal: loginData = {
    userName: '',
    roleName: '',
    result: false,
  };
  let success = true;

  if (data.phone === '1390000' && data.pwd !== '') {
    retVal.userName = users[0].userName;
    retVal.roleName = users[0].roleName;
    retVal.result = true;
  } else if (data.phone === '000000') {
    //fail
    success = false;
  }
  return request(retVal, success);
}

function request(data: loginData | wbData | null, success: boolean) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const timsRet: TimsResponse = {
        messageId: 'abcd1234asdfasdfas9876',
        code: '0000',
        message: 'successful operation',
        sentTime: new Date(new Date().valueOf() - 5000), //5 seconds ago
        responseTime: new Date(),
        data,
      };
      if (success) {
        res(timsRet);
      } else {
        timsRet.code = '0400';
        timsRet.message = 'error';
        timsRet.data = null;
        rej(timsRet);
      }
    }, 1000);
  });
}
export { loginRequest, waybillRequest };
