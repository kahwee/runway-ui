import '../index.css';
import '../styles/native.css';
import './preview.css';
export default {
  initialGlobals: { theme:'studio', density:'comfortable' },
  globalTypes: {
    theme:{description:'Art direction',toolbar:{icon:'paintbrush',items:['studio','orbital','parchment'],dynamicTitle:true}},
    density:{description:'Control spacing',toolbar:{icon:'component',items:['comfortable','compact'],dynamicTitle:true}},
  },
  parameters: { layout:'fullscreen', controls:{expanded:true}, options:{storySort:{order:['Start here','Charts','Foundations','Game patterns','Behaviors','Compositions']}} },
  decorators:[(story,context)=>{
    const root=document.createElement('section');
    root.className='g-ui story-surface';
    root.dataset.theme=context.globals.theme;
    root.dataset.density=context.globals.density;
    const content=story();
    if(typeof content==='string') root.innerHTML=content;
    else root.append(content);
    // Native dialogs in this story need their own root tokens.
    root.querySelectorAll('dialog').forEach(dialog=>{dialog.dataset.theme=context.globals.theme;dialog.dataset.density=context.globals.density;});
    return root;
  }],
};
