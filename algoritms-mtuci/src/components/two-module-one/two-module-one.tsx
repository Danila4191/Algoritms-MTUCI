import React, { useState } from "react";
// @ts-ignore
import styles from "./two-module-one.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";

type Token = string;
type Operator = '+' | '-' | '*' | '/' | '^' | '(' | ')';
// @ts-ignore
const OPERATORS: Set<Operator> = new Set(['+', '-', '*', '/', '^', '(', ')']);
const PRECEDENCE: Record<Operator, number> = {
  '^': 4,
  '*': 3,
  '/': 3,
  '+': 2,
  '-': 2,
  '(': 1,
  ')': 1
};

export const TwoModuleOne = () => {

 class ExpressionConverter {
  // Преобразование инфиксной записи в постфиксную (алгоритм сортировочной станции)
  public static infixToPostfix(expression: string): Token[] {
    const output: Token[] = [];
    const stack: Operator[] = [];
    
    // Разбиваем выражение на токены
    const tokens = this.tokenize(expression);
    
    for (const token of tokens) {
      if (this.isNumber(token)) {
        // Число сразу добавляем в выходную очередь
        output.push(token);
      } else if (OPERATORS.has(token as Operator)) {
        const operator = token as Operator;
        
        if (operator === '(') {
          stack.push(operator);
        } else if (operator === ')') {
          // Выталкиваем операторы из стека до открывающей скобки
          while (stack.length > 0 && stack[stack.length - 1] !== '(') {
            output.push(stack.pop()!);
          }
          stack.pop(); // Удаляем '('
        } else {
          // Обычный оператор
          while (
            stack.length > 0 &&
            PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[operator] &&
            operator !== '^' // право-ассоциативный оператор
          ) {
            output.push(stack.pop()!);
          }
          stack.push(operator);
        }
      }
    }
    
    // Выталкиваем оставшиеся операторы из стека
    while (stack.length > 0) {
      output.push(stack.pop()!);
    }
    
    return output;
  }
  
  // Вычисление постфиксного выражения
  public static evaluatePostfix(tokens: Token[]): number {
    const stack: number[] = [];
    
    for (const token of tokens) {
      if (this.isNumber(token)) {
        stack.push(parseFloat(token));
      } else if (OPERATORS.has(token as Operator)) {
        const operator = token as Operator;
        
        if (operator === '(' || operator === ')') {
          throw new Error('Invalid postfix expression');
        }
        
        const b = stack.pop();
        const a = stack.pop();
        
        if (a === undefined || b === undefined) {
          throw new Error('Invalid expression');
        }
        
        switch (operator) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': 
            if (b === 0) throw new Error('Division by zero');
            stack.push(a / b); 
            break;
          case '^': stack.push(Math.pow(a, b)); break;
        }
      }
    }
    
    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }
    
    return stack[0];
  }
  
  // Вычисление инфиксного выражения (через преобразование в постфиксную)
  public static evaluateInfix(expression: string): number {
    const postfix = this.infixToPostfix(expression);
    return this.evaluatePostfix(postfix);
  }
  
  // Разбиение строки на токены
  private static tokenize(expression: string): Token[] {
    return expression
      .replace(/\s+/g, '')
      .split(/([+\-*/^()])/)
      .filter(token => token !== '');
  }
  
  // Проверка, является ли токен числом
  private static isNumber(token: string): boolean {
    return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
  }
}


  
const [expression, setExpression] = useState<string>('(3 + 4) * 2 - 5');
  const [postfixExpression, setPostfixExpression] = useState<Token[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleConvertToPostfix = () => {
    try {
      setError('');
      const postfix = ExpressionConverter.infixToPostfix(expression);
      setPostfixExpression(postfix);
      setResult(null);
    } catch (err) {
      setError(`Ошибка преобразования: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleEvaluateInfix = () => {
    try {
      setError('');
      const calculatedResult = ExpressionConverter.evaluateInfix(expression);
      setResult(calculatedResult);
      setPostfixExpression([]);
    } catch (err) {
      setError(`Ошибка вычисления: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleEvaluatePostfix = () => {
    try {
      setError('');
      if (postfixExpression.length === 0) {
        throw new Error('Сначала преобразуйте выражение в постфиксную форму');
      }
      const calculatedResult = ExpressionConverter.evaluatePostfix(postfixExpression);
      setResult(calculatedResult);
    } catch (err) {
      setError(`Ошибка вычисления: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleClear = () => {
    setExpression('');
    setPostfixExpression([]);
    setResult(null);
    setError('');
  };


  return (
    <SolutionLayout title="Инфиксная и постфиксная нотации">
      <div className={styles.container}>
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Калькулятор выражений</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="expression" style={{ display: 'block', marginBottom: '5px' }}>
          Введите выражение:
        </label>
        <input
          id="expression"
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Например: (3 + 4) * 2 - 5"
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleConvertToPostfix}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          В постфиксную форму
        </button>
        
        <button
          onClick={handleEvaluateInfix}
          style={{
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Вычислить инфиксное
        </button>
        
        <button
          onClick={handleEvaluatePostfix}
          style={{
            padding: '10px 15px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Вычислить постфиксное
        </button>
        
        <button
          onClick={handleClear}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Очистить
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {postfixExpression.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Постфиксная запись (RPN):</h3>
          <div style={{
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            {postfixExpression.join(' ')}
          </div>
        </div>
      )}

      {result !== null && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Результат:</h3>
          <div style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {result}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h4>Примеры выражений:</h4>
        <ul>
          <li><code>3 + 4 * 2</code></li>
          <li><code>(3 + 4) * 2</code></li>
          <li><code>10 / 2 + 3 * 4</code></li>
          <li><code>2 ^ 3 + 1</code> (возведение в степень)</li>
        </ul>
      </div>
    </div>
      </div>
    </SolutionLayout>
  );
};




