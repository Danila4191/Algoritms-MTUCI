import React, { useState } from "react";
// @ts-ignore
import styles from "./module-three.module.css";
import { SolutionLayout } from "../../ui/solution-layout/solution-layout";
import { Input } from "../../ui/input/input";
import { Button } from "../../ui/button/button";
import { findStr } from "../../../utils/functions";

export const ModuleThree = () => {
  const [inputValueStr, setInputValueStr] = useState({ value: "" });
  const [inputValueSubstring, setInputValueSubstring] = useState({ value: "" });
  const [loading, setloading] = useState<boolean>(false);
  const [stopwatcKMP, setStopwatcKMP] = useState<number>(0);
  const [stopwatcStandartValue, setStopwatcStandartValue] = useState<number>(0);
  const [strValue, setStrValue] = useState<string>();
  const [subStrValue, setSubStrValue] = useState<string>();

  const onChangeStr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueStr({ ...inputValueStr, value: e.target.value });
  };
  const onChangeSubstring = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueSubstring({ ...inputValueSubstring, value: e.target.value });
  };
  const onClickCreateStr = () => {
    setStrValue(inputValueStr.value);
    setSubStrValue("");
  };
  const onClickAddSubStr = () => {
    let newStr = strValue + inputValueSubstring.value;
    setStrValue(newStr);
  };

  const onClickSearchSubStr = () => {
    setloading(true);
    let start = new Date().getTime();
    if (strValue !== undefined) {
      findStr(strValue, inputValueSubstring.value);
      if (findStr(strValue, inputValueSubstring.value)) {
        setSubStrValue(inputValueSubstring.value);
      }
    }
    let end = new Date().getTime();
    setStopwatcKMP(end - start);
    start = new Date().getTime();
    if (strValue !== undefined) {
      strValue.includes(inputValueSubstring.value);
    }
    end = new Date().getTime();
    setStopwatcStandartValue(end - start);
    setloading(false);
  };
  return (
    <SolutionLayout title="Поиск подстроки в строке">
      <div className={styles.container}>
        <div className={styles.imput}>
          <Input
            type="text"
            onChange={onChangeStr}
            maxLength={30}
            isLimitText={true}
          />
          <Button
            onClick={onClickCreateStr}
            text="Добавить строку"
            isLoader={loading}
            disabled={
              inputValueStr.value.length < 2 ||
              inputValueStr.value.length > 30 ||
              loading
            }
          />
        </div>
        <div className={styles.imput}>
          <Input
            type="text"
            onChange={onChangeSubstring}
            maxLength={10}
            isLimitText={true}
          />
          <Button
            onClick={onClickAddSubStr}
            text="Добавить подстроку"
            isLoader={loading}
            disabled={
              inputValueSubstring.value.length < 1 ||
              inputValueSubstring.value.length > 10 ||
              loading
            }
          />
          <Button
            onClick={onClickSearchSubStr}
            text="Искать подстроку"
            isLoader={loading}
            disabled={
              inputValueSubstring.value.length < 1 ||
              inputValueSubstring.value.length > 10 ||
              loading
            }
          />
        </div>
        <div className={styles.result__table}>
          <p>KPM {stopwatcKMP} мС </p>
          <p>Standart {stopwatcStandartValue} мс</p>
        </div>
        <div className={styles.result}>
          <p className="text text_type_h3"> Строка </p>
          {strValue}
          {subStrValue && (
            <p className="text "> Найдена подстрока: {subStrValue} </p>
          )}
        </div>
      </div>
    </SolutionLayout>
  );
};
