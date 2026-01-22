import { Object3D, Camera, Scene, WebGLRenderer } from 'three';

declare global {
  interface Window {
    THREE: any;
    THREEx: any;
  }
}

export enum AppState {
  LOADING_SCRIPTS = 'LOADING_SCRIPTS',
  INITIALIZING_AR = 'INITIALIZING_AR',
  READY = 'READY',
  ERROR = 'ERROR'
}

export interface ARContextValue {
  arToolkitSource: any;
  arToolkitContext: any;
}
