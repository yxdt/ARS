import { msgQueryParams, msgQueryResult } from "../types/ars";
import { queryMessage } from "./rest";

async function markRead(msgId: number): Promise<Result> {
  let success = false;
}

async function queryMessages(query: msgQueryParams): Promise<msgQueryResult> {
  console.log("controllers.message.queryMessages.param:", query);

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
    //console.log("login error:", err);
    restRet = { code: "0500", data: null };
  }
  //console.log("controllers.users.doLogin.res:", restRet);
  if (restRet.code === "0000") {
    if (restRet.data && restRet.data.messages) {
      ret.messages = restRet.data.messages;
      ret.count = restRet.data.messages.length;
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
      //console.log('controllers.waybill.queryWaybills.res.rej:', restRet);
      rej(ret);
    }
  });
}

export { queryMessages };
