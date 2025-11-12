import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MainPage } from "../main/main";
import styles from "./App.module.css";
import { ModuleOne } from "../module-one/module-one";
import { ModuleTwo } from "../module-two/module-two";
import { ModuleThree } from "../module-three/module-three";
import { ModuleFour } from "../module_four/module-four";
import { ModuleFive } from "../module-five/module-five";
import { TwoModuleOne } from "../two-module-one/two-module-one";
import { TwoModuleTwo } from "../two-module-two/two-module-two";
import { TwoModuleThree } from "../two-module-three/two-module-three";
import { TwoModuleFour } from "../two-module-four/two-module-four";
import { TwoModuleFive } from "../two-module-five/two-module-five";
import { TwoModuleSix } from "../two-module-six/two-module-six";
import { TwoModuleSeven } from "../two-module-seven/two-module-seven";

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
                  <Route path="/2S/module-one">
            <TwoModuleOne></TwoModuleOne>
          </Route>
          <Route path="/2S/module-two">
            <TwoModuleTwo></TwoModuleTwo>
          </Route>
          <Route path="/2S/module-three">
            <TwoModuleThree></TwoModuleThree>
          </Route>
          <Route path="/2S/module-four">
            <TwoModuleFour></TwoModuleFour>
          </Route>
          <Route path="/2S/module-five">
            <TwoModuleFive></TwoModuleFive>
          </Route>
            <Route path="/2S/module-six">
            <TwoModuleSix></TwoModuleSix>
          </Route>
          <Route path="/2S/module-seven">
            <TwoModuleSeven></TwoModuleSeven>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
