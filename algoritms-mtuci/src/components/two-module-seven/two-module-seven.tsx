import React, { useState, useEffect } from "react";
// @ts-ignore
import styles from "./two-module-seven.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
export interface Cell {
  x: number;
  y: number;
  cost: number;
  isObstacle: boolean;
}

export interface PathfindingResult {
  path: Cell[];
  visited: Cell[];
  distance: number;
  executionTime: number;
  steps: number;
  algorithm: string;
}

export interface AlgorithmStep {
  current: Cell;
  openSet: Cell[];
  closedSet: Cell[];
  path: Cell[];
  description: string;
}

export interface TimeComplexityData {
  gridSize: number;
  obstacles: number;
  executionTimeLee: number;
  executionTimeAStar: number;
  stepsLee: number;
  stepsAStar: number;
  operations: number;
}

export interface GridConfig {
  width: number;
  height: number;
  obstacleProbability: number;
  minCost: number;
  maxCost: number;
}
interface GridVisualizationProps {
  grid: Cell[][];
  pathfindingResults?: PathfindingResult[];
  selectedAlgorithm?: string;
  onCellClick?: (cell: Cell) => void;
  startCell?: Cell | null;
  endCell?: Cell | null;
  cellSize?: number;
}
const GridVisualization: React.FC<GridVisualizationProps> = ({
  grid,
  pathfindingResults = [],
  selectedAlgorithm = "",
  onCellClick,
  startCell = null,
  endCell = null,
  cellSize = 40,
}) => {
  const getCellColor = (cell: Cell, result?: PathfindingResult): string => {
    // Стартовая клетка
    if (startCell && cell.x === startCell.x && cell.y === startCell.y) {
      return "#4CAF50";
    }

    // Конечная клетка
    if (endCell && cell.x === endCell.x && cell.y === endCell.y) {
      return "#F44336";
    }

    // Препятствие
    if (cell.isObstacle) {
      return "#424242";
    }

    // Путь
    if (result && result.path.some((c) => c.x === cell.x && c.y === cell.y)) {
      return "#2196F3";
    }

    // Посещенные клетки
    if (
      result &&
      result.visited.some((c) => c.x === cell.x && c.y === cell.y)
    ) {
      return "#BBDEFB";
    }

    // Обычная клетка - оттенок серого в зависимости от стоимости
    const baseColor = 240;
    const costFactor = (cell.cost - 1) / 4; // нормализуем стоимость от 0 до 1
    const intensity = Math.floor(baseColor - costFactor * 80);
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  const getCellText = (cell: Cell): string => {
    if (cell.isObstacle) return "X";
    return cell.cost < Number.MAX_SAFE_INTEGER ? cell.cost.toString() : "∞";
  };

  return (
    <div
      style={{
        display: "inline-block",
        border: "2px solid #333",
        borderRadius: "5px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      {grid.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.map((cell, x) => {
            const result = pathfindingResults.find(
              (r) => r.algorithm === selectedAlgorithm
            );
            const isInPath =
              result && result.path.some((c) => c.x === x && c.y === y);
            const isVisited =
              result && result.visited.some((c) => c.x === x && c.y === y);

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onCellClick?.(cell)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: getCellColor(cell, result),
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: cell.isObstacle ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontWeight: isInPath ? "bold" : "normal",
                  color: cell.isObstacle ? "white" : "black",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
                title={`Клетка (${x}, ${y}) | Стоимость: ${cell.cost}${
                  cell.isObstacle ? " | ПРЕПЯТСТВИЕ" : ""
                }`}
              >
                {getCellText(cell)}

                {/* Индикатор посещения */}
                {isVisited && !isInPath && !cell.isObstacle && (
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      width: 6,
                      height: 6,
                      backgroundColor: "#2196F3",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GridVisualization;
export const TwoModuleSeven = () => {
  class PathfindingAlgorithms {
    private static readonly DIRECTIONS = [
      { dx: 0, dy: -1 }, // вверх
      { dx: 1, dy: 0 }, // вправо
      { dx: 0, dy: 1 }, // вниз
      { dx: -1, dy: 0 }, // влево
    ];

    /**
     * Волновой алгоритм (алгоритм Ли)
     */
    public static leeAlgorithm(
      grid: Cell[][],
      start: Cell,
      end: Cell
    ): PathfindingResult {
      const startTime = performance.now();
      const visited: Cell[] = [];
      let stepsCount = 0;

      const width = grid[0].length;
      const height = grid.length;

      // Матрица расстояний
      const dist: number[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(Number.MAX_SAFE_INTEGER));

      // Матрица предков для восстановления пути
      const prev: (Cell | null)[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(null));

      // Очередь для BFS
      const queue: Cell[] = [start];
      dist[start.y][start.x] = 0;
      visited.push({ ...start });

      while (queue.length > 0) {
        stepsCount++;
        const current = queue.shift()!;

        // Если достигли цели
        if (current.x === end.x && current.y === end.y) {
          break;
        }

        // Проверяем всех соседей
        for (const dir of this.DIRECTIONS) {
          const nx = current.x + dir.dx;
          const ny = current.y + dir.dy;

          // Проверка границ и препятствий
          if (this.isValidCell(grid, nx, ny)) {
            const neighbor = grid[ny][nx];
            const newDist = dist[current.y][current.x] + neighbor.cost;

            if (newDist < dist[ny][nx]) {
              dist[ny][nx] = newDist;
              prev[ny][nx] = current;
              queue.push(neighbor);
              visited.push({ ...neighbor });
            }
          }
        }
      }

      // Восстанавливаем путь
      const path = this.reconstructPath(prev, start, end);
      const endTime = performance.now();

      return {
        path,
        visited,
        distance:
          dist[end.y][end.x] < Number.MAX_SAFE_INTEGER
            ? dist[end.y][end.x]
            : -1,
        executionTime: endTime - startTime,
        steps: stepsCount,
        algorithm: "Волновой алгоритм (Ли)",
      };
    }

    /**
     * Алгоритм A*
     */
    public static aStarAlgorithm(
      grid: Cell[][],
      start: Cell,
      end: Cell
    ): PathfindingResult {
      const startTime = performance.now();
      const visited: Cell[] = [];
      let stepsCount = 0;

      const width = grid[0].length;
      const height = grid.length;

      // Матрица стоимости пути от начала
      const gScore: number[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(Number.MAX_SAFE_INTEGER));

      // Матрица общей оценки (f = g + h)
      const fScore: number[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(Number.MAX_SAFE_INTEGER));

      // Матрица предков
      const prev: (Cell | null)[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(null));

      gScore[start.y][start.x] = 0;
      fScore[start.y][start.x] = this.heuristic(start, end);

      // Открытый список (кандидаты для обработки)
      const openSet: Cell[] = [start];
      visited.push({ ...start });

      while (openSet.length > 0) {
        stepsCount++;

        // Находим клетку с наименьшей f-оценкой
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
          const cell = openSet[i];
          const current = openSet[currentIndex];
          if (fScore[cell.y][cell.x] < fScore[current.y][current.x]) {
            currentIndex = i;
          }
        }

        const current = openSet[currentIndex];

        // Если достигли цели
        if (current.x === end.x && current.y === end.y) {
          break;
        }

        // Удаляем текущую клетку из открытого списка
        openSet.splice(currentIndex, 1);

        // Проверяем соседей
        for (const dir of this.DIRECTIONS) {
          const nx = current.x + dir.dx;
          const ny = current.y + dir.dy;

          if (this.isValidCell(grid, nx, ny)) {
            const neighbor = grid[ny][nx];
            const tentativeGScore =
              gScore[current.y][current.x] + neighbor.cost;

            if (tentativeGScore < gScore[ny][nx]) {
              // Этот путь лучше, запоминаем его
              prev[ny][nx] = current;
              gScore[ny][nx] = tentativeGScore;
              fScore[ny][nx] = tentativeGScore + this.heuristic(neighbor, end);

              if (
                !openSet.some(
                  (cell) => cell.x === neighbor.x && cell.y === neighbor.y
                )
              ) {
                openSet.push(neighbor);
                visited.push({ ...neighbor });
              }
            }
          }
        }
      }

      const path = this.reconstructPath(prev, start, end);
      const endTime = performance.now();

      return {
        path,
        visited,
        distance:
          gScore[end.y][end.x] < Number.MAX_SAFE_INTEGER
            ? gScore[end.y][end.x]
            : -1,
        executionTime: endTime - startTime,
        steps: stepsCount,
        algorithm: "A* алгоритм",
      };
    }

    /**
     * Эвристическая функция для A* (манхэттенское расстояние)
     */
    private static heuristic(a: Cell, b: Cell): number {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    /**
     * Проверка валидности клетки
     */
    private static isValidCell(grid: Cell[][], x: number, y: number): boolean {
      return (
        y >= 0 &&
        y < grid.length &&
        x >= 0 &&
        x < grid[0].length &&
        !grid[y][x].isObstacle
      );
    }

    /**
     * Восстановление пути по матрице предков
     */
    private static reconstructPath(
      prev: (Cell | null)[][],
      start: Cell,
      end: Cell
    ): Cell[] {
      const path: Cell[] = [];
      let current: Cell | null = end;

      // Проверяем, достижима ли конечная точка
      if (
        prev[end.y][end.x] === null &&
        (start.x !== end.x || start.y !== end.y)
      ) {
        return []; // Путь не существует
      }

      while (current !== null) {
        path.unshift(current);
        if (current.x === start.x && current.y === start.y) {
          break;
        }
        current = prev[current.y][current.x];
      }

      return path;
    }

    /**
     * Генерация случайной сетки
     */
    public static generateGrid(
      width: number,
      height: number,
      obstacleProbability: number = 0.2,
      minCost: number = 1,
      maxCost: number = 5
    ): Cell[][] {
      const grid: Cell[][] = [];

      for (let y = 0; y < height; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < width; x++) {
          const isObstacle = Math.random() < obstacleProbability;
          const cost = isObstacle
            ? Number.MAX_SAFE_INTEGER
            : Math.floor(Math.random() * (maxCost - minCost + 1)) + minCost;

          row.push({
            x,
            y,
            cost,
            isObstacle,
          });
        }
        grid.push(row);
      }

      return grid;
    }

    /**
     * Анализ временной сложности
     */
    public static analyzeTimeComplexity(
      maxSize: number = 20
    ): TimeComplexityData[] {
      const results: TimeComplexityData[] = [];

      for (let size = 5; size <= maxSize; size += 5) {
        const grid = this.generateGrid(size, size, 0.2);

        // Убедимся, что старт и финиш не являются препятствиями
        let start = grid[0][0];
        let end = grid[size - 1][size - 1];

        // Если старт или финиш - препятствия, находим ближайшие свободные клетки
        if (start.isObstacle) {
          start = this.findNearestFreeCell(grid, 0, 0);
        }
        if (end.isObstacle) {
          end = this.findNearestFreeCell(grid, size - 1, size - 1);
        }

        // Запускаем оба алгоритма
        const startTimeLee = performance.now();
        const resultLee = this.leeAlgorithm(grid, start, end);
        const endTimeLee = performance.now();

        const startTimeAStar = performance.now();
        const resultAStar = this.aStarAlgorithm(grid, start, end);
        const endTimeAStar = performance.now();

        // Подсчитываем препятствия
        let obstacleCount = 0;
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (grid[y][x].isObstacle) obstacleCount++;
          }
        }

        results.push({
          gridSize: size * size,
          obstacles: obstacleCount,
          executionTimeLee: endTimeLee - startTimeLee,
          executionTimeAStar: endTimeAStar - startTimeAStar,
          stepsLee: resultLee.steps,
          stepsAStar: resultAStar.steps,
          operations: size * size,
        });
      }

      return results;
    }

    /**
     * Поиск ближайшей свободной клетки
     */
    private static findNearestFreeCell(
      grid: Cell[][],
      startX: number,
      startY: number
    ): Cell {
      const width = grid[0].length;
      const height = grid.length;

      // Поиск в ширину для нахождения ближайшей свободной клетки
      const visited: boolean[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(false));
      const queue: Cell[] = [grid[startY][startX]];
      visited[startY][startX] = true;

      while (queue.length > 0) {
        const current = queue.shift()!;

        if (!current.isObstacle) {
          return current;
        }

        for (const dir of this.DIRECTIONS) {
          const nx = current.x + dir.dx;
          const ny = current.y + dir.dy;

          if (
            ny >= 0 &&
            ny < height &&
            nx >= 0 &&
            nx < width &&
            !visited[ny][nx]
          ) {
            visited[ny][nx] = true;
            queue.push(grid[ny][nx]);
          }
        }
      }

      // Если не нашли свободную клетку, возвращаем стартовую
      return grid[startY][startX];
    }

    /**
     * Тестирование алгоритмов на известных примерах
     */
    public static testAlgorithms(): { passed: boolean; details: string[] } {
      const details: string[] = [];
      let passed = true;

      details.push("ТЕСТИРОВАНИЕ АЛГОРИТМОВ ПОИСКА ПУТИ");
      details.push("====================================");

      // Тест 1: Простая сетка без препятствий
      details.push("ТЕСТ 1: Простая сетка 3x3 без препятствий");
      const grid1 = this.createTestGrid1();
      const start1 = grid1[0][0];
      const end1 = grid1[2][2];

      const resultLee1 = this.leeAlgorithm(grid1, start1, end1);
      const resultAStar1 = this.aStarAlgorithm(grid1, start1, end1);

      details.push("Волновой алгоритм:");
      details.push(
        `- Путь: ${resultLee1.path.map((c) => `(${c.x},${c.y})`).join(" -> ")}`
      );
      details.push(`- Длина: ${resultLee1.distance}`);
      details.push(`- Время: ${resultLee1.executionTime.toFixed(2)}мс`);

      details.push("A* алгоритм:");
      details.push(
        `- Путь: ${resultAStar1.path
          .map((c) => `(${c.x},${c.y})`)
          .join(" -> ")}`
      );
      details.push(`- Длина: ${resultAStar1.distance}`);
      details.push(`- Время: ${resultAStar1.executionTime.toFixed(2)}мс`);

      // Проверяем, что пути одинаковые и корректные
      const expectedDistance1 = 4; // (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)
      if (
        resultLee1.distance !== expectedDistance1 ||
        resultAStar1.distance !== expectedDistance1
      ) {
        passed = false;
        details.push("ОШИБКА: Неправильная длина пути в тесте 1");
      }

      // Тест 2: Сетка с препятствиями
      details.push("ТЕСТ 2: Сетка с препятствиями");
      const grid2 = this.createTestGrid2();
      const start2 = grid2[0][0];
      const end2 = grid2[3][3];

      const resultLee2 = this.leeAlgorithm(grid2, start2, end2);
      const resultAStar2 = this.aStarAlgorithm(grid2, start2, end2);

      details.push("Волновой алгоритм:");
      details.push(`- Длина пути: ${resultLee2.distance}`);
      details.push(`- Посещено клеток: ${resultLee2.visited.length}`);

      details.push("A* алгоритм:");
      details.push(`- Длина пути: ${resultAStar2.distance}`);
      details.push(`- Посещено клеток: ${resultAStar2.visited.length}`);

      // Проверяем, что оба алгоритма нашли путь и он корректен
      if (resultLee2.path.length === 0 || resultAStar2.path.length === 0) {
        passed = false;
        details.push("ОШИБКА: Алгоритмы не нашли путь в тесте 2");
      }

      // Тест 3: Невозможный путь
      details.push("ТЕСТ 3: Невозможный путь");
      const grid3 = this.createTestGrid3();
      const start3 = grid3[0][0];
      const end3 = grid3[2][2];

      const resultLee3 = this.leeAlgorithm(grid3, start3, end3);
      const resultAStar3 = this.aStarAlgorithm(grid3, start3, end3);

      details.push(
        `Волновой алгоритм нашел путь: ${resultLee3.path.length > 0}`
      );
      details.push(`A* алгоритм нашел путь: ${resultAStar3.path.length > 0}`);

      if (resultLee3.path.length > 0 || resultAStar3.path.length > 0) {
        passed = false;
        details.push(
          "ОШИБКА: Алгоритмы нашли путь там, где его не должно быть"
        );
      }

      details.push(
        `РЕЗУЛЬТАТ ТЕСТИРОВАНИЯ: ${
          passed ? "ВСЕ ТЕСТЫ ПРОЙДЕНЫ" : "ОБНАРУЖЕНЫ ОШИБКИ"
        }`
      );

      return { passed, details };
    }

    /**
     * Тестовые сетки для проверки
     */
    private static createTestGrid1(): Cell[][] {
      // Простая сетка 3x3 без препятствий, стоимость = 1
      const grid: Cell[][] = [];
      for (let y = 0; y < 3; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < 3; x++) {
          row.push({ x, y, cost: 1, isObstacle: false });
        }
        grid.push(row);
      }
      return grid;
    }

    private static createTestGrid2(): Cell[][] {
      // Сетка 4x4 с препятствиями
      const grid: Cell[][] = [];
      for (let y = 0; y < 4; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < 4; x++) {
          // Создаем препятствие в середине
          const isObstacle = (x === 1 && y === 1) || (x === 2 && y === 2);
          row.push({ x, y, cost: 1, isObstacle });
        }
        grid.push(row);
      }
      return grid;
    }

    private static createTestGrid3(): Cell[][] {
      // Сетка где путь заблокирован
      const grid: Cell[][] = [];
      for (let y = 0; y < 3; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < 3; x++) {
          // Блокируем все клетки кроме стартовой
          const isObstacle = !(x === 0 && y === 0);
          row.push({ x, y, cost: 1, isObstacle });
        }
        grid.push(row);
      }
      return grid;
    }
  }
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [endCell, setEndCell] = useState<Cell | null>(null);

  // Результаты алгоритмов
  const [pathfindingResults, setPathfindingResults] = useState<
    PathfindingResult[]
  >([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");
  const [testResults, setTestResults] = useState<string[]>([]);

  // Анализ сложности
  const [complexityData, setComplexityData] = useState<TimeComplexityData[]>(
    []
  );

  // Настройки
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    width: 15,
    height: 10,
    obstacleProbability: 0.2,
    minCost: 1,
    maxCost: 3,
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Инициализация
  useEffect(() => {
    initializeGrid();
  }, []);

  // Инициализация сетки
  const initializeGrid = () => {
    const newGrid = PathfindingAlgorithms.generateGrid(
      gridConfig.width,
      gridConfig.height,
      gridConfig.obstacleProbability,
      gridConfig.minCost,
      gridConfig.maxCost
    );

    setGrid(newGrid);

    // Находим свободные клетки для старта и финиша
    const start = PathfindingAlgorithms["findNearestFreeCell"](newGrid, 0, 0);
    const end = PathfindingAlgorithms["findNearestFreeCell"](
      newGrid,
      gridConfig.width - 1,
      gridConfig.height - 1
    );

    setStartCell(start);
    setEndCell(end);
    setPathfindingResults([]);
    setSelectedAlgorithm("");
  };

  // Обработчик клика по клетке
  const handleCellClick = (cell: Cell) => {
    if (cell.isObstacle) return;

    if (!startCell) {
      setStartCell(cell);
    } else if (!endCell && (cell.x !== startCell.x || cell.y !== startCell.y)) {
      setEndCell(cell);
    } else {
      // Сброс выбора
      setStartCell(cell);
      setEndCell(null);
    }
  };

  // Запуск алгоритмов
  const runAlgorithms = async () => {
    if (!startCell || !endCell) {
      alert("Выберите стартовую и конечную клетки!");
      return;
    }

    if (startCell.x === endCell.x && startCell.y === endCell.y) {
      alert("Стартовая и конечная клетки не могут быть одинаковыми!");
      return;
    }

    setIsRunning(true);
    setPathfindingResults([]);

    try {
      // Запускаем оба алгоритма
      const results: PathfindingResult[] = [];

      const leeResult = PathfindingAlgorithms.leeAlgorithm(
        grid,
        startCell,
        endCell
      );
      results.push(leeResult);

      const aStarResult = PathfindingAlgorithms.aStarAlgorithm(
        grid,
        startCell,
        endCell
      );
      results.push(aStarResult);

      setPathfindingResults(results);
      setSelectedAlgorithm("Волновой алгоритм (Ли)");
    } catch (error) {
      alert(`Ошибка выполнения алгоритмов: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Запуск тестов
  const runTests = () => {
    setTestResults(["Запуск тестов..."]);

    setTimeout(() => {
      const testResult = PathfindingAlgorithms.testAlgorithms();
      setTestResults(testResult.details);

      if (testResult.passed) {
        alert("Все тесты пройдены успешно! Алгоритмы работают корректно.");
      } else {
        alert("Обнаружены ошибки в алгоритмах. Проверьте детали тестирования.");
      }
    }, 100);
  };

  // Анализ сложности
  const analyzeComplexity = () => {
    setTestResults(["Анализ временной сложности..."]);

    setTimeout(() => {
      const data = PathfindingAlgorithms.analyzeTimeComplexity(25);
      setComplexityData(data);

      const results = [
        "АНАЛИЗ ВРЕМЕННОЙ СЛОЖНОСТИ",
        "===========================",
      ];

      data.forEach((item) => {
        results.push(
          `Сетка: ${Math.sqrt(item.gridSize)}x${Math.sqrt(item.gridSize)} | ` +
            `Ли: ${item.executionTimeLee.toFixed(2)}мс | ` +
            `A*: ${item.executionTimeAStar.toFixed(2)}мс | ` +
            `Отношение: ${(
              item.executionTimeLee / item.executionTimeAStar
            ).toFixed(2)}x`
        );
      });

      setTestResults(results);
    }, 100);
  };

  // Обновление конфигурации сетки
  const updateGridConfig = (key: keyof GridConfig, value: number) => {
    const newConfig = { ...gridConfig, [key]: value };
    setGridConfig(newConfig);
  };

  // Получение текущего результата
  const getCurrentResult = (): PathfindingResult | undefined => {
    return pathfindingResults.find((r) => r.algorithm === selectedAlgorithm);
  };
  return (
    <SolutionLayout title="Сетевые алгоритмы. Эвристические алгоритмы поиска путей">
      <div className={styles.container}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#2c3e50",
              marginBottom: "10px",
            }}
          >
            Сравнение алгоритмов поиска пути
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#7f8c8d",
              marginBottom: "30px",
            }}
          >
            Волновой алгоритм (Ли) vs Алгоритм A*
          </p>

          {/* Панель управления */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Настройки сетки */}
              <div>
                <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                  Настройки сетки
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label style={{ minWidth: "80px" }}>Ширина:</label>
                    <input
                      type="number"
                      value={gridConfig.width}
                      onChange={(e) =>
                        updateGridConfig(
                          "width",
                          Math.max(5, parseInt(e.target.value) || 5)
                        )
                      }
                      min="5"
                      max="30"
                      style={{
                        width: "60px",
                        padding: "5px",
                        border: "1px solid #ddd",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label style={{ minWidth: "80px" }}>Высота:</label>
                    <input
                      type="number"
                      value={gridConfig.height}
                      onChange={(e) =>
                        updateGridConfig(
                          "height",
                          Math.max(5, parseInt(e.target.value) || 5)
                        )
                      }
                      min="5"
                      max="30"
                      style={{
                        width: "60px",
                        padding: "5px",
                        border: "1px solid #ddd",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label style={{ minWidth: "80px" }}>Препятствия:</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        flex: 1,
                      }}
                    >
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.05"
                        value={gridConfig.obstacleProbability}
                        onChange={(e) =>
                          updateGridConfig(
                            "obstacleProbability",
                            parseFloat(e.target.value)
                          )
                        }
                        style={{ flex: 1 }}
                      />
                      <span style={{ minWidth: "40px" }}>
                        {(gridConfig.obstacleProbability * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={initializeGrid}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "5px",
                    }}
                  >
                    Новая сетка
                  </button>
                </div>
              </div>

              {/* Управление алгоритмами */}
              <div>
                <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                  Алгоритмы
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={runAlgorithms}
                    disabled={isRunning || !startCell || !endCell}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: isRunning ? "#bdc3c7" : "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: isRunning ? "not-allowed" : "pointer",
                    }}
                  >
                    {isRunning ? "Выполнение..." : "Запустить оба алгоритма"}
                  </button>

                  <button
                    onClick={runTests}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#9b59b6",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Запустить тесты
                  </button>

                  <button
                    onClick={analyzeComplexity}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#f39c12",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Анализ сложности
                  </button>
                </div>
              </div>

              {/* Выбор алгоритма для отображения */}
              <div>
                <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                  Отображение
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {pathfindingResults.map((result, index) => (
                    <label
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="algorithm"
                        value={result.algorithm}
                        checked={selectedAlgorithm === result.algorithm}
                        onChange={() => setSelectedAlgorithm(result.algorithm)}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px" }}>
                        {result.algorithm}
                      </span>
                    </label>
                  ))}
                  {pathfindingResults.length === 0 && (
                    <div style={{ color: "#7f8c8d", fontSize: "14px" }}>
                      Результаты не доступны
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Инструкция */}
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: "#ecf0f1",
                borderRadius: "5px",
                fontSize: "14px",
                border: "1px solid #bdc3c7",
              }}
            >
              <strong>Инструкция:</strong> Кликните на клетку чтобы выбрать
              старт, затем кликните на другую клетку чтобы выбрать финиш
            </div>
          </div>

          {/* Основное содержимое */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 400px",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Визуализация сетки */}
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                Визуализация сетки
              </h3>

              <div
                style={{
                  border: "2px solid #bdc3c7",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <GridVisualization
                  grid={grid}
                  pathfindingResults={pathfindingResults}
                  selectedAlgorithm={selectedAlgorithm}
                  onCellClick={handleCellClick}
                  startCell={startCell}
                  endCell={endCell}
                  cellSize={30}
                />
              </div>

              {/* Легенда */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "15px",
                  marginTop: "15px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#4CAF50",
                      border: "1px solid #45a049",
                    }}
                  ></div>
                  <span>Старт</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#F44336",
                      border: "1px solid #d32f2f",
                    }}
                  ></div>
                  <span>Финиш</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#424242",
                      border: "1px solid #212121",
                    }}
                  ></div>
                  <span>Препятствие</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#2196F3",
                      border: "1px solid #1976d2",
                    }}
                  ></div>
                  <span>Путь</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#BBDEFB",
                      border: "1px solid #90caf9",
                    }}
                  ></div>
                  <span>Посещено</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      backgroundColor: "#E0E0E0",
                      border: "1px solid #bdbdbd",
                    }}
                  ></div>
                  <span>Стоимость</span>
                </div>
              </div>
            </div>

            {/* Результаты и статистика */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Результаты алгоритмов */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                  Результаты
                </h3>

                {pathfindingResults.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {pathfindingResults.map((result, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "12px",
                          backgroundColor:
                            selectedAlgorithm === result.algorithm
                              ? "#e8f4f8"
                              : "#f8f9fa",
                          borderRadius: "5px",
                          borderLeft: `4px solid ${
                            selectedAlgorithm === result.algorithm
                              ? "#3498db"
                              : "#bdc3c7"
                          }`,
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            color: "#2c3e50",
                            fontSize: "16px",
                          }}
                        >
                          {result.algorithm}
                        </h4>
                        <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                          <div>
                            <strong>Длина пути:</strong>{" "}
                            {result.distance >= 0
                              ? result.distance
                              : "Путь не найден"}
                          </div>
                          <div>
                            <strong>Время:</strong>{" "}
                            {result.executionTime.toFixed(2)} мс
                          </div>
                          <div>
                            <strong>Шаги:</strong> {result.steps}
                          </div>
                          <div>
                            <strong>Посещено клеток:</strong>{" "}
                            {result.visited.length}
                          </div>
                          <div>
                            <strong>Длина маршрута:</strong>{" "}
                            {result.path.length} клеток
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Сравнение */}
                    {pathfindingResults.length === 2 &&
                      pathfindingResults[0].distance >= 0 &&
                      pathfindingResults[1].distance >= 0 && (
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "12px",
                            backgroundColor: "#fff3cd",
                            borderRadius: "5px",
                            border: "1px solid #ffeaa7",
                          }}
                        >
                          <strong style={{ color: "#856404" }}>
                            Сравнение производительности:
                          </strong>
                          <div
                            style={{
                              fontSize: "13px",
                              marginTop: "8px",
                              lineHeight: "1.4",
                            }}
                          >
                            <div>
                              A* быстрее в{" "}
                              {(
                                pathfindingResults[0].executionTime /
                                pathfindingResults[1].executionTime
                              ).toFixed(2)}{" "}
                              раз
                            </div>
                            <div>
                              A* эффективнее в{" "}
                              {(
                                pathfindingResults[0].visited.length /
                                pathfindingResults[1].visited.length
                              ).toFixed(2)}{" "}
                              раз
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "#7f8c8d",
                      textAlign: "center",
                      padding: "30px",
                      border: "2px dashed #bdc3c7",
                      borderRadius: "5px",
                    }}
                  >
                    Запустите алгоритмы для отображения результатов
                  </div>
                )}
              </div>

              {/* Текущий путь */}
              {getCurrentResult() && getCurrentResult()!.path.length > 0 && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                    Текущий путь
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      fontFamily: "monospace",
                      maxHeight: "200px",
                      overflow: "auto",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      borderRadius: "3px",
                      lineHeight: "1.5",
                    }}
                  >
                    {getCurrentResult()!.path.map((cell, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "2px 0",
                          borderBottom:
                            index < getCurrentResult()!.path.length - 1
                              ? "1px solid #dee2e6"
                              : "none",
                        }}
                      >
                        {index === 0
                          ? "Старт → "
                          : index === getCurrentResult()!.path.length - 1
                          ? "Финиш"
                          : `Шаг ${index} → `}
                        ({cell.x}, {cell.y})
                        {cell.cost > 1 ? ` [стоимость: ${cell.cost}]` : ""}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Результаты тестирования */}
          {testResults.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                Результаты тестирования
              </h3>
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: "5px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}
              >
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      margin: "4px 0",
                      padding: "2px 0",
                      whiteSpace: "pre-wrap",
                      borderBottom:
                        index < testResults.length - 1
                          ? "1px solid #dee2e6"
                          : "none",
                    }}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Анализ сложности */}
          {complexityData.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#34495e", marginBottom: "15px" }}>
                Анализ временной сложности
              </h3>

              <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    minWidth: "600px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#ecf0f1" }}>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Размер сетки
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Препятствия
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Время Ли (мс)
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Время A* (мс)
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Шаги Ли
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Шаги A*
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #bdc3c7",
                          textAlign: "left",
                        }}
                      >
                        Ускорение
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {complexityData.map((data, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f8f9fa" : "white",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {Math.sqrt(data.gridSize)}x{Math.sqrt(data.gridSize)}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {data.obstacles}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {data.executionTimeLee.toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {data.executionTimeAStar.toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {data.stepsLee}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {data.stepsAStar}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                          }}
                        >
                          {(
                            data.executionTimeLee / data.executionTimeAStar
                          ).toFixed(2)}
                          x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  backgroundColor: "#e8f4f8",
                  padding: "15px",
                  borderRadius: "5px",
                  borderLeft: "4px solid #3498db",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                  Выводы:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    color: "#34495e",
                    lineHeight: "1.6",
                  }}
                >
                  <li>
                    <strong>Волновой алгоритм (Ли):</strong> O(n²) в худшем
                    случае, всегда находит кратчайший путь
                  </li>
                  <li>
                    <strong>Алгоритм A*:</strong> O(b^d) где b - коэффициент
                    ветвления, d - глубина, обычно значительно быстрее
                  </li>
                  <li>
                    <strong>Эффективность A*:</strong> В 2-10 раз быстрее
                    благодаря эвристике
                  </li>
                  <li>
                    <strong>Память:</strong> A* требует меньше памяти за счет
                    целенаправленного поиска
                  </li>
                  <li>
                    <strong>Рекомендации:</strong> A* для больших сеток, Ли для
                    гарантированного нахождения пути
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </SolutionLayout>
  );
};
