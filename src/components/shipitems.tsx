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
  //const [shipItems, setShipItems] = useState(props.shipItems || []);
  console.log("shipitems.params:", props);
  const shipItems = props.shipItems || [];

  const [current, setCurrent] = useState(props.current);

  const arrPages: Array<number> = new Array();
  const pageInds: Array<TabItem> = new Array();
  let pagedItems;
  let idx = 0;
  for (let i = 1; i <= props.pageCount; i++) {
    pagedItems = shipItems.filter((item) => parseInt(item.page) === i);
    console.log("pagedItems:", pagedItems, pagedItems.length);
    if (pagedItems && pagedItems.length > 0) {
      console.log("has item:", i);
      arrPages.push(idx++);
      pageInds.push({ title: "【" + i + "】" });
      let sumVal = 0;
      for (let j = 0; j < pagedItems.length; j++) {
        sumVal += pagedItems[j].qty;
      }
      pagedItems.push({
        id: "----total",
        orderNum: "",
        model: "小计",
        seq: "99",
        page: 1 + current + "",
        qty: sumVal,
      });
    }
  }

  console.log("arrPages.current:", current, arrPages, pagedItems, pageInds);

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
        console.log("arrPages.map.pageNo:", pageNo, pagedItems);
        return (
          <AtTabsPane
            current={current}
            index={pageNo}
            key={"item-pane-" + pageNo}
          >
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
          </AtTabsPane>
        );
      })}
    </AtTabs>
  );
}
