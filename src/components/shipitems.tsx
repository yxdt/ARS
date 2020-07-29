import Taro, { useState } from "@tarojs/taro";
import { AtTabs, AtTabsPane, AtList, AtListItem } from "taro-ui";
import { View } from "@tarojs/components";
import { TabItem } from "taro-ui/types/tabs";
import { ShipItem } from "../types/ars";

export interface ShipItemProps {
  current: number;
  pageCount: number;
  shipItems: ShipItem[];
}

export default function ShipItems(props: ShipItemProps) {
  // const [pages, setPages] = useState(props.pageCount);
  const [shipItems, setShipItems] = useState(props.shipItems || []);
  const [current, setCurrent] = useState(props.current);

  const arrPages: Array<number> = new Array(props.pageCount || 1);
  const pageInds: Array<TabItem> = new Array(props.pageCount || 1);

  for (let i = 0; i < props.pageCount; i++) {
    arrPages[i] = i;
    pageInds[i] = { title: "【" + (i + 1) + "】" };
  }
  const pagedItems = shipItems.filter((item) => item.page === 1 + current + "");

  //consolelog('arrPages.current:', current, pages, arrPages, pagedItems);

  return (
    <AtTabs
      current={current}
      scroll={true}
      tabList={pageInds}
      onClick={(value) => {
        //consolelog('tab pane clicked:', value);
        setCurrent(value);
      }}
    >
      {arrPages.map((pageNo) => {
        //consolelog('tabpanes:', pageNo, shipItems);
        return (
          <AtTabsPane
            current={current}
            index={pageNo}
            key={"item-pane-" + pageNo}
          >
            <View>
              <AtList>
                {pagedItems.map((item) => {
                  return (
                    <AtListItem
                      key={"ship-item-" + item.id}
                      onClick={() => {
                        //consolelog('you clicked a list item.', item);
                      }}
                      title={item.orderNum}
                      note={item.model}
                      extraText={"" + item.qty}
                    ></AtListItem>
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
