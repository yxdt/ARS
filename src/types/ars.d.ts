//命名规则：
//xxxxParams: 向服务器发送的参数
//xxxxData：从服务器返回的结果

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

export interface WxUserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;

  city: string;
  province: string;
  country: string;

  language: string;
}

export interface PhotoUrl {
  url: string;
}

export interface DriverInfo {
  openid: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
}

export interface WaybillConfirmParams {
  openid: string; //司机小程序用户openid
  sysTime: Date; //到达时间
  ordNo: string; //运单号
  shpToCd: string; //四位验证码
  latitude: string;
  longitude: string;
  address: string;
  phone: string;
}
export interface WaybillConfirmData {
  result: string;
}

export interface PhotosResult extends Result {
  photos: Array<photoData>;
}

export interface WaybillResult extends Result {
  waybill: Waybill;
}
export interface Result {
  result: string;
}
export interface InfoCardProps {
  title: string;
  message: string;
  extMessage: string;
  backFunc: Function;
}

export interface TimsResponse<T> {
  messageId: string;
  data: T | null;
  code: string;
  message: string;
  sentTime: Date;
  responseTime: Date;
}
export interface loginParam {
  phone: string;
  pwd: string;
}
export interface loginData {
  result: boolean;
  userName: string;
  roleName: string;
}

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

export interface wbData {
  ordNo: string;
  logCd: string;
  logName: string;
  totalPage: number;
  shpToCd: string;
  shpToName: string;
  arrivalTime: Date;
  ordDetailList: Array<wbdData>;
  status: number;
}

export interface ShipItem {
  id: number;
  orderNum: string;
  model: string;
  seq: number;
  page: number;
  qty: number;
}
export interface wbdData {
  id: number;
  orderNum: string;
  page: number;
  seq: number;
  model: string;
  qty: number;
}

export interface wbPhoto {
  url: string;
  caption: string;
  wbNum: string;
  status: number;
}

export interface photoData {
  url: string;
  status: number; //0:上传， 1：通过， 2：驳回
}
export interface photoListData {
  photos: photoData[];
}

export interface uploadParams {
  openid: string;
  ordNo: string;
  shpToCd: string;
}
export interface uploadData {
  fileName: string;
  filePath: string;
}
export interface uploadResult extends Result {
  upload: uploadData;
}
