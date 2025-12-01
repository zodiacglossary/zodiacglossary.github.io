import"./index.Cd_vQiNd.js";var u={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function p(){if(x)return i;x=1;var r=Symbol.for("react.transitional.element"),l=Symbol.for("react.fragment");function o(R,t,n){var s=null;if(n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:r,type:R,key:s,ref:t!==void 0?t:null,props:n}}return i.Fragment=l,i.jsx=o,i.jsxs=o,i}var d;function _(){return d||(d=1,u.exports=p()),u.exports}var e=_();function j({lemma:r}){return!r||!r.lemma_id||!(r.original||r.transliteration)||!r.primary_meaning?e.jsx(e.Fragment,{children:`(unknown lemma ${r?.lemma_id})`}):e.jsxs(e.Fragment,{children:[e.jsxs("a",{href:`/lemma/${r.lemma_id}`,children:["〈",r.original||"—","〉"]})," ",e.jsx("span",{className:"transliteration",children:r.transliteration})," ‘",r.primary_meaning,"’"]})}export{j as L,e as j};
