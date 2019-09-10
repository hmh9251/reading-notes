
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
