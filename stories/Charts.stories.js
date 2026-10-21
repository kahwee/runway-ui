import chartDocument from '../docs/charts.html?raw';
import { catalog } from '../docs/catalog.js';
export default {title:'Charts/CSS plots',tags:['autodocs'],args:{height:180,grid:true},argTypes:{height:{control:{type:'range',min:100,max:320,step:20}},grid:{control:'boolean'}}};
function plot(kind,args){
 const doc=new DOMParser().parseFromString(chartDocument,'text/html');
 const figure=doc.querySelector(`[data-chart="${kind}"] figure`);
 figure.style.setProperty('--g-chart-height',`${args.height}px`);
 figure.dataset.grid=args.grid?'on':'off';
 return figure;
}
export const Columns={render:args=>plot('columns',args)};
export const StackedBars={render:args=>plot('stacked',args)};
export const DivergingBars={render:args=>plot('diverging',args)};
export const Area={render:args=>plot('area',args)};
export const LegacyHorizontal={render:()=>catalog.find(x=>x.id==='chart').snippet};
export const EmptyScale={render:args=>{
 const figure=plot('columns',args);
 figure.querySelectorAll('[data-value]').forEach(mark=>{mark.dataset.value='0';mark.style.setProperty('--g-amount',0);});
 figure.querySelectorAll('strong,tbody td').forEach(cell=>cell.textContent='0');
 return figure;
}};
