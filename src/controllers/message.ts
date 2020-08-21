import {
  msgQueryParams,
  msgQueryResult,
  Result,
  TimsResponse,
} from "../types/ars";
import { queryMessage, markMessage } from "./rest";

async function markRead(msgId: number): Promise<Result> {
  return markTheMessage(msgId);
}
//async function markHide(msgId: number): Promise<Result> {
//  return markTheMessage(msgId, 3);
//}
async function markTheMessage(msgid: number): Promise<Result> {
  let success = false;
  let ret: Result = {
    result: "success",
  };
  let restRet: TimsResponse<string>;
  try {
    restRet = await markMessage(msgid);
  } catch (e) {
    restRet = e;
  }

  if (restRet.code === "0000") {
    ret.result = "success";
    success = true;
  } else {
    ret.result = "error";
    success = false;
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

async function queryMessages(query: msgQueryParams): Promise<msgQueryResult> {
  let success = false;
  let ret: msgQueryResult = {
    result: "success",
    count: 0,
    messages: null,
  };
  let restRet;
  try {
    restRet = await queryMessage(query);
  } catch (err) {
    restRet = { code: "0500", data: null };
  }
  if (restRet.code === "0000") {
    if (restRet.data && restRet.data.sms && restRet.data.sms.records) {
      ret.messages = restRet.data.sms.records;
      ret.count = restRet.data.sms.records.length;
    } else {
      ret.result = "fail";
      ret.count = 0;
      ret.messages = null;
    }
    success = true;
  } else {
    ret.result = "error";
    ret.count = 0;
    ret.messages = null;
  }
  return new Promise((res, rej) => {
    if (success) {
      res(ret);
    } else {
      rej(ret);
    }
  });
}

export { queryMessages, markRead /*, markHide*/ };
