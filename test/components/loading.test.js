import Nerv from "nervjs";
import { renderToString } from "nerv-server";
import Loading from "../../src/components/loading";
//import { AtAvatar } from "taro-ui";
describe("Loading Snap", () => {
  it("render Loading -- all default", () => {
    //const component = renderToString(<AtAvatar size="large" />);
    //console.log("component:", component);
    //const component = renderToString(Nerv.createElement('Loading', null, null));

    const component = renderToString(<Loading />);
    console.log("component:", component);

    //expect(component).toMatchSnapshot();
  });
});
