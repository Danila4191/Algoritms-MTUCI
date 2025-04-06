import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MainPage } from "../main/main";
import styles from "./App.module.css";
import { ModuleOne } from "../module-one/module-one";

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
            
          </Route>
          <Route path="/module-three">
          
          </Route>
          <Route path="/module-four">
            
          </Route>
          <Route path="/module-five">
          
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
