import{u as k,o as A,a as v,N as n,x as j,k as H,b as e,S as a,C as i,G as d,a7 as N,a8 as b,V as L,F as S,H as w,h as p,aa as M,v as E,s as C,t as $}from"./index-09375773.js";import{g as G}from"./mastodonApiService-6509ae35.js";import{R}from"./responsiveCustomGrid-f4e58937.js";const D=$("<div></div>"),I=$('<img class="emoji">'),P=()=>{const o=k(A),[l,g]=v(n.Loading),[m,_]=v([]);j(()=>{x()});const x=async()=>{if(o==null||o.accounts==null||o.accounts.length<1)return;const r=o.accounts[0],t=await G().getAnnouncements(r.accessToken,!0);t.isSuccess==!1&&(H().e("Could not fetch announcements",t.errorMessage),g(n.Error)),_(t.value),g(n.Success)};return e(R,{get children(){return[e(a,{get when(){return l()==n.Error},get children(){return e(i,{children:"Something went wrong"})}}),e(a,{get when(){return l()==n.Loading},get children(){return e(d,{colSpan:4,get children(){return e(N,{})}})}}),e(a,{get when(){return l()==n.Success},get children(){return[e(d,{colSpan:4,get children(){return e(b,{text:"Announcements"})}}),e(d,{colSpan:4,get children(){return e(a,{get when(){return m().length>0},get fallback(){return e(i,{minH:"25vh",children:"No Items"})},get children(){return e(L,{class:"conversations",justifyContent:"flex-start",alignItems:"flex-start",get children(){return e(S,{get each(){return m()},children:r=>{let c=r.content;for(const t of r.emojis)c=c.replaceAll(`:${t.shortcode}:`,`<img src="${t.static_url}" class="emoji" alt="${t.shortcode}" />`);return e(w,{class:"convo",get children(){return[e(i,{children:"📢"}),e(p,{class:"content",ml:10,flexGrow:4,get children(){return[(()=>{const t=D.cloneNode(!0);return t.innerHTML=c,t})(),e(w,{get children(){return e(S,{get each(){return r.reactions},children:t=>e(M,{p:"1em",get children(){const u=I.cloneNode(!0);return E(s=>{const h=t.static_url,f=t.name;return h!==s._v$&&C(u,"src",s._v$=h),f!==s._v$2&&C(u,"alt",s._v$2=f),s},{_v$:void 0,_v$2:void 0}),u}})})}})]}})]}})}})}})}})}}),e(p,{m:"3em"})]}})]}})};export{P as AnnouncementsPage,P as default};