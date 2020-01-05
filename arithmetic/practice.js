

const process = (n) => {
  if(n === 1) return 1;
  if(n === 2) return 13;
  return process(n-1);
}

console.log(process(10));
