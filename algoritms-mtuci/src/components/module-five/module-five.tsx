import React, { useState } from "react";
// @ts-ignore
import styles from "./module-five.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import {} from "../../utils/functions";

export const ModuleFive = () => {
  const [inputValue, setInputValue] = useState({ value: 0 });
  const [loading, setloading] = useState(false);
  const [stopwatcStandartValue, setStopwatcStandartValue] = useState(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, value: e.target.valueAsNumber });
  };
  const onClick = () => {
    setloading(true);
    let start = new Date().getTime();
    setDepth(inputValue.value)
    let end = new Date().getTime();
    setStopwatcStandartValue(end - start);
    setloading(false);
  };
 
  const [depth, setDepth] = useState(0);
  const [size, setSize] = useState(800);

  const drawTriangle = (ctx:any, p1:any, p2:any, p3:any, currentDepth:any) => {
    if (currentDepth === 0) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = `hsl(${currentDepth * 40}, 100%, 50%)`;
      ctx.fill();
      return;
    }

    // Находим середины сторон
    const p12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const p23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
    const p31 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

    // Рекурсивно рисуем 3 меньших треугольника
    drawTriangle(ctx, p1, p12, p31, currentDepth - 1);
    drawTriangle(ctx, p12, p2, p23, currentDepth - 1);
    drawTriangle(ctx, p31, p23, p3, currentDepth - 1);
  };
  const drawSierpinski = (canvas:any) => {
   
   
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Вершины основного треугольника
    const p1 = { x: size / 2, y: 20 };
    const p2 = { x: 20, y: size - 20 };
    const p3 = { x: size - 20, y: size - 20 };

    drawTriangle(ctx, p1, p2, p3, depth);

  };
  return (
    <SolutionLayout title="Салфетка Серпинского">
      <div className={styles.container}>
        <div className={styles.imput}>
          <Input
            type="number"
            onChange={onChange}
            max={8}
            isLimitText={true}
          />
          <Button
            onClick={onClick}
            text="Построить"
            isLoader={loading}
            disabled={inputValue.value.toString() == "NaN" || inputValue.value < 1 || inputValue.value > 8 || loading}
          />
        </div>
        <div className={styles.result__table}>
          <p>
            Standart {stopwatcStandartValue} мс. Итераций {depth}
          </p>
        </div>
        <div className={styles.result}>
        <canvas className={styles.canvas} 
          width={800}
          height={800}
          ref={drawSierpinski}
        />
        </div>
      </div>
    </SolutionLayout>
  );
};
