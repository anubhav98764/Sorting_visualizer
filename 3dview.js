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
    explanation: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
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
    explanation: "Finds the minimum element from the unsorted portion and swaps it with the element at boundary.",
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
    explanation: "Builds sorted array one item at a time by taking next element and inserting it in place.",
    pseudocode: [
      "for i = 1 to n-1:",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key:",
      "    arr[j + 1] = arr[j]; j--",
      "  arr[j + 1] = key"
    ]
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
    generator: null
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
}

// --- GENERATOR ENGINE WITH REAL-TIME STEP EXPLANATIONS ---
function* bubbleSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    inst.activeLine = 0;
    inst.stepExplanation = `Starting Outer Pass i = ${i}.`;
    yield;
    for (let j = 0; j < n - i - 1; j++) {
      inst.activeIndices = [j, j + 1];
      inst.highlightType = 'compare';
      inst.activeLine = 2;
      inst.stepExplanation = `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`;
      yield;

      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        inst.highlightType = 'swap';
        inst.activeLine = 3;
        inst.stepExplanation = `Swapping ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`;
        yield;
      }
    }
  }
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = "Array is fully sorted!";
}

function* selectionSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    inst.activeLine = 1;
    inst.stepExplanation = `Pass ${i}: Assuming arr[${i}] (${arr[i]}) as minimum.`;
    yield;
    for (let j = i + 1; j < n; j++) {
      inst.activeIndices = [j, minIdx];
      inst.highlightType = 'compare';
      inst.activeLine = 3;
      inst.stepExplanation = `Checking if arr[${j}] (${arr[j]}) < minimum (${arr[minIdx]}).`;
      yield;

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        inst.stepExplanation = `New minimum found at index ${minIdx} (${arr[minIdx]}).`;
        yield;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      inst.activeIndices = [i, minIdx];
      inst.highlightType = 'swap';
      inst.activeLine = 4;
      inst.stepExplanation = `Swapping boundary element arr[${i}] with minimum element arr[${minIdx}].`;
      yield;
    }
  }
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.activeLine = -1;
  inst.stepExplanation = "Array is fully sorted!";
}

function* insertionSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    inst.activeLine = 1;
    inst.stepExplanation = `Inserting key = arr[${i}] (${key}) into sorted portion.`;
    yield;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      inst.activeIndices = [j, j + 1];
      inst.highlightType = 'swap';
      inst.activeLine = 4;
      inst.stepExplanation = `Shifting arr[${j}] (${arr[j]}) to the right.`;
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
  inst.stepExplanation = "Array is fully sorted!";
}

function getGenerator(inst) {
  if (inst.algorithm === 'selection') return selectionSortGenerator(inst);
  if (inst.algorithm === 'insertion') return insertionSortGenerator(inst);
  return bubbleSortGenerator(inst);
}

// 2D Canvas Viewport Renderer
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
  const maxBarHeight = height * 0.38;
  const baselineY = top + height - 165;

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

    const labelY = y - 35;
    const labelWidth = 40;
    const labelHeight = 26;
    const labelX = x + (BLOCK_WIDTH - labelWidth) / 2;

    ctx.fillStyle = COLOR_CARD;
    ctx.strokeStyle = barColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(val.toString(), labelX + labelWidth / 2, labelY + labelHeight / 2);
  }

  // --- DRAW CANVAS OVERLAY BOX (PSEUDOCODE & REAL-TIME EXPLANATION) ---
  const info = ALGO_DETAILS[instance.algorithm] || ALGO_DETAILS['bubble'];
  const cardMargin = 15;
  const cardX = left + cardMargin;
  const cardY = top + height - 150;
  const cardWidth = width - (cardMargin * 2);
  const cardHeight = 135;

  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 8);
  ctx.fill();
  ctx.stroke();

  const leftColWidth = cardWidth * 0.52;
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(info.title, cardX + 12, cardY + 22);

  info.pseudocode.forEach((line, idx) => {
    const lineY = cardY + 44 + (idx * 18);
    if (instance.activeLine === idx) {
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.fillRect(cardX + 8, lineY - 12, leftColWidth - 16, 17);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px monospace";
    } else {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "11px monospace";
    }
    ctx.fillText(line, cardX + 12, lineY);
  });

  ctx.strokeStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(cardX + leftColWidth, cardY + 10);
  ctx.lineTo(cardX + leftColWidth, cardY + cardHeight - 10);
  ctx.stroke();

  // Real-Time Explanation Render Column
  const rightColX = cardX + leftColWidth + 12;
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Real-Time Step Explanation", rightColX, cardY + 22);

  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#38bdf8";
  const words = (instance.stepExplanation || info.explanation).split(" ");
  let currentLine = "";
  let lineY = cardY + 42;
  const maxTextWidth = cardWidth - leftColWidth - 24;

  for (let w = 0; w < words.length; w++) {
    let testLine = currentLine + words[w] + " ";
    if (ctx.measureText(testLine).width > maxTextWidth && w > 0) {
      ctx.fillText(currentLine, rightColX, lineY);
      currentLine = words[w] + " ";
      lineY += 15;
    } else {
      currentLine = testLine;
    }
  }
  ctx.fillText(currentLine, rightColX, lineY);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(`Time Complexity: ${info.complexity}`, rightColX, cardY + cardHeight - 12);

  ctx.restore();
}

function View2D({ currentMode: activeMode, algorithm, isPlaying, speed, setIsPlaying }) {
  const canvasRef = useRef(null);
  const [algoB, setAlgoB] = useState('insertion');

  useEffect(() => {
    instanceA = createInstance(algorithm || 'bubble');
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

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 70px)', background: COLOR_BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {modeToRender === 'compare' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px', background: COLOR_CARD, borderBottom: '1px solid #334155' }}>
          <div>
            <label style={{ marginRight: '8px', fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>RIGHT VIEW ALGORITHM:</label>
            <select value={algoB} onChange={handleAlgoChangeB} disabled={isPlaying} style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px' }}>
              <option value="insertion">Insertion Sort</option>
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
            </select>
          </div>
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default View2D;