const users = [
  {
    userName: "何燕员",
    roleName: "中心核验员",
    cellphone: "1390000",
    password: "0000",
  },
];

export default function request({ url, method, data, header }) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      ////consolelog("debugging");
      if (data.phone === "1390000" && data.pwd !== "") {
        retVal.userName = "何燕员";
        retVal.roleName = "中心核验员";
        retVal.result = true;
      } else {
        retVal.userName = "";
        retVal.roleName = "";
        retVal.result = false;
      }
      res(retVal);
    }, 1000);
  });
}
