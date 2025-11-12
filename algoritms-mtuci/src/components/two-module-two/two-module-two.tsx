import React, { useState } from "react";
// @ts-ignore
import styles from "./two-module-two.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
interface RodCuttingResult {
  maxRevenue: number;
  optimalCuts: number[];
  dpTable: number[];
  solutionTable: number[];
}

 interface PriceTable {
  length: number;
  price: number;
}
export const TwoModuleTwo = () => {


  return (
    <SolutionLayout title="Методы динамического программирования">
      <div className={styles.container}>
       
      </div>
    </SolutionLayout>
  );
};