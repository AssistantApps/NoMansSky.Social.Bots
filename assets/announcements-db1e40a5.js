import{R as x,T as A,a as v,N as n,v as j,k as N,b as e,S as a,C as i,G as d,Y as b,Z as H,V as L,F as S,H as w,h as $,$ as M,r as R,s as C,t as p}from"./index-ad524b77.js";import{g as E,R as G}from"./mastodonApiService-2f1d2948.js";const T=p("<div></div>"),D=p('<img class="emoji">'),F=()=>{const c=x(A),[l,g]=v(n.Loading),[m,_]=v([]);j(()=>{k()});const k=async()=>{if(c==null||c.accounts==null||c.accounts.length<1)return;const r=c.accounts[0],t=await E().getAnnouncements(r.accessToken,!0);t.isSuccess==!1&&(N().e("Could not fetch announcements",t.errorMessage),g(n.Error)),_(t.value),g(n.Success)};return e(G,{get children(){return[e(a,{get when(){return l()==n.Error},get children(){return e(i,{children:"Something went wrong"})}}),e(a,{get when(){return l()==n.Loading},get children(){return e(d,{colSpan:4,get children(){return e(b,{})}})}}),e(a,{get when(){return l()==n.Success},get children(){return[e(d,{colSpan:4,get children(){return e(H,{text:"Announcements"})}}),e(d,{colSpan:4,get children(){return e(a,{get when(){return m().length>0},get fallback(){return e(i,{children:"No Items"})},get children(){return e(L,{class:"conversations",justifyContent:"flex-start",alignItems:"flex-start",get children(){return e(S,{get each(){return m()},children:r=>{let o=r.content;for(const t of r.emojis)o=o.replaceAll(`:${t.shortcode}:`,`<img src="${t.static_url}" class="emoji" alt="${t.shortcode}" />`);return e(w,{class:"convo",get children(){return[e(i,{children:"📢"}),e($,{class:"content",ml:10,flexGrow:4,get children(){return[(()=>{const t=T.cloneNode(!0);return t.innerHTML=o,t})(),e(w,{get children(){return e(S,{get each(){return r.reactions},children:t=>e(M,{p:"1em",get children(){const u=D.cloneNode(!0);return R(s=>{const h=t.static_url,f=t.name;return h!==s._v$&&C(u,"src",s._v$=h),f!==s._v$2&&C(u,"alt",s._v$2=f),s},{_v$:void 0,_v$2:void 0}),u}})})}})]}})]}})}})}})}})}}),e($,{m:"3em"})]}})]}})};export{F as AnnouncementsPage,F as default};
