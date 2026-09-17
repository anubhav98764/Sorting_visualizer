import React, { useEffect, useRef, useState } from "react";

const BLOCK_WIDTH = 36;
const SPACING = 12;
const COLOR_PRIMARY = "#3b82f6";
const COLOR_COMPARE = "#ef4444"; 
const COLOR_SWAP = "#eab308";    
const COLOR_SORTED = "#22c55e";  
const COLOR_BG = "#0b0f19";
const COLOR_CARD = "rgba(15, 23, 42, 0.9)";
const COLOR_GRID = "#1e293b";

const ALGO_DETAILS = {
  bubble: {
    title: "Bubble Sort",
    complexity: "O(n²)",
    explanation: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are wrong.",
    pseudocode: [
      "for i = 0 to n-1:",
      "  for j = 0 to n-i-1:",
      "    if arr[j] > arr[j+1]:",
      "      swap(arr[j], arr[j+1])"
    ]
  },
  selection: {
    title: "Selection Sort",
    complexity: "O(n²)",
    explanation: "Finds the minimum element from the unsorted portion and swaps it with the boundary element.",
    pseudocode: [
      "for i = 0 to n-1:",
      "  minIdx = i",
      "  for j = i+1 to n:",
      "    if arr[j] < arr[minIdx]: minIdx = j",
      "  swap(arr[i], arr[minIdx])"
    ]
  },
  insertion: {
    title: "Insertion Sort",
    complexity: "O(n²)",
    explanation: "Builds sorted array one item at a time by inserting elements into their correct position.",
    pseudocode: [
      "for i = 1 to n-1:",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key:",
      "    arr[j + 1] = arr[j]; j--",
      "  arr[j + 1] = key"
    ]
  },
  quick: {
    title: "Quick Sort",
    complexity: "O(n log n)",
    explanation: "Picks a pivot and partitions the array around it, recursively sorting sub-arrays.",
    pseudocode: [
      "quickSort(arr, low, high):",
      "  if low < high:",
      "    pi = partition(arr, low, high)",
      "    quickSort(arr, low, pi - 1)",
      "    quickSort(arr, pi + 1, high)"
    ]
  },
  merge: {
    title: "Merge Sort",
    complexity: "O(n log n)",
    explanation: "Divides the array into halves, recursively sorts them, and then merges the sorted halves.",
    pseudocode: [
      "mergeSort(arr):",
      "  if length <= 1 return arr",
      "  mid = floor(length / 2)",
      "  left = mergeSort(arr[0..mid])",
      "  right = mergeSort(arr[mid..end])",
      "  return merge(left, right)"
    ]
  }
};

let externalUpdateTrigger = null;

export const stepforward = () => {
  if (!instanceA.generator) {
    instanceA.generator = getGenerator(instanceA);
  }
  if (!instanceB.generator) {
    instanceB.generator = getGenerator(instanceB);
  }
  instanceA.generator.next();
  if (currentMode === 'compare') {
    instanceB.generator.next();
  }

  if (externalUpdateTrigger) {
    externalUpdateTrigger(t => t + 1);
  }
};

export let currentMode = 'compare';
let masterArray = [84, 67, 45, 90, 23, 56, 38];

function createInstance(algo) {
  return {
    algorithm: algo,
    array: [...masterArray],
    activeIndices: [],
    highlightType: null,
    activeLine: -1,
    stepExplanation: "Ready to sort. Click Play to start.",
    generator: null,
    totalSteps: 0,
    totalSwaps: 0
  };
}

let instanceA = createInstance('bubble');
let instanceB = createInstance('insertion');

export const setViewmode = (mode) => {
  currentMode = mode;
};

export const SetCustomArray = () => {
  const inputEl = document.getElementById("custom-number");
  if (!inputEl) return;

  const parsedNumbers = inputEl.value
    .split(',')
    .map(num => parseInt(num.trim()))
    .filter(num => !isNaN(num) && num > 0);

  if (parsedNumbers.length < 2) {
    alert("Please enter at least 2 valid positive numbers separated by commas.");
    return;
  }

  masterArray = parsedNumbers;
  rebuildAll();
};

export const resetArray = () => {
  masterArray = [];
  for (let i = 1; i <= 10; i++) {
    masterArray.push(Math.floor(Math.random() * 85) + 10);
  }
  rebuildAll();
};

