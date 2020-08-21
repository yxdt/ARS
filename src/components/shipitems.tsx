import Taro, { useState } from "@tarojs/taro";
import { AtTabs, AtTabsPane, AtList, AtListItem } from "taro-ui";
import { View } from "@tarojs/components";
import { TabItem } from "taro-ui/types/tabs";
import { ShipItem, PagedShipItem } from "../types/ars";

export interface ShipItemProps {
  current: number;
  pageCount: number;
  shipItems: PagedShipItem[];
}

export default function ShipItems(props: ShipItemProps) {
  // const [pages, setPages] = useState(props.pageCount);
  //const [shipItems, setShipItems] = useState(props.shipItems || []);
  //consolelog("shipitems.params:", props);
  const shipItems = props.shipItems || [];

  const [current, setCurrent] = useState(props.current);

  let arrPages: Array<number> = new Array();
  let pageInds: Array<TabItem> = new Array();
  let pagedItems: Array<Array<ShipItem>> = new Array();
  for (let i = 1; i <= shipItems.length; i++) {
    pagedItems[i - 1] = shipItems[i - 1].shipItems;
    //consolelog("pagedItems:", pagedItems, pagedItems.length);
    arrPages.push(i - 1);
    pageInds.push({ title: "【" + shipItems[i - 1].pageNo + "】" });
  }

  //consolelog("arrPages.current:", current, arrPages, pagedItems, pageInds);

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
        //consolelog("arrPages.map.pageNo:", pageNo, pagedItems);
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
          </AtTabsPane>
        );
      })}
    </AtTabs>
  );
}
