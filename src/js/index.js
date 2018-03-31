"use strict"

import { leftPad } from "./leftpad_es6";

const serNos = [ 6934, 23111, 23114, 1001, 211161, 'abc', 'xyz' ];

// const strSNos = serNos.map(sn => leftPad( sn, 8, '0' ) );

// console.log( strSNos );

const partEl = document.getElementById('part-list');

let strList = '';

serNos.forEach(element => {
  strList += `<li>${ leftPad(element, 8, '0') }</li>`;
});

partEl.innerHTML = strList;