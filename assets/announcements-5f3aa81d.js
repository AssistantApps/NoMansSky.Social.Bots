import{u as A,v as k,a as f,N as r,K as j,k as H,b as e,S as o,C as i,G as u,ac as N,ad as E,V as L,F as v,H as S,h as w,ai as M,E as b,y as C,t as p}from"./index-39e77ea8.js";import{a as G}from"./mastodonHelper-d6a1b950.js";import{R}from"./responsiveCustomGrid-ad57a233.js";const y=p("<div></div>"),D=p('<img class="emoji">'),T=()=>{const $=A(k),[c,d]=f(r.Loading),[g,_]=f([]);j(()=>{x()});const x=async()=>{const[s,n]=await G($);if(n==null)return;const t=await s.getAnnouncements(n,!0);t.isSuccess==!1&&(H().e("Could not fetch announcements",t.errorMessage),d(r.Error)),_(t.value),d(r.Success)};return e(R,{get children(){return[e(o,{get when(){return c()==r.Error},get children(){return e(i,{children:"Something went wrong"})}}),e(o,{get when(){return c()==r.Loading},get children(){return e(u,{colSpan:4,get children(){return e(N,{})}})}}),e(o,{get when(){return c()==r.Success},get children(){return[e(u,{colSpan:4,get children(){return e(E,{text:"Announcements"})}}),e(u,{colSpan:4,get children(){return e(o,{get when(){return g().length>0},get fallback(){return e(i,{minH:"25vh",children:"No Items"})},get children(){return e(L,{class:"conversations",justifyContent:"flex-start",alignItems:"flex-start",get children(){return e(v,{get each(){return g()},children:s=>{let n=s.content;for(const t of s.emojis)n=n.replaceAll(`:${t.shortcode}:`,`<img src="${t.static_url}" class="emoji" alt="${t.shortcode}" />`);return e(S,{class:"convo",get children(){return[e(i,{children:"📢"}),e(w,{class:"content",ml:10,flexGrow:4,get children(){return[(()=>{const t=y.cloneNode(!0);return t.innerHTML=n,t})(),e(S,{get children(){return e(v,{get each(){return s.reactions},children:t=>e(M,{p:"1em",get children(){const l=D.cloneNode(!0);return b(a=>{const m=t.static_url,h=t.name;return m!==a._v$&&C(l,"src",a._v$=m),h!==a._v$2&&C(l,"alt",a._v$2=h),a},{_v$:void 0,_v$2:void 0}),l}})})}})]}})]}})}})}})}})}}),e(w,{m:"3em"})]}})]}})};export{T as AnnouncementsPage,T as default};