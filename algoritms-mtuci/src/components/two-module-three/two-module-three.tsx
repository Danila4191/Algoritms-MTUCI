import React, { useState, useEffect } from "react";
// @ts-ignore
import styles from "./two-module-three.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
export interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export interface KnapsackSolution {
  maxValue: number;
  selectedItems: Item[];
  executionTime: number;
  method: string;
}

export interface KnapsackState {
  maxWeight: number;
  currentWeight: number;
  items: Item[];
  totalValue: number;
}

export const TwoModuleThree = () => {
  class ItemClass implements Item {
    constructor(
      public id: number,
      public name: string,
      public weight: number,
      public value: number
    ) {}

    clone(): ItemClass {
      return new ItemClass(this.id, this.name, this.weight, this.value);
    }

    toString(): string {
      return `${this.name} (вес: ${this.weight}, ценность: ${this.value})`;
    }
  }
  class Knapsack {
    private items: Item[] = [];
    private currentWeight: number = 0;
    private totalValue: number = 0;

    constructor(public maxWeight: number) {}

    // Добавление предмета в рюкзак
    addItem(item: Item): boolean {
      if (this.currentWeight + item.weight <= this.maxWeight) {
        this.items.push(item);
        this.currentWeight += item.weight;
        this.totalValue += item.value;
        return true;
      }
      return false;
    }

    // Очистка рюкзака
    clear(): void {
      this.items = [];
      this.currentWeight = 0;
      this.totalValue = 0;
    }

    // Геттеры
    getItems(): Item[] {
      return [...this.items];
    }

    getCurrentWeight(): number {
      return this.currentWeight;
    }

    getTotalValue(): number {
      return this.totalValue;
    }

    getRemainingCapacity(): number {
      return this.maxWeight - this.currentWeight;
    }

    // Строковое представление
    toString(): string {
      return `Рюкзак: ${this.currentWeight}/${this.maxWeight} кг, ценность: ${this.totalValue}, предметов: ${this.items.length}`;
    }
  }
  class KnapsackSolver {
    private static recursionCount: number = 0;
    private static memo: Map<string, number> = new Map();

    /**
     * Рекурсивное решение (без мемоизации)
     */
    public static recursiveSolve(
      items: Item[],
      maxWeight: number
    ): KnapsackSolution {
      const startTime = performance.now();
      this.recursionCount = 0;

      const result = this.recursiveHelper(items, maxWeight, 0);
      const selectedItems = this.reconstructItems(items, maxWeight, result);

      const endTime = performance.now();

      return {
        maxValue: result,
        selectedItems,
        executionTime: endTime - startTime,
        method: "Рекурсивный (без мемоизации)",
      };
    }

    /**
     * Рекурсивное решение с мемоизацией
     */
    public static memoizedSolve(
      items: Item[],
      maxWeight: number
    ): KnapsackSolution {
      const startTime = performance.now();
      this.recursionCount = 0;
      this.memo.clear();

      const result = this.memoizedHelper(items, maxWeight, 0);
      const selectedItems = this.reconstructMemoizedItems(
        items,
        maxWeight,
        result
      );

      const endTime = performance.now();

      return {
        maxValue: result,
        selectedItems,
        executionTime: endTime - startTime,
        method: "Рекурсивный (с мемоизацией)",
      };
    }

    /**
     * Вспомогательная рекурсивная функция
     */
    private static recursiveHelper(
      items: Item[],
      capacity: number,
      index: number
    ): number {
      this.recursionCount++;

      // Базовый случай
      if (index >= items.length || capacity <= 0) {
        return 0;
      }

      // Если текущий предмет не помещается, пропускаем его
      if (items[index].weight > capacity) {
        return this.recursiveHelper(items, capacity, index + 1);
      }

      // Выбираем максимум из двух вариантов:
      // 1. Берем текущий предмет
      const takeValue =
        items[index].value +
        this.recursiveHelper(items, capacity - items[index].weight, index + 1);

      // 2. Не берем текущий предмет
      const skipValue = this.recursiveHelper(items, capacity, index + 1);

      return Math.max(takeValue, skipValue);
    }

    /**
     * Вспомогательная функция с мемоизацией
     */
    private static memoizedHelper(
      items: Item[],
      capacity: number,
      index: number
    ): number {
      this.recursionCount++;

      // Базовый случай
      if (index >= items.length || capacity <= 0) {
        return 0;
      }

      // Проверяем мемоизацию
      const memoKey = `${index},${capacity}`;
      if (this.memo.has(memoKey)) {
        return this.memo.get(memoKey)!;
      }

      // Если текущий предмет не помещается
      if (items[index].weight > capacity) {
        const result = this.memoizedHelper(items, capacity, index + 1);
        this.memo.set(memoKey, result);
        return result;
      }

      // Вычисляем оба варианта
      const takeValue =
        items[index].value +
        this.memoizedHelper(items, capacity - items[index].weight, index + 1);

      const skipValue = this.memoizedHelper(items, capacity, index + 1);

      const result = Math.max(takeValue, skipValue);
      this.memo.set(memoKey, result);

      return result;
    }

    /**
     * Восстановление выбранных предметов для обычной рекурсии
     */
    private static reconstructItems(
      items: Item[],
      maxWeight: number,
      maxValue: number
    ): Item[] {
      const selected: Item[] = [];
      let remainingWeight = maxWeight;
      let remainingValue = maxValue;

      for (let i = 0; i < items.length && remainingValue > 0; i++) {
        // Проверяем, был ли выбран текущий предмет
        const tempValue = this.recursiveHelper(
          items.slice(i + 1),
          remainingWeight,
          0
        );

        if (remainingValue !== tempValue) {
          // Предмет был выбран
          selected.push(items[i]);
          remainingWeight -= items[i].weight;
          remainingValue -= items[i].value;
        }
      }

      return selected;
    }

    /**
     * Восстановление выбранных предметов для мемоизации
     */
    private static reconstructMemoizedItems(
      items: Item[],
      maxWeight: number,
      maxValue: number
    ): Item[] {
      const selected: Item[] = [];
      let remainingWeight = maxWeight;
      let remainingValue = maxValue;

      for (let i = 0; i < items.length && remainingValue > 0; i++) {
        // Проверяем мемоизацию для оставшихся предметов
        const memoKey = `${i + 1},${remainingWeight}`;
        const tempValue = this.memo.has(memoKey) ? this.memo.get(memoKey)! : 0;

        if (remainingValue !== tempValue) {
          // Предмет был выбран
          selected.push(items[i]);
          remainingWeight -= items[i].weight;
          remainingValue -= items[i].value;
        }
      }

      return selected;
    }

    /**
     * Получение статистики рекурсии
     */
    public static getRecursionStats(): number {
      return this.recursionCount;
    }
  }

  class DataGenerator {
    private static itemNames: string[] = [
      "Ноутбук",
      "Фотоаппарат",
      "Книга",
      "Еда",
      "Вода",
      "Палатка",
      "Спальник",
      "Фонарик",
      "Аптечка",
      "Одежда",
      "Обувь",
      "Посуда",
      "Топор",
      "Нож",
      "Веревка",
      "Карта",
      "Компас",
      "Часы",
      "Телефон",
      "Зарядка",
    ];

    /**
     * Генерация случайного предмета
     */
    public static generateRandomItem(id: number): Item {
      const randomName =
        this.itemNames[Math.floor(Math.random() * this.itemNames.length)];
      const randomWeight = Math.floor(Math.random() * 20) + 1; // 1-20 кг
      const randomValue = Math.floor(Math.random() * 100) + 1; // 1-100 единиц ценности

      return {
        id,
        name: randomName,
        weight: randomWeight,
        value: randomValue,
      };
    }

    /**
     * Генерация набора предметов
     */
    public static generateItems(count: number): Item[] {
      const items: Item[] = [];
      for (let i = 0; i < count; i++) {
        items.push(this.generateRandomItem(i + 1));
      }
      return items;
    }

    /**
     * Генерация оптимального набора для тестирования
     */
    public static generateOptimalSet(): Item[] {
      return [
        { id: 1, name: "Золото", weight: 5, value: 100 },
        { id: 2, name: "Серебро", weight: 3, value: 50 },
        { id: 3, name: "Бронза", weight: 2, value: 20 },
        { id: 4, name: "Платина", weight: 8, value: 150 },
        { id: 5, name: "Алмаз", weight: 1, value: 80 },
      ];
    }
  }

  const [items, setItems] = useState<Item[]>([]);
  const [maxWeight, setMaxWeight] = useState<number>(50);
  const [solutions, setSolutions] = useState<KnapsackSolution[]>([]);
  const [selectedSolution, setSelectedSolution] =
    useState<KnapsackSolution | null>(null);
  const [knapsack, setKnapsack] = useState<Knapsack>(new Knapsack(maxWeight));

  // Состояние для добавления/редактирования предмета
  const [newItem, setNewItem] = useState<Omit<Item, "id">>({
    name: "",
    weight: 0,
    value: 0,
  });
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Инициализация
  useEffect(() => {
    setKnapsack(new Knapsack(maxWeight));
  }, [maxWeight]);

  // Генерация случайных предметов
  const handleGenerateItems = () => {
    const count = parseInt(
      prompt("Введите количество предметов для генерации:") || "10"
    );
    if (count > 0) {
      const generatedItems = DataGenerator.generateItems(count);
      setItems(generatedItems);
      setSolutions([]);
      setSelectedSolution(null);
    }
  };

  // Добавление предмета
  const handleAddItem = () => {
    if (newItem.name && newItem.weight > 0 && newItem.value > 0) {
      const newId =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      const itemToAdd: Item = {
        id: newId,
        ...newItem,
      };

      setItems([...items, itemToAdd]);
      setNewItem({ name: "", weight: 0, value: 0 });
      setSolutions([]);
      setSelectedSolution(null);
    }
  };

  // Начало редактирования предмета
  const handleStartEdit = (item: Item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      weight: item.weight,
      value: item.value,
    });
  };

  // Сохранение изменений предмета
  const handleSaveEdit = () => {
    if (
      editingItem &&
      newItem.name &&
      newItem.weight > 0 &&
      newItem.value > 0
    ) {
      const updatedItems = items.map((item) =>
        item.id === editingItem.id ? { ...editingItem, ...newItem } : item
      );

      setItems(updatedItems);
      setEditingItem(null);
      setNewItem({ name: "", weight: 0, value: 0 });
      setSolutions([]);
      setSelectedSolution(null);
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: "", weight: 0, value: 0 });
  };

  // Удаление предмета
  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    setSolutions([]);
    setSelectedSolution(null);
  };

  // Решение задачи
  const handleSolve = (method: "recursive" | "memoized") => {
    if (items.length === 0) {
      alert("Добавьте предметы для решения задачи!");
      return;
    }

    let solution: KnapsackSolution;

    if (method === "recursive") {
      solution = KnapsackSolver.recursiveSolve(items, maxWeight);
    } else {
      solution = KnapsackSolver.memoizedSolve(items, maxWeight);
    }

    setSolutions((prev) => [...prev, solution]);
    setSelectedSolution(solution);

    // Заполняем рюкзак выбранными предметами
    const newKnapsack = new Knapsack(maxWeight);
    solution.selectedItems.forEach((item) => newKnapsack.addItem(item));
    setKnapsack(newKnapsack);
  };

  // Сравнение методов
  const handleCompareMethods = () => {
    if (items.length === 0) {
      alert("Добавьте предметы для сравнения!");
      return;
    }

    const recursiveSolution = KnapsackSolver.recursiveSolve(items, maxWeight);
    const memoizedSolution = KnapsackSolver.memoizedSolve(items, maxWeight);

    setSolutions([recursiveSolution, memoizedSolution]);
    setSelectedSolution(memoizedSolution); // Показываем мемоизированный как основной

    // Заполняем рюкзак оптимальным решением
    const newKnapsack = new Knapsack(maxWeight);
    memoizedSolution.selectedItems.forEach((item) => newKnapsack.addItem(item));
    setKnapsack(newKnapsack);
  };

  // Очистка решений
  const handleClearSolutions = () => {
    setSolutions([]);
    setSelectedSolution(null);
    setKnapsack(new Knapsack(maxWeight));
  };

  return (
    <SolutionLayout title="Задача о заполнении рюкзака">
      <div className={styles.container}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "20px auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1
            style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}
          >
            Задача о рюкзаке
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Левая колонка - Управление */}
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#555", marginBottom: "20px" }}>
                Управление
              </h2>

              {/* Максимальный вес */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Максимальный вес рюкзака:
                </label>
                <input
                  type="number"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(Number(e.target.value))}
                  min="1"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>

              {/* Добавление/редактирование предмета */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#555", marginBottom: "10px" }}>
                  {editingItem
                    ? "Редактирование предмета"
                    : "Добавление предмета"}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Название предмета"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Вес"
                    value={newItem.weight || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, weight: Number(e.target.value) })
                    }
                    min="1"
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Ценность"
                    value={newItem.value || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, value: Number(e.target.value) })
                    }
                    min="1"
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    {editingItem ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          style={{
                            flex: 1,
                            padding: "10px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            flex: 1,
                            padding: "10px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAddItem}
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Добавить предмет
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Кнопки управления */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  onClick={handleGenerateItems}
                  style={{
                    padding: "10px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Сгенерировать предметы
                </button>

                <button
                  onClick={() => handleSolve("recursive")}
                  style={{
                    padding: "10px",
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Решить (рекурсия)
                </button>

                <button
                  onClick={() => handleSolve("memoized")}
                  style={{
                    padding: "10px",
                    backgroundColor: "#20c997",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Решить (мемоизация)
                </button>

                <button
                  onClick={handleCompareMethods}
                  style={{
                    padding: "10px",
                    backgroundColor: "#6f42c1",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Сравнить методы
                </button>

                <button
                  onClick={handleClearSolutions}
                  style={{
                    padding: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Очистить решения
                </button>
              </div>
            </div>

            {/* Правая колонка - Результаты */}
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#555", marginBottom: "20px" }}>
                Результаты
              </h2>

              {/* Информация о рюкзаке */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#555", marginBottom: "10px" }}>Рюкзак</h3>
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                  }}
                >
                  <div>
                    <strong>Состояние:</strong> {knapsack.toString()}
                  </div>
                  <div>
                    <strong>Свободно:</strong> {knapsack.getRemainingCapacity()}{" "}
                    кг
                  </div>
                </div>
              </div>

              {/* Выбранное решение */}
              {selectedSolution && (
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#555", marginBottom: "10px" }}>
                    Оптимальное решение
                  </h3>
                  <div
                    style={{
                      padding: "15px",
                      backgroundColor: "#d4edda",
                      border: "1px solid #c3e6cb",
                      borderRadius: "4px",
                    }}
                  >
                    <div>
                      <strong>Метод:</strong> {selectedSolution.method}
                    </div>
                    <div>
                      <strong>Максимальная ценность:</strong>{" "}
                      {selectedSolution.maxValue}
                    </div>
                    <div>
                      <strong>Время выполнения:</strong>{" "}
                      {selectedSolution.executionTime.toFixed(2)} мс
                    </div>
                    <div>
                      <strong>Выбранные предметы:</strong>
                    </div>
                    <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                      {selectedSolution.selectedItems.map((item, index) => (
                        <li key={index}>
                          {item.name} (вес: {item.weight}, ценность:{" "}
                          {item.value})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Сравнение методов */}
              {solutions.length > 1 && (
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#555", marginBottom: "10px" }}>
                    Сравнение методов
                  </h3>
                  <div
                    style={{
                      padding: "15px",
                      backgroundColor: "#cce7ff",
                      border: "1px solid #b3d9ff",
                      borderRadius: "4px",
                    }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#e7f3ff" }}>
                          <th
                            style={{
                              padding: "8px",
                              border: "1px solid #b3d9ff",
                              textAlign: "left",
                            }}
                          >
                            Метод
                          </th>
                          <th
                            style={{
                              padding: "8px",
                              border: "1px solid #b3d9ff",
                              textAlign: "left",
                            }}
                          >
                            Ценность
                          </th>
                          <th
                            style={{
                              padding: "8px",
                              border: "1px solid #b3d9ff",
                              textAlign: "left",
                            }}
                          >
                            Время (мс)
                          </th>
                          <th
                            style={{
                              padding: "8px",
                              border: "1px solid #b3d9ff",
                              textAlign: "left",
                            }}
                          >
                            Предметов
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {solutions.map((solution, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #b3d9ff",
                              }}
                            >
                              {solution.method}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #b3d9ff",
                              }}
                            >
                              {solution.maxValue}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #b3d9ff",
                              }}
                            >
                              {solution.executionTime.toFixed(2)}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #b3d9ff",
                              }}
                            >
                              {solution.selectedItems.length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Список предметов */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#555", marginBottom: "15px" }}>
              Список предметов ({items.length})
            </h2>

            {items.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6c757d" }}>
                Нет предметов
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "15px",
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "15px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {item.name}
                    </div>
                    <div>Вес: {item.weight} кг</div>
                    <div>Ценность: {item.value}</div>
                    <div
                      style={{ marginTop: "10px", display: "flex", gap: "5px" }}
                    >
                      <button
                        onClick={() => handleStartEdit(item)}
                        style={{
                          flex: 1,
                          padding: "5px",
                          backgroundColor: "#ffc107",
                          color: "black",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          flex: 1,
                          padding: "5px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SolutionLayout>
  );
};
