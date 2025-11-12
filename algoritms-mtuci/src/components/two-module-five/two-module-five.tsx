import React, { useState, useEffect  } from "react";
// @ts-ignore
import styles from "./two-module-five.module.css";
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

export interface PrimResult {
  mst: GraphEdge[];
  totalWeight: number;
  steps: PrimStep[];
  executionTime: number;
}

export interface PrimStep {
  step: number;
  addedNode: number;
  addedEdge: GraphEdge | null;
  visited: number[];
  edges: GraphEdge[];
  description: string;
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
  mstEdges?: GraphEdge[];
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
  selectedNodes?: number[];
}
const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  mstEdges = [],
  width = 700,
  height = 500,
  onNodeClick,
  selectedNodes = []
}) => {
  return (
    <div style={{
      position: 'relative',
      width: `${width}px`,
      height: `${height}px`,
      border: '2px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      {/* Рёбра графа */}
      {edges.map((edge, index) => {
        const sourceNode = nodes[edge.source];
        const targetNode = nodes[edge.target];
        const isInMST = mstEdges.some(e => 
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
        );

        // Вычисляем середину ребра для подписи веса
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;

        return (
          <React.Fragment key={index}>
            {/* Линия ребра */}
            <line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={isInMST ? '#28a745' : '#6c757d'}
              strokeWidth={isInMST ? 3 : 1}
              strokeDasharray={isInMST ? 'none' : '5,5'}
            />
            
            {/* Подпись веса */}
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fill: isInMST ? '#28a745' : '#6c757d',
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: 'white',
                padding: '2px'
              }}
            >
              {edge.weight}
            </text>
          </React.Fragment>
        );
      })}

      {/* Вершины */}
      {nodes.map((node) => (
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
            backgroundColor: selectedNodes.includes(node.id) ? '#ffc107' : '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '3px solid',
            borderColor: selectedNodes.includes(node.id) ? '#ff5722' : '#0056b3',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
          title={node.label}
        >
          {node.id}
        </div>
      ))}
    </div>
  );
};

export default GraphVisualization;
export const TwoModuleFive = () => {
   const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);
  
  // Результаты алгоритма
  const [primResult, setPrimResult] = useState<PrimResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Анализ сложности
  const [complexityData, setComplexityData] = useState<TimeComplexityData[]>([]);
  
  // Настройки
  const [nodeCount, setNodeCount] = useState<number>(8);
  const [edgeProbability, setEdgeProbability] = useState<number>(0.5);
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);

  // Инициализация
  useEffect(() => {
    generateRandomGraph();
  }, []);

  // Генерация случайного графа
  const generateRandomGraph = () => {
    const { matrix, nodes: newNodes } = PrimAlgorithm.generateRandomGraph(nodeCount, edgeProbability);
    setAdjacencyMatrix(matrix);
    setNodes(newNodes);
    setEdges(PrimAlgorithm.matrixToEdges(matrix));
    setPrimResult(null);
    setCurrentStep(0);
    setSelectedNodes([]);
  };

  // Запуск алгоритма Прима
  const runPrimAlgorithm = () => {
    if (adjacencyMatrix.length === 0) return;

    const result = PrimAlgorithm.findMST(adjacencyMatrix, nodes);
    setPrimResult(result);
    setCurrentStep(0);
    setSelectedNodes([0]); // Начинаем с вершины 0
  };

  // Показ следующего шага
  const nextStep = () => {
    if (primResult && currentStep < primResult.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      const step = primResult.steps[currentStep + 1];
      setSelectedNodes(step.visited);
    }
  };

  // Показ предыдущего шага
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const step = primResult!.steps[currentStep - 1];
      setSelectedNodes(step.visited);
    }
  };

  // Анализ временной сложности
  const analyzeComplexity = () => {
    const data = PrimAlgorithm.analyzeTimeComplexity(50);
    setComplexityData(data);
  };

  // Ручное задание матрицы смежности
  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = [...adjacencyMatrix];
    const numValue = value === '' ? 0 : parseInt(value);
    newMatrix[row][col] = numValue;
    newMatrix[col][row] = numValue; // Симметричная матрица
    
    setAdjacencyMatrix(newMatrix);
    setEdges(PrimAlgorithm.matrixToEdges(newMatrix));
  };

  // Получение MST рёбер для текущего шага
  const getCurrentMSTEdges = (): GraphEdge[] => {
    if (!primResult) return [];
    return primResult.steps[currentStep]?.edges || [];
  };

