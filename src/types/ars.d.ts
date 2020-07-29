/**
 * 命名规则：
 * xxxxParams: 向服务器发送的参数
 * xxxxData：从服务器返回的结果
 * xxxxResult：系统对从服务器返回的结果进行二次处理解耦后的用于业务逻辑的结果
 */

//司机不要求注册，中心人员需要后台手工确认绑定openid或手机
export interface RegUser {
  userName: string; //default is wx.nickName
  openId: string; //wx unique id
  cellphone: string;
  password: string; //hashed
  userType: string; //司机 or 中心人员
  area: string; //负责地区
  avatarUrl: string; //头像
  country: string; //wx
  province: string; //wx
  city: string; //wx
  gender: string; //wx 1: 男 other: 女
}

//微信提供的用户公开信息
export interface WxUserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  city: string;
  province: string;
  country: string;
  language: string;
}

//信息提示卡属性
export interface InfoCardProps {
  title: string;
  message: string;
  extMessage: string;
  backFunc: Function;
}

//系统消息详情
export interface MessageDetailProps {
  title: string;
  content: string;
  ordNo: string;
  cdc: string;
  sentTime: string;
  markFunc: Function;
  msgId: string;
}

//返回结果的基础接口
export interface Result {
  result: string;
}

//用于确认到达前获取司机相关信息
export interface DriverInfo {
  openid: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
}

//用于到达确认
export interface WaybillConfirmParams {
  openId: string; //openid: string; //司机小程序用户openid
  sysTime: Date; //到达时间
  carAllocNo: string; //ordNo: string; //运单号
  shpToSeq: string; //shpToCd: string; //四位验证码
  latitude: string;
  longitude: string;
  address: string;
  phone: string;
}
export interface WaybillConfirmData {
  result: string;
}
export interface WaybillResult extends Result {
  waybill: Waybill;
}

//后台API调用的返回接口属性
export interface TimsResponse<T> {
  messageId: string;
  data: T | null;
  code: string; //0000,0400,0500
  message: string;
  sentTime: Date;
  responseTime: Date;
}

//中心人员用户登录相关
export interface loginParam {
  phone: string;
  pwd: string;
  openId: string;
}
export interface loginData {
  //result: boolean;
  userName: string;
  roleName: string;
}
export interface loginResult extends Result {
  user: loginData;
}

//运单相关
export interface Waybill {
  wbNum: string;
  rdcCode: string;
  rdcName: string;
  totalPages: number;
  shiptoCode: string;
  shiptoName: string;
  arriveTime: Date;
  status: string;
  statusCaption: string;
  shipItems: ShipItem[];
  photos: wbPhoto[];
}
//api 查询返回值
export interface wbData {
  carAllocNo: string; //ordNo
  dcCd: string; //logCd: string;
  dcName: string; //logName: string;
  totalPage: number;
  shpToSeq: string; //shpToCd: string;
  shpToName: string;
  arrivalTime: Date;
  ordDetailList: Array<wbdData>;
  status: number;
}
//运单详情项目
export interface ShipItem {
  id: string;
  orderNum: string;
  model: string;
  seq: string;
  page: string;
  qty: number;
}
//运单详情项目返回值
export interface wbdData {
  shpToCd: string; //id: number;
  ordNo: string; //orderNum: string;
  pageNo: string; //page: number;
  ordSeqNo: string; //seq: number;
  modelCd: string; //model: string;
  ordQty: number; //qty: number;
}
//运单回执
export interface wbPhoto {
  url: string;
  caption: string;
  wbNum: string;
  status: number;
}

//运单状态及日期
export interface wbStatus {
  status: number;
  doneDate: Date | null;
  caption: string;
  comment: string;
  seq: number;
}

export interface wbStatusData {
  statusList: Array<wbStatus>;
}

export interface wbStatusResult extends Result {
  statusList: Array<wbStatus>;
  wbno: string;
}
// export interface PhotoUrl {
//   url: string;
// }
//回执照片查询返回值
export interface photoData {
  url: string;
  status: number; //0:上传， 1：通过， 2：驳回
  remark: string;
}
export interface photoListData {
  photos: photoData[];
}

export interface PhotosResult extends Result {
  photos: Array<photoData> | null;
}

//待验证回执查询参数,返回的列表是status==0
//暂缓，只用openid作为参数
export interface unVerifiedPhotoParams {
  openid: string; //当前中心工作人员openid
  roleName: string; //当前中心工作人员角色
}
export interface uvPhotoData {
  url: string;
  ordNo: string;
  shpToCd: string;
  cdcName: string;
  state: number; //0:待审核 1: 通过 2：驳回
}
export interface uvPhotoListData {
  photos: Array<uvPhotoData> | null;
}
export interface uvPhotoResult extends Result {
  photos: Array<uvPhotoData> | null;
}

//回执上传
export interface uploadParams {
  openid: string;
  ordNo: string;
  shpToCd: string;
}
export interface uploadData {
  fileName: string;
  filePath: string;
  id: string;
}
export interface uploadResult extends Result {
  upload: uploadData;
}

//系统消息
//"{errcode:0,errmsg:ok}"
//"{errcode:43101,errmsg:"user refuse to accept the msg hint: [IgcdkAwgE-EAeUea]"}"
export interface msgSentData {
  errcode: string;
  errmsg: string;
}

export interface msgSentResult extends Result {
  info: msgSentData;
}

export interface message {
  msgId: number;
  title: string;
  content: string;
  ordNo: string;
  cdc: string;
  sentTime: string;
  status: number; //0:新生成, 1:已接收, 2:用户已拒收，3:用户标记已读
  toOpenid: string; //接收者openid
}

export interface messages {
  messages: Array<message>;
}

export interface msgQueryParams {
  beginDate: Date;
  endDate: Date;
  toOpenid: string;
  ordNo: string;
  cdcCode: string;
  status: number;
}

export interface msgQueryData {
  messages: Array<message> | null;
}
export interface msgQueryResult {
  result: string;
  messages: Array<message> | null;
  count: number;
}

//已上传回执核验
export interface verifyParams {
  carAllocNo: string; //ordNo: string;
  shpToSeq: string; //shpToCd: string;
  status: number;
  remark: string;
  imgId: string;
  openId: string;
}
export interface verifyData {
  result: string;
}

export interface verifyResult extends Result {
  filename: string;
  remark: string;
}

//运单查询
export interface queryParams {
  pgYmdStart: string; //beginDate: Date;
  pgYmdEnd: string; //endDate: Date;
  shpToCd: string; //cdcCode: string;
  status: number; //wbStatus: number;
  carAllocNo: string; //ordNo: string;
}
export interface queryData {
  waybills: Array<wbData> | null;
}
export interface queryResult extends Result {
  count: number;
  waybills: Array<Waybill> | null;
}
