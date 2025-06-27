import React, { useState } from "react";
// @ts-ignore
import styles from "./module-one.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import {
  getArrRandom,
  selectionSort,
  QuickSort,
} from "../../utils/functions";

export const ModuleOne = () => {
  const [inputValue, setInputValue] = useState({ value: "number" });
  const [loading, setloading] = useState<boolean>(false);
  const [arrValue, setArrValue] = useState<number[]>([]);
  const [stopwatcSelectValue, setStopwatcSelectValue] = useState<number>(0);
  const [stopwatcQuickValue, setStopwatcQuickValue] = useState<number>(0);
  const [stopwatcStandartValue, setStopwatcStandartValue] = useState<number>(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, value: e.target.value });
  };

  const onClick = () => {
    setloading(true);
    const arr = getArrRandom(Number(inputValue.value));

    let start = new Date().getTime();
    selectionSort(arr);
    let end = new Date().getTime();
    setStopwatcSelectValue(end - start);


    start = new Date().getTime();
    QuickSort(arr);
    end = new Date().getTime();
    setStopwatcQuickValue(end - start);


    start = new Date().getTime();
    arr.sort(function (a, b) {
      return a - b;
    });
    end = new Date().getTime();
    setStopwatcStandartValue(end - start);


    setArrValue(selectionSort(getArrRandom(Number(inputValue.value))));
    setloading(false);
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.container}>
        <div className={styles.imput}>
          <Input
            type="number"
            onChange={onChange}
            max={10000}
            isLimitText={true}
          />
          <Button
            onClick={onClick}
            text="Сортировать"
            isLoader={loading}
            disabled={
              inputValue.value.length < 2 ||
              inputValue.value.length > 5 ||
              loading
            }
          />
        </div>
        <div className={styles.result__table}>
          <p>Select {stopwatcSelectValue} мС </p>
          <p>Quick {stopwatcQuickValue} мС </p>
          <p>Standart {stopwatcStandartValue} мс</p>
        </div>
        <div className={styles.result}>
          {arrValue.map((item) => (
            <p className={styles.result__item}>{item}</p>
          ))}
        </div>
      </div>
    </SolutionLayout>
  );
};
