/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-03 15:24:37
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-03 16:32:49
 */
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";

const BASE_NAME = window.__POWERED_BY_QIANKUN__ ? "/react" : "";


function App() {
  return (
    <Router basename={ BASE_NAME }>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

