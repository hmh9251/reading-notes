//计数排序

const countingSort = (arr, len) => {
  if(len <= 1) return arr;

  let max = arr[0];
  for(let i = 1; i < len; i++) {
      max = Math.max(max, arr[i]);
  }
  console.log('max', max);

  const c = new Array(max + 1).fill(0);
  for(let i = 0; i < len; i++) {
    c[arr[i]]++;
  }
  console.log(c);
  for(let i = 1; i <= max; i++) {
    c[i] = c[i-1] + c[i];
  }
  
  const r = [];
  for(let i = 0; i < len; i++) {
    let current = arr[i];
    r[c[current]-1] = arr[i];
    c[current]--;
  }
  return r;
}

let arr = [2,4,5,6,7,8,9,5,2,7,3,4,4,3,2,5,5,5,5,2,2,2,8,8];

console.log(countingSort(arr, arr.length))