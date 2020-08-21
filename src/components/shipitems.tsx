import Taro, { useState } from "@tarojs/taro";
import { AtTabs, AtTabsPane, AtList, AtListItem } from "taro-ui";
import { TabItem } from "taro-ui/types/tabs";
import { ShipItem, PagedShipItem } from "../types/ars";

export interface ShipItemProps {
  current: number;
  pageCount: number;
  shipItems: PagedShipItem[];
}
export default function ShipItems(props: ShipItemProps) {
  const shipItems = props.shipItems || [];
  const [current, setCurrent] = useState(props.current);
  let arrPages: Array<number> = new Array();
  let pageInds: Array<TabItem> = new Array();
  let pagedItems: Array<Array<ShipItem>> = new Array();
  for (let i = 1; i <= shipItems.length; i++) {
    pagedItems[i - 1] = shipItems[i - 1].shipItems;
    arrPages.push(i - 1);
    pageInds.push({ title: "【" + shipItems[i - 1].pageNo + "】" });
  }

  return (
    <AtTabs
      current={current}
      scroll={true}
      tabList={pageInds}
      onClick={(value) => {
        setCurrent(value);
      }}
    >
      {arrPages.map((pageNo) => {
        return (
          <AtTabsPane
            current={current}
            index={pageNo}
            key={"item-pane-" + pageNo}
          >
            <AtList>
              {pagedItems[current].map((item) => {
                return (
                  <AtListItem
                    key={"ship-item-" + item.id}
                    onClick={() => {}}
                    title={item.orderNum}
                    note={item.model}
                    extraText={"" + item.qty}
                  ></AtListItem>
                );
              })}
            </AtList>
          </AtTabsPane>
        );
      })}
    </AtTabs>
  );
}