function rebuildAll() {
  instanceA = createInstance(instanceA.algorithm);
  instanceB = createInstance(instanceB.algorithm);
  if (externalUpdateTrigger) externalUpdateTrigger(t => t + 1);
}

// --- GENERATOR ENGINES ---
function* bubbleSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    inst.totalSteps++;
    inst.activeLine = 0;
    inst.stepExplanation = `Starting Outer Pass i = ${i}.`;
    yield;
    for (let j = 0; j < n - i - 1; j++) {
      inst.totalSteps++;
      inst.activeIndices = [j, j + 1];
      inst.highlightType = 'compare';
      inst.activeLine = 2;
      inst.stepExplanation = `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`;
      yield;

      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        inst.totalSwaps++;
        inst.highlightType = 'swap';
        inst.activeLine = 3;
        inst.stepExplanation = `Swapping ${arr[j + 1]} and ${arr[j]}.`;
        yield;
      }
    }
  }
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = `Sorted! Steps: ${inst.totalSteps}, Swaps: ${inst.totalSwaps}`;
}

function* selectionSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    inst.totalSteps++;
    inst.activeLine = 1;
    inst.stepExplanation = `Pass ${i}: Assuming arr[${i}] (${arr[i]}) as minimum.`;
    yield;
    for (let j = i + 1; j < n; j++) {
      inst.totalSteps++;
      inst.activeIndices = [j, minIdx];
      inst.highlightType = 'compare';
      inst.activeLine = 3;
      inst.stepExplanation = `Checking if arr[${j}] (${arr[j]}) < min (${arr[minIdx]}).`;
      yield;

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        inst.stepExplanation = `New minimum found at index ${minIdx}.`;
        yield;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      inst.totalSwaps++;
      inst.activeIndices = [i, minIdx];
      inst.highlightType = 'swap';
      inst.activeLine = 4;
      inst.stepExplanation = `Swapping arr[${i}] with minimum element at arr[${minIdx}].`;
      yield;
    }
  }
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = `Sorted! Steps: ${inst.totalSteps}, Swaps: ${inst.totalSwaps}`;
}

function* insertionSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    inst.totalSteps++;
    inst.activeLine = 1;
    inst.stepExplanation = `Inserting key = arr[${i}] (${key}) into sorted part.`;
    yield;
    while (j >= 0 && arr[j] > key) {
      inst.totalSteps++;
      arr[j + 1] = arr[j];
      inst.totalSwaps++;
      inst.activeIndices = [j, j + 1];
      inst.highlightType = 'swap';
      inst.activeLine = 4;
      inst.stepExplanation = `Shifting arr[${j}] to the right.`;
      j = j - 1;
      yield;
    }
    arr[j + 1] = key;
    inst.activeLine = 5;
    inst.stepExplanation = `Placed key (${key}) at index ${j + 1}.`;
    yield;
  }
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = `Sorted! Steps: ${inst.totalSteps}, Shifts: ${inst.totalSwaps}`;
}

function* quickSortGenerator(inst) {
  let arr = inst.array;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  function* partition(low, high) {
    let pivot = arr[high];
    inst.activeLine = 2;
    inst.stepExplanation = `Partition: Pivot selected is ${pivot} at index ${high}.`;
    yield;

    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
      inst.totalSteps++;
      inst.activeIndices = [j, high];
      inst.highlightType = 'compare';
      inst.stepExplanation = `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`;
      yield;

      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        inst.totalSwaps++;
        inst.activeIndices = [i, j];
        inst.highlightType = 'swap';
        inst.stepExplanation = `Swapping elements into partition boundary.`;
        yield;
      }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    inst.totalSwaps++;
    inst.highlightType = 'swap';
    inst.stepExplanation = `Placing pivot into its correct final position.`;
    yield;
    return i + 1;
  }

  function* quickSortHelper(low, high) {
    if (low < high) {
      inst.activeLine = 2;
      let piGen = partition(low, high);
      let pi = yield* piGen;
      inst.activeLine = 3;
      yield* quickSortHelper(low, pi - 1);
      inst.activeLine = 4;
      yield* quickSortHelper(pi + 1, high);
    }
  }

  yield* quickSortHelper(0, arr.length - 1);
  inst.activeIndices = Array.from({ length: arr.length }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = `QuickSort Complete! Steps: ${inst.totalSteps}, Swaps: ${inst.totalSwaps}`;
}

function* mergeSortGenerator(inst) {
  let arr = inst.array;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  function* merge(l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;
    inst.activeLine = 5;
    inst.stepExplanation = `Merging subarrays from index ${l} to ${r}.`;
    yield;

    while (i < n1 && j < n2) {
      inst.totalSteps++;
      inst.activeIndices = [l + i, m + 1 + j];
      inst.highlightType = 'compare';
      inst.stepExplanation = `Merging: Comparing ${L[i]} and ${R[j]}.`;
      yield;

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      inst.totalSwaps++;
      inst.highlightType = 'swap';
      inst.stepExplanation = `Placed element into main array at index ${k}.`;
      yield;
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
      yield;
    }

    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
      yield;
    }
  }

  function* mergeSortHelper(l, r) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    inst.activeLine = 3;
    yield* mergeSortHelper(l, m);
    inst.activeLine = 4;
    yield* mergeSortHelper(m + 1, r);
    yield* merge(l, m, r);
  }

  yield* mergeSortHelper(0, arr.length - 1);
  inst.activeIndices = Array.from({ length: arr.length }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = `MergeSort Complete! Steps: ${inst.totalSteps}, Swaps: ${inst.totalSwaps}`;
}

function getGenerator(inst) {
  if (inst.algorithm === 'selection') return selectionSortGenerator(inst);
  if (inst.algorithm === 'insertion') return insertionSortGenerator(inst);
  if (inst.algorithm === 'quick') return quickSortGenerator(inst);
  if (inst.algorithm === 'merge') return mergeSortGenerator(inst);
  return bubbleSortGenerator(inst);
}

// Draw Viewport on Canvas
function drawViewport(ctx, instance, left, top, width, height) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, width, height);
  ctx.clip();

  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(left, top, width, height);

  ctx.strokeStyle = COLOR_GRID;
  ctx.lineWidth = 1;
  for (let y = top; y < top + height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + width, y);
    ctx.stroke();
  }

  const array = instance.array;
  if (!array || array.length === 0) {
    ctx.restore();
    return;
  }

  const maxVal = Math.max(...array, 1);
  const totalBarWidth = array.length * (BLOCK_WIDTH + SPACING) - SPACING;
  const startX = left + (width - totalBarWidth) / 2;
  const maxBarHeight = height * 0.55;
  const baselineY = top + height - 30;

  for (let i = 0; i < array.length; i++) {
    const val = array[i];
    const barHeight = Math.max((val / maxVal) * maxBarHeight, 15);
    const x = startX + i * (BLOCK_WIDTH + SPACING);
    const y = baselineY - barHeight;

    let barColor = COLOR_PRIMARY;
    if (instance.activeIndices.includes(i)) {
      if (instance.highlightType === 'swap') barColor = COLOR_SWAP;
      else if (instance.highlightType === 'compare') barColor = COLOR_COMPARE;
      else if (instance.highlightType === 'sorted') barColor = COLOR_SORTED;
    }

    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(x, y, BLOCK_WIDTH, barHeight, [6, 6, 0, 0]);
    ctx.fill();

    const labelY = y - 30;
    const labelWidth = 38;
    const labelHeight = 24;
    const labelX = x + (BLOCK_WIDTH - labelWidth) / 2;

    ctx.fillStyle = COLOR_CARD;
    ctx.strokeStyle = barColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(val.toString(), labelX + labelWidth / 2, labelY + labelHeight / 2);
  }

  ctx.restore();
}

function View2D({ currentMode: activeMode, algorithm, isPlaying, speed, setIsPlaying }) {
  const canvasRef = useRef(null);
  const [algoB, setAlgoB] = useState('insertion');
  const [, setTick] = useState(0);

  useEffect(() => {
    externalUpdateTrigger = setTick;
    return () => {
      externalUpdateTrigger = null;
    };
  }, []);


  useEffect(() => {
    instanceA = createInstance(algorithm || 'bubble');
    setTick(t => t + 1);
  }, [algorithm]);

  useEffect(() => {
    if (isPlaying) {
      if (!instanceA.generator) instanceA.generator = getGenerator(instanceA);
      if (!instanceB.generator) instanceB.generator = getGenerator(instanceB);
    }
  }, [isPlaying]);

  const handleAlgoChangeB = (e) => {
    const selected = e.target.value;
    setAlgoB(selected);
    instanceB = createInstance(selected);
    setTick(t => t + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastStepTime = 0;

    const render = (time) => {
      const parent = canvas.parentElement;
      if (parent) {
        if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      }

      const delay = Math.max(10, 600 - speed * 5.5);
      if (isPlaying && time - lastStepTime > delay) {
        let stepA = instanceA.generator ? instanceA.generator.next() : { done: true };
        let stepB = instanceB.generator ? instanceB.generator.next() : { done: true };

        if (stepA.done && stepB.done && setIsPlaying) {
          setIsPlaying(false);
        }
        setTick(t => t + 1);
        lastStepTime = time;
      }

      const w = canvas.width;
      const h = canvas.height;
      const modeToRender = activeMode || currentMode;

      ctx.clearRect(0, 0, w, h);

      if (modeToRender === 'compare') {
        const halfWidth = Math.floor(w / 2);
        drawViewport(ctx, instanceA, 0, 0, halfWidth, h);

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(halfWidth, 0);
        ctx.lineTo(halfWidth, h);
        ctx.stroke();

        drawViewport(ctx, instanceB, halfWidth, 0, w - halfWidth, h);
      } else {
        drawViewport(ctx, instanceA, 0, 0, w, h);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeMode, isPlaying, speed, setIsPlaying]);

  const modeToRender = activeMode || currentMode;
  const infoA = ALGO_DETAILS[instanceA.algorithm] || ALGO_DETAILS['bubble'];
  const infoB = ALGO_DETAILS[instanceB.algorithm] || ALGO_DETAILS['insertion'];

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 70px)', background: COLOR_BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {modeToRender === 'compare' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px', background: COLOR_CARD, borderBottom: '1px solid #334155' }}>
          <div>
            <label style={{ marginRight: '8px', fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>RIGHT VIEW ALGORITHM:</label>
            <select value={algoB} onChange={handleAlgoChangeB} disabled={isPlaying} style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px' }}>
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="quick">Quick Sort</option>
              <option value="merge">Merge Sort</option>
            </select>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 3, position: 'relative', height: '100%' }}>
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>

        <div style={{ flex: 1.2, background: '#0b0f19', borderLeft: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', minWidth: '320px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#38bdf8', fontFamily: 'monospace' }}>💻 {infoA.title} (Left)</span>
              <span style={{ fontSize: '10px', color: '#facc15', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>{infoA.complexity}</span>
            </div>
            <div style={{ background: '#070a12', borderRadius: '6px', padding: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399', lineHeight: '1.5' }}>
              {infoA.pseudocode.map((line, idx) => (
                <div key={idx} style={{ background: instanceA.activeLine === idx ? 'rgba(56, 189, 248, 0.2)' : 'transparent', padding: '1px 4px', borderRadius: '3px' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px' }}>🧠 METRICS ({infoA.title})</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div style={{ background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>STEPS</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{instanceA.totalSteps}</div>
              </div>
              <div style={{ background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>SWAPS</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#facc15' }}>{instanceA.totalSwaps}</div>
              </div>
            </div>
            <div style={{ background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '11px', color: '#e2e8f0', minHeight: '36px' }}>
              {instanceA.stepExplanation}
            </div>
          </div>

          {modeToRender === 'compare' && (
            <>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444', fontFamily: 'monospace' }}>💻 {infoB.title} (Right)</span>
                  <span style={{ fontSize: '10px', color: '#facc15', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>{infoB.complexity}</span>
                </div>
                <div style={{ background: '#070a12', borderRadius: '6px', padding: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#f87171', lineHeight: '1.5' }}>
                  {infoB.pseudocode.map((line, idx) => (
                    <div key={idx} style={{ background: instanceB.activeLine === idx ? 'rgba(239, 68, 68, 0.2)' : 'transparent', padding: '1px 4px', borderRadius: '3px' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ef4444', marginBottom: '6px' }}>🧠 METRICS ({infoB.title})</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>STEPS</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{instanceB.totalSteps}</div>
                  </div>
                  <div style={{ background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>SWAPS</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#facc15' }}>{instanceB.totalSwaps}</div>
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '11px', color: '#e2e8f0', minHeight: '36px' }}>
                  {instanceB.stepExplanation}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default View2D;