import { writable } from 'svelte/store';
import { CanvasData } from '../snarky/helpers/CanvasData';

export const initCanvasStore = async () => {
  const canvasDataRaw = await (await fetch('http://localhost:3030/canvasData')).json();
  console.log(canvasDataRaw);
  canvasStore.set(new CanvasData(canvasDataRaw));
};

export const canvasStore = writable<CanvasData>();