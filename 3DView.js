import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { speakText } from "../AIBox/Aibox.js";
import "./3DView.css"; 

const COLOR_PRIMARY = "#3b82f6";
const COLOR_COMPARE = "#ef4444"; 
const COLOR_SWAP = "#eab308";    
const COLOR_SORTED = "#22c55e";  

const LOW_COLOR = new THREE.Color("#6B4A23"); 
const HIGH_COLOR = new THREE.Color("#F4D58D"); 

let masterArray = [84, 67, 45, 90, 23, 56, 38];
let sortingInstance = {
  algorithm: 'bubble',
  array: [...masterArray],
  activeIndices: [],
  highlightType: null,
  stepExplanation: "Click 'Start AI Narration' to begin.",
  currentLoopType: "Waiting to Start",
  loopDetails: "Idle state",
  loopVariables: { i: '-', j: '-', extra: '-' },
  generator: null,
  totalSteps: 0,
  totalSwaps: 0
};

let updateExternalState = null;

// Full Algorithm Source Codes
const ALGORITHM_SOURCE_CODES = {
  bubble: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
  selection: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
  insertion: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  quick: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}`,
  merge: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
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
  resetSortingInstance();

  if (updateExternalState) {
    updateExternalState([...masterArray]);
  }
};

export const resetArray = () => {
  masterArray = [];
  for (let i = 1; i <= 8; i++) {
    masterArray.push(Math.floor(Math.random() * 85) + 10);
  }
  resetSortingInstance();

  if (updateExternalState) {
    updateExternalState([...masterArray]);
  }
};

function resetSortingInstance() {
  sortingInstance = {
    algorithm: sortingInstance.algorithm,
    array: [...masterArray],
    activeIndices: [],
    highlightType: null,
    stepExplanation: "New array loaded. Ready to start.",
    currentLoopType: "Ready",
    loopDetails: "Awaiting execution",
    loopVariables: { i: '-', j: '-', extra: '-' },
    generator: null,
    totalSteps: 0,
    totalSwaps: 0
  };
}

// --- GENERATORS ---
function* bubbleSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    inst.totalSteps++;
    inst.currentLoopType = "Outer Loop (Pass i)";
    inst.loopDetails = `Pass ${i} is fixing elements from right to left.`;
    inst.loopVariables = { i: i, j: '-', extra: `n=${n}` };
    inst.stepExplanation = `Starting Outer Pass i = ${i}.`;
    yield;
    for (let j = 0; j < n - i - 1; j++) {
      inst.totalSteps++;
      inst.currentLoopType = "Inner Loop (Comparison)";
      inst.loopDetails = `Comparing adjacent elements at index ${j} and ${j + 1}.`;
      inst.loopVariables = { i: i, j: j, extra: `arr[j]=${arr[j]}` };
      inst.activeIndices = [j, j + 1];
      inst.highlightType = 'compare';
      inst.stepExplanation = `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`;
      yield;

      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        inst.totalSwaps++;
        inst.currentLoopType = "Inner Loop (Swap Action)";
        inst.loopDetails = `Condition true: Swapping index ${j} & ${j + 1}.`;
        inst.loopVariables = { i: i, j: j, extra: `Swapped!` };
        inst.highlightType = 'swap';
        inst.stepExplanation = `Swapping ${arr[j + 1]} and ${arr[j]} because left is greater.`;
        yield;
      }
    }
  }
  inst.currentLoopType = "Completed";
  inst.loopDetails = "Sorting finished successfully!";
  inst.loopVariables = { i: 'Done', j: 'Done', extra: `Swaps: ${inst.totalSwaps}` };
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.stepExplanation = `Array is fully sorted! Total Steps: ${inst.totalSteps}, Total Swaps: ${inst.totalSwaps}.`;
}

function* selectionSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    inst.currentLoopType = "Outer Loop (Boundary)";
    inst.loopDetails = `Assuming index ${i} has the minimum value.`;
    inst.loopVariables = { i: i, j: '-', extra: `minIdx=${minIdx}` };
    inst.stepExplanation = `Pass ${i}: Assuming element at index ${i} (${arr[i]}) as minimum.`;
    yield;
    for (let j = i + 1; j < n; j++) {
      inst.totalSteps++;
      inst.currentLoopType = "Inner Loop (Scan Min)";
      inst.loopDetails = `Scanning index ${j} to find a smaller value than arr[${minIdx}].`;
      inst.loopVariables = { i: i, j: j, extra: `minIdx=${minIdx}` };
      inst.activeIndices = [j, minIdx];
      inst.highlightType = 'compare';
      inst.stepExplanation = `Checking if element at index ${j} (${arr[j]}) is smaller than current minimum (${arr[minIdx]}).`;
      yield;

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        inst.currentLoopType = "Inner Loop (Update Min)";
        inst.loopDetails = `Found new minimum at index ${minIdx}!`;
        inst.loopVariables = { i: i, j: j, extra: `New minIdx=${minIdx}` };
        inst.stepExplanation = `New minimum found at index ${minIdx} with value ${arr[minIdx]}.`;
        yield;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      inst.totalSwaps++;
      inst.currentLoopType = "Selection Swap";
      inst.loopDetails = `Swapping boundary element at index ${i} with min index ${minIdx}.`;
      inst.loopVariables = { i: i, j: '-', extra: `Swapped` };
      inst.activeIndices = [i, minIdx];
      inst.highlightType = 'swap';
      inst.stepExplanation = `Swapping element at index ${i} with minimum element at index ${minIdx}.`;
      yield;
    }
  }
  inst.currentLoopType = "Completed";
  inst.loopDetails = "Selection Sort finished!";
  inst.loopVariables = { i: 'Done', j: 'Done', extra: `Swaps: ${inst.totalSwaps}` };
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.stepExplanation = `Array is fully sorted! Total Steps: ${inst.totalSteps}, Total Swaps: ${inst.totalSwaps}.`;
}

function* insertionSortGenerator(inst) {
  let arr = inst.array;
  let n = arr.length;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    inst.currentLoopType = "Outer Loop (Key Pick)";
    inst.loopDetails = `Picking key = ${key} at index ${i} to insert in sorted part.`;
    inst.loopVariables = { i: i, j: j, extra: `key=${key}` };
    inst.stepExplanation = `Inserting key element ${key} from index ${i} into sorted portion.`;
    yield;

    while (j >= 0 && arr[j] > key) {
      inst.totalSteps++;
      inst.currentLoopType = "While Loop (Shift Scan)";
      inst.loopDetails = `Comparing key ${key} with arr[${j}] (${arr[j]}).`;
      inst.loopVariables = { i: i, j: j, extra: `key=${key}` };
      inst.activeIndices = [j, j + 1];
      inst.highlightType = 'compare';
      inst.stepExplanation = `Comparing key ${key} with ${arr[j]} at index ${j}.`;
      yield;

      arr[j + 1] = arr[j];
      inst.totalSwaps++;
      inst.currentLoopType = "While Loop (Shift Right)";
      inst.loopDetails = `Shifting arr[${j}] to index ${j + 1}.`;
      inst.loopVariables = { i: i, j: j, extra: `Shifting` };
      inst.highlightType = 'swap';
      inst.stepExplanation = `Shifting element ${arr[j]} to the right.`;
      j = j - 1;
      yield;
    }
    arr[j + 1] = key;
    inst.currentLoopType = "Outer Loop (Place Key)";
    inst.loopDetails = `Placing key ${key} into slot index ${j + 1}.`;
    inst.loopVariables = { i: i, j: j + 1, extra: `Inserted` };
    inst.stepExplanation = `Placed key ${key} at index ${j + 1}.`;
    yield;
  }
  inst.currentLoopType = "Completed";
  inst.loopDetails = "Insertion Sort finished!";
  inst.loopVariables = { i: 'Done', j: 'Done', extra: `Swaps: ${inst.totalSwaps}` };
  inst.activeIndices = Array.from({ length: n }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.stepExplanation = `Array is fully sorted! Total Steps: ${inst.totalSteps}, Total Swaps: ${inst.totalSwaps}.`;
}

// Quick Sort Generator
function* quickSortGenerator(inst) {
  let arr = inst.array;
  inst.totalSteps = 0;
  inst.totalSwaps = 0;

  function* partition(low, high) {
    let pivot = arr[high];
    inst.currentLoopType = "QuickSort Partition";
    inst.loopDetails = `Pivot chosen = ${pivot} at index ${high}.`;
    inst.loopVariables = { i: low - 1, j: low, extra: `pivot=${pivot}` };
    inst.stepExplanation = `Choosing pivot element ${pivot} at index ${high}.`;
    yield;

    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
      inst.totalSteps++;
      inst.currentLoopType = "Partition Scan";
      inst.loopDetails = `Comparing element arr[${j}] (${arr[j]}) with pivot ${pivot}.`;
      inst.loopVariables = { i: i, j: j, extra: `pivot=${pivot}` };
      inst.activeIndices = [j, high];
      inst.highlightType = 'compare';
      inst.stepExplanation = `Comparing element ${arr[j]} with pivot ${pivot}.`;
      yield;

      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        inst.totalSwaps++;
        inst.currentLoopType = "Partition Swap";
        inst.loopDetails = `Smaller than pivot! Swapping into index slot [${i}].`;
        inst.loopVariables = { i: i, j: j, extra: `Swapped` };
        inst.activeIndices = [i, j];
        inst.highlightType = 'swap';
        inst.stepExplanation = `Placing smaller element into index position ${i}.`;
        yield;
      }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    inst.totalSwaps++;
    inst.currentLoopType = "Pivot Placement";
    inst.loopDetails = `Placing pivot into its correct sorted position.`;
    inst.loopVariables = { i: i + 1, j: high, extra: `Pivot set` };
    inst.activeIndices = [i + 1, high];
    inst.highlightType = 'swap';
    inst.stepExplanation = `Placing pivot into correct sorted index position.`;
    yield;
    return i + 1;
  }

  function* quickSortHelper(low, high) {
    if (low < high) {
      let piGen = partition(low, high);
      let pi = yield* piGen;
      yield* quickSortHelper(low, pi - 1);
      yield* quickSortHelper(pi + 1, high);
    }
  }

  yield* quickSortHelper(0, arr.length - 1);
  inst.currentLoopType = "Completed";
  inst.loopDetails = "QuickSort finished successfully!";
  inst.loopVariables = { i: 'Done', j: 'Done', extra: `Swaps: ${inst.totalSwaps}` };
  inst.activeIndices = Array.from({ length: arr.length }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.stepExplanation = `Array is fully sorted using QuickSort!`;
}

// Merge Sort Generator
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
    inst.currentLoopType = "Merge Halves";
    inst.loopDetails = `Merging sorted ranges [${l} to ${r}].`;
    inst.loopVariables = { i: l, j: m, extra: `Range[${l}-${r}]` };
    yield;

    while (i < n1 && j < n2) {
      inst.totalSteps++;
      inst.currentLoopType = "Merge Comparison";
      inst.loopDetails = `Comparing L[${i}] (${L[i]}) and R[${j}] (${R[j]}).`;
      inst.loopVariables = { i: i, j: j, extra: `k=${k}` };
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
      inst.currentLoopType = "Merge Placement";
      inst.loopDetails = `Placed element into main array index [${k}].`;
      inst.loopVariables = { i: i, j: j, extra: `Placed` };
      inst.activeIndices = [k];
      inst.highlightType = 'swap';
      inst.stepExplanation = `Placed element into target index position ${k}.`;
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
    yield* mergeSortHelper(l, m);
    yield* mergeSortHelper(m + 1, r);
    yield* merge(l, m, r);
  }

  yield* mergeSortHelper(0, arr.length - 1);
  inst.currentLoopType = "Completed";
  inst.loopDetails = "MergeSort finished successfully!";
  inst.loopVariables = { i: 'Done', j: 'Done', extra: `Swaps: ${inst.totalSwaps}` };
  inst.activeIndices = Array.from({ length: arr.length }, (_, i) => i);
  inst.highlightType = 'sorted';
  inst.stepExplanation = `Array is fully sorted using MergeSort!`;
}

function getActiveGenerator(inst) {
  switch (inst.algorithm) {
    case 'selection': return selectionSortGenerator(inst);
    case 'insertion': return insertionSortGenerator(inst);
    case 'quick': return quickSortGenerator(inst);
    case 'merge': return mergeSortGenerator(inst);
    case 'bubble':
    default:
      return bubbleSortGenerator(inst);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeTextSprite(text, { fontSize = 44, color = "#F5F1E8", weight = 600, font = "Inter, sans-serif", bg = null } = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const padding = 18;
  ctx.font = `${weight} ${fontSize}px ${font}`;
  const width = Math.ceil(ctx.measureText(text).width) + padding * 2;
  const height = fontSize + padding * 2;
  canvas.width = width;
  canvas.height = height;
  ctx.font = `${weight} ${fontSize}px ${font}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  if (bg) {
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, width, height, 14);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.fillText(text, width / 2, height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.anisotropy = 4;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const scale = 0.012;
  sprite.scale.set(width * scale, height * scale, 1);
  return sprite;
}

