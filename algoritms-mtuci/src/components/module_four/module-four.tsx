import React, { useState } from "react";
// @ts-ignore
import styles from "./module-four.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { ElementStates,arrString,IStack } from "../../types/types";

export const ModuleFour = () => {
  const [inputValue, setInputValue] = useState<arrString>({
    value: "",
    state: ElementStates.Changing,
  });
  const [arr, setArr] = useState<arrString[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  class Stack<T> implements IStack<T> {
    private container: arrString[] = arr;

    push = (item: arrString): void => {
      this.container.push(item);
      setArr(this.getElements());
      let length = this.getSize() - 1;
      let arrCopy = this.getElements();

      setInputValue({
        value: "",
        state: ElementStates.Changing,
      });
      setLoading(true);
      setTimeout(function () {
        arrCopy[length].state = ElementStates.Default;
        setArr(arrCopy);
        setLoading(false);
      }, 500);
    };

    pop = (): void => {
      if (this.container.length !== 0) {
        this.container.pop();
        setArr(this.getElements());
        setLoading(true);
        setTimeout(function () {
          setLoading(false);
        }, 500);
      }
    };

    clear = (): void => {
      if (this.container.length !== 0) {
        this.container = [];
        setArr([]);
      }
    };

    getSize = () => this.container.length;
    getElements = () => this.container;
  }
  const st = new Stack<string>();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, value: e.target.value });
  };



  return (
    <SolutionLayout title="Стек">
      <div className={styles.container}>
        <div className={styles.input}>
          <Input value={inputValue.value} onChange={onChange} maxLength={4} isLimitText={true} />

          <Button
            onClick={() => st.push(inputValue)}
            linkedList="small"
            text="Добавить"
            isLoader={loading  }
            disabled={loading || inputValue.value === "" && true}
          />

          <Button
            onClick={() => st.pop()}
            linkedList="small"
            text="Удалить"
            isLoader={loading}
            disabled={loading || (arr.length === 0 ? true : false)}
          />

          <div className={styles.button}>
            <Button
              onClick={() => {
                st.clear();
              }}
              linkedList="small"
              text="Очистить"
              disabled={arr.length === 0 ? true : false}
            />
          </div>
        </div>
        <div className={styles.algo__box}>
          {arr !== undefined
            ? arr.map((srting: arrString, index: number) => (
                <Circle
                  key={index}
                  state={srting.state}
                  head={index === (st.getSize() - 1) ? "top" : null}
                  tail={String(index)}
                  letter={srting.value}
                />
              ))
            : null}
        </div>
      </div>
    </SolutionLayout>
  );
};