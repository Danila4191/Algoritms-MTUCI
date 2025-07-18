import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MainPage } from "../main/main";
import styles from "./App.module.css";
import { ModuleOne } from "../module-one/module-one";
import { ModuleTwo } from "../module-two/module-two";
import { ModuleThree } from "../module-three/module-three";
import { ModuleFour } from "../module_four/module-four";
import { ModuleFive } from "../module-five/module-five";
function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <MainPage />
          </Route>
          <Route path="/module-one">
            <ModuleOne></ModuleOne>
          </Route>
          <Route path="/module-two">
            <ModuleTwo></ModuleTwo>
          </Route>
          <Route path="/module-three">
            <ModuleThree></ModuleThree>
          </Route>
          <Route path="/module-four">
            <ModuleFour></ModuleFour>
          </Route>
          <Route path="/module-five">
            <ModuleFive></ModuleFive>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
