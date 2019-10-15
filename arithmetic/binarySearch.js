
const binarySearch = (arr = [], value) => {
  let n = arr.length;
  if(n < 1) return -1;

  let low = 0;
  let high = n - 1;

  while(low <= high) {
    let mid = Math.floor( (high + low) / 2 );
    if(arr[mid] === value) {
      return mid;
    } else if (arr[mid] < value) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}

console.log(binarySearch([0,2,3,6,7], 6))
