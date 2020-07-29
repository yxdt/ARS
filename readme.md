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

## fontawesome 图标使用列表:

barcode
calendar-check
calendar-times
camera
dolly
laptop
qrcode
truck
truck-moving
upload
shipping-fast

## 消息推送服务

1. 司机确认送达消息提示
2. 司机回执上传消息提示
3. 中心核验人员审核通过回执消息提示
4. 中心核验人员审核驳回回执消息提示
