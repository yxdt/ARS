import Taro, { useState } from '@tarojs/taro';
import { AtTabs, AtTabsPane, AtList, AtListItem } from 'taro-ui';
import { View } from '@tarojs/components';
import { TabItem } from 'taro-ui/types/tabs';

export default function ShipItems(props) {
  const [pages, setPages] = useState(props.pageCount);
  const [shipItems, setShipItems] = useState(props.shipItems || []);
  const [current, setCurrent] = useState(props.current);

  const arrPages: number[] = new Array(pages);
  const pageInds: TabItem[] = new Array(pages);

  for (let i = 0; i < pages; i++) {
    arrPages[i] = i;
    pageInds[i] = { title: '【' + (i + 1) + '】' };
  }
  const pagedItems = shipItems.filter((item) => item.page === current + 1);

  console.log('arrPages.current:', current, pages, arrPages, pagedItems);

  return (
    <AtTabs
      current={current}
      scroll={true}
      tabList={pageInds}
      onClick={(value) => {
        console.log('tab pane clicked:', value);
        setCurrent(value);
      }}>
      {arrPages.map((pageNo) => {
        console.log('tabpanes:', pageNo, shipItems);
        return (
          <AtTabsPane current={current} index={pageNo} key={'item-pane-' + pageNo}>
            <View>
              <AtList>
                {pagedItems.map((item) => {
                  return (
                    <AtListItem
                      key={'ship-item-' + item.id}
                      onClick={() => {
                        console.log('you clicked a list item.', item);
                      }}
                      title={item.orderNum}
                      note={item.modelNum}
                      extraText={'' + item.qty}></AtListItem>
                  );
                })}
              </AtList>
            </View>
          </AtTabsPane>
        );
      })}
    </AtTabs>
  );
}
