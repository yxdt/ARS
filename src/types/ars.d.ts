export interface ShipItem {
  status: string;
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
}

export interface Result {
  result: string;
}