class PrimAlgorithm {
  /**
   * Алгоритм Прима для построения минимального остовного дерева
   */
  public static findMST(
    adjacencyMatrix: number[][],
    nodes: GraphNode[]
  ): PrimResult {
    const startTime = performance.now();
    const n = adjacencyMatrix.length;
    const steps: PrimStep[] = [];
    const mst: GraphEdge[] = [];
    const visited: boolean[] = new Array(n).fill(false);
    let totalWeight = 0;
    let operations = 0;

    // Шаг 0: Инициализация
    steps.push({
      step: 0,
      addedNode: -1,
      addedEdge: null,
      visited: [],
      edges: [],
      description: 'Инициализация алгоритма. Выбираем начальную вершину 0.'
    });

    // Начинаем с вершины 0
    visited[0] = true;
    operations++;

    steps.push({
      step: 1,
      addedNode: 0,
      addedEdge: null,
      visited: [0],
      edges: [],
      description: 'Добавлена начальная вершина 0 в остовное дерево.'
    });

    // Пока не посетим все вершины
    for (let i = 0; i < n - 1; i++) {
      let minWeight = Infinity;
      let minEdge: GraphEdge | null = null;
      let addedNode = -1;

      // Ищем минимальное ребро между посещенными и непосещенными вершинами
      for (let u = 0; u < n; u++) {
        operations++;
        if (visited[u]) {
          for (let v = 0; v < n; v++) {
            operations++;
            if (!visited[v] && adjacencyMatrix[u][v] > 0) {
              if (adjacencyMatrix[u][v] < minWeight) {
                minWeight = adjacencyMatrix[u][v];
                minEdge = { source: u, target: v, weight: minWeight };
                addedNode = v;
              }
            }
          }
        }
      }

      if (minEdge) {
        // Добавляем найденное ребро в MST
        visited[addedNode] = true;
        mst.push(minEdge);
        totalWeight += minWeight;
        operations++;

        steps.push({
          step: i + 2,
          addedNode,
          addedEdge: minEdge,
          visited: visited.map((v, idx) => v ? idx : -1).filter(idx => idx !== -1),
          edges: [...mst],
          description: `Добавлено ребро ${minEdge.source}-${minEdge.target} весом ${minWeight}. Вершина ${addedNode} добавлена в дерево.`
        });
      }
    }

    const endTime = performance.now();

    return {
      mst,
      totalWeight,
      steps,
      executionTime: endTime - startTime
    };
  }

