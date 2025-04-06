export const getArrRandom = (length: number) => {
  return Array.from({ length: length }, () =>
    Math.floor(Math.random() * length)
  );
};
export const stopwatch = (fn: any): number => {
  let start = new Date().getTime();
  fn();
  let end = new Date().getTime();
  let time = end - start;
  return time;
};

export const selectionSort = (inputArr: number[]) => {
  let n = inputArr.length;
  for (let i = 0; i < n; i++) {
    // Находим наименьшее число в правой части массива
    let min = i;
    for (let j = i; j < n; j++) {
      if (inputArr[j] < inputArr[min]) {
        min = j;
      }
    }
    if (min != i) {
      // Заменяем элементы
      let tmp = inputArr[i];
      inputArr[i] = inputArr[min];
      inputArr[min] = tmp;
    }
  }
  return inputArr;
};

export const QuickSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  const leftList = [];
  const rightList = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      leftList.push(arr[i]);
    } else {
      rightList.push(arr[i]);
    }
  }

  return [...QuickSort(leftList), pivot, ...QuickSort(rightList)];
};
