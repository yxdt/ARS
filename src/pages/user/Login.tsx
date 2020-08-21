import Taro, { useState } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtInput, AtMessage } from 'taro-ui';
import './index.scss';
import ArsTabBar from '../../components/tabbar';
import { doLogin, doOpenidLogin, getWxOpenId, checkToken } from '../../controllers/users';
export default function Login() {
  const [cellphone, setCellphone] = useState('');
  const [password, setPassword] = useState('');
  const [loging, setLoging] = useState(false);
  if (this.$router.params.cellphone) {
    setCellphone(this.$router.params.cellphone);
  }
  const needRefresh = checkToken();
  getWxOpenId((openid) => {
    if (needRefresh > 0) {
      setLoging(true);
      doOpenidLogin(openid)
        .then((ret) => {
          if (ret.result === 'success') {
            Taro.setStorageSync('roleName', ret.user.roleName);
            Taro.setStorageSync('userName', ret.user.userName);
            Taro.setStorageSync('token', ret.user.token);
            Taro.setStorageSync('tokendate', new Date().valueOf());
            Taro.setStorage({ key: 'cellphone', data: cellphone });
          }
        })
        .catch((e) => {
          console.warn('openidLogin fail:', e);
        });
    }
  });

  function login() {
    setLoging(true);
    doLogin(cellphone, password)
      .then((ret) => {
        let message, type;
        if (ret.result === 'success') {
          type = 'success';
          message = '登录成功！';
          Taro.setStorageSync('roleName', ret.user.roleName);
          Taro.setStorageSync('userName', ret.user.userName);
          Taro.setStorageSync('token', ret.user.token);
          Taro.setStorageSync('tokendate', new Date().valueOf());
          Taro.setStorage({ key: 'cellphone', data: cellphone });
          Taro.reLaunch({ url: '/pages/user/userinfo' });
        } else if (ret.result === 'error') {
          //网络或服务器错误
          type = 'error';
          message = '网络访问或服务器错误，请重试。';
          Taro.removeStorage({ key: 'roleName' });
          Taro.removeStorage({ key: 'userName' });
          Taro.removeStorage({ key: 'token' });
        } else {
          //登录失败
          type = 'error';
          message = '手机或密码错误，登录失败，请重试。';
          Taro.removeStorage({ key: 'roleName' });
          Taro.removeStorage({ key: 'userName' });
          Taro.removeStorage({ key: 'token' });
        }
        Taro.atMessage({
          message,
          type,
          duration: 6000,
        });
        setLoging(false);
      })
      .catch(() => {
        setLoging(false);
      });
  }

  return (
    <View className="user-reg-span">
      <AtMessage />
      <Text className="login-form-caption" style="margin-bottom:2rem">
        欢迎登录到 <Text className="home-title-hilite">TIMS</Text>\n
        <Text className="home-title-sub">配送信息管理系统</Text>
      </Text>
      <View>
        <View style={{ flexDirection: 'row', display: 'flex' }}>
          <AtInput
            className="home-input"
            name="cellphone"
            title="手机号"
            type="text"
            onChange={(val: string) => {
              setCellphone(val);
            }}
            placeholder="请输入您的手机号"
          />
        </View>
        <View style={{ flexDirection: 'row', display: 'flex' }}>
          <AtInput
            className="home-input"
            name="password"
            title="密 码"
            type="password"
            onChange={(val: string) => {
              setPassword(val);
            }}
            placeholder="请输入您的密码"
          />
        </View>
      </View>
      <View style="display:flex; flex-direction:row">
        <Button className="home-button preview-confirm-button" onClick={login} disabled={loging}>
          {loging ? '登录中...' : '登录'}
        </Button>
        <Button
          className="home-button preview-confirm-button"
          onClick={() => {
            setLoging(false);
            Taro.reLaunch({ url: '/pages/index/index' });
          }}
          disabled={loging}>
          返回
        </Button>
      </View>
      <Text className="caption">本功能只面向配送中心工作人员，请输入您的注册手机号及密码进行登录。</Text>
      <ArsTabBar current={2} />
    </View>
  );
}
