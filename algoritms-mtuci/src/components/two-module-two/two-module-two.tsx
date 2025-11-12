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
  class RodCuttingSolver {
    /**
     * Решение задачи о разрезании стержня методом динамического программирования
     * @param prices - таблица цен для каждого возможного разреза
     * @param rodLength - длина стержня
     * @returns объект с максимальной выручкой и оптимальными разрезами
     */
    public static solve(
      prices: PriceTable[],
      rodLength: number
    ): RodCuttingResult {
      // Создаем массив цен для удобства доступа
      const priceArray = this.createPriceArray(prices, rodLength);

      // Инициализируем таблицы для ДП
      const dp: number[] = new Array(rodLength + 1).fill(0); // r[j] - макс выручка для стержня длины j
      const s: number[] = new Array(rodLength + 1).fill(0); // s[j] - оптимальная длина первого отрезка

      // Заполняем таблицы методом динамического программирования
      for (let j = 1; j <= rodLength; j++) {
        let maxRevenue = -Infinity;

        for (let i = 1; i <= j; i++) {
          // Вычисляем выручку для разреза длины i и остатка j-i
          const revenue = priceArray[i] + dp[j - i];

          if (revenue > maxRevenue) {
            maxRevenue = revenue;
            s[j] = i; // Запоминаем оптимальный первый разрез
          }
        }

        dp[j] = maxRevenue;
      }

      // Восстанавливаем оптимальные разрезы
      const optimalCuts = this.reconstructSolution(s, rodLength);

      return {
        maxRevenue: dp[rodLength],
        optimalCuts,
        dpTable: dp,
        solutionTable: s,
      };
    }

    /**
     * Восстановление оптимального разреза по таблице решений
     */
    private static reconstructSolution(
      s: number[],
      rodLength: number
    ): number[] {
      const cuts: number[] = [];
      let remainingLength = rodLength;

      while (remainingLength > 0) {
        const cutLength = s[remainingLength];
        cuts.push(cutLength);
        remainingLength -= cutLength;
      }

      return cuts;
    }

    /**
     * Создание массива цен для быстрого доступа
     */
    private static createPriceArray(
      prices: PriceTable[],
      maxLength: number
    ): number[] {
      const priceArray: number[] = new Array(maxLength + 1).fill(0);

      // Заполняем массив цен
      prices.forEach(({ length, price }) => {
        if (length <= maxLength) {
          priceArray[length] = Math.max(priceArray[length], price);
        }
      });

      return priceArray;
    }

    /**
     * Валидация входных данных
     */
    public static validateInput(
      prices: PriceTable[],
      rodLength: number
    ): string | null {
      if (rodLength <= 0) {
        return "Длина стержня должна быть положительным числом";
      }

      if (prices.length === 0) {
        return "Таблица цен не может быть пустой";
      }

      for (const price of prices) {
        if (price.length <= 0 || price.price < 0) {
          return "Длина и цена должны быть положительными числами";
        }
      }

      return null;
    }
  }
  const [rodLength, setRodLength] = useState<number>(10);
  const [prices, setPrices] = useState<PriceTable[]>([
    { length: 1, price: 1 },
    { length: 2, price: 5 },
    { length: 3, price: 8 },
    { length: 4, price: 9 },
    { length: 5, price: 10 },
    { length: 6, price: 17 },
    { length: 7, price: 17 },
    { length: 8, price: 20 },
    { length: 9, price: 24 },
    { length: 10, price: 30 },
  ]);
  const [result, setResult] = useState<RodCuttingResult | null>(null);
  const [error, setError] = useState<string>("");
  const [newLength, setNewLength] = useState<number>(1);
  const [newPrice, setNewPrice] = useState<number>(1);

  const handleSolve = () => {
    try {
      setError("");

      // Валидация
      const validationError = RodCuttingSolver.validateInput(prices, rodLength);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Решение задачи
      const solution = RodCuttingSolver.solve(prices, rodLength);
      setResult(solution);
    } catch (err) {
      setError(
        `Ошибка вычисления: ${
          err instanceof Error ? err.message : "Неизвестная ошибка"
        }`
      );
    }
  };

  const handleAddPrice = () => {
    if (newLength <= 0 || newPrice <= 0) {
      setError("Длина и цена должны быть положительными числами");
      return;
    }

    // Проверяем, существует ли уже цена для этой длины
    const existingIndex = prices.findIndex((p) => p.length === newLength);

    if (existingIndex >= 0) {
      // Обновляем существующую цену
      const updatedPrices = [...prices];
      updatedPrices[existingIndex] = { length: newLength, price: newPrice };
      setPrices(updatedPrices);
    } else {
      // Добавляем новую цену
      setPrices(
        [...prices, { length: newLength, price: newPrice }].sort(
          (a, b) => a.length - b.length
        )
      );
    }

    setNewLength(1);
    setNewPrice(1);
    setError("");
  };

  const handleRemovePrice = (index: number) => {
    const updatedPrices = prices.filter((_, i) => i !== index);
    setPrices(updatedPrices);
  };

  const handleReset = () => {
    setPrices([
      { length: 1, price: 1 },
      { length: 2, price: 5 },
      { length: 3, price: 8 },
      { length: 4, price: 9 },
      { length: 5, price: 10 },
      { length: 6, price: 17 },
      { length: 7, price: 17 },
      { length: 8, price: 20 },
      { length: 9, price: 24 },
      { length: 10, price: 30 },
    ]);
    setRodLength(10);
    setResult(null);
    setError("");
  };
  return (
    <SolutionLayout title="Методы динамического программирования">
      <div className={styles.container}>
        <div
          style={{
            maxWidth: "900px",
            margin: "20px auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h1 style={{ color: "#333", textAlign: "center" }}>
            Задача о разрезании стержня
          </h1>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#555", marginBottom: "15px" }}>
              Параметры задачи
            </h2>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Длина стержня:
              </label>
              <input
                type="number"
                value={rodLength}
                onChange={(e) => setRodLength(Number(e.target.value))}
                min="1"
                style={{
                  width: "100px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#555", marginBottom: "10px" }}>
                Таблица цен
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto auto",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>Длина</div>
                <div style={{ fontWeight: "bold" }}>Цена</div>
                <div style={{ fontWeight: "bold" }}>Действие</div>

                {prices.map((price, index) => (
                  <React.Fragment key={index}>
                    <div>{price.length}</div>
                    <div>{price.price}</div>
                    <button
                      onClick={() => handleRemovePrice(index)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Удалить
                    </button>
                  </React.Fragment>
                ))}
              </div>

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={newLength}
                  onChange={(e) => setNewLength(Number(e.target.value))}
                  placeholder="Длина"
                  min="1"
                  style={{
                    width: "80px",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  placeholder="Цена"
                  min="1"
                  style={{
                    width: "80px",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <button
                  onClick={handleAddPrice}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Добавить цену
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSolve}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Решить задачу
              </button>

              <button
                onClick={handleReset}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Сбросить
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "15px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {result && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#555", marginBottom: "15px" }}>Результат</h2>

              <div style={{ marginBottom: "15px" }}>
                <strong>Максимальная выручка:</strong>{" "}
                <span
                  style={{
                    color: "#28a745",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {result.maxRevenue}
                </span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <strong>Оптимальные разрезы:</strong>{" "}
                <span style={{ fontFamily: "monospace", fontSize: "16px" }}>
                  {result.optimalCuts.join(" + ")} ={" "}
                  {result.optimalCuts.reduce((a, b) => a + b, 0)}
                </span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#555", marginBottom: "10px" }}>
                  Таблица динамического программирования
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: "5px",
                  }}
                >
                  {result.dpTable.map((value, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        backgroundColor: "#e9ecef",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>r[{index}]</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: "#555", marginBottom: "10px" }}>
                  Таблица решений
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: "5px",
                  }}
                >
                  {result.solutionTable.map((value, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        backgroundColor: "#d1ecf1",
                        border: "1px solid #bee5eb",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>s[{index}]</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "30px",
              padding: "15px",
              backgroundColor: "#e7f3ff",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#004085",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Описание алгоритма:</h3>
            <p>
              Алгоритм использует динамическое программирование для нахождения
              оптимального способа разрезания стержня длины <em>n</em> на части
              для максимизации общей выручки. Временная сложность: O(n²).
            </p>
            <p>
              <strong>r[j]</strong> - максимальная выручка для стержня длины j
              <br />
              <strong>s[j]</strong> - длина первого оптимального разреза для
              стержня длины j
            </p>
          </div>
        </div>
      </div>
    </SolutionLayout>
  );
};
