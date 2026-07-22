import"./index.Cd_vQiNd.js";var d={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function h(){if(x)return s;x=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function a(o,t,i){var u=null;if(i!==void 0&&(u=""+i),t.key!==void 0&&(u=""+t.key),"key"in t){i={};for(var l in t)l!=="key"&&(i[l]=t[l])}else i=t;return t=i.ref,{$$typeof:r,type:o,key:u,ref:t!==void 0?t:null,props:i}}return s.Fragment=e,s.jsx=a,s.jsxs=a,s}var c;function p(){return c||(c=1,d.exports=h()),d.exports}var n=p();const j=r=>/\p{Lu}(?!\p{Ll})/u.test(r??""),g=r=>/[0-9?]/.test(r??"");function R({lemma:r}){if(!r||!r.lemma_id||!(r.original||r.transliteration)||!r.primary_meaning)return n.jsx(n.Fragment,{children:`(unknown lemma ${r?.lemma_id})`});if(r.language_id===1){const o=j(r.original)||g(r.original);return n.jsxs(n.Fragment,{children:[n.jsxs("a",{href:`/lemma/${r.lemma_id}`,children:["〈",r.transliteration||r.original,"〉"]})," ",o&&r.transliteration&&n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"transliteration",children:r.original})," "]}),"‘",r.primary_meaning,"’"]})}const e=r.original||r.transliteration,a=r.original&&r.transliteration;return n.jsxs(n.Fragment,{children:[n.jsxs("a",{href:`/lemma/${r.lemma_id}`,children:["〈",r.original?e:n.jsx("span",{className:"transliteration",children:e}),"〉"]})," ",a&&n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"transliteration",children:r.transliteration})," "]}),"‘",r.primary_meaning,"’"]})}export{R as L,n as j};
