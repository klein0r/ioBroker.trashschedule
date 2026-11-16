function e(e){return!!e.form}var t=[`header`,`staticText`,`divider`];function n(e,t){return e==null?``:typeof e==`object`?e[t]||e.en||Object.values(e).find(e=>!!e)||``:String(e)}function r(e){let n={};for(let[r,i]of Object.entries(e.items||{}))i&&!t.includes(i.type)&&(n[r]=i.type);return n}function i(e){return typeof e==`string`?e:typeof e==`number`||typeof e==`boolean`?e.toString():JSON.stringify(e)}function a(e,t){if(t!=null)switch(e){case`number`:case`slider`:{if(typeof t==`number`)return Number.isFinite(t)?t:void 0;let e=i(t).trim().replace(`,`,`.`);if(!e)return;let n=Number(e);return Number.isFinite(n)?n:void 0}case`checkbox`:return t===!0||t===`true`||t===1||t===`1`;default:return i(t)}}function o(e,t){let n={};for(let[r,i]of Object.entries(e)){let e=a(i,t[r]);e!==void 0&&(n[r]=e)}return n}var s=`"Roboto", "Helvetica", "Arial", sans-serif`,c=Object.freeze({type:`light`,primary:`#3399CC`,primaryContrast:`#FFFFFF`,secondary:`#164477`,secondaryContrast:`#FFFFFF`,background:`#FFFFFF`,paper:`#FFFFFF`,text:`rgba(0, 0, 0, 0.87)`,textSecondary:`rgba(0, 0, 0, 0.6)`,divider:`rgba(0, 0, 0, 0.12)`,error:`#D32F2F`,warning:`#ED6C02`,info:`#0288D1`,success:`#2E7D32`,fontFamily:s,fontSize:14,borderRadius:4}),l=Object.freeze({type:`dark`,primary:`#4DABF5`,primaryContrast:`rgba(0, 0, 0, 0.87)`,secondary:`#436A93`,secondaryContrast:`#FFFFFF`,background:`#121212`,paper:`#121212`,text:`#FFFFFF`,textSecondary:`rgba(255, 255, 255, 0.7)`,divider:`rgba(255, 255, 255, 0.12)`,error:`#F44336`,warning:`#FFA726`,info:`#29B6F6`,success:`#66BB6A`,fontFamily:s,fontSize:14,borderRadius:4}),u=[`primary`,`primaryContrast`,`secondary`,`secondaryContrast`,`background`,`paper`,`text`,`textSecondary`,`divider`,`error`,`warning`,`info`,`success`,`fontFamily`],d=[`fontSize`,`borderRadius`];function f(e){return{...e===`dark`?l:c}}function p(e){if(!e||typeof e!=`object`)return f(typeof e==`string`?e:`light`);let t=e,n=f(typeof t.type==`string`?t.type:`light`);for(let e of u){let r=t[e];typeof r==`string`&&r.trim()&&(n[e]=r.trim())}for(let e of d){let r=t[e],i=typeof r==`string`?parseFloat(r):r;typeof i==`number`&&Number.isFinite(i)&&i>=0&&(n[e]=i)}return n}function m(e,t){return e.type===t.type&&u.every(n=>e[n]===t[n])&&d.every(n=>e[n]===t[n])}function h(e){return`--iob-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`}function g(e){let t={};for(let n of u)t[h(n)]=e[n];for(let n of d)t[h(n)]=`${e[n]}px`;return t[`color-scheme`]=e.type,t}var _={ok:{en:`OK`,"zh-cn":`确定`},cancel:{en:`Cancel`,de:`Abbrechen`,ru:`Отмена`,pt:`Cancelar`,nl:`Annuleren`,fr:`Annuler`,it:`Annulla`,es:`Cancelar`,pl:`Anuluj`,uk:`Скасувати`,"zh-cn":`取消`},close:{en:`Close`,de:`Schließen`,ru:`Закрыть`,pt:`Fechar`,nl:`Sluiten`,fr:`Fermer`,it:`Chiudi`,es:`Cerrar`,pl:`Zamknij`,uk:`Закрити`,"zh-cn":`关闭`}},v=`
dialog {
    box-sizing: border-box;
    width: 480px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
    padding: 0;
    border: 0;
    border-radius: calc(var(--iob-border-radius) * 2);
    background: var(--iob-paper);
    color: var(--iob-text);
    font-family: var(--iob-font-family);
    font-size: var(--iob-font-size);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
/* as the dialogs of MUI: a dark paper gets lighter the higher it lies */
dialog.dark { background-image: linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16)); }
dialog::backdrop { background: rgba(0, 0, 0, 0.5); }
dialog:focus { outline: none; }
form { display: flex; flex-direction: column; height: 100%; max-height: inherit; margin: 0; }
header { display: flex; align-items: center; gap: 8px; padding: 12px 8px 12px 16px; font-size: 1.15em; font-weight: 500; }
header span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.body { flex: 1; min-height: 0; padding: 0 16px 16px; overflow: auto; display: flex; flex-direction: column; gap: 12px; }
footer { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 16px; }
button { font: inherit; padding: 6px 16px; border-radius: var(--iob-border-radius); border: 1px solid var(--iob-primary); background: transparent; color: var(--iob-primary); cursor: pointer; }
button.primary { background: var(--iob-primary); color: var(--iob-primary-contrast); }
button.close { border: 0; padding: 2px 8px; font-size: 1.4em; line-height: 1; color: var(--iob-text-secondary); }
label { display: flex; flex-direction: column; gap: 4px; }
label.check { flex-direction: row; align-items: center; gap: 8px; }
input, select, textarea { font: inherit; accent-color: var(--iob-primary); }
.help { color: var(--iob-text-secondary); font-size: 0.85em; }
h3 { margin: 4px 0 0; font-size: 1em; }
p { margin: 0; }
hr { width: 100%; border: 0; border-top: 1px solid var(--iob-divider); margin: 0; }
[hidden] { display: none !important; }
`;function y(e){if(!e)return null;try{let t=Function(`data`,`return (${e});`);return e=>{try{return!!t(e)}catch{return!1}}}catch{return null}}function b(e){return typeof e==`string`?e:typeof e==`number`||typeof e==`boolean`?String(e):``}function x(e){let{input:t,setting:n}=e;if(t)return t instanceof HTMLInputElement&&t.type===`checkbox`?t.checked:t instanceof HTMLSelectElement?n.options?.[t.selectedIndex]?.value:t.value}function S(e,t,r,i,a){let o={name:t,setting:r,box:e.createElement(`div`),hidden:y(r.hidden),disabled:y(r.disabled)},s=n(r.label,a);switch(r.type){case`header`:return o.box=e.createElement(`h3`),o.box.textContent=n(r.text,a)||s,o;case`staticText`:return o.box=e.createElement(`p`),o.box.textContent=n(r.text,a)||s,o;case`divider`:return o.box=e.createElement(`hr`),o}let c=e.createElement(`label`);o.box=c;let l=e.createElement(`span`);if(l.textContent=s||t,r.type===`checkbox`){let t=e.createElement(`input`);t.type=`checkbox`,t.checked=i===!0||i===`true`,c.className=`check`,c.append(t,l),o.input=t}else if(r.type===`select`){let t=e.createElement(`select`);for(let i of r.options||[]){let r=e.createElement(`option`);r.textContent=n(i.label,a),t.append(r)}let s=(r.options||[]).findIndex(e=>String(e.value)===b(i));t.selectedIndex=s===-1?0:s,c.append(l,t),o.input=t}else if(r.type===`text`&&(r.minRows||1)>1){let t=e.createElement(`textarea`);t.rows=r.minRows||2,t.value=b(i),c.append(l,t),o.input=t}else{let t=e.createElement(`input`),n=b(i);switch(r.type){case`number`:case`slider`:t.type=r.type===`slider`?`range`:`number`,r.min!==void 0&&(t.min=String(r.min)),r.max!==void 0&&(t.max=String(r.max)),t.step=r.step===void 0?`any`:String(r.step);break;case`password`:t.type=`password`;break;case`color`:t.type=!n||/^#[0-9a-f]{6}$/i.test(n)?`color`:`text`;break;default:t.type=`text`}if(t.value=n,t.type===`range`){let n=e.createElement(`output`);n.textContent=t.value,t.addEventListener(`input`,()=>n.textContent=t.value),l.append(`: `,n)}c.append(l,t),o.input=t}if(r.help){let t=e.createElement(`span`);t.className=`help`,t.textContent=n(r.help,a),c.append(t)}return o}function C(t,i={}){let a=i.lang||`en`,s=document,c=e=>_[e][a]||_[e].en||e,l=s.createElement(`div`);l.setAttribute(`data-iob-dialog`,``);let u=l.attachShadow({mode:`open`}),d=s.createElement(`style`);d.textContent=v;let f=s.createElement(`dialog`),m=p(i.theme);f.className=m.type===`dark`?`dark`:``;for(let[e,t]of Object.entries(g(m)))f.style.setProperty(e,t);t.width&&(f.style.width=`${t.width}px`),t.height&&(f.style.height=`${t.height}px`);let h=s.createElement(`form`),y=s.createElement(`header`),b=s.createElement(`span`);b.textContent=n(t.title,a);let C=s.createElement(`button`);C.type=`button`,C.className=`close`,C.title=c(`close`),C.setAttribute(`aria-label`,c(`close`)),C.textContent=`×`,y.append(b,C);let w=s.createElement(`div`);return w.className=`body`,h.append(y,w),f.append(h),u.append(d,f),new Promise(i=>{let d=!1,p=e=>{d||(d=!0,f.open&&f.close(),l.remove(),i(e))};if(C.addEventListener(`click`,()=>p(null)),f.addEventListener(`close`,()=>p(null)),h.addEventListener(`submit`,e=>e.preventDefault()),e(t)){let e={},i=[];for(let[e,n]of Object.entries(t.form.items||{})){let r=t.data?.[e]??n.default,o=S(s,e,n,r,a);i.push(o),w.append(o.box)}let l=()=>{for(let t of i)t.input&&(e[t.name]=x(t));return e},u=()=>{let e=l();for(let t of i)t.box.hidden=t.hidden?t.hidden(e):!1,t.input&&(t.input.disabled=t.disabled?t.disabled(e):!1)};h.addEventListener(`input`,u),h.addEventListener(`change`,u),u();let d=i.find(e=>e.input&&!e.box.hidden&&!e.input.disabled);d?.input&&(d.input.autofocus=!0);let f=s.createElement(`footer`),m=s.createElement(`button`);m.type=`button`,m.textContent=n(t.cancel,a)||c(`cancel`),m.addEventListener(`click`,()=>p(null));let g=s.createElement(`button`);g.type=`submit`,g.className=`primary`,g.textContent=n(t.ok,a)||c(`ok`),f.append(m,g),h.append(f),h.addEventListener(`submit`,()=>p(o(r(t.form),l())))}else w.append(t.element),f.addEventListener(`iob-dialog-close`,e=>p(e.detail??null));s.body.append(l),f.showModal(),u.activeElement&&u.activeElement!==C||(f.tabIndex=-1,f.focus())})}function w(e){return[...new Set(e.filter(e=>typeof e==`string`&&!!e))]}var T=[`socket`,`dialogs`,`theme`,`editMode`,`settings`,`value`],E=class extends HTMLElement{states={};objects={};#e=null;#t={};#n=p(`light`);#r=!1;#i=null;#a=void 0;#o=null;#s=!1;#c=(e,t)=>{this.#o?.states.includes(e)&&(this.states[e]=t||null,this.#_())};#l=(e,t)=>{this.#o?.objects.includes(e)&&(this.objects[e]=t||null,this.#d())};get socket(){return this.#e}set socket(e){this.#e=e||null,this.#d()}get settings(){return this.#t}set settings(e){this.#t=e||{},this.#d()}get theme(){return this.#n}set theme(e){let t=p(e);m(t,this.#n)||(this.#n=t,this.#u(),this.#_())}get editMode(){return this.#r}set editMode(e){let t=!!e;t!==this.#r&&(this.#r=t,this.#_())}get dialogs(){return this.#i}set dialogs(e){this.#i=e||null}get value(){return this.#a}set value(e){e!==this.#a&&(this.#a=e,this.#_())}connectedCallback(){for(let e of T)if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}this.#u(),this.#d()}disconnectedCallback(){this.#g()}getStateIds(e){return[]}getObjectIds(e){return[]}get systemLang(){return this.#e?.systemLang||`en`}text(e){return n(e,this.systemLang)}setState(e,t){return this.#e&&!this.#r?this.#e.setState(e,t):Promise.resolve()}changeValue(e){return this.#r||this.emit(`iob-change`,e)?!1:(this.value=e,!0)}emit(e,t){return this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0,cancelable:!0}))}async openDialog(t){if(this.#r)return null;let n=this.#i?await this.#i.open(t):await C(t,{lang:this.systemLang,theme:this.#n});return e(t)?n&&typeof n==`object`?o(r(t.form),n):null:n??null}#u(){for(let[e,t]of Object.entries(g(this.#n)))this.style.setProperty(e,t)}#d(){if(!this.isConnected)return;let e=this.#e,t=e?w(this.getStateIds(this.#t)):[],n=e?w(this.getObjectIds(this.#t)):[];this.#o&&this.#o.socket!==e&&this.#g();let r=this.#o?.states||[],i=this.#o?.objects||[],a=r.filter(e=>!t.includes(e)),o=i.filter(e=>!n.includes(e)),s=t.filter(e=>!r.includes(e)),c=n.filter(e=>!i.includes(e));e&&a.length&&e.unsubscribeState(a,this.#c),e&&o.length&&this.#h(e,o);for(let e of a)delete this.states[e];for(let e of[...a,...o])!t.includes(e)&&!n.includes(e)&&delete this.objects[e];this.#o=e&&(t.length||n.length)?{socket:e,states:t,objects:n}:null,e&&s.length&&this.#p(e,s),e&&c.length&&this.#m(e,c),this.#_()}#f(e,t,n){return this.#o?.socket===e&&this.#o[t].includes(n)}#p(e,t){e.subscribeState(t,this.#c).catch(e=>console.warn(`<${this.localName}>: cannot subscribe ${t.join(`, `)}: ${e}`));for(let n of t)e.getState(n).then(t=>{this.#f(e,`states`,n)&&this.states[n]===void 0&&(this.states[n]=t||null,this.#_())}).catch(()=>{}),e.getObject(n).then(t=>{this.#f(e,`states`,n)&&!this.#f(e,`objects`,n)&&(this.objects[n]=t||null,this.#_())}).catch(()=>{})}#m(e,t){e.subscribeObject(t,this.#l).catch(e=>console.warn(`<${this.localName}>: cannot subscribe the objects ${t.join(`, `)}: ${e}`));for(let n of t)e.getObject(n).then(t=>{this.#f(e,`objects`,n)&&(this.objects[n]=t||null,this.#d())}).catch(()=>{})}#h(e,t){e.unsubscribeObject(t,this.#l).catch(()=>{})}#g(){if(this.#o){let{socket:e,states:t,objects:n}=this.#o;t.length&&e.unsubscribeState(t,this.#c),n.length&&this.#h(e,n),this.#o=null}this.states={},this.objects={}}#_(){this.#s||(this.#s=!0,queueMicrotask(()=>{this.#s=!1,this.isConnected&&this.render()}))}};function D(e,t){let n=typeof e==`string`?e:e.tag;customElements.get(n)||customElements.define(n,t)}var ee=`iob-trashschedule-pickups`;function O(e,t){if(typeof e!=`string`||!e)return[];let n;try{n=JSON.parse(e)}catch{return[]}if(!Array.isArray(n))return[];let r=n.filter(e=>!!e&&typeof e==`object`&&!e._completed);return t>0?r.slice(0,t):r}function k(e,t,n){let r={month:`numeric`,day:`numeric`};if((n===`long`||n===`short`)&&(r.weekday=n),e==null||e===``)return``;let i=new Date(e);return Number.isNaN(i.getTime())?``:i.toLocaleDateString(t,r)}function A(e,t){let n=e.toString(16);return`0`.repeat(t-n.length)+n}function j(e,t,n){e/=255,t/=255,n/=255;let r=Math.max(e,t,n),i=Math.min(e,t,n),a=0,o=0,s=(r+i)/2;if(r!==i){let c=r-i;switch(o=s>.5?c/(2-r-i):c/(r+i),r){case e:a=(t-n)/c+(t<n?6:0);break;case t:a=(n-e)/c+2;break;case n:a=(e-t)/c+4}a/=6}return[a,o,s]}function M(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function N(e,t,n){let r,i,a;if(t===0)r=i=a=n;else{let o=n<.5?n*(1+t):n+t-n*t,s=2*n-o;r=M(s,o,e+1/3),i=M(s,o,e),a=M(s,o,e-1/3)}let o=e=>Math.max(0,Math.min(Math.round(e*255),255));return[o(r),o(i),o(a)]}function P(e){return j(parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16))}function F(e,t){let n=P(e),r=N(n[0],n[1],n[2]+t);return A(r[0],2)+A(r[1],2)+A(r[2],2)}var I=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 372.57144 611.88544'%3E%3Cdefs%3E%3Cfilter id='d'%3E%3CfeGaussianBlur stdDeviation='1.88219'/%3E%3C/filter%3E%3Cfilter id='e' x='-.13781' y='-.04479' width='1.2756' height='1.0896'%3E%3CfeGaussianBlur stdDeviation='.79176'/%3E%3C/filter%3E%3ClinearGradient id='a'%3E%3Cstop stop-color='%23363636' offset='0'/%3E%3Cstop stop-color='%23363636' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b'%3E%3Cstop stop-color='%23666666' offset='0'/%3E%3Cstop stop-color='%23595959' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c'%3E%3Cstop stop-color='%23707070' offset='0'/%3E%3Cstop stop-color='%23595959' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='l' x1='174.29' x2='183.57' y1='335' y2='577.86' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%236e6e6e' offset='0'/%3E%3Cstop stop-color='%238a8a8a' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='m' x2='0' y1='230.07' y2='401.07' gradientUnits='userSpaceOnUse' xlink:href='%23c'/%3E%3ClinearGradient id='k' x2='0' y1='108.98' y2='-102.96' gradientUnits='userSpaceOnUse' xlink:href='%23c'/%3E%3ClinearGradient id='j' x1='171.99' x2='193.73' y1='96.159' y2='56.561' gradientUnits='userSpaceOnUse' xlink:href='%23b'/%3E%3ClinearGradient id='i' x1='171.99' x2='193.73' y1='513.74' y2='474.14' gradientUnits='userSpaceOnUse' xlink:href='%23b'/%3E%3ClinearGradient id='h' x2='0' y1='165.39' y2='25.449' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3ClinearGradient id='g' x2='0' y1='283.54' y2='205.98' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3ClinearGradient id='f' x2='0' y1='282.84' y2='205.27' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3C/defs%3E%3Cpath d='m61.143 176h254.29c20.577 0 31.143-18.053 37.143-46.036l20-83.928c0-25.504-16.566-46.036-37.143-46.036h-294.29c-20.577 0-37.143 20.532-37.143 46.036l20 83.928c8 27.363 16.566 46.036 37.143 46.036z' fill='url(%23k)'/%3E%3Cpath d='m76.467 165.39h223.64c18.097 0 27.389-15.877 32.666-40.488l17.589-73.812c0-22.43-14.569-40.488-32.666-40.488h-258.82c-18.097 0-32.666 18.057-32.666 40.488l17.589 73.812c7.0358 24.065 14.569 40.488 32.666 40.488z' fill='url(%23h)' opacity='.25'/%3E%3Cpath d='m358.9 289.24-41.378 291.4c0 14.882-11.98 26.862-26.862 26.862h-212.83c-14.881 0-26.862-11.98-26.862-26.862l-42.739-290.04 350.67-1.362z' fill='url(%23l)'/%3E%3Cpath d='m20.977 290.54-12.75 0.03101 42.75 290.06c0 11.835 7.572 21.844 18.157 25.437-2.415-4.3701-3.813-9.412-3.813-14.781l-44.344-300.75z' fill='%23a3a3a3'/%3E%3Cpath d='m29.019 291.84-12.75 0.03119 42.75 290.06c0 7.9506 3.0632 17.905 8.5147 22.816 2.6639 2.3997 6.1672 1.442 9.6416 2.6215-2.4143-4.3704-3.8125-9.4116-3.8125-14.781l-44.344-300.75v6.1e-5z' fill='%23a3a3a3' filter='url(%23d)'/%3E%3Cpath d='m340.42 293.96 12.75 0.03119-42.75 290.06c0 8.6726-4.0655 16.364-10.403 21.27-2.3113 1.7891-4.2178 1.0863-7.0465 2.0466 2.4143-4.3704 3.1054-7.2903 3.1054-12.66l44.344-300.75v6.1e-5z' fill='%23a3a3a3' filter='url(%23d)'/%3E%3Cpath d='m348.11 290.54 12.75 0.03101-42.75 290.06c0 11.835-7.572 21.844-18.156 25.437 2.414-4.3701 3.812-9.412 3.812-14.781l44.344-300.75z' fill='%23a3a3a3'/%3E%3Cpath d='m1.089 282.9 10.375 70.406c6.7593 7.2021 16.385 11.688 27.094 11.688h294.31c9.9557 0 18.974-3.8856 25.625-10.219l9.0312-63.531c-5.3515 13.922-18.805 23.75-34.656 23.75h-294.31c-18.866 0-34.335-13.918-36.781-32.094h-0.6875z' fill='%238a8a8a'/%3E%3Cpath d='m57.143 176h254.29c20.577 0 31.143 14.566 37.143 37.143l20 67.714c0 20.577-16.566 37.143-37.143 37.143h-294.29c-20.577 0-37.143-16.566-37.143-37.143l20-67.714c8-22.077 16.566-37.143 37.143-37.143z' fill='url(%23m)'/%3E%3Cpath d='m12.375 314.02 8.4062 56.969c5.6076 3.3926 12.189 5.3438 19.25 5.3438h294.31c5.2941 0 10.326-1.1125 14.875-3.0938l7.7188-54.562c-6.2503 4.7925-14.07 7.6562-22.594 7.6562h-294.31c-11.016 0-20.873-4.7451-27.656-12.312z' fill='%23363636' opacity='.17857'/%3E%3Cpath d='m57.652 177.99c-20.577 0-29.156 15.079-37.156 37.156l-20 67.719c0 20.577 16.579 37.125 37.156 37.125h294.28c20.577 0 37.125-16.548 37.125-37.125l-20-67.719c-6-22.577-16.548-37.156-37.125-37.156h-254.28zm6.375 2.5h243.53c19.708 0 29.816 13.757 35.562 35.062l19.156 63.906c0 19.418-15.855 35.031-35.562 35.031h-281.84c-19.708 0-35.594-15.613-35.594-35.031l19.156-63.906c7.662-20.833 15.886-35.062 35.594-35.062z' fill='%23a6a6a6'/%3E%3Cpath d='m313.17 139.57-234.19-101.05c-3.0598-1.2988-6.5686 0.11888-7.8674 3.1786s0.11887 6.5686 3.1786 7.8674l234.19 101.05c3.0598 1.2988 6.5686-0.11887 7.8674-3.1786s-0.1189-6.5686-3.1786-7.8674z' fill='url(%23j)'/%3E%3Cpath d='m75.652 37.522c-2.3386-6e-3 -4.5572 1.3927-5.5312 3.6875-0.0892 0.21005-0.15485 0.41158-0.21875 0.625 1.664-1.3259 3.9902-1.7054 6.0938-0.8125l234.19 101.03c2.8378 1.2046 4.2506 4.3335 3.4062 7.2188 0.74124-0.59937 1.3501-1.4017 1.75-2.3438 1.2988-3.0598-0.0965-6.5762-3.1562-7.875l-234.19-101.03c-0.76494-0.32471-1.5642-0.49808-2.3438-0.5z' fill='%23363636' opacity='.38929'/%3E%3Cg transform='matrix(1 0 0 -1 -6.8583e-8 606.2)'%3E%3Cpath d='m313.17 557.15-234.19-101.05c-3.0598-1.2988-6.5686 0.11887-7.8674 3.1786s0.11887 6.5686 3.1786 7.8674l234.19 101.05c3.0598 1.2988 6.5686-0.11884 7.8674-3.1786s-0.1189-6.5686-3.1786-7.8674z' fill='url(%23i)'/%3E%3Cpath d='m72.526 464.7c-1.5827-1.7216-2.048-4.3027-1.012-6.5702 0.0948-0.20758 0.1992-0.392 0.31355-0.58322 0.1447 2.1227 1.4345 4.0954 3.5131 5.045l232.61 104.62c2.8041 1.281 6.0664 0.21179 7.6256-2.3585 0.05801 0.95154-0.12311 1.9423-0.54837 2.8732-1.3813 3.0234-4.9178 4.3671-7.9412 2.9858l-232.61-104.62c-0.75586-0.34531-1.4232-0.81808-1.9508-1.392z' fill='%23363636' opacity='.38929'/%3E%3C/g%3E%3Cpath d='m34.882 312.83c-9.2018-2.9784-16.709-8.7598-20.74-15.972-2.3966-4.2879-4.7158-11.761-4.7158-15.196 0-3.4583 18.785-65.742 22.308-73.962 1.489-3.4748 3.7672-8.132 5.0628-10.349 2.7296-4.6716 9.0225-11.761 9.7795-11.017 0.47365 0.46518 13.004 121.44 13.039 125.89l0.0154 1.9445-10.43-0.03796c-7.992-0.02911-11.339-0.33227-14.319-1.2969z' fill='url(%23g)' opacity='.25'/%3E%3Cpath d='m335.4 312.13c9.2018-2.9784 16.709-8.7598 20.74-15.972 2.3966-4.2879 4.7158-11.761 4.7158-15.196 0-3.4583-18.785-65.742-22.308-73.962-1.489-3.4748-3.7672-8.132-5.0628-10.349-2.7296-4.6716-9.0225-11.761-9.7795-11.017-0.47363 0.46518-13.004 121.44-13.039 125.89l-0.01538 1.9446 10.43-0.03803c7.992-0.02911 11.339-0.33227 14.319-1.2969z' fill='url(%23f)' opacity='.25'/%3E%3Cpath d='m1.089 282.9 10.375 70.406c6.7593 7.2021 16.385 11.688 27.094 11.688h294.31c9.9557 0 18.974-3.8856 25.625-10.219l9.0312-63.531c-5.3515 13.922-18.805 23.75-34.656 23.75h-294.31c-18.866 0-34.335-13.918-36.781-32.094h-0.6875z' fill='%238a8a8a'/%3E%3Cpath d='m5.4681 293.44s8.1317 15.556 22.981 19.445l3.182 49.498c-14.142 1.0607-19.445-8.8388-19.445-8.8388l-6.7175-60.104z' fill='%239e9e9e' filter='url(%23e)'/%3E%3Cpath d='m366.63 293.44s-8.1317 15.556-22.981 19.445l-3.182 49.498c14.142 1.0607 19.445-8.8388 19.445-8.8388l6.7175-60.104z' fill='%239e9e9e' filter='url(%23e)'/%3E%3C/svg%3E")`;function L(e){let t=/^#?([a-f\d]{6})$/i.exec(e??``);if(!t)return;let n=t[1],r=P(n)[2];r<.33?n=F(n,.33-r):r>.89&&(n=F(n,-(r-.89)));let i={"8a8a8a":0,363636:-.33,595959:-.19,666666:-.14,"6e6e6e":-.11,707070:-.1,"9e9e9e":.08,a3a3a3:.1,a6a6a6:.11};return I.replace(/%23([a-f\d]{6})/gi,(e,t)=>{let r=i[t.toLowerCase()];return r===void 0?e:`%23${r===0?n:F(n,r)}`})}var R=[`json`,`jsonNotFound`,`lastRefresh`,`nextRefresh`,`resetCompleted`,`completedToday`,`completedTomorrow`,`completedAll`],z=`#8a8a8a`;function B(e){let t=(e==null?``:String(e).trim()).match(/^(?:(?:system\.adapter\.)?trashschedule\.)?(\d+)$/);return t?parseInt(t[1],10):null}function V(e){let t=(e.trashType||``).trim();if(t){let e=t.match(/^(trashschedule\.\d+\.type)(?:\.([^.]+))?(?:\.|$)/);return e?{id:!e[2]||R.includes(e[2])?`${e[1]}.json`:`${e[1]}.${e[2]}.json`}:{id:null,problem:`notType`}}let n=B(e.instance);return n===null?{id:null,problem:`chooseInstance`}:{id:`trashschedule.${n}.type.json`}}function H(e){if(typeof e!=`string`||!e)return null;let t=[];for(let n of O(e,0)){let e=Number(n.daysLeft);if(!Number.isFinite(e))continue;let r=n._description;t.push({name:typeof n.name==`string`?n.name:``,daysLeft:e,nextDate:Number(n.nextDate)||0,description:typeof r==`string`?r:``,color:typeof n._color==`string`?n._color:``})}return t}function U(e,t,n){if(!e)return``;try{return k(e,t,n)}catch{return k(e,`en-US`,n)}}function W(e){return e===`zh-cn`?`zh-CN`:e}function G(e){return L(e)||L(z)||``}var K={chooseInstance:`Choose an instance in the settings`,notType:`Not a trash type of Trash Schedule`,noData:`No data - is the instance running?`,noPickups:`No upcoming pickups`,daysLeft:`Days left`,paper:`Paper`,organic:`Organic waste`,recycling:`Recycling`,residual:`Residual waste`},q={en:K,de:{chooseInstance:`Instanz in den Einstellungen wählen`,notType:`Kein Abfall-Typ von Trash Schedule`,noData:`Keine Daten - läuft die Instanz?`,noPickups:`Keine anstehenden Abholungen`,daysLeft:`Verbleibende Tage`,paper:`Papier`,organic:`Biomüll`,recycling:`Wertstoffe`,residual:`Restmüll`},ru:{chooseInstance:`Выберите экземпляр в настройках`,notType:`Это не тип мусора Trash Schedule`,noData:`Нет данных - экземпляр запущен?`,noPickups:`Нет предстоящих вывозов`,daysLeft:`Осталось дней`,paper:`Бумага`,organic:`Органические отходы`,recycling:`Вторсырьё`,residual:`Смешанные отходы`},pt:{chooseInstance:`Escolha uma instância nas configurações`,notType:`Não é um tipo de lixo do Trash Schedule`,noData:`Sem dados - a instância está em execução?`,noPickups:`Nenhuma recolha prevista`,daysLeft:`Dias restantes`,paper:`Papel`,organic:`Orgânicos`,recycling:`Recicláveis`,residual:`Indiferenciados`},nl:{chooseInstance:`Kies een instantie in de instellingen`,notType:`Geen soort afval van Trash Schedule`,noData:`Geen gegevens - draait de instantie?`,noPickups:`Geen komende ophalingen`,daysLeft:`Resterende dagen`,paper:`Papier`,organic:`Gft`,recycling:`Plastic`,residual:`Restafval`},fr:{chooseInstance:`Choisissez une instance dans les paramètres`,notType:`Pas un type de déchets de Trash Schedule`,noData:`Aucune donnée - l'instance est-elle démarrée ?`,noPickups:`Aucune collecte à venir`,daysLeft:`Jours restants`,paper:`Papier`,organic:`Biodéchets`,recycling:`Recyclables`,residual:`Ordures ménagères`},it:{chooseInstance:`Scegli un'istanza nelle impostazioni`,notType:`Non è un tipo di rifiuti di Trash Schedule`,noData:`Nessun dato - l'istanza è in esecuzione?`,noPickups:`Nessuna raccolta in arrivo`,daysLeft:`Giorni rimanenti`,paper:`Carta`,organic:`Organico`,recycling:`Plastica`,residual:`Indifferenziata`},es:{chooseInstance:`Elija una instancia en la configuración`,notType:`No es un tipo de basura de Trash Schedule`,noData:`Sin datos: ¿se está ejecutando la instancia?`,noPickups:`No hay recogidas próximas`,daysLeft:`Días restantes`,paper:`Papel`,organic:`Orgánico`,recycling:`Envases`,residual:`Resto`},pl:{chooseInstance:`Wybierz instancję w ustawieniach`,notType:`To nie jest rodzaj śmieci Trash Schedule`,noData:`Brak danych - czy instancja działa?`,noPickups:`Brak nadchodzących wywozów`,daysLeft:`Pozostało dni`,paper:`Papier`,organic:`Bio`,recycling:`Tworzywa`,residual:`Zmieszane`},uk:{chooseInstance:`Виберіть екземпляр у налаштуваннях`,notType:`Це не тип сміття Trash Schedule`,noData:`Немає даних - екземпляр запущено?`,noPickups:`Немає запланованих вивозів`,daysLeft:`Залишилось днів`,paper:`Папір`,organic:`Органічні відходи`,recycling:`Вторсировина`,residual:`Змішані відходи`},"zh-cn":{chooseInstance:`请在设置中选择实例`,notType:`不是 Trash Schedule 的垃圾类型`,noData:`无数据 - 实例是否在运行？`,noPickups:`没有即将到来的清运`,daysLeft:`剩余天数`,paper:`纸张`,organic:`厨余垃圾`,recycling:`可回收物`,residual:`其他垃圾`}};function J(e,t){return q[e]?.[t]||K[t]}var Y=.55;function X(e,t){let n={rows:e,cols:1},r=-1;for(let i=e;i>=1;i--){let a=Math.ceil(e/i);if(Math.ceil(e/a)!==i)continue;let o=Math.min(t/(Y*a),1/i);o>r+1e-9&&(n={rows:i,cols:a},r=o)}return n}function Z(e){return X(e,2)}function Q(){let e=[];for(let t=2;t<=12;t++){let n=``;for(let r=0;r<=1200;r++){let i=Math.exp(Math.log(.05)+r*Math.log(400)/1200),{rows:a,cols:o}=X(t,i),s=`--rows: ${a}; --cols: ${o};`;if(s!==n){let r=`.cans.n${t}`;e.push(n?`@container trashschedule (aspect-ratio >= ${Math.round(i*1e3)} / 1000) { ${r} { ${s} } }`:`${r} { ${s} }`),n=s}}}return e.join(`
`)}var te=`
:host {
    display: block;
    width: 100%;
    height: 100%;
}
.mount {
    width: 100%;
    height: 100%;
    /* the size of the box does not depend on what is in it */
    container-type: size;
    container-name: trashschedule;
}
.pickups {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
.edit {
    pointer-events: none;
}
.name,
.date {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
}
.name {
    font-weight: 700;
}
.date {
    color: var(--iob-text-secondary);
}

/* the cans of the vis widget */
.cans {
    display: grid;
    grid-template-columns: repeat(var(--cols, 1), minmax(0, 1fr));
    grid-template-rows: repeat(var(--rows, 1), minmax(0, 1fr));
    gap: clamp(2px, 2cqmin, 12px);
    padding: clamp(2px, 2cqmin, 8px);
}
.item {
    container-type: size;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    /* the height of a line of the name and of the date, with its margin to the can; cq units here are the ones of the cell */
    --name-size: max(8px, min(11cqw, 8.5cqh));
    --date-size: max(7px, min(9cqw, 7cqh));
}
.item.with-name {
    --name-room: calc(1.25 * var(--name-size) + 2cqh);
}
.item.with-date {
    --date-room: calc(1.25 * var(--date-size) + 2cqh);
}
.item .name {
    flex: none;
    margin-bottom: 2cqh;
    font-size: var(--name-size);
}
.item .date {
    flex: none;
    margin-top: 2cqh;
    font-size: var(--date-size);
}
/* as high as the can: the name and the date stay at the can, the three are centered in the cell together */
.can-area {
    flex: none;
    width: 100%;
    height: max(0px, min(164.23cqw, 100cqh - var(--name-room, 0px) - var(--date-room, 0px)));
    container-type: size;
    display: flex;
    align-items: center;
    justify-content: center;
}
.can {
    position: relative;
    flex: none;
    /* the proportions of the drawing: 372.57 x 611.89 */
    width: min(100cqw, 60.89cqh);
    height: min(100cqh, 164.23cqw);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
.days {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
.can .days {
    position: absolute;
    left: 50%;
    top: 63%;
    transform: translateX(-50%);
    width: 42%;
    height: 25%;
    border-radius: 30%;
    /* on the can, not on the page: the same in a light and a dark theme */
    background: rgba(255, 255, 255, 0.4);
    color: #1e1e1e;
    font-size: max(8px, min(12cqh, 19.7cqw));
}

/* one line per trash type */
.list {
    --gap: 2cqh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--gap);
    padding: 2cqh 2cqw;
}
.row {
    container-type: size;
    flex: none;
    width: 100%;
    height: min(calc((96cqh - (var(--count) - 1) * var(--gap)) / var(--count)), 30cqw, 120px);
    display: flex;
    align-items: center;
}
.mini {
    flex: none;
    height: 86cqh;
    width: 52.37cqh;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
.text {
    flex: 1 1 0;
    min-width: 0;
    /* the room beside the can and the days, by the height of the line: cq units of the row reach its children only */
    padding: 0 max(4px, 25cqh);
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.row .name {
    font-size: max(8px, min(32cqh, 9cqw));
}
.row .date {
    font-size: max(7px, min(25cqh, 7cqw));
}
/* a line too low for the name above the date (a flat tile): the date goes beside the name */
@container (height < 26px) {
    .row .text {
        flex-direction: row;
        align-items: baseline;
        justify-content: flex-start;
        gap: 0.6em;
    }
    .row .name {
        flex: 0 1 auto;
    }
    .row .date {
        flex: 0 100 auto;
    }
}
.row .days {
    flex: none;
    min-width: 2em;
    height: 1.7em;
    padding: 0 0.4em;
    border-radius: var(--iob-border-radius);
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-size: max(8px, min(38cqh, 10cqw));
}

/* the days glow when the pickup is near, like in the vis widget */
@keyframes glow {
    0% {
        box-shadow: 0 0 0 0 var(--iob-error);
    }
    100% {
        box-shadow: 0 0 10px 8px transparent;
    }
}
.glow .days {
    animation: glow 2s ease infinite;
}
@media (prefers-reduced-motion: reduce) {
    .glow .days {
        animation: none;
        box-shadow: 0 0 0 2px var(--iob-error);
    }
}

.hint {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    color: var(--iob-text-secondary);
    font-size: clamp(11px, 6cqmin, 15px);
}
.hint .mini {
    height: clamp(24px, 24cqmin, 64px);
    width: calc(clamp(24px, 24cqmin, 64px) * 0.6089);
    opacity: 0.5;
}

${Q()}
`,ne=[{word:`paper`,daysLeft:1,color:`#2a64c4`},{word:`organic`,daysLeft:3,color:`#2ca850`},{word:`recycling`,daysLeft:8,color:`#c8b820`},{word:`residual`,daysLeft:15,color:`#545454`}],re=864e5;function $(e,t,n){let r=document.createElement(e);return r.className=t,n!==void 0&&(r.textContent=n),r}function ie(e){let t=$(`div`,`hint`),n=$(`div`,`mini`);return n.style.backgroundImage=G(void 0),t.append(n,$(`div`,`message`,e)),t}function ae(e,t,n){let r=$(`div`,e.glow?`item glow`:`item`);r.classList.toggle(`with-name`,t),r.classList.toggle(`with-date`,n),r.title=e.title,t&&r.append($(`div`,`name`,e.name));let i=$(`div`,`can-area`),a=$(`div`,`can`);return a.style.backgroundImage=G(e.color),a.append($(`span`,`days`,e.days)),i.append(a),r.append(i),n&&r.append($(`div`,`date`,e.date)),r}function oe(e,t,n){let r=$(`div`,e.glow?`row glow`:`row`);r.title=e.title;let i=$(`div`,`mini`);i.style.backgroundImage=G(e.color);let a=$(`div`,`text`);return t&&a.append($(`div`,`name`,e.name)),n&&a.append($(`div`,`date`,e.date)),r.append(i,a,$(`div`,`days`,e.days)),r}function se(e,t){let n=e.pickups.length,r=$(`div`,`pickups ${e.layout}${t?` edit`:``}`);if(e.layout===`list`)r.style.setProperty(`--count`,String(n)),r.append(...e.pickups.map(t=>oe(t,e.showName,e.showDate)));else{if(r.classList.add(`n${n}`),n>12){let{rows:e,cols:t}=Z(n);r.style.setProperty(`--rows`,String(e)),r.style.setProperty(`--cols`,String(t))}r.append(...e.pickups.map(t=>ae(t,e.showName,e.showDate)))}return r}D(ee,class extends E{#e;#t=``;constructor(){super();let e=this.attachShadow({mode:`open`}),t=document.createElement(`style`);t.textContent=te,this.#e=document.createElement(`div`),this.#e.className=`mount`,e.append(t,this.#e)}getStateIds(e){return[V(e).id]}render(){let e=this.#n(),t=this.editMode,n=JSON.stringify([e,t]);n!==this.#t&&(this.#t=n,e.kind===`hint`?this.#e.replaceChildren(ie(e.text)):e.kind===`pickups`?this.#e.replaceChildren(se(e,t)):this.#e.replaceChildren())}#n(){let e=this.settings,t=this.systemLang,n=V(e);if(!n.id)return{kind:`hint`,text:J(t,n.problem||`chooseInstance`)};let r=null,i=this.states[n.id];if(i!==void 0&&(r=H(i?.val)),!r&&this.editMode){let e=/* @__PURE__ */ new Date;e.setHours(0,0,0,0),r=ne.map(n=>({name:J(t,n.word),daysLeft:n.daysLeft,nextDate:e.getTime()+n.daysLeft*re,description:``,color:n.color}))}if(!r)return i===void 0?{kind:`empty`}:{kind:`hint`,text:J(t,`noData`)};let a=Math.max(0,Math.floor(Number(e.limit)||0));if(a&&(r=r.slice(0,a)),!r.length)return{kind:`hint`,text:J(t,`noPickups`)};let o=e.dateWeekday===`hide`||e.dateWeekday===`short`?e.dateWeekday:`long`,s=e.dateLocale||W(t),c=e.glowLimit??1,l=J(t,`daysLeft`);return{kind:`pickups`,layout:e.layout===`list`?`list`:`cans`,showName:e.showName!==!1,showDate:e.showDate!==!1,pickups:r.map(t=>{let n=U(t.nextDate,s,o);return{name:t.name,days:String(t.daysLeft),date:n,color:t.color,glow:!!e.glow&&t.daysLeft<=c,title:[t.name,U(t.nextDate,s,`long`),`${l}: ${t.daysLeft}`,t.description].filter(Boolean).join(`
`)}})}}});