  /**
   * Генерация случайного графа
   */
  public static generateRandomGraph(
    nodeCount: number,
    edgeProbability: number = 0.5
  ): { matrix: number[][], nodes: GraphNode[] } {
    const matrix: number[][] = Array(nodeCount).fill(0).map(() => 
      Array(nodeCount).fill(0)
    );
    
    const nodes: GraphNode[] = Array(nodeCount).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 600 + 50,
      y: Math.random() * 400 + 50,
      label: `Вершина ${i}`
    }));

    // Генерируем ребра
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < edgeProbability) {
          const weight = Math.floor(Math.random() * 20) + 1;
          matrix[i][j] = weight;
          matrix[j][i] = weight;
        }
      }
    }

    return { matrix, nodes };
  }

  /**
   * Анализ временной сложности
   */
  public static analyzeTimeComplexity(maxNodes: number = 20): TimeComplexityData[] {
    const results: TimeComplexityData[] = [];

    for (let nodes = 5; nodes <= maxNodes; nodes += 5) {
      const { matrix, nodes: graphNodes } = this.generateRandomGraph(nodes, 0.7);
      
      const startTime = performance.now();
      const result = this.findMST(matrix, graphNodes);
      const endTime = performance.now();

      // Подсчитываем количество ребер
      let edgeCount = 0;
      for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
          if (matrix[i][j] > 0) edgeCount++;
        }
      }

      results.push({
        nodes,
        edges: edgeCount,
        executionTime: endTime - startTime,
        operations: Math.pow(nodes, 2) // O(V²) для наивной реализации
      });
    }

    return results;
  }

  /**
   * Преобразование матрицы смежности в список ребер
   */
  public static matrixToEdges(matrix: number[][]): GraphEdge[] {
    const edges: GraphEdge[] = [];
    const n = matrix.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (matrix[i][j] > 0) {
          edges.push({
            source: i,
            target: j,
            weight: matrix[i][j]
          });
        }
      }
    }

    return edges;
  }
}

  return (
    <SolutionLayout title="Алгоритмы построения минимального остовного дерева">
      <div className={styles.container}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Визуализация алгоритма Прима
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Левая панель - Управление */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#555', marginBottom: '20px' }}>Управление графом</h2>

          {/* Настройки генерации */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#555', marginBottom: '10px' }}>Генерация графа</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <label>Вершин:</label>
              <input
                type="number"
                value={nodeCount}
                onChange={(e) => setNodeCount(Math.max(3, parseInt(e.target.value) || 3))}
                min="3"
                max="20"
                style={{ width: '60px', padding: '5px' }}
              />
              
              <label>Вероятность ребра:</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={edgeProbability}
                onChange={(e) => setEdgeProbability(parseFloat(e.target.value))}
                style={{ width: '100px' }}
              />
              <span>{edgeProbability.toFixed(1)}</span>
            </div>
            
            <button
              onClick={generateRandomGraph}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Сгенерировать граф
            </button>
          </div>

          {/* Управление алгоритмом */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#555', marginBottom: '10px' }}>Алгоритм Прима</h3>
            <button
              onClick={runPrimAlgorithm}
              style={{
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Запустить алгоритм
            </button>

            {primResult && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: currentStep === 0 ? '#6c757d' : '#ffc107',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Назад
                  </button>
                  
                  <span>Шаг {currentStep + 1} из {primResult.steps.length}</span>
                  
                  <button
                    onClick={nextStep}
                    disabled={currentStep === primResult.steps.length - 1}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: currentStep === primResult.steps.length - 1 ? '#6c757d' : '#ffc107',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: currentStep === primResult.steps.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Вперед →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Анализ сложности */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#555', marginBottom: '10px' }}>Анализ сложности</h3>
            <button
              onClick={analyzeComplexity}
              style={{
                padding: '10px 15px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Анализировать сложность
            </button>
          </div>

          {/* Информация о результате */}
          {primResult && (
            <div style={{ 
              backgroundColor: '#e7f3ff', 
              padding: '15px', 
              borderRadius: '4px',
              border: '1px solid #b3d9ff'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#004085' }}>Результат:</h4>
              <div><strong>Вес MST:</strong> {primResult.totalWeight}</div>
              <div><strong>Время выполнения:</strong> {primResult.executionTime.toFixed(2)} мс</div>
              <div><strong>Рёбер в MST:</strong> {primResult.mst.length}</div>
              
              {primResult.steps[currentStep] && (
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                  <strong>Текущий шаг:</strong> {primResult.steps[currentStep].description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Правая панель - Визуализация */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#555', marginBottom: '20px' }}>Визуализация графа</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <GraphVisualization
              nodes={nodes}
              edges={edges}
              mstEdges={getCurrentMSTEdges()}
              selectedNodes={selectedNodes}
              onNodeClick={(node) => setSelectedNodes([node.id])}
            />
          </div>

          {/* Легенда */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '3px', backgroundColor: '#28a745' }}></div>
              <span>Рёбра MST</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '1px', backgroundColor: '#6c757d', borderBottom: '1px dashed #6c757d' }}></div>
              <span>Остальные рёбра</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#ffc107', borderRadius: '50%' }}></div>
              <span>Выбранные вершины</span>
            </div>
          </div>
        </div>
      </div>

      {/* Матрица смежности */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h2 style={{ color: '#555', marginBottom: '15px' }}>Матрица смежности</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}></th>
                {nodes.map((_, index) => (
                  <th key={index} style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', minWidth: '40px' }}>
                    {index}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adjacencyMatrix.map((row, i) => (
                <tr key={i}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                    {i}
                  </th>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={cell || 0}
                        onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                        min="0"
                        style={{ width: '40px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '2px' }}
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

      {/* Анализ временной сложности */}
      {complexityData.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Анализ временной сложности</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Вершин (V)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Рёбер (E)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Время (мс)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Операции (O(V²))</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Сложность</th>
              </tr>
            </thead>
            <tbody>
              {complexityData.map((data, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.nodes}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.edges}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.executionTime.toFixed(2)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.operations}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>O(V²)</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ backgroundColor: '#e7f3ff', padding: '15px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#004085' }}>Выводы:</h4>
            <p style={{ margin: '0', fontSize: '14px' }}>
              <strong>Временная сложность алгоритма Прима:</strong> O(V²) для реализации с матрицей смежности.<br/>
              <strong>Пространственная сложность:</strong> O(V²) для хранения матрицы смежности.<br/>
              <strong>Оптимизация:</strong> Использование двоичной кучи может снизить сложность до O(E log V).
            </p>
          </div>
        </div>
      )}

      {/* Теоретическая информация */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <h2 style={{ color: '#555', marginBottom: '15px' }}>Теоретическая информация</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#333' }}>Алгоритм Прима:</h4>
            <ol style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>Выбираем произвольную вершину для начала построения MST</li>
              <li>Находим минимальное ребро, соединяющее дерево с новой вершиной</li>
              <li>Добавляем это ребро и вершину в MST</li>
              <li>Повторяем шаги 2-3, пока не будут включены все вершины</li>
            </ol>
          </div>
          <div>
            <h4 style={{ color: '#333' }}>Сложность алгоритма:</h4>
            <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li><strong>Наивная реализация:</strong> O(V²)</li>
              <li><strong>С двоичной кучей:</strong> O(E log V)</li>
              <li><strong>С фибоначчиевой кучей:</strong> O(E + V log V)</li>
              <li><strong>Пространственная:</strong> O(V²) для матрицы смежности</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
      </div>
    </SolutionLayout>
  );
};