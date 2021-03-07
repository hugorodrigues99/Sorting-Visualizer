import React, { Fragment, useState, useEffect } from "react";
import NavBar from "./components/navBar";
import Body from "./components/body";
import { randomize, swapElements } from "./algorithms/utils";
import "./App.css";

const START_POINT = 78;
const ACC = 1000;

function App() {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    setBars(randomize(START_POINT));
  }, []);

  // Bubble Sort
  const bubbleSort = () => {
    const unsortedBars = [...bars];
    let delay = 100;

    let stop = null;
    for (var i = 0; i < unsortedBars.length; i++) {
      stop = true;

      for (var j = 0; j < unsortedBars.length - i - 1; j++) {
        colorElements(unsortedBars, [j, j + 1], delay, "eval");
        delay += ACC;

        if (unsortedBars[j].height > unsortedBars[j + 1].height) {
          colorElements(unsortedBars, [j, j + 1], delay, "swap");
          delay += ACC;
          swapElements(unsortedBars, j, j + 1);
          colorElements(unsortedBars, [j, j + 1], delay, "eval");
          delay += ACC;
          stop = false;
        }
      }
      unsortedBars[j].status = "done";
      colorElements(unsortedBars, [], delay);
      delay += ACC;

      if (stop) break;
    }

    if (stop) {
      for (
        let remaining = 0;
        remaining < unsortedBars.length - i - 1;
        remaining++
      ) {
        unsortedBars[remaining].status = "done";
        colorElements(unsortedBars, [], delay);
        delay += ACC;
      }
    }
  };

  // Merge Sort
  const mergeSort = (arr, l, r, delay, last) => {
    if (l < r) {
      const m = Math.floor((l + r) / 2);

      const delay1 = mergeSort(arr, l, m, delay, false);
      const delay2 = mergeSort(arr, m + 1, r, delay1, false);

      return merge(arr, l, m, r, delay2, last);
    }
    return delay;
  };

  const merge = (arr, l, m, r, delay, last) => {
    const n1 = m - l + 1;
    const n2 = r - m;

    const L = [];
    const R = [];
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0,
      j = 0;

    let k = l;
    while (i < n1 && j < n2) {
      const lIndex = arr.indexOf(L[i]);
      const rIndex = arr.indexOf(R[j]);
      colorElements(arr, [lIndex, rIndex], delay, "eval");
      delay += ACC;
      if (L[i].height <= R[j].height) {
        arr.splice(lIndex, 1);
        arr.splice(k++, 0, L[i++]);
      } else {
        colorElements(arr, [lIndex, rIndex], delay, "swap");
        delay += ACC;
        arr.splice(rIndex, 1);
        arr.splice(k++, 0, R[j++]);
        colorElements(arr, [k - 1, k], delay, "eval");
        delay += ACC;
      }

      if (last) {
        arr[k - 1].status = "done";
        colorElements(arr, [], delay);
        delay += ACC;
      }
    }

    while (i < n1) {
      arr[k++] = L[i++];
      if (last) {
        arr[k - 1].status = "done";
        colorElements(arr, [], delay);
        delay += ACC;
      }
    }
    while (j < n2) {
      arr[k++] = R[j++];
      if (last) {
        arr[k - 1].status = "done";
        colorElements(arr, [], delay);
        delay += ACC;
      }
    }

    return delay;
  };

  // Quick Sort
  const quickSort = (arr, low, high, delay) => {
    if (low < high) {
      const [pivot, partDelay] = partition(arr, low, high, delay);

      const leftDelay = quickSort(arr, low, pivot - 1, partDelay);
      return quickSort(arr, pivot + 1, high, leftDelay);
    } else if (low < arr.length) {
      arr[low].status = "done";
      colorElements(arr, [], delay);
      return delay + ACC;
    }
    return delay;
  };

  function partition(arr, low, high, delay) {
    arr[high].status = "pivot";

    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      colorElements(arr, [i + 1, j], delay, "eval");
      delay += ACC;
      if (arr[j].height < pivot.height) {
        colorElements(arr, [i + 1, j], delay, "swap");
        delay += ACC;
        swapElements(arr, ++i, j);
        colorElements(arr, [i, j], delay, "eval");
        delay += ACC;
      }
    }

    colorElements(arr, [i + 1, high], delay, "swap");
    delay += ACC;
    swapElements(arr, i + 1, high);
    colorElements(arr, [i + 1, high], delay, "eval");
    delay += ACC;
    arr[i + 1].status = "done";
    colorElements(arr, [], delay);
    delay += ACC;
    return [i + 1, delay];
  }

  // Heap Sort
  const heapSort = (arr, n) => {
    let delay = ACC;
    console.log(n);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
      delay += heapify(arr, n, i, delay);

    for (let i = n - 1; i > 0; i--) {
      colorElements(arr, [0, i], delay, "swap");
      delay += ACC;
      swapElements(arr, 0, i);
      arr[i].status = "done";
      colorElements(arr, [], delay);
      delay += ACC;
      delay += heapify(arr, i, 0, delay);
    }
  };

  const heapify = (arr, n, i, delay) => {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
      colorElements(arr, [l, largest], delay, "heapTest");
      delay += ACC;
      if (arr[l].height > arr[largest].height) largest = l;
    }

    if (r < n) {
      colorElements(arr, [r, largest], delay, "heapTest");
      delay += ACC;
      if (arr[r].height > arr[largest].height) largest = r;
    }

    if (largest !== i) {
      colorElements(arr, [i, largest], delay, "swap");
      delay += ACC;
      swapElements(arr, i, largest);
      colorElements(arr, [i, largest], delay, "eval");
      delay += ACC;
      delay += heapify(arr, n, largest, delay);
    }

    return delay;
  };

  const colorElements = (arr, elements, delay, action) => {
    const newArr = arr.map((bar) => {
      return { ...bar };
    });
    if (action) elements.forEach((el) => (newArr[el].status = action));
    delayAnimation(newArr, delay);
  };

  const delayAnimation = (arr, delay) => {
    setTimeout(() => {
      setBars(arr);
    }, delay);
  };

  return (
    <Fragment>
      <NavBar
        arraySize={bars.length === 0 ? START_POINT : bars.length}
        onClickRandomizeArray={() => setBars(randomize(bars.length))}
        onChangeArraySize={(e) => setBars(randomize(e.target.value))}
        onClickBubbleSort={bubbleSort}
        onClickMergeSort={() => {
          const unsortedBars = [...bars];
          mergeSort(unsortedBars, 0, unsortedBars.length - 1, ACC, true);
        }}
        onClickQuickSort={() => {
          const unsortedBars = [...bars];
          quickSort(unsortedBars, 0, unsortedBars.length - 1, ACC);
        }}
        onClickHeapSort={() => {
          const unsortedBars = [...bars];
          heapSort(unsortedBars, unsortedBars.length);
        }}
      />
      <Body bars={bars} />
    </Fragment>
  );
}

export default App;
