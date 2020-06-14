import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { AtForm, AtInput, AtList, AtListItem, AtButton, AtIcon } from 'taro-ui';
import './index.scss';
import Loading from '../../components/loading';
import { getWaybill } from '../../controllers/rest';

export interface SheetState {
  checked: boolean;
  loading: boolean;
  waybill: object;
  itemCount: number;
  itemflags: Array<boolean>;
}
export default class Index extends Component<null, SheetState> {
  constructor() {
    super(...arguments);
    this.state = {
      checked: false,
      loading: true,
      waybill: {},
      itemCount: 0,
      itemflags: [],
    };
    console.log('sheet', this.$router.params);
  }

  componentWillMount() {}

  componentDidMount() {
    console.log('componentDidMount.props:', this.props, this.$router.params);
    const wbno = this.$router.params.wbno;
    getWaybill(wbno).then((ret: object) => {
      console.log('getWaybill.ret:', ret);
      if (ret) {
        let iflags = new Array();
        const iCnt = ret.shipItems.length;
        for (let i = 0; i < iCnt; i++) {
          iflags[i] = ret.shipItems[i].status === 'arrived';
        }
        this.setState({
          loading: false,
          waybill: ret,
          itemflags: iflags,
          itemCount: iCnt,
        });
      }
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '货运单',
  };

  openCamera() {
    Taro.navigateTo({
      url: '/pages/camera/camera?isScan=true',
    });
  }
  openManual() {
    Taro.navigateTo({
      url: '/pages/driver/index',
    });
  }

  handleChange(val) {
    console.log('something has been changed:', val);
  }
  render() {
    const { loading, waybill, checked, itemCount } = this.state;
    console.log('loading:', loading);
    if (loading) {
      return <Loading />;
    }
    return (
      <View className="index">
        <Text className="form-title">货运单详细信息</Text>
        <View className="sheet-info-span">
          <Text className="form-caption">
            运单状态： <Text className="form-hilite">{waybill.statusCaption}</Text>
          </Text>
          <Text className="form-caption">运单编号：{waybill.sheetNum}</Text>
          <Text className="form-caption">
            发行时间：
            {new Date(waybill.startDatetime).toLocaleString('zh-CN')}
          </Text>
          <Text className="form-caption">往来单位：{waybill.shiptoName}</Text>
          <Text className="form-caption">联系电话：{waybill.shiptoTel}</Text>
          <Text
            style={{
              color: '#f5f5f5',
              height: '33px',
              margin: '0 auto',
            }}>
            ---
          </Text>
          <Text className="form-caption">
            物流中心：{waybill.rdcCode}（{waybill.rdcName}）
          </Text>
          <Text className="form-caption">
            接货单位：{waybill.shiptoCode} （{waybill.shiptoName}）
          </Text>
          <Text className="form-caption">
            车辆编号：{waybill.plateNum}（{waybill.driverName}）
          </Text>
          <View className="form-detail-span">
            <View className="form-detail-header">
              <Text className="form-detail-title">货运清单</Text>
              <Text className="form-detail-title-right">全选</Text>
              <AtIcon
                prefixClass="fa"
                value={checked ? 'check-square-o' : 'square-o'}
                size="20"
                color="#666666"
                customStyle="margin-left:10px;margin-top:1.5rem;"
                onClick={() => {
                  const iFlags = new Array();
                  for (let i = 0; i < itemCount; i++) {
                    iFlags[i] = !checked;
                  }
                  this.setState({
                    itemflags: iFlags,
                    checked: !checked,
                  });
                }}></AtIcon>
            </View>
            <AtList>
              {waybill.shipItems.map((item, index) => (
                <AtListItem
                  key={'ship-item-' + item.id}
                  onClick={() => {
                    const iFlag = this.state.itemflags;
                    iFlag[index] = !iFlag[index];
                    this.setState({ itemflags: iFlag });
                  }}
                  title={item.orderNum}
                  note={item.modelNum}
                  extraText={'' + item.qty}
                  iconInfo={{
                    prefixClass: 'fa',
                    value: this.state.itemflags[index] ? 'check-square-o' : 'square-o',
                    size: 25,
                    color: '#666',
                  }}></AtListItem>
              ))}
            </AtList>
          </View>
          <AtButton className="home-button" formType="submit">
            确认到达
          </AtButton>
          <AtButton
            className="home-button"
            formType="reset"
            onClick={() => {
              Taro.navigateBack();
            }}>
            取消
          </AtButton>
        </View>
      </View>
    );
  }
}
