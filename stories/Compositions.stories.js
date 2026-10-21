import workshop from '../index.html?raw';
export default {title:'Compositions/Game interface'};
export const OperationsRoom={render:()=>{
 const source=new DOMParser().parseFromString(workshop,'text/html');
 const root=document.createElement('div');root.className='g-stack';
 root.innerHTML='<p class="g-kicker">Management / operations room</p><h1>A system you can read at a glance.</h1><p>Composed from the same standalone primitives. State changes belong to your application.</p>';
 const grid=document.createElement('div');grid.className='story-grid';
 source.querySelectorAll('#simulation .g-panel').forEach(panel=>grid.append(panel.cloneNode(true)));
 if(!grid.children.length)grid.innerHTML='<section class="g-panel"><h2>Operations</h2><p>Explore individual stories and the full workshop for complete game compositions.</p></section>';
 root.append(grid);return root;
}};
