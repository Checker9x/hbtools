(()=>{
const old=document.getElementById('__hbt');
if(old){old.__stop();return;}
try{performance.setResourceTimingBufferSize(10000);}catch(e){}
const H=String.fromCharCode(35);
const nm1=e=>{let s=e.tagName.toLowerCase();if(e.id)s+=H+e.id;else if(typeof e.className=='string'&&e.className.trim())s+='.'+e.className.trim().split(/\s+/).slice(0,2).join('.');return s;};
const sel=e=>{if(!e||!e.tagName)return '?';let s=nm1(e);const p=e.parentElement;if(p&&!e.id)s=nm1(p)+' > '+s;return s;};
const animText=()=>{
const vh=innerHeight,vw=innerWidth,g={};let tot=0,inf=0,offInf=0;
document.getAnimations().forEach(a=>{
const ef=a.effect||{},el=ef.target,tm=ef.getTiming?ef.getTiming():{},isInf=tm.iterations===Infinity;
const nm=a.animationName||(a.transitionProperty?'transition:'+a.transitionProperty:'js-anim');
let on=false;
if(el&&el.getBoundingClientRect){const r=el.getBoundingClientRect();on=r.width>0&&r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw;}
const k=sel(el)+(ef.pseudoElement||'')+' | '+nm;
const v=g[k]=g[k]||{n:0,i:0,on:0};
v.n++;tot++;
if(isInf){v.i++;inf++;if(!on)offInf++;}
if(on)v.on++;
});
const rows=Object.entries(g).sort((a,b)=>b[1].i-a[1].i||b[1].n-a[1].n).map(([k,v])=>v.n+'x '+(v.i?'LOOP ':'')+'['+v.on+' on-screen] '+k);
return 'ANIMATIONS at '+new Date().toLocaleTimeString()+'\nTotal '+tot+' | looping '+inf+' | looping off-screen '+offInf+'\n\n'+rows.join('\n');
};
const d=document.createElement('div');
d.id='__hbt';
d.style.cssText='position:fixed;top:4px;left:4px;right:4px;z-index:2147483647;background:rgba(0,0,0,.9);color:#0f0;font:10px monospace;padding:6px;border-radius:6px;max-height:70vh;overflow:hidden';
const bar=document.createElement('div');
const live=document.createElement('div');
live.style.cssText='font:11px monospace;white-space:pre;margin:2px 0 6px';
live.textContent='Measuring... (2s)';
const ta=document.createElement('textarea');
ta.readOnly=true;
ta.value=animText();
ta.style.cssText='width:94vw;max-width:100%;height:38vh;background:#000;color:#0f0;font:10px monospace;border:0;box-sizing:border-box';
const full=()=>location.host+' '+live.textContent+'\n\n'+ta.value;
const btn=(t,f)=>{const x=document.createElement('button');x.textContent=t;x.style.cssText='margin:0 6px 4px 0;font:13px sans-serif;padding:4px 10px';x.onclick=f;bar.appendChild(x);return x;};
let alive=true,f=0,lag=0,last=performance.now(),r0=performance.getEntriesByType('resource').length,t=last,low=999;
const loop=()=>{if(!alive)return;f++;requestAnimationFrame(loop);};
requestAnimationFrame(loop);
const i1=setInterval(()=>{const n=performance.now();lag=Math.max(lag,n-last-100);last=n;},100);
const i2=setInterval(()=>{
const n=performance.now(),s=(n-t)/1000,r=performance.getEntriesByType('resource').length;
const fps=Math.round(f/s);if(fps<low)low=fps;
const an=document.getAnimations?document.getAnimations():[];
const loops=an.filter(a=>a.effect&&a.effect.getTiming&&a.effect.getTiming().iterations===Infinity).length;
const ifr=[...document.querySelectorAll('iframe')].map(i=>{try{return new URL(i.src).host;}catch(e){return '?';}}).join(',').slice(0,60);
live.textContent='FPS '+fps+' (low '+low+')\nMax lag '+Math.round(lag)+'ms\nReq/2s '+(r-r0)+'\nDOM '+document.getElementsByTagName('*').length+'\nAnims '+an.length+' (looping '+loops+')\nVideo '+document.querySelectorAll('video').length+' Canvas '+document.querySelectorAll('canvas').length+'\nIframes '+(ifr||'0');
f=0;lag=0;r0=r;t=n;
},2000);
const stop=()=>{alive=false;clearInterval(i1);clearInterval(i2);d.remove();};
d.__stop=stop;
btn('Refresh list',()=>{ta.value=animText();});
btn('Copy all',()=>{const x=full();(navigator.clipboard?navigator.clipboard.writeText(x):Promise.reject()).catch(()=>{const c=document.createElement('textarea');c.value=x;d.appendChild(c);c.select();document.execCommand('copy');c.remove();});});
const mn=btn('Min',()=>{const m=ta.style.display!=='none';ta.style.display=m?'none':'block';d.style.right=m?'auto':'4px';mn.textContent=m?'Max':'Min';});
btn('Close',stop);
d.appendChild(bar);d.appendChild(live);d.appendChild(ta);
document.body.appendChild(d);
})()
