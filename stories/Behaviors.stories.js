import { bindNavigation } from '../behaviors/navigation.js';
import { createInventory } from '../behaviors/inventory.js';
// Documentation-only lifecycle host: no custom elements are required by Runway UI.
if(!customElements.get('runway-story-host')) customElements.define('runway-story-host',class extends HTMLElement {
  connectedCallback(){this.cleanup?.();this.cleanup=this.setup?.();}
  disconnectedCallback(){this.cleanup?.();this.cleanup=undefined;}
});
export default {title:'Behaviors/Optional JavaScript',tags:['autodocs']};
export const KeyboardNavigation={render:()=>{
 const root=document.createElement('runway-story-host');
 root.innerHTML='<h2>Roving keyboard focus</h2><p>Tab enters the group. Arrow keys, Home and End move focus; disabled controls are skipped.</p><div class="g-dock" role="toolbar" aria-label="World views"><button class="g-button">Overview</button><button class="g-button" disabled>Locked</button><button class="g-button">Resources</button><button class="g-button">Research</button></div><p role="status">Choose a view.</p>';
 root.setup=()=>{
   const nav=bindNavigation(root.querySelector('[role=toolbar]'),{columns:1});
   const select=event=>{if(event.target.closest('button'))root.querySelector('[role=status]').textContent=`${event.target.textContent} selected.`;};
   root.addEventListener('click',select);
   return()=>{nav.destroy();root.removeEventListener('click',select);};
 };
 return root;
}};
export const VirtualInventory={render:()=>{
 const root=document.createElement('runway-story-host');root.className='story-width';root.style.display='block';
 root.innerHTML='<h2>10,000-item virtual catalog</h2><p>End reaches the final item; Enter selects it. This optional helper owns a dedicated grid root.</p><div class="g-virtual" tabindex="0" aria-label="Equipment catalog"></div><p role="status">No item selected.</p>';
 root.setup=()=>{
   const inventory=createInventory(root.querySelector('.g-virtual'),{items:Array.from({length:10000},(_,i)=>({label:`Equipment ${i+1}`,icon:'◈'})),columns:6,onSelect:item=>{root.querySelector('[role=status]').textContent=`${item.label} selected.`;}});
   return()=>inventory.destroy();
 };
 return root;
}};
