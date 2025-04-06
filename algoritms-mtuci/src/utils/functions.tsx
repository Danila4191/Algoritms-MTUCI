export const getArrRandom = (length: number) => {
  return Array.from({ length: length }, () =>
    Math.floor(Math.random() * length)
  );
};

 export const createRandomArr = (length: number, min: number, max: number) => {
    const arr = Array.from({ length: max - min + 1 }, (n, i) => min + i);

    for (let i = arr.length; --i > 0; ) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, length);
  }
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
export const InterpolationSearch = (item: number, arr: number[]) => {
  var mid, low = 0, high = arr.length-1;

  while (arr[low] < item && arr[high] > item)
  {  mid = low + Math.floor( ((item-arr[low])*(high-low))/(arr[high]-arr[low]) );
     if (arr[mid] < item) low = mid+1;
     else if (arr[mid] > item) high = mid-1;
     else return mid;
  }

  if (arr[low] === item) return item;           // На выходе индекс искомого элемента.
  else if (arr[high] === item) return high;    // Если искомого элемента нет в массиве, то -1.
  else return -1;
}