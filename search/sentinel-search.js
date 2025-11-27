export function sentinelSearch(arr, target) {
  const ultimo = arr[arr.length - 1];
  arr[arr.length - 1] = target;
  let i = 0;
  while (arr[i] !== target) {
    i++;
  }

  arr[arr.length - 1] = ultimo;

  if (i < arr.length - 1 || ultimo === target) {
    return i;
  }

  return -1;
}
