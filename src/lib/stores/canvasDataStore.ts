import { writable } from 'svelte/store';
import { CanvasData } from '../snarky/helpers/CanvasData';
import { isReady } from 'snarkyjs';

export const initCanvasStore = async () => {
  const canvasDataRaw = await (await fetch(`${import.meta.env.VITE_SERVER_URL}/canvasData`)).json();
  canvasStore.set(new CanvasData(canvasDataRaw));
};

export const updateCanvasStore = async (i: number, j: number, canvasData: CanvasData) => {
  await isReady;

  canvasData.switch(i, j);
  const options = {
    method: 'POST',
    body: JSON.stringify(canvasData.value),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  await fetch(`${import.meta.env.VITE_SERVER_URL}/canvasData`, options)
  canvasStore.set(canvasData)
}

export const canvasStore = writable<CanvasData>();