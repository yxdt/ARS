import { Component } from 'react';
import 'taro-ui/dist/style/index.scss';
import './app.scss';
import './icon.scss';

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return this.props.children;
  }
}
export default App;
