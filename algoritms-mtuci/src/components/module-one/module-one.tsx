import React, { useState } from "react";
// @ts-ignore
import styles from "./module-one.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";

export const ModuleOne = () => {
  const [inputValue, setInputValue] = useState({ value: "" });
  const [loading, setloading] = useState<boolean>(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, value: e.target.value });
  };

  const onClick = () => {
    setloading(true);

    return (
      <SolutionLayout title="Сортировка">
        <div className={styles.container}>
          <div className={styles.imput}>
            <Input onChange={onChange} maxLength={11} isLimitText={true} />
            <Button
              onClick={onClick}
              text="Сортировать"
              isLoader={loading}
              disabled={inputValue.value.length < 2 || loading}
            />
          </div>
        </div>
      </SolutionLayout>
    );
  };
};
