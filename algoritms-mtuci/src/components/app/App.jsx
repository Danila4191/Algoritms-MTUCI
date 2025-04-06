import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MainPage } from "../main/main";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <MainPage />
          </Route>
          <Route path="/module-one">
          
          </Route>
          <Route path="/module-two">
            
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
