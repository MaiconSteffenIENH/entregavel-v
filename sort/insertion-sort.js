export function insertionSort(arrArg) {
  const array = structuredClone(arrArg);

  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    let j = i - 1;
    while (j >= 0 && value < array[j]) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = value;
  }

  return array;
}
