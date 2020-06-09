class User {
  id: string;
  openId: string;
  userName: string;
  cellphone: string;
  truckType: string;
  plateNum: string;
  superId: string;
  distNum: string;
  comment: string;
  password: string;
  province: string;
  city: string;
  address: string;
  gender: string;
  dob: Date;
  status: string;
  lastDatetime: Date;
  userType: string;
  constructor(
    id: string,
    userName: string,
    openId: string,
    cellphone: string,
    plateNum: string
  ) {
    this.id = id;
    this.userName = userName;
    this.openId = openId;
    this.cellphone = cellphone;
    this.plateNum = plateNum;
  }
}
