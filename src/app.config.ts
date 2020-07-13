export default {
  pages: [
    'pages/index/index',
    'pages/camera/camera',
    'pages/camera/verify',
    'pages/user/userinfo',
    'pages/user/Register',
    'pages/user/Login',
    'pages/sheet/index',
    'pages/sheet/query',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#a50034',
    navigationBarTitleText: 'TIMS',
    navigationBarTextStyle: 'white',
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于确认运单正确送达',
    },
  },
};
