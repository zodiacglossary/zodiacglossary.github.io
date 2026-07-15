import"./index.Cd_vQiNd.js";var x={exports:{}},e={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d;function p(){if(d)return e;d=1;var r=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function a(c,t,i){var o=null;if(i!==void 0&&(o=""+i),t.key!==void 0&&(o=""+t.key),"key"in t){i={};for(var u in t)u!=="key"&&(i[u]=t[u])}else i=t;return t=i.ref,{$$typeof:r,type:c,key:o,ref:t!==void 0?t:null,props:i}}return e.Fragment=s,e.jsx=a,e.jsxs=a,e}var l;function R(){return l||(l=1,x.exports=p()),x.exports}var n=R();function j({lemma:r}){if(!r||!r.lemma_id||!(r.original||r.transliteration)||!r.primary_meaning)return n.jsx(n.Fragment,{children:`(unknown lemma ${r?.lemma_id})`});const s=r.original||r.transliteration,a=r.original&&r.transliteration;return n.jsxs(n.Fragment,{children:[n.jsxs("a",{href:`/lemma/${r.lemma_id}`,children:["〈",r.original?s:n.jsx("span",{className:"transliteration",children:s}),"〉"]})," ",a&&n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"transliteration",children:r.transliteration})," "]}),"‘",r.primary_meaning,"’"]})}export{j as L,n as j};
