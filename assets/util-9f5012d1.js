import{a as i,x as u,ak as h,b as e,G as o,a8 as m,al as g,am as l,an as y,ao as x,t as S,ap as C}from"./index-845334e5.js";import{R as b}from"./responsiveCustomGrid-d3c9dd6a.js";const f=a=>{var t,n;return(n=(t=navigator==null?void 0:navigator.clipboard)==null?void 0:t.writeText)==null?void 0:n.call(t,a)},T=S("<span>📋</span>"),G=()=>{const[a,t]=i(""),[n,p]=i("");u(()=>{d()});const d=async()=>{const r=await h(C.encryptKey,"");p(r)};return e(b,{get children(){return[e(o,{colSpan:4,get children(){return e(m,{text:"Utilities"})}}),e(o,{colSpan:4,get children(){return e(g,{children:"Quick encrypt"})}}),e(o,{colSpan:2,get children(){return e(l,{minH:"40vh",placeholder:"Paste text here",onInput:r=>{var c,s;return t(y(n(),(s=(c=r==null?void 0:r.target)==null?void 0:c.value)!=null?s:""))}})}}),e(o,{colSpan:2,position:"relative",get children(){return[e(l,{minH:"40vh",placeholder:"Copy encrypted text from here",get children(){return a()}}),e(x,{colorScheme:"info","aria-label":"Copy encr",borderRadius:"2em",class:"copy-fab",onClick:()=>f(a()),get icon(){return T.cloneNode(!0)}})]}})]}})};export{G as UtilPage,G as default};