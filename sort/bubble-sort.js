export function bubbleSort(arrayArg) {
  const arr = structuredClone(arrayArg);
  let foiModificado;

  do {
    foiModificado = false;
    for (let i = 0; i < arr.length - 1; i++) {
      const numeroAtual = arr[i];
      const proximoNumero = arr[i + 1];

      if (numeroAtual > proximoNumero) {
        foiModificado = true;
        arr[i] = proximoNumero;
        arr[i + 1] = numeroAtual;
      }
    }
  } while (foiModificado);

  return arr;
}
