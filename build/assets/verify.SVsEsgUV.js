import{a as u,e as p,o as f,bU as g,g as t,p as r,w as d,i as o,t as l,j as n,l as y,q as v,_ as h}from"./index.7OFNPsHl.js";import{_ as k}from"./SimpleLayout.SP_Vp0US.js";const w={class:"container py-5 my-5 text-center"},B={__name:"verify",setup(x){const m=u().params.token,_=p({type:"",messages:""}),c=v(()=>h(()=>import("./ServerMessage.I5ol-gtz.js"),__vite__mapDeps([0,1,2])));f(()=>{i()});async function i(){var s=new FormData;s.append("token",m),await axios.post("/api/user/verify",s).then(e=>{if(e.data.status_code==200)toast.success(e.data.msg),g.push("/");else{try{form.server_messages.type="error",form.server_messages.messages=JSON.parse(e.data.msg)}catch{form.server_messages.type="error",form.server_messages.messages=e.data.msg}form.is_submitting=!1}})}return(s,e)=>{const a=k;return t(),r(a,null,{default:d(()=>[o("div",w,[o("h1",null,l(s.$t("Verification Page")),1),n(_).messages!=""?(t(),r(n(c),{key:0})):y("",!0)])]),_:1})}}};export{B as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/ServerMessage.I5ol-gtz.js","assets/index.7OFNPsHl.js","assets/index.1t-AB2n6.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
