//司机不要求注册，中心人员需要后台手工确认绑定openid或手机
export interface RegUser {
  userName: string;
  openId: string; //wx unique id
  cellphone: string;
  password: string; //hashed
  userType: string; //司机 or 中心人员
  area: string; //负责地区
  avatarUrl: string; //头像
  country: string; //wx
  province: string; //wx
  city: string; //wx
  gender: string; //wx 1: 男
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

export interface ShipItem {
  status: string;
}
export interface PhotoUrl {
  url: string;
}
export interface Waybill {
  rdcCode: string;
  startDatetime: Date;
  shiptoCode: string;
  plateNum: string;
  totalPages: number;
  status: string;
  statusCaption: string;
  sheetNum: string;
  shiptoName: string;
  shiptoTel: string;
  rdcName: string;
  driverName: string;
  shipItems: ShipItem[];
  photos: string[];
}
export interface WaybillResult {
  result: string;
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

export interface PhotosResult {
  photos: Array<string>;
}
