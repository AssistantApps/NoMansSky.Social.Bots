import{g as d,c as t,u as o,T as g,y as l,j as m,h as u}from"./index-6dcc8f02.js";import{P as h}from"./pageHeader-3218e05d.js";const S=n=>{const[r,c]=d(""),i=()=>{try{const e=JSON.parse(r());n.setCredentials(e)}catch(e){u().e(e)}};return[t(h,{text:"Not authorized"}),t(o,{m:20}),t(g,{minH:"70vh",onInput:e=>{var a,s;return c((s=(a=e==null?void 0:e.target)==null?void 0:a.value)!=null?s:"")}}),t(o,{m:20}),t(m,{get children(){return t(l,{colorScheme:"primary",get disabled(){return r().length<1},onClick:()=>i(),children:"Set credentials"})}})]};export{S as NotAuthedPage,S as default};