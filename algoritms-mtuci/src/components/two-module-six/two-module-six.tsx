import React, { useState, useEffect } from "react";
// @ts-ignore
import styles from "./two-module-six.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
export interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface ShortestPath {
  distance: number;
  path: number[];
}

export interface FloydWarshallResult {
  distances: number[][];
  next: number[][];
  executionTime: number;
  steps: AlgorithmStep[];
  paths: Map<string, ShortestPath>;
}

export interface AlgorithmStep {
  iteration: number;
  k: number;
  i: number;
  j: number;
  currentDistance: number;
  newDistance: number;
  updated: boolean;
  description: string;
  distances: number[][];
}

export interface TimeComplexityData {
  nodes: number;
  edges: number;
  executionTime: number;
  operations: number;
}
interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  shortestPath?: number[];
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
  selectedNodes?: number[];
}
const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  shortestPath = [],
  width = 700,
  height = 500,
  onNodeClick,
  selectedNodes = []
}) => {
  // Проверяем, является ли ребро частью кратчайшего пути
  const isInShortestPath = (source: number, target: number): boolean => {
    for (let i = 0; i < shortestPath.length - 1; i++) {
      if (shortestPath[i] === source && shortestPath[i + 1] === target) {
        return true;
      }
    }
    return false;
  };

  // Вычисляем контрольные точки для кривых стрелок
  const calculateCurvePoints = (source: GraphNode, target: GraphNode) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Смещение для кривой (чтобы стрелки не накладывались)
    const offset = 15;
    const offsetX = -dy / length * offset;
    const offsetY = dx / length * offset;
    
    return {
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      cx: (source.x + target.x) / 2 + offsetX,
      cy: (source.y + target.y) / 2 + offsetY
    };
  };

  // Вычисляем позицию стрелки
  const calculateArrowPoints = (source: GraphNode, target: GraphNode) => {
    const arrowLength = 10;
    const angle = Math.atan2(target.y - source.y, target.x - source.x);
    const arrowX = target.x - arrowLength * Math.cos(angle);
    const arrowY = target.y - arrowLength * Math.sin(angle);

    return {
      x: arrowX,
      y: arrowY,
      angle: angle
    };
  };

  return (
    <div style={{
      position: 'relative',
      width: `${width}px`,
      height: `${height}px`,
      border: '2px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9fa'
    }}>
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Рёбра графа */}
        {edges.map((edge, index) => {
          const sourceNode = nodes[edge.source];
          const targetNode = nodes[edge.target];
          const isPathEdge = isInShortestPath(edge.source, edge.target);
          const curve = calculateCurvePoints(sourceNode, targetNode);
          const arrow = calculateArrowPoints(sourceNode, targetNode);

          return (
            <g key={index}>
              {/* Кривая линия ребра */}
              <path
                d={`M ${curve.x1} ${curve.y1} Q ${curve.cx} ${curve.cy} ${curve.x2} ${curve.y2}`}
                stroke={isPathEdge ? '#28a745' : '#007bff'}
                strokeWidth={isPathEdge ? 4 : 2}
                fill="none"
                strokeDasharray={isPathEdge ? 'none' : '5,3'}
              />
              
              {/* Стрелка */}
              <polygon
                points={`
                  ${arrow.x},${arrow.y}
                  ${arrow.x - 8 * Math.cos(arrow.angle - Math.PI/6)},${arrow.y - 8 * Math.sin(arrow.angle - Math.PI/6)}
                  ${arrow.x - 8 * Math.cos(arrow.angle + Math.PI/6)},${arrow.y - 8 * Math.sin(arrow.angle + Math.PI/6)}
                `}
                fill={isPathEdge ? '#28a745' : '#007bff'}
              />
              
              {/* Подпись веса */}
              <text
                x={curve.cx}
                y={curve.cy - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: isPathEdge ? '#28a745' : '#007bff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: 'white',
                  padding: '2px 4px'
                }}
              >
                {edge.weight}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Вершины */}
      {nodes.map((node) => {
        const isInPath = shortestPath.includes(node.id);
        const isSelected = selectedNodes.includes(node.id);
        
        return (
          <div
            key={node.id}
            onClick={() => onNodeClick?.(node)}
            style={{
              position: 'absolute',
              left: `${node.x - 20}px`,
              top: `${node.y - 20}px`,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isInPath ? '#28a745' : isSelected ? '#ffc107' : '#007bff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '3px solid',
              borderColor: isInPath ? '#1e7e34' : isSelected ? '#ff5722' : '#0056b3',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            title={`${node.label}\nКликните для выбора`}
          >
            {node.id}
          </div>
        );
      })}
    </div>
  );
};
export const TwoModuleSix= () => {
 class FloydWarshallAlgorithm {
  public static readonly INF = 999999;

  /**
   * Алгоритм Флойда-Уоршелла для поиска кратчайших путей между всеми парами вершин
   */
  public static findShortestPaths(
    adjacencyMatrix: number[][],
    nodes: GraphNode[]
  ): FloydWarshallResult {
    const startTime = performance.now();
    const n = adjacencyMatrix.length;
    const steps: AlgorithmStep[] = [];
    
    // Инициализация матриц
    const dist: number[][] = this.initializeDistanceMatrix(adjacencyMatrix, n);
    const next: number[][] = this.initializeNextMatrix(adjacencyMatrix, n);
    
    let stepCount = 0;

    // Начальное состояние
    steps.push({
      iteration: stepCount,
      k: -1,
      i: -1,
      j: -1,
      currentDistance: 0,
      newDistance: 0,
      updated: false,
      description: "Инициализация матрицы расстояний и матрицы следования",
      distances: this.cloneMatrix(dist)
    });

    // Основной алгоритм - тройной цикл
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          stepCount++;
          
          // Проверяем, что пути i->k и k->j существуют
          if (dist[i][k] < this.INF && dist[k][j] < this.INF) {
            const potentialDistance = dist[i][k] + dist[k][j];
            
            if (potentialDistance < dist[i][j]) {
              const oldDistance = dist[i][j];
              dist[i][j] = potentialDistance;
              next[i][j] = next[i][k];
              
              steps.push({
                iteration: stepCount,
                k,
                i,
                j,
                currentDistance: oldDistance,
                newDistance: potentialDistance,
                updated: true,
                description: `Обновлен путь ${i} → ${j} через ${k}: ${this.formatDistance(oldDistance)} → ${this.formatDistance(potentialDistance)}`,
                distances: this.cloneMatrix(dist)
              });
            } else {
              steps.push({
                iteration: stepCount,
                k,
                i,
                j,
                currentDistance: dist[i][j],
                newDistance: potentialDistance,
                updated: false,
                description: `Путь ${i} → ${j} через ${k} не улучшает: ${this.formatDistance(dist[i][j])} ≤ ${this.formatDistance(potentialDistance)}`,
                distances: this.cloneMatrix(dist)
              });
            }
          } else {
            steps.push({
              iteration: stepCount,
              k,
              i,
              j,
              currentDistance: dist[i][j],
              newDistance: this.INF,
              updated: false,
              description: `Нет пути ${i} → ${k} или ${k} → ${j}`,
              distances: this.cloneMatrix(dist)
            });
          }
        }
      }
    }

    const endTime = performance.now();
    const paths = this.reconstructAllPaths(dist, next, n);

    return {
      distances: dist,
      next,
      executionTime: endTime - startTime,
      steps,
      paths
    };
  }

  /**
   * Инициализация матрицы расстояний
   */
  private static initializeDistanceMatrix(adjacencyMatrix: number[][], n: number): number[][] {
    const dist: number[][] = [];
    
    for (let i = 0; i < n; i++) {
      dist[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          dist[i][j] = 0;
        } else if (adjacencyMatrix[i][j] > 0) {
          dist[i][j] = adjacencyMatrix[i][j];
        } else {
          dist[i][j] = this.INF;
        }
      }
    }
    
    return dist;
  }

  /**
   * Инициализация матрицы следования для восстановления путей
   */
  private static initializeNextMatrix(adjacencyMatrix: number[][], n: number): number[][] {
    const next: number[][] = [];
    
    for (let i = 0; i < n; i++) {
      next[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j || adjacencyMatrix[i][j] === 0) {
          next[i][j] = -1;
        } else {
          next[i][j] = j;
        }
      }
    }
    
    return next;
  }

  /**
   * Восстановление всех кратчайших путей
   */
  private static reconstructAllPaths(
    dist: number[][], 
    next: number[][], 
    n: number
  ): Map<string, ShortestPath> {
    const paths = new Map<string, ShortestPath>();
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const pathKey = `${i}-${j}`;
        if (i === j) {
          paths.set(pathKey, { distance: 0, path: [i] });
        } else if (dist[i][j] < this.INF) {
          const path = this.reconstructPath(i, j, next);
          paths.set(pathKey, {
            distance: dist[i][j],
            path
          });
        } else {
          paths.set(pathKey, {
            distance: this.INF,
            path: []
          });
        }
      }
    }
    
    return paths;
  }

  /**
   * Восстановление конкретного пути по матрице следования
   */
  public static reconstructPath(i: number, j: number, next: number[][]): number[] {
    if (next[i][j] === -1) {
      return [];
    }
    
    const path: number[] = [i];
    let current = i;
    
    while (current !== j) {
      current = next[current][j];
      path.push(current);
    }
    
    return path;
  }

  /**
   * Генерация случайного ориентированного графа
   */
  public static generateRandomGraph(
    nodeCount: number,
    edgeProbability: number = 0.3
  ): { matrix: number[][], nodes: GraphNode[] } {
    const matrix: number[][] = Array(nodeCount).fill(0).map(() => 
      Array(nodeCount).fill(0)
    );
    
    const nodes: GraphNode[] = Array(nodeCount).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 600 + 50,
      y: Math.random() * 400 + 50,
      label: `В${i}`
    }));

    // Генерируем ориентированные ребра
    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        if (i !== j && Math.random() < edgeProbability) {
          const weight = Math.floor(Math.random() * 20) + 1;
          matrix[i][j] = weight;
        }
      }
    }

    return { matrix, nodes };
  }

  /**
   * Анализ временной сложности
   */
  public static analyzeTimeComplexity(maxNodes: number = 15): TimeComplexityData[] {
    const results: TimeComplexityData[] = [];

    for (let nodes = 3; nodes <= maxNodes; nodes += 3) {
      const { matrix } = this.generateRandomGraph(nodes, 0.4);
      const graphNodes: GraphNode[] = Array(nodes).fill(0).map((_, i) => ({
        id: i,
        x: 0, y: 0,
        label: `V${i}`
      }));
      
      const startTime = performance.now();
      this.findShortestPaths(matrix, graphNodes);
      const endTime = performance.now();

      // Подсчитываем количество ребер
      let edgeCount = 0;
      for (let i = 0; i < nodes; i++) {
        for (let j = 0; j < nodes; j++) {
          if (i !== j && matrix[i][j] > 0) edgeCount++;
        }
      }

      results.push({
        nodes,
        edges: edgeCount,
        executionTime: endTime - startTime,
        operations: nodes * nodes * nodes // V³
      });
    }

    return results;
  }

  /**
   * Тестирование алгоритма на известных примерах
   */
  public static testAlgorithm(): { passed: boolean; details: string[] } {
    const details: string[] = [];
    let passed = true;

    details.push("=== ТЕСТИРОВАНИЕ АЛГОРИТМА ФЛОЙДА-УОРШЕЛЛА ===");

    // Тест 1: Простой граф
    details.push("\n ТЕСТ 1: Простой граф 3 вершины");
    const testMatrix1 = [
      [0, 4, 0],
      [0, 0, 2],
      [3, 0, 0]
    ];

    const result1 = this.findShortestPaths(testMatrix1, [
      { id: 0, x: 0, y: 0, label: "0" },
      { id: 1, x: 0, y: 0, label: "1" },
      { id: 2, x: 0, y: 0, label: "2" }
    ]);

    // Ожидаемые результаты
    const expectedDistances1 = [
      [0, 4, 6],    // 0→1=4, 0→2=6 (через 1)
      [5, 0, 2],    // 1→0=5 (через 2), 1→2=2
      [3, 7, 0]     // 2→0=3, 2→1=7 (через 0)
    ];

    details.push("Полученная матрица расстояний:");
    result1.distances.forEach((row, i) => {
      details.push(`[${row.join(', ')}]`);
    });

    details.push("Ожидаемая матрица расстояний:");
    expectedDistances1.forEach((row, i) => {
      details.push(`[${row.join(', ')}]`);
    });

    // Проверка результатов
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (result1.distances[i][j] !== expectedDistances1[i][j]) {
          passed = false;
          details.push(` ОШИБКА: dist[${i}][${j}] = ${result1.distances[i][j]}, ожидалось: ${expectedDistances1[i][j]}`);
        }
      }
    }

    // Тест 2: Граф с отсутствующими путями
    details.push("\n ТЕСТ 2: Граф с недостижимыми вершинами");
    const testMatrix2 = [
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 0]
    ];

    const result2 = this.findShortestPaths(testMatrix2, [
      { id: 0, x: 0, y: 0, label: "0" },
      { id: 1, x: 0, y: 0, label: "1" },
      { id: 2, x: 0, y: 0, label: "2" },
      { id: 3, x: 0, y: 0, label: "3" }
    ]);

    // Проверяем недостижимые пути
    if (result2.distances[3][0] < this.INF) {
      passed = false;
      details.push(" ОШИБКА: Путь 3→0 должен быть недостижим");
    }
    if (result2.distances[2][0] < this.INF) {
      passed = false;
      details.push(" ОШИБКА: Путь 2→0 должен быть недостижим");
    }

    details.push(`\n РЕЗУЛЬТАТ ТЕСТИРОВАНИЯ: ${passed ? ' ВСЕ ТЕСТЫ ПРОЙДЕНЫ' : ' ОБНАРУЖЕНЫ ОШИБКИ'}`);

    return { passed, details };
  }

  /**
   * Клонирование матрицы
   */
  private static cloneMatrix(matrix: number[][]): number[][] {
    return matrix.map(row => [...row]);
  }

  /**
   * Форматирование расстояния для отображения
   */
  public static formatDistance(distance: number): string {
    return distance >= this.INF ? '∞' : distance.toString();
  }
}
 const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // Результаты алгоритма
  const [algorithmResult, setAlgorithmResult] = useState<FloydWarshallResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedPath, setSelectedPath] = useState<ShortestPath | null>(null);
  
  // Анализ сложности
  const [complexityData, setComplexityData] = useState<TimeComplexityData[]>([]);
  
  // Настройки
  const [nodeCount, setNodeCount] = useState<number>(4);
  const [edgeProbability, setEdgeProbability] = useState<number>(0.4);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [targetNode, setTargetNode] = useState<number>(1);
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Инициализация
  useEffect(() => {
    initializeDefaultGraph();
  }, []);

  // Инициализация графа по умолчанию
  const initializeDefaultGraph = () => {
    const defaultMatrix = [
      [0, 3, 0, 7],
      [8, 0, 2, 0],
      [5, 0, 0, 1],
      [2, 0, 0, 0]
    ];
    
    const defaultNodes: GraphNode[] = [
      { id: 0, x: 200, y: 100, label: "Вершина 0" },
      { id: 1, x: 400, y: 100, label: "Вершина 1" },
      { id: 2, x: 400, y: 300, label: "Вершина 2" },
      { id: 3, x: 200, y: 300, label: "Вершина 3" }
    ];
    
    setAdjacencyMatrix(defaultMatrix);
    setNodes(defaultNodes);
    setEdges(matrixToEdges(defaultMatrix));
    setAlgorithmResult(null);
    setSelectedPath(null);
    setSelectedNodes([0, 1]);
  };

  // Преобразование матрицы в список рёбер
  const matrixToEdges = (matrix: number[][]): GraphEdge[] => {
    const edges: GraphEdge[] = [];
    const n = matrix.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && matrix[i][j] > 0) {
          edges.push({
            source: i,
            target: j,
            weight: matrix[i][j]
          });
        }
      }
    }

    return edges;
  };

  // Генерация случайного графа
  const generateRandomGraph = () => {
    const { matrix, nodes: newNodes } = FloydWarshallAlgorithm.generateRandomGraph(nodeCount, edgeProbability);
    setAdjacencyMatrix(matrix);
    setNodes(newNodes);
    setEdges(matrixToEdges(matrix));
    setAlgorithmResult(null);
    setSelectedPath(null);
    setSelectedNodes([0, 1]);
  };

  // Запуск алгоритма Флойда-Уоршелла
  const runAlgorithm = () => {
    if (adjacencyMatrix.length === 0) {
      alert('Граф не задан!');
      return;
    }

    try {
      const result = FloydWarshallAlgorithm.findShortestPaths(adjacencyMatrix, nodes);
      setAlgorithmResult(result);
      setCurrentStep(0);
      setSelectedPath(null);
      
      // Автоматически показываем путь между первыми двумя вершинами
      setTimeout(() => findShortestPath(0, 1, result), 100);
    } catch (error) {
      alert(`Ошибка выполнения алгоритма: ${error}`);
    }
  };

  // Поиск кратчайшего пути между двумя вершинами
  const findShortestPath = (from: number, to: number, result?: FloydWarshallResult) => {
    const algoResult = result || algorithmResult;
    if (!algoResult) {
      alert('Сначала запустите алгоритм!');
      return;
    }

    const pathKey = `${from}-${to}`;
    const shortestPath = algoResult.paths.get(pathKey);
    
    if (shortestPath && shortestPath.distance < FloydWarshallAlgorithm.INF) {
      setSelectedPath(shortestPath);
      setSelectedNodes([from, to]);
    } else {
      setSelectedPath(null);
      alert(` Путь из вершины ${from} в вершину ${to} не существует!`);
    }
  };

  // Запуск тестов
  const runTests = () => {
    setIsTesting(true);
    setTestResults([' Запуск тестов...']);
    
    setTimeout(() => {
      const testResult = FloydWarshallAlgorithm.testAlgorithm();
      setTestResults(testResult.details);
      setIsTesting(false);
      
      if (testResult.passed) {
        alert(' Все тесты пройдены успешно! Алгоритм работает корректно.');
      } else {
        alert(' Обнаружены ошибки в алгоритме. Проверьте детали тестирования.');
      }
    }, 100);
  };

  // Анализ временной сложности
  const analyzeComplexity = () => {
    setTestResults([' Анализ временной сложности...']);
    
    setTimeout(() => {
      const data = FloydWarshallAlgorithm.analyzeTimeComplexity(12);
      setComplexityData(data);
      
      const results = [
        ' АНАЛИЗ ВРЕМЕННОЙ СЛОЖНОСТИ',
        '================================'
      ];
      
      data.forEach(item => {
        results.push(
          `Вершин: ${item.nodes}, Рёбер: ${item.edges}, Время: ${item.executionTime.toFixed(2)}мс`
        );
      });
      
      results.push(
        '',
        ' ВЫВОД:',
        `• Сложность алгоритма: O(V³)`,
        `• Время растет пропорционально кубу количества вершин`,
        `• Подходит для графов до 100-200 вершин`
      );
      
      setTestResults(results);
    }, 100);
  };

  // Редактирование матрицы смежности
  const handleMatrixChange = (row: number, col: number, value: string) => {
    if (row === col) return; // Запрещаем изменять диагональ
    
    const newMatrix = adjacencyMatrix.map(r => [...r]);
    const numValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    newMatrix[row][col] = numValue;
    
    setAdjacencyMatrix(newMatrix);
    setEdges(matrixToEdges(newMatrix));
    setAlgorithmResult(null);
    setSelectedPath(null);
  };

  // Получение текущей матрицы расстояний для отображения
  const getCurrentDistances = (): number[][] => {
    if (!algorithmResult || currentStep === 0) {
      // Начальное состояние
      const n = adjacencyMatrix.length;
      const dist: number[][] = [];
      
      for (let i = 0; i < n; i++) {
        dist[i] = [];
        for (let j = 0; j < n; j++) {
          if (i === j) {
            dist[i][j] = 0;
          } else if (adjacencyMatrix[i][j] > 0) {
            dist[i][j] = adjacencyMatrix[i][j];
          } else {
            dist[i][j] = FloydWarshallAlgorithm.INF;
          }
        }
      }
      
      return dist;
    }
    
    return algorithmResult.steps[currentStep].distances;
  };

  // Восстановление пути для текущего шага
  const getPathForCurrentStep = (): number[] => {
    if (!algorithmResult || currentStep === 0) return [];
    
    const step = algorithmResult.steps[currentStep];
    if (step.updated && step.i !== -1 && step.j !== -1) {
      return FloydWarshallAlgorithm.reconstructPath(step.i, step.j, algorithmResult.next);
    }
    
    return [];
  };

  return (
    <SolutionLayout title="Сетевые алгоритмы. Динамические алгоритмы поиска путей">
      <div className={styles.container}>
         <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>
         Алгоритм Флойда-Уоршелла
      </h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>
        Визуализация поиска кратчайших путей между всеми парами вершин
      </p>

      {/* Панель управления */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {/* Генерация графа */}
          <div>
            <h3 style={{ color: '#34495e', marginBottom: '10px' }}> Генерация графа</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label>Вершин: </label>
                <input
                  type="number"
                  value={nodeCount}
                  onChange={(e) => setNodeCount(Math.max(2, parseInt(e.target.value) || 2))}
                  min="2"
                  max="8"
                  style={{ width: '60px', padding: '5px' }}
                />
              </div>
              <div>
                <label>Вероятность ребра: </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.1"
                  value={edgeProbability}
                  onChange={(e) => setEdgeProbability(parseFloat(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span> {edgeProbability.toFixed(1)}</span>
              </div>
              <button
                onClick={generateRandomGraph}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Сгенерировать
              </button>
            </div>
          </div>

          {/* Поиск пути */}
          <div>
            <h3 style={{ color: '#34495e', marginBottom: '10px' }}>🔍 Поиск пути</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(parseInt(e.target.value))}
                style={{ padding: '5px', borderRadius: '3px' }}
              >
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>Из {node.id}</option>
                ))}
              </select>
              <span>→</span>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(parseInt(e.target.value))}
                style={{ padding: '5px', borderRadius: '3px' }}
              >
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>В {node.id}</option>
                ))}
              </select>
              <button
                onClick={() => findShortestPath(sourceNode, targetNode)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Найти
              </button>
            </div>
          </div>

          {/* Управление алгоритмом */}
          <div>
            <h3 style={{ color: '#34495e', marginBottom: '10px' }}> Алгоритм</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={runAlgorithm}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Запустить
              </button>
              <button
                onClick={runTests}
                disabled={isTesting}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#9b59b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isTesting ? 'not-allowed' : 'pointer',
                  opacity: isTesting ? 0.6 : 1
                }}
              >
                {isTesting ? 'Тестирование...' : 'Тесты'}
              </button>
              <button
                onClick={analyzeComplexity}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Анализ сложности
              </button>
            </div>
          </div>
        </div>

        {/* Информация о результате */}
        {algorithmResult && (
          <div style={{ 
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#ecf0f1',
            borderRadius: '5px',
            borderLeft: '4px solid #3498db'
          }}>
            <div><strong> Время выполнения:</strong> {algorithmResult.executionTime.toFixed(2)} мс</div>
            <div><strong> Количество шагов:</strong> {algorithmResult.steps.length}</div>
            <div><strong> Вершин обработано:</strong> {nodes.length}</div>
            
            {selectedPath && (
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#d5f4e6', borderRadius: '3px' }}>
                <strong> Кратчайший путь {sourceNode} → {targetNode}:</strong><br/>
                <strong>Расстояние:</strong> {selectedPath.distance}<br/>
                <strong>Маршрут:</strong> {selectedPath.path.join(' → ')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Основное содержимое */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Визуализация графа */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#34495e', marginBottom: '15px' }}> Визуализация графа</h3>
          <GraphVisualization
            nodes={nodes}
            edges={edges}
            shortestPath={getPathForCurrentStep()}
            selectedNodes={selectedNodes}
            onNodeClick={(node) => setSelectedNodes([node.id])}
          />
          
          {/* Легенда */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px', 
            marginTop: '15px',
            fontSize: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '3px', backgroundColor: '#28a745' }}></div>
              <span>Кратчайший путь</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#007bff' }}></div>
              <span>Обычные рёбра</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ffc107', borderRadius: '50%' }}></div>
              <span>Выбранные вершины</span>
            </div>
          </div>
        </div>

        {/* Матрицы */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Матрица смежности */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#34495e', marginBottom: '15px' }}> Матрица смежности</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '10px', 
                      border: '1px solid #bdc3c7', 
                      backgroundColor: '#ecf0f1',
                      minWidth: '40px'
                    }}></th>
                    {nodes.map((_, i) => (
                      <th key={i} style={{ 
                        padding: '10px', 
                        border: '1px solid #bdc3c7', 
                        backgroundColor: '#ecf0f1',
                        minWidth: '50px'
                      }}>
                        {i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adjacencyMatrix.map((row, i) => (
                    <tr key={i}>
                      <th style={{ 
                        padding: '10px', 
                        border: '1px solid #bdc3c7', 
                        backgroundColor: '#ecf0f1'
                      }}>
                        {i}
                      </th>
                      {row.map((cell, j) => (
                        <td key={j} style={{ 
                          padding: '8px', 
                          border: '1px solid #bdc3c7', 
                          textAlign: 'center'
                        }}>
                          <input
                            type="number"
                            value={cell}
                            onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                            min="0"
                            style={{ 
                              width: '45px', 
                              textAlign: 'center', 
                              border: '1px solid #ddd', 
                              borderRadius: '3px',
                              padding: '3px',
                              backgroundColor: i === j ? '#f8f9fa' : 'white'
                            }}
                            disabled={i === j}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Матрица расстояний */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#34495e', marginBottom: '15px' }}>
              {algorithmResult ? ' Текущая матрица расстояний' : ' Начальная матрица расстояний'}
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '10px', 
                      border: '1px solid #bdc3c7', 
                      backgroundColor: '#ecf0f1'
                    }}></th>
                    {nodes.map((_, i) => (
                      <th key={i} style={{ 
                        padding: '10px', 
                        border: '1px solid #bdc3c7', 
                        backgroundColor: '#ecf0f1',
                        minWidth: '50px'
                      }}>
                        {i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getCurrentDistances().map((row, i) => (
                    <tr key={i}>
                      <th style={{ 
                        padding: '10px', 
                        border: '1px solid #bdc3c7', 
                        backgroundColor: '#ecf0f1'
                      }}>
                        {i}
                      </th>
                      {row.map((cell, j) => {
                        const isActive = algorithmResult && 
                                       algorithmResult.steps[currentStep]?.i === i && 
                                       algorithmResult.steps[currentStep]?.j === j;
                                       
                        return (
                          <td key={j} style={{ 
                            padding: '10px', 
                            border: '1px solid #bdc3c7', 
                            textAlign: 'center',
                            backgroundColor: isActive ? '#fff3cd' : 'white',
                            fontWeight: isActive ? 'bold' : 'normal',
                            color: isActive ? '#856404' : 'inherit'
                          }}>
                            {FloydWarshallAlgorithm.formatDistance(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Шаги алгоритма */}
      {algorithmResult && algorithmResult.steps.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#34495e', marginBottom: '15px' }}>
             Шаги алгоритма ({currentStep + 1} из {algorithmResult.steps.length})
          </h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              style={{
                padding: '8px 15px',
                backgroundColor: currentStep === 0 ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ⬅ Назад
            </button>
            
            <div style={{ flex: 1, textAlign: 'center' }}>
              <strong>Текущий шаг:</strong> {algorithmResult.steps[currentStep].k >= 0 ? 
                `k=${algorithmResult.steps[currentStep].k}, i=${algorithmResult.steps[currentStep].i}, j=${algorithmResult.steps[currentStep].j}` : 
                'Инициализация'}
            </div>
            
            <button 
              onClick={() => setCurrentStep(Math.min(algorithmResult.steps.length - 1, currentStep + 1))}
              disabled={currentStep === algorithmResult.steps.length - 1}
              style={{
                padding: '8px 15px',
                backgroundColor: currentStep === algorithmResult.steps.length - 1 ? '#bdc3c7' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: currentStep === algorithmResult.steps.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Вперед 
            </button>
          </div>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '5px',
            borderLeft: '4px solid #e74c3c'
          }}>
            {algorithmResult.steps[currentStep]?.description}
          </div>
        </div>
      )}

      {/* Результаты тестирования и анализа */}
      {testResults.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#34495e', marginBottom: '15px' }}> Результаты тестирования и анализа</h3>
          <div style={{ 
            maxHeight: '300px',
            overflow: 'auto',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            {testResults.map((result, index) => (
              <div key={index} style={{ 
                margin: '4px 0',
                padding: '2px 0',
                whiteSpace: 'pre-wrap'
              }}>
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Анализ сложности в виде таблицы */}
      {complexityData.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#34495e', marginBottom: '15px' }}> Анализ временной сложности</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left' }}>Вершин (V)</th>
                <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left' }}>Рёбер (E)</th>
                <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left' }}>Время (мс)</th>
                <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left' }}>Операции (V³)</th>
                <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left' }}>Сложность</th>
              </tr>
            </thead>
            <tbody>
              {complexityData.map((data, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #bdc3c7' }}>{data.nodes}</td>
                  <td style={{ padding: '12px', border: '1px solid #bdc3c7' }}>{data.edges}</td>
                  <td style={{ padding: '12px', border: '1px solid #bdc3c7' }}>{data.executionTime.toFixed(2)}</td>
                  <td style={{ padding: '12px', border: '1px solid #bdc3c7' }}>{data.operations}</td>
                  <td style={{ padding: '12px', border: '1px solid #bdc3c7' }}>O(V³)</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ 
            backgroundColor: '#e8f4f8', 
            padding: '15px', 
            borderRadius: '5px',
            borderLeft: '4px solid #3498db'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}> Выводы:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#34495e' }}>
              <li><strong>Временная сложность:</strong> O(V³) - три вложенных цикла по количеству вершин</li>
              <li><strong>Пространственная сложность:</strong> O(V²) - хранение двух матриц V×V</li>
              <li><strong>Применение:</strong> Нахождение кратчайших путей между всеми парами вершин</li>
              <li><strong>Особенности:</strong> Работает с отрицательными весами (но не с отрицательными циклами)</li>
              <li><strong>Рекомендации:</strong> Использовать для графов до 100-200 вершин</li>
            </ul>
          </div>
        </div>
      )}
    </div>

      </div>
    </SolutionLayout>
  );
};