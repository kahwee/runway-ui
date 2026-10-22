export interface HistoryAnnotation { index:number; title:string; description:string; }
export interface HistoryOptions {
  title?:string; unit?:string; values?:Array<number|null>; labels?:string[];
  minimum?:number; maximum?:number; height?:number;
  annotations?:HistoryAnnotation[]; format?:(value:number)=>string;
  axisFormat?:(value:number)=>string; exactFormat?:(value:number)=>string; tableOpen?:boolean; detail?:'auto'|'compact'|'full';
}
/** Escaped semantic HTML; zero-span, nonfinite and out-of-scale inputs are rejected. */
export declare function renderHistory(options?:HistoryOptions):string;
