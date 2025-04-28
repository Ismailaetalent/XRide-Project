/// <reference types="vite/client" />

declare module 'leaflet';
declare module 'leaflet-routing-machine';

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