export default function PremiumBarChart3D({ 
  title = "AI Automated 3D Visualizer", 
  subtitle = "Voice Narrated Sorting",
  algorithm = 'bubble', 
  speed = 50, 
  isPlaying,
  setIsPlaying,
  onStepChange 
}) {
  const mountRef = useRef(null);
  const [displayStatus, setDisplayStatus] = useState("Click 'Start AI Narration' to begin.");
  const [loopStatus, setLoopStatus] = useState({ 
    type: "Waiting", 
    details: "Ready to execute loops", 
    vars: { i: '-', j: '-', extra: '-' }
  });
  const [isStarted, setIsStarted] = useState(false);
  const [arrayState, setArrayState] = useState([...sortingInstance.array]);
  const [activeIndices, setActiveIndices] = useState([]);

  useEffect(() => {
    sortingInstance.algorithm = algorithm || 'bubble';
    resetSortingInstance();
    setArrayState([...sortingInstance.array]);
    setActiveIndices([]);
    setLoopStatus({ 
      type: "Ready", 
      details: `Selected: ${algorithm.toUpperCase()} SORT`, 
      vars: { i: '-', j: '-', extra: '-' }
    });
  }, [algorithm]);

  useEffect(() => {
    updateExternalState = (newArr) => {
      setArrayState(newArr);
      setActiveIndices([]);
      setIsStarted(false);
      setLoopStatus({ 
        type: "Reset", 
        details: "New custom array loaded", 
        vars: { i: '-', j: '-', extra: '-' }
      });
      if (setIsPlaying) setIsPlaying(false);
    };
    return () => {
      updateExternalState = null;
    };
  }, [setIsPlaying]);

  useEffect(() => {
    if (!isStarted || !isPlaying) {
      if (!isPlaying && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    let isCancelled = false;

    const executeNextStep = () => {
      if (isCancelled || !isPlaying) return;
      if (!sortingInstance.generator) return;

      let res = sortingInstance.generator.next();
      if (res.done) {
        if (setIsPlaying) setIsPlaying(false);
        return;
      }

      setDisplayStatus(sortingInstance.stepExplanation);
      if (onStepChange) {
        onStepChange({
          explanation: sortingInstance.stepExplanation,
          loopType: sortingInstance.currentLoopType,
          details: sortingInstance.loopDetails,
          variables: sortingInstance.loopVariables,
          arrayState: [...sortingInstance.array]
        });
      }
      setLoopStatus({
        type: sortingInstance.currentLoopType,
        details: sortingInstance.loopDetails,
        vars: sortingInstance.loopVariables
      });
      setArrayState([...sortingInstance.array]);
      setActiveIndices([...sortingInstance.activeIndices]);

      speakText(sortingInstance.stepExplanation, () => {
        if (isCancelled || !isPlaying) return;
        setTimeout(() => {
          if (isPlaying) executeNextStep();
        }, 400);
      });
    };

    if (!sortingInstance.generator) {
      const algoName = sortingInstance.algorithm || 'bubble';
      const speechIntro = `Let's start ${algoName} sorting`;

      speakText(speechIntro, () => {
        if (isCancelled || !isPlaying) return;
        sortingInstance.generator = getActiveGenerator(sortingInstance);
        executeNextStep();
      });
    } else {
      executeNextStep();
    }

    return () => {
      isCancelled = true;
    };
  }, [isStarted, isPlaying, sortingInstance.algorithm]);

  const setupScene = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 8;
    bgCanvas.height = 256;
    const bgCtx = bgCanvas.getContext("2d");
    const grad = bgCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#12151f");
    grad.addColorStop(1, "#0b0f19");
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, 8, 256);
    const bgTexture = new THREE.CanvasTexture(bgCanvas);

    const scene = new THREE.Scene();
    scene.background = bgTexture;
    scene.fog = new THREE.Fog(0x0b0f19, 18, 34);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const target = new THREE.Vector3(0, 2.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x8fb8ff, 0x3a2a12, 0.55);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffdca8, 1.15);
    key.position.set(6, 10, 6);
    key.castShadow = true;
    scene.add(key);

    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.92, metalness: 0.05 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(40, 40, 0x334155, 0x1e293b);
    grid.position.y = 0.01;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);

    const orbit = { radius: 15, theta: 0, phi: 1.35, targetRadius: 15, targetTheta: 0, targetPhi: 1.35 };
    const applyOrbit = () => {
      const p = orbit;
      camera.position.x = target.x + p.radius * Math.sin(p.phi) * Math.sin(p.theta);
      camera.position.z = target.z + p.radius * Math.sin(p.phi) * Math.cos(p.theta);
      camera.position.y = target.y + p.radius * Math.cos(p.phi);
      camera.lookAt(target);
    };
    applyOrbit();

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        orbit.targetTheta -= dx * 0.006;
        orbit.targetPhi = Math.min(1.45, Math.max(0.35, orbit.targetPhi - dy * 0.006));
      }
    };
    const onPointerUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      orbit.targetRadius = Math.min(24, Math.max(8, orbit.targetRadius + e.deltaY * 0.012));
    };

    const dom = renderer.domElement;
    dom.style.touchAction = "none";
    dom.style.cursor = "grab";
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!mountRef.current) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
    });
    resizeObserver.observe(mount);

    let barGroup = new THREE.Group();
    scene.add(barGroup);

    const clock = new THREE.Clock();
    let raf;
    let currentBarMeshes = [];

    const animate = () => {
      raf = requestAnimationFrame(animate);

      orbit.theta += (orbit.targetTheta - orbit.theta) * 0.08;
      orbit.phi += (orbit.targetPhi - orbit.phi) * 0.08;
      orbit.radius += (orbit.targetRadius - orbit.radius) * 0.08;
      applyOrbit();

      const currentArr = sortingInstance.array;
      const maxValue = Math.max(...currentArr, 1);
      const maxBarHeight = 6.4;
      const barWidth = 1.3;
      const barDepth = 1.3;
      const spacing = 2.15;
      const startX = -((currentArr.length - 1) * spacing) / 2;

      if (currentBarMeshes.length > 0) {
        currentBarMeshes.forEach(m => barGroup.remove(m));
        currentBarMeshes = [];
      }

      currentArr.forEach((val, i) => {
        const normalized = val / maxValue;
        const targetHeight = Math.max(0.25, normalized * maxBarHeight);
        
        let color = LOW_COLOR.clone().lerp(HIGH_COLOR, normalized);
        if (sortingInstance.activeIndices.includes(i)) {
          if (sortingInstance.highlightType === 'swap') color = new THREE.Color(COLOR_SWAP);
          else if (sortingInstance.highlightType === 'compare') color = new THREE.Color(COLOR_COMPARE);
          else if (sortingInstance.highlightType === 'sorted') color = new THREE.Color(COLOR_SORTED);
        }

        const geo = new THREE.BoxGeometry(barWidth, targetHeight, barDepth);
        const mat = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.55,
          roughness: 0.32,
          emissive: color.clone().multiplyScalar(0.06),
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;

        const x = startX + i * spacing;
        mesh.position.set(x, targetHeight / 2, 0);

        const valueSprite = makeTextSprite(`[${i}] ${val}`, {
          fontSize: 38,
          color: "#0B0E14",
          weight: 700,
          bg: "rgba(244, 213, 141, 0.95)",
        });
        valueSprite.position.set(x, targetHeight + 0.55, 0);

        barGroup.add(mesh);
        barGroup.add(valueSprite);
        currentBarMeshes.push(mesh, valueSprite);
      });

      setDisplayStatus(sortingInstance.stepExplanation);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const cleanup = setupScene();
    return cleanup;
  }, [setupScene]);

  const currentAlgorithmCode = ALGORITHM_SOURCE_CODES[algorithm] || ALGORITHM_SOURCE_CODES['bubble'];

  return (
    <div className="vis-dashboard-container">
      {/* Top Header / Status Navigation Bar */}
      <div className="vis-top-toolbar">
        <div className="vis-tool-info">
          <span className="vis-badge-tag">{algorithm.toUpperCase()} SORT</span>
          <h2 className="vis-toolbar-title">{title}</h2>
        </div>
        <div className="vis-toolbar-actions">
          {!isStarted ? (
            <button 
              className="vis-start-btn"
              onClick={() => {
                setIsStarted(true);
                if (setIsPlaying) setIsPlaying(true);
              }}
            >
              🔊 Start AI Narration & Sorting
            </button>
          ) : (
            <div className="vis-narration-indicator">
              <span className="pulsing-dot"></span> AI Active Narration
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Workspace Container */}
      <div className="vis-workspace-grid">
        {/* Left/Main Column: 3D Canvas Visualizer */}
        <div className="vis-canvas-wrapper" ref={mountRef}>
          {/* Overlay Info Card */}
          <div className="pbc-panel">
            <p className="pbc-subtitle">{subtitle}</p>
            <p className="pbc-total-label">AI Narration Status</p>
            <p className="pbc-total" style={{ fontSize: '14px', color: '#F4D58D', lineHeight: '1.4' }}>{displayStatus}</p>
          </div>
        </div>

        {/* --- RIGHT: CODE & MEMORY LOGIC TRACKER --- */}
        <div className="vis-sidebar-panel">
          
          {/* Top Clean Code Box Container */}
          <div className="vis-card-box" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', fontFamily: 'monospace' }}>
                  {algorithm}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#38bdf8', background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>
                Code
              </span>
            </div>

            {/* Line-Numbered Full Code Editor Box */}
            <div style={{
              background: '#070a12',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '12px 8px',
              fontFamily: 'monospace',
              fontSize: '11px',
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              gap: '12px'
            }}>
              <div style={{ color: '#475569', textAlign: 'right', userSelect: 'none', lineHeight: '1.6' }}>
                {currentAlgorithmCode.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div style={{ color: '#34d399', whiteSpace: 'pre-wrap', lineHeight: '1.6', flex: 1 }}>
                <code>{currentAlgorithmCode}</code>
              </div>
            </div>
          </div>

          {/* Memory Tracker Card */}
          <div className="vis-card-box">
            <div className="vis-card-header" style={{ marginBottom: '10px' }}>
              <span className="vis-card-title">🧠 MEMORY: WHAT THE PROGRAM IS HOLDING</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '9px', color: '#34d399', fontWeight: 'bold', marginBottom: '2px' }}>● WORKING ON</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>i = {loopStatus.vars.i}, j = {loopStatus.vars.j}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{loopStatus.type}</div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '2px' }}>● STATE INFO</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#facc15', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loopStatus.vars.extra}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Active Execution</div>
              </div>
            </div>

            <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '9px', color: '#a855f7', fontWeight: 'bold', marginBottom: '2px' }}>■ THIS STEP ACTION</div>
              <div style={{ fontSize: '11px', color: '#f8fafc', lineHeight: '1.4' }}>{loopStatus.details}</div>
            </div>
          </div>

          {/* Auxiliary Array Mapping Box */}
          <div className="vis-card-box">
            <div className="vis-card-header">
              <span className="vis-card-title">📦 Auxiliary Array Mapping</span>
            </div>
            <div className="vis-array-chips-grid">
              {arrayState.map((val, idx) => (
                <div 
                  key={idx} 
                  className={`vis-array-chip ${activeIndices.includes(idx) ? 'active' : ''}`}
                >
                  <span className="chip-idx">[{idx}]</span>
                  <span className="chip-val">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}