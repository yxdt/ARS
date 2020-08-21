import { getWaybill, completeWaybill, confirmWaybill, queryWaybill, queryWbStatus, SERVER_URL } from './rest';
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
  wbqData,
  WaybillCompleteResult,
  WaybillCompleteParams,
} from '../types/ars';
import { getDriverInfo } from './users';

//状态码说明映射
function getStatusCaption(status: number): string {
  let retStr = '未知';
  switch (status) {
    case 0:
      retStr = '未到达';
      break;
    case 1:
      retStr = '已到达';
      break;
    case 2:
      retStr = '已上传待确认';
      break;
    case 3:
      retStr = '回执驳回';
      break;
    case 4:
      retStr = '回执重传待确认';
      break;
    case 8:
      retStr = '中心已确认';
      break;
  }
  return retStr;
}

//获取运单详情
async function loadWaybill(wbno: string): Promise<WaybillResult> {
  let success = false;
  let restRet: TimsResponse<wbData> | null = null;
  let photoRet: TimsResponse<photoListData> | null = null;
  let ret: Waybill = {
    wbNum: '',
    rdcCode: '',
    rdcName: '',
    totalPages: 0,
    shiptoCode: '',
    shiptoName: '',
    arriveTime: new Date(),
    status: 'loaded',
    statusCaption: '已装车',
    statusNum: 0,
    shipItems: [],
    photos: [],
    arsCode: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    remark: '',
    shpToCd: '',
    pgYmd: '',
    maxPage: 0,
  };
  if (wbno && wbno.length > 0) {
    try {
      restRet = await getWaybill(wbno);
    } catch (err) {
      restRet = err;
    }

    if (restRet && restRet.code === '0000' && restRet.data) {
      const retData = <wbData>restRet.data;
      let status: string = 'loaded';
      let statusCaption: string = '已装车';
      if (restRet.data.orderImageList && restRet.data.orderImageList.length > 0) {
        photoRet = {
          data: { photos: restRet.data.orderImageList },
          code: '0000',
          message: 'success',
          messageId: '0',
          sentTime: new Date(),
          responseTime: new Date(),
        };
      } else {
        photoRet = {
          data: null,
          code: '0500',
          messageId: '0',
          message: 'fail',
          sentTime: new Date(),
          responseTime: new Date(),
        };
      }
      switch (retData.status) {
        case 1:
          status = 'arrived';
          statusCaption = '司机已确认到达';
          break;
        case 2:
          status = 'uploaded';
          statusCaption = '回执已上传';
          break;
        case 3:
          status = 'rejected';
          statusCaption = '上传回执未通过';
          break;
        case 4:
          status = 'reup';
          statusCaption = '回执已重新上传';

          break;
        case 8:
          status = 'confirmed';
          statusCaption = '中心已确认';
          break;
        default:
          status = 'loaded';
          statusCaption = '未到达';
          retData.arrivalTime = restRet.responseTime;
          break;
      }
      ret = {
        wbNum: retData.carAllocNo,
        rdcCode: retData.dcCd,
        rdcName: retData.dcName,
        totalPages: retData.totalPage,
        shiptoCode: retData.shpToSeq,
        shiptoName: retData.shpToName,
        arriveTime: retData.arrivalTime,
        photos: [],
        shipItems: [],
        status,
        statusCaption,
        statusNum: retData.status,
        arsCode: retData.arsCode,
        address: retData.address && retData.address !== 'null' ? retData.address : '',
        latitude: retData.latitude,
        longitude: retData.longitude,
        phone: retData.phone && retData.phone !== 'null' ? retData.phone : '',
        remark: retData.remark,
        shpToCd: retData.shpToCd,
        maxPage: retData.maxPage,
      };
      for (const pitem of retData.ordDetailList) {
        ret.shipItems.push({
          pageNo: pitem.pageNo,
          shipItems: pitem.ordList.map((witem) => ({
            id: witem.ordNo,
            orderNum: witem.ordNo,
            model: witem.modelCd,
            seq: witem.ordSeqNo,
            page: witem.pageNo,
            qty: witem.ordQty,
          })),
        });
      }
      for (let i = 0; i < ret.shipItems.length; i++) {
        let total = 0;
        for (let j = 0; j < ret.shipItems[i].shipItems.length; j++) {
          total += ret.shipItems[i].shipItems[j].qty;
        }
        if (total > 0) {
          ret.shipItems[i].shipItems.push({
            id: '----total',
            orderNum: '',
            model: '小计',
            seq: '99',
            page: ret.shipItems[i].pageNo,
            qty: total,
          });
        }
      }
      success = true;
    }
    if (photoRet && photoRet.code === '0000' && photoRet.data) {
      ret.photos = (<photoListData>photoRet.data).photos.map((item) => ({
        id: item.id,
        url: SERVER_URL + item.filePath,
        status: item.status,
        caption: item.status === 0 ? '驳回:' + item.remark : item.status === 1 ? '通过' : '已上传',
        wbNum: wbno,
      }));
    }
  }
  return new Promise((res, rej) => {
    if (success) {
      res({ result: 'success', waybill: ret });
    } else {
      rej({
        result: 'fail',
        waybill: null,
        code: (restRet && restRet.code) || '5000',
        message: (restRet && restRet.message) || '服务器访问失败',
      });
    }
  });
}

//运单中心确认完成
async function confirmComplete(wbno: string, shiptoCode: string, remark: string, openId: string): Promise<WaybillCompleteResult> {
  const ccParam: WaybillCompleteParams = {
    carAllocNo: wbno,
    shpToSeq: shiptoCode,
    remark,
    openId,
  };
  let result: TimsResponse<WaybillCompleteResult>;
  let success = false;
  let ret: WaybillCompleteResult = { result: 'success', wbno: wbno };
  try {
    result = await completeWaybill(ccParam);
    if (result && result.code === '0000') {
      success = true;
      ret.result = 'success';
    } else {
      success = false;
      ret.result = 'error';
      ret.message = result.message;
    }
  } catch (e) {
    result = e;
    ret.result = 'error';
    ret.message = '未知错误';
  }

  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

//运单司机或中心确认到达
async function confirmArrive(wbno: string, shiptoCode: string, cellphone: string, arriveTime: string): Promise<Result> {
  const driverInfo = await getDriverInfo(cellphone);
  const wbcParam: WaybillConfirmParams = {
    ...driverInfo,
    sysTime: arriveTime,
    carAllocNo: wbno,
    shpToSeq: shiptoCode,
    openId: driverInfo.openid,
  };
  let result: TimsResponse<Result>;
  let success = false;
  let ret: Result = { result: 'success' };
  try {
    result = await confirmWaybill(wbcParam);
    if (result && result.code === '0000' && result.data) {
      success = true;
      ret.result = 'success';
    }
  } catch (e) {
    result = e;
    ret.result = 'error';
  }

  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

//运单条件查询
async function queryWaybills(query: queryParams): Promise<queryResult> {
  let success = false;
  let ret: queryResult = {
    result: 'success',
    count: 0,
    waybills: [],
  };
  let restRet;
  try {
    restRet = await queryWaybill(query);
  } catch (err) {
    restRet = { code: '0500', data: null };
  }
  if (restRet.code === '0000') {
    if (restRet.data && restRet.data.orderList) {
      ret.waybills = restRet.data.orderList.map((item: wbqData) => ({
        wbNum: item.carAllocNo + item.shpToSeq,
        rdcCode: item.dcCd,
        rdcName: item.dcFullNm,
        totalPages: 1,
        shiptoCode: item.shpToSeq,
        shiptoName: item.shpToNm,
        arriveTime: item.insertDate,
        status: item.status + '',
        statusCaption: getStatusCaption(item.status),
        shipItems: [],
        photos: [],
        pgYmd: item.pgYmd,
      }));
      ret.count = restRet.data.orderList.length;
      if (ret.waybills) {
        ret.waybills.push({
          wbNum: '',
          rdcCode: '',
          rdcName: '合计',
          totalPages: 1,
          shiptoCode: '',
          shiptoName: '合计',
          arriveTime: '',
          status: '',
          statusCaption: ret.count + '',
          shipItems: [],
          photos: [],
          pgYmd: '',
        });
      }
    } else {
      ret.result = 'fail';
      ret.count = 0;
      ret.waybills = null;
    }
    success = true;
  } else {
    ret.result = 'error';
    ret.count = 0;
    ret.waybills = null;
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

//获取运单状态
async function queryWaybillStatus(wbno: string): Promise<wbStatusResult> {
  let success = false;
  let ret: wbStatusResult = {
    result: 'success',
    wbno,
    statusList: [],
  };
  let restRet;
  try {
    restRet = await queryWbStatus(wbno);
  } catch (err) {
    restRet = { code: '0500', data: null };
    success = false;
  }
  const statuses = [
    { status: 0, caption: '未到达', doneCaption: '司机已出发', seq: 0 },
    { status: 1, caption: '已到达', doneCaption: '司机需上传回执', seq: 1 },
    { status: 2, caption: '已上传待确认', doneCaption: '中心核验回执', seq: 2 },
    { status: 8, caption: '中心已确认', doneCaption: '运单完成', seq: 5 },
  ];
  if (restRet.code === '0000') {
    if (restRet.data && restRet.data.status >= 0) {
      let isCurrent = true;
      let preComment = '';
      ret.statusList = statuses.map((item) => {
        if (item.status <= restRet.data.status) {
          preComment = item.doneCaption;
          return {
            status: item.status,
            caption: item.caption,
            comment: item.doneCaption,
            seq: item.seq,
            doneDate: new Date(),
          };
        } else if (isCurrent) {
          isCurrent = false;
          return {
            status: item.status,
            caption: preComment,
            comment: item.caption,
            seq: item.seq,
            doneDate: null,
          };
        } else {
          return {
            status: item.status,
            caption: item.caption,
            comment: '',
            seq: item.seq,
            doneDate: null,
          };
        }
      });
      ret.result = 'success';
    } else {
      ret.result = 'fail';
      ret.statusList = [];
    }
    success = true;
  } else {
    ret.result = 'error';
    ret.statusList = [];
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

export { loadWaybill, confirmArrive, confirmComplete, queryWaybills, queryWaybillStatus, getStatusCaption };
