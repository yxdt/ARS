# TIMS 小程序说明

## 开发环境搭建

本小程序是 Typescript+Node.js，并基于京东的 Tarojs 框架开发的，开发环境如下：

1. node.js: 版本为 14.5 或更高

   > [nodejs 官方网站，点击跳转](https://nodejs.org/en/)

   > 打开网站，下载安装当前最新版 nodejs 即可

   > 安装后，打开命令行工具，输入

   ```
     \> node --version
   ```

   > 如果显示相应的版本号，说明安装已成功

2. Taro.js: 开发版本为 2.2.7。

   > 注意：Taro.js 的最新版本为 3.0，是在项目启动后才推出的（2020.7.1），而且在实际手机测试运行过程中，发现部分组件不能正常工作，因此目前还不能用 3.0 版框架进行开发

   > [Tarojs 官方网址](https://taro-docs.jd.com/taro/docs/GETTING-STARTED)

   > 安装命令：

   ```
   \> npm install -g @tarojs/cli@2.2.7
   ```

   > 注意：安装指定版本（2.2.7）的 tarojs，一定要安装 2.2.7 版本。

3. 程序运行：

   > 将本程序源代码解压后，进入所在目录，并输入下面的命令，安装相关程序包：

   ```
   \>npm install
   ```

   > 安装成功后，执行下面的命令，生成微信小程序包：

   > \>npm run build:weapp

   > 生成后的小程序包在当前目录下的.\dist 目录中

   > 如果需要调试小程序，可以运行如下命令，该命令生成的小程序包由于加了调试信息，会超过 2M 的限制，因此无法上传到真机进行调试：

   > \>npm run dev:weapp

4. 安装微信开发者工具：

   > 通过微信开发者工具，可以上传并发布小程序：

   > [微信开发工具下载链接](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

   > 下载安装完成后，运行开发工具，打开.\dist 目录。如果看到小程序首页则说明正常加载。即可进行小程序的测试、上传、发布等相关操作。

## 小程序功能验证测试

小程序测试分为两大部分：功能测试和用户界面测试，其中用户界面测试需要正确安装并配置了微信开发者工具。

需要在微信开发者工具中打开自动配置： 在微信开发者工具菜单项“设置”中，打开“安全”面板，确定“服务端口”为开放状态即可。

设置完成后，输入命令即可进行测试：

\>npm run test

> 注意： 首次运行测试会生成界面快照，只有小程序开发工具正确安装并完成配置后，才可以顺利进行测试，在测试期间可以看到开发者工具自动打开小程序并逐一点击界面上的相关功能。

> 小程序测试结果输出：

```
> LGARS@1.0.0 test ..\Shipping\ARS
> jest

 PASS  src/controllers/tests/camera.test.js
  Query un-verified Photos.
    √ should get 3 photos return (35 ms)
    √ should get 0 photos in return (32 ms)
    √ should get error (31 ms)
  Approve Uploaded Picture.
    √ should approve the picture (32 ms)
    √ should have no permission to approve the picture (32 ms)
    √ should got an error (31 ms)
  Reject Uploaded Picture.
    √ should reject the picture (32 ms)
    √ should have no permission to reject the picture (32 ms)
    √ should got an error (32 ms)

 PASS  src/controllers/tests/rest.test.js
  User Login API test
    √ user login successful (33 ms)
    √ user login fail (31 ms)
    √ user login cellphone required (32 ms)
    √ user login password required (31 ms)
    √ user login reject (31 ms)
  Waybill Query
    √ should get a driver confirmed waybill (32 ms)
    √ should get a center confirmed waybill (31 ms)
    √ should get a not arrived waybill (32 ms)
    √ should get no waybill (31 ms)
    √ should get reject (32 ms)
  confirm Waybill test
    √ should confirm the waybill by driver (33 ms)

 PASS  src/controllers/tests/message.test.js
  System Message Sending test: Driver Arrive Message
    √ should driver Send Arrived message successful (34 ms)
    √ should CDC clerk refuse the message. (31 ms)
    √ should get a fail response. (31 ms)
  System Message Sending test: Driver Upload Notifacation Message
    √ should driver Send photo upload message successful (32 ms)
    √ should CDC clerk refuse the message. (31 ms)
    √ should get a fail response. (31 ms)
  System Message Sending test: CDC Reject Notifacation Message
    √ should CDC Send photo reject message successful (31 ms)
    √ should driver refuse the message. (32 ms)
    √ should get a fail response. (32 ms)
  Query System Messages
    √ should query messages successful (31 ms)
    √ should query message fail (31 ms)
    √ should mark message as read error (32 ms)
  Mark System Messages as read
    √ should mark message as read successful (31 ms)
    √ should mark message as read fail (33 ms)
    √ should mark message as read error (31 ms)
  Mark System Messages as hide
    √ should query messages successful (31 ms)
    √ should mark message as hide fail (31 ms)
    √ should mark message as hide error (32 ms)

 PASS  src/controllers/tests/user.test.js
  User Login Test
    √ should login successfully (33 ms)
    √ should login fail (32 ms)
    √ password cannot be empty (31 ms)
    √ should reject (31 ms)
  Driver Info Test
    √ should get driver info correctly (1002 ms)

 PASS  src/controllers/tests/waybill.test.js (6.725 s)
  Load Waybill Test
    √ should load an arrived waybill successfully (63 ms)
    √ should load an confirmed waybill successfully (62 ms)
    √ should load an loaded waybill successfully (62 ms)
    √ should load an loaded waybill but no photos successfully (62 ms)
    √ should not find a waybill (62 ms)
    √ should reject an error  (63 ms)
  Confirm Waybill Test
    √ should confirm (1032 ms)
    √ should return fail for a already confirmed waybill (1032 ms)
    √ should return error for a server error (1032 ms)
  Query Waybill Status Test
    √ should return a statuslist (31 ms)
    √ should return a fail empty (32 ms)
    √ should return a error result (31 ms)
  Query Waybills Test
    √ should return waybills (31 ms)
    √ should return empty waybills (32 ms)
    √ should return error (33 ms)

 PASS  wetest/pages.test.js (112.609 s)
  pages snapshot test
    √ index page should load properly (9481 ms)
    √ Camera page should load properly (3166 ms)
    √ userinfo page should load properly (3170 ms)
    √ Waybill detail page should load properly (4099 ms)
    √ Waybill query list page should load properly (3570 ms)
    √ camera verify list page should load properly (3558 ms)
  Index page test
    √ index page should have elements (3576 ms)
    √ should display error prompt (7742 ms)
  receipt photo page test
    √ should display error prompt (12209 ms)
  userinfo page test
    √ should not logged in (3268 ms)
    √ should not have center permissions (4585 ms)
    √ should have the center permissions (16458 ms)
  verify uploaded receipts test
    √ should log in successfully (4983 ms)
    √ should have verify permission and have uploaded list (6193 ms)
    √ should have verify permission and have query function (8772 ms)
    √ should log out (4133 ms)

Test Suites: 6 passed, 6 total
Tests:       74 passed, 74 total
Snapshots:   6 passed, 6 total
Time:        114.924 s, estimated 116 s
Ran all test suites.
```

## 项目结构

```
+config                               ~~配置文件目录
|  +--dev.js                          ~~开发时配置
|  +--index.js                        ~~项目配置
|  +--prod.js                         ~~运行时配置
+src                                  ~~源代码目录
|   +--assets                         ~~静态资源目录
|   |     +--fonts                    ~~Fontawesome图标集
|   |     +--img                      ~~静态图片目录
|   +--components                     ~~项目组件目录
|   |     +--comp.scss                ~~组件SCSS文件
|   |     +--infocard.tsx             ~~信息提示组件
|   |     +--loading.tsx              ~~载入状态提示组件
|   |     +--messagedetail.tsx        ~~详细信息组件
|   |     +--navbar.tsx               ~~导航条组件
|   |     +--shipitems.tsx            ~~运单详细条目组件
|   |     +--tabbar.tsx               ~~下方栏目导航组件
|   +--controllers                    ~~控制器目录(业务逻辑层)
|   |     +--tests                    ~~功能测试文件目录(正式版中已删除)
|   |     |     +--__mock__           ~~虚拟测试数据目录
|   |     |     |     +--userLogin.js ~~用户登录测试相关信息
|   |     |     +--camera.test.js     ~~拍照及二维码相关测试
|   |     |     +--message.test.js    ~~消息收发相关测试
|   |     |     +--rest.test.js       ~~REST API相关测试
|   |     |     +--user.test.js       ~~用户功能相关测试
|   |     |     +--waybill.test.js    ~~运单功能相关测试
|   |     +--camera.ts                ~~拍照及二维码相关功能
|   |     +--message.ts               ~~消息发送接收相关功能
|   |     +--rest.ts                  ~~服务器Rest API相关功能
|   |     +--user.ts                  ~~用户相关功能
|   |     +--waybill.ts               ~~运单相关功能
|   +--libs                           ~~外部库
|   |     +--qqmap-wx-jssdk.js        ~~腾讯位置服务库
|   +--mock                           ~~虚拟数据接口目录(正式版中已删除)
|   |     +--api.ts
|   +--pages                          ~~小程序功能页目录
|   |     +--camera
|   |     |     +--camera.scss
|   |     |     +--camera.tsx         ~~拍照及二维码页面
|   |     |     +--verify.tsx         ~~待审核回执功能页面
|   |     +--index
|   |     |     +--index.scss
|   |     |     +--index.tsx          ~~小程序主页
|   |     +--sheet                    ~~小程序运单相关页
|   |     |     +--index.scss
|   |     |     +--index.tsx          ~~运单详情页
|   |     |     +--query.tsx          ~~运单查询页
|   |     +--user                     ~~用户相关页面(司机、中心工作人员)
|   |     |     +--index.scss
|   |     |     +--Login.tsx          ~~系统登录页面(面向中心工作人员)
|   |     |     +--Register.tsx       ~~用户注册页面(已取消)
|   |     |     +--userinfo.tsx       ~~用户个人信息页面(区分司机、中心工作人员)
|   +--types
|   |     +--ars.d.ts                 ~~小程序相关类型定义
+--wetest                             ~~小程序自动化界面测试目录(正式版中已删除)
|   +--__snapshots__
|   |     +--pages.test.js.snap       ~~小程序页面快照(自动生成)
|   +--pages.test.js                  ~~小程序页面功能测试
+--.gitattributes                     ~~GIT配置文件(自动生成)
+--.gitignore                         ~~GIT忽略文件
+--babelconfig.js                     ~~babel配置文件
+--global.d.ts                        ~~项目类型定义文件
+--jest.config.js                     ~~Jest配置文件(用于测试)
+--package.json                       ~~项目引用安装包配置
+--project.config.json                ~~项目配置文件(用于发布小程序)
+--readme.md                          ~~项目说明文件
+--sitemap.json                       ~~小程序入口说明(小程序发布需要)
+--tsconfig.json                      ~~TypeScript配置文件
+--webpack.config.js                  ~~Webpack配置文件
```

## 功能列表：

### 首页：

1. 运单二维码扫描读取

2. 运单编码输入

   - 错误的处理（错误订单号、验证码、无网络）

3. 运单查询

   - 查询成功结果展示
   - 查询失败：显示原因

4. 用户登录功能（面向中心人员）

   - 登录成功
   - 登录失败

### 司机运单操作

1. 运单详情：运单号定位，运单详情显示

2. 运单明细

   - 查看运单信息
   - 查看运单货品详细清单

3. 回执照片列表

   - 查看已上传回执并可以对驳回回执重新上传、对尚未标记完成上传的运单，可以进行删除操作
   - 中心工作人员可以对上传回执进行通过、驳回、删除操作

4. 到达确认

   - 验证码
   - 司机手机号
   - 司机位置信息（经纬度、地址）：司机拒绝后穿空值
   - 司机的地点信息（腾讯位置服务）：同上
   - 司机 openid

5. 司机回执上传

   - 回执照片拍摄
   - 回执照片缩放查看
   - 回执确认上传、取消重拍
   - 上传成功提示
   - 上传失败提示
     = 回执上传成功，服务器端应发送订阅消息通知中心核验

6. 回执退回提醒

   - 中心人员核验
   - 如果不通过，驳回时给出驳回原因，并自动发送给司机退回提醒
     = 司机应事先订阅接收消息，

### 回执上传页：（根据用户角色划分）

1. 前提 1：判断是否已有运单已选定

   - 如果没有选定：提示用户，并跳转到首页待输入
   - 如果已选定，显示相应装车单号

2. 前提 2：根据运单状态确定是否可以上传

   - 如果是司机，只能对到达确认的运单上传回执
   - 如果是中心人员，可以对已经中心确认的运单上传回执

3. 拍照功能：调用微信开放接口拍照
4. 预览功能

   - 图片缩放、移动

5. 上传功能

   - 成功提示
   - 失败提示

6. 取消上传

### 个人信息页

1. 微信授权功能：获取昵称、头像、性别、地区等信息

2. 消息订阅功能

   - 司机、中心人员只有在订阅了消息后，才可以接收模板消息

3. 面向中心人员功能

   - 回执审核

     - 列出需要审核的回执列表
     - 用户点击回执可以打开对应运单，并显示已上传回执照片并缩放查看
     - 用户可以通过、驳回上传回执，对于驳回回执，可以给出理由

   - 运单查询

     - 根据查询条件查询
     - 给出查询结果列表
     - 可以点击打开对应的运单查看详细信息

### 基础支持功能

1. 用户 openid 获取
2. 用户地理位置信息的获取
3. 联网状态检查及异常提示
4. 小程序内信息收发及提示功能
5. 系统信息发送功能
6. 系统信息接收提示功能
7. 小程序页面跳转状态刷新功能

### 消息推送服务类型

1. 司机确认送达消息提示
2. 司机回执上传消息提示
3. 中心核验人员审核通过回执消息提示
4. 中心核验人员审核驳回回执消息提示

### 微信开发者工具自动调试

> 需要手工将 users/name/appdata/local/目录下的微信开发者工具目录删除，然后重新安装微信开发者工具，确保 cli 能够正确索引到。

> 注：为了避免对正式版的性能影响，已经将自动调试程序、测试程序移除

### 真机发布问题

> 避免使用异步函数的调用的 finally(): finally()在模拟器上可以工作，但在真机不工作。至少在 iPhone6S 的测试机上不工作。
> 避免使用日期函数本地化 toLocalString(): 在安卓环境下不能正常显示。
> 避免使用 padStart(): 在客户端环境下不能正常使用。
