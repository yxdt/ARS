## 开发环境搭建

本小程序是 Typescript+Node.js，并基于京东的 Tarojs 框架开发的，开发环境如下：

1. node.js: 版本为 14.5 或更高

   > [nodejs 官方网站，点击跳转](https://nodejs.org/en/)

   > 打开网站，下载安装当前最新版 nodejs 即可

   > 安装后，打开命令行工具，输入
   > \> node --version
   > 如果显示相应的版本号，说明安装已成功

2. Taro.js: 开发版本为 2.2.7。

   > 注意：Taro.js 的最新版本为 3.0，是在项目启动后才推出的（2020.7.1），而且在实际手机测试运行过程中，发现部分组件不能正常工作，因此目前还不能用 3.0 版框架进行开发

   > [Tarojs 官方网址](https://taro-docs.jd.com/taro/docs/GETTING-STARTED)

   > 安装命令：

   > \> npm install -g @tarojs/cli@2.2.7

   > 注意：安装指定版本（2.2.7）的 tarojs，一定要安装 2.2.7 版本。

3. 程序运行：

   > 将本程序源代码解压后，进入所在目录，并输入下面的命令，安装相关程序包：

   > \>npm install

   > 安装成功后，执行下面的命令，生成微信小程序包：

   > \>npm run build:weapp

   > 生成后的小程序包在当前目录下的.\dist 目录中

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
|   +--controllers                    ~~控制器目录(业务逻辑实现)
|   |     +--tests                    ~~功能测试文件目录
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
|   +--mock                           ~~虚拟数据接口目录
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
+--wetest
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

## 消息推送服务

1. 司机确认送达消息提示
2. 司机回执上传消息提示
3. 中心核验人员审核通过回执消息提示
4. 中心核验人员审核驳回回执消息提示
