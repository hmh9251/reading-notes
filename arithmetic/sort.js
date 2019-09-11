
//冒泡排序
const bubbleSort = arr => {
  if(arr.length <= 1) return arr;
  let length = arr.length;
  for(let i = 0; i < length; i++) {
    let haschange = false;
    for(let j = 0; j < length-i-1; j++) {
      if(arr[j] > arr[j + 1]) {
        let temp = arr[j+1];
        arr[j+1] = arr[j];
        arr[j] = temp;
        haschange = true;
      }
    }
    if(!haschange) break;
  }
  return arr;
}

console.log(bubbleSort([2,5,1,6,2,7,9]))

//插入排序
const insertionSort = arr => {
  if(arr.length <= 1) return arr;
  for(let i = 1; i < arr.length; ++i) {
    let value = arr[i];
    let j = i - 1;
    for(; j >= 0; --j) {
      if(arr[j] > value) {
        arr[j+1] = arr[j];
      } else {
        break;
      }
    }
    arr[j+1] = value;
  }
  return arr;
}

console.log(insertionSort([5,6,2,5,2,53,9,5,0,2,5,3,2,6,1]));

//选择排序
const selectionSort = arr => {
  if(arr.length <= 1) return arr;
  for(let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for(let j = i + 1; j < arr.length; j++) {
      if(arr[j] < arr[minIndex]){
        minIndex = j;
      }
    }
    const temp = arr[minIndex];
    arr[minIndex] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

console.log(insertionSort([5,6,2,5,2,53,9,5,0,2,5,3,2,6,1]));

//归并排序
const mergeArr = (left, right) => {
  let temp = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while(left.length > leftIndex && right.length > rightIndex) {
    if(left[leftIndex] <= right[rightIndex]) {
      temp.push(left[leftIndex]);
      leftIndex++;
    } else {
      temp.push(right[rightIndex]);
      rightIndex++;
    }
  }
  return temp.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const mergeSort = (arr) => {
  if(arr.length <= 1) return arr;
  const middle = Math.floor(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle);
  return mergeArr(mergeSort(left), mergeSort(right));
}

const testArr = []
let i = 0
while (i < 100) {
    testArr.push(Math.floor(Math.random() * 1000))
    i++
}

const res = mergeSort(testArr)
console.log(testArr)
console.log(res)
