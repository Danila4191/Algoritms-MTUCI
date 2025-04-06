import React, { useState, useEffect } from "react";
// @ts-ignore
import styles from "./module-two.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { InterpolationSearch, createRandomArr } from "../../utils/functions";

export const ModuleTwo = () => {
  const [inputValue, setInputValue] = useState({ value: 0 });
  const [loading, setloading] = useState<boolean>(false);
  const [arrValue, setArrValue] = useState<number[]>([]);
  const [number, setNumber] = useState<number>(-1);
  const [stopwatcInterpolationValue, setStopwatcInterpolationValue] =
    useState<number>(0);
  const [stopwatcStandartValue, setStopwatcStandartValue] = useState<number>(0);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, value: e.target.valueAsNumber });
  };

  useEffect(() => {
    setArrValue(
      createRandomArr(100, 0, 1000).sort(function (a, b) {
        return a - b;
      })
    );
  }, []);

  const onClickSearch = () => {
    setloading(true);
    let start = new Date().getTime();
    InterpolationSearch(inputValue.value, arrValue);

    let end = new Date().getTime();
    setStopwatcInterpolationValue(end - start);
    setNumber(InterpolationSearch(inputValue.value, arrValue));

    start = new Date().getTime();
    arrValue.find((item) => item === inputValue.value);
    end = new Date().getTime();
    setStopwatcStandartValue(end - start);
    setloading(false);
    console.log(inputValue.value);
    console.log(arrValue);
    console.log(InterpolationSearch(inputValue.value, arrValue));
    console.log(arrValue.find((item) => item === inputValue.value));
  };

  const onClickDelete = () => {
    setArrValue(arrValue.filter((item) => item !== inputValue.value));
    setNumber(-1);
  };
  const onClickAdd = () => {
    setArrValue(
      arrValue.concat(inputValue.value).sort(function (a, b) {
        return a - b;
      })
    );
  };
  return (
    <SolutionLayout title="Поиск элемента">
      <div className={styles.container}>
        <div className={styles.imput}>
          <Input
            type="number"
            onChange={onChange}
            max={1000}
            isLimitText={true}
          />
          <Button
            onClick={onClickSearch}
            text="Поиск"
            isLoader={loading}
            disabled={inputValue.value < 0 || inputValue.value > 100 || loading}
          />
          <Button
            onClick={onClickAdd}
            text="добавить"
            isLoader={loading}
            disabled={inputValue.value < 0 || inputValue.value > 100 || loading}
          />
          <Button
            onClick={onClickDelete}
            text="удалить"
            isLoader={loading}
            disabled={inputValue.value < 0 || inputValue.value > 100 || loading}
          />
        </div>
        <div className={styles.result__table}>
          <p>interpolation {stopwatcInterpolationValue} мС </p>
          {number !== -1 && <p>число {number} найдено</p>}
          <p>Standart {stopwatcStandartValue} мс</p>
        </div>
        <div className={styles.result}>
          {arrValue.map((item, index) => (
            <p
              key={index}
              className={`${styles.result__item} ${
                item === number && styles.result__item_active
              } `}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </SolutionLayout>
  );
};
