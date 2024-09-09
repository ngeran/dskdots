/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/
import{offscreenConfig as e}from"./offscrenUtil.js";let t;const n=new URLSearchParams(window.location.search),r=n.get("env")||"prod",i=n.get("rrv")||"false",s="iframe#user-subscription-iframe";chrome.runtime.onMessage.addListener((async function(n){if("offscreen"!==n.target)return!1;switch(n.main_op){case"getUserSubscriptions":!function(e){if(!window.document.querySelector(s)&&e.cdnURL){const n=window.document;if(e.isCDNSignInEnabled){const n=new URL(e.signInURL);t=`${n}?main_op=fus`}else t=`${e.cdnURL}#/susi/fetchUserSubscription`;const r=n.createElement("iframe");r.setAttribute("src",t),r.setAttribute("id","user-subscription-iframe");n.getElementById("cdn-dnr-iframe").appendChild(r)}}(n);break;case"getFileBuffer":const a=await fetch(n.fileBufferBlob),o=await a.blob(),c=await new Response(o).arrayBuffer();!function(t){const n=window.document.getElementById("ajs-worker-iframe"),i=e[r].acrobat_viewer_origin;n&&n.contentWindow.postMessage(t,i)}({main_op:"getFileBuffer",tabId:n.tabId,fileInfo:{fileBuffer:c,docLastOpenState:n.docLastOpenState}});break;case"closeIframeOfUserSubscription":i=s,window.document.querySelector(i).remove();break;default:return console.warn(`Unexpected message type received: '${n.main_op}'.`),!1}var i})),window.addEventListener("message",(function(e){if(e.origin!==new URL(t).origin)return;const n=e.data;"lastUserGuid"===n.type&&(n.main_op="updateSignInStatus",delete n.type);switch(n?.main_op){case"userSubscriptions":case"updateSignInStatus":chrome.runtime.sendMessage({...n,target:"background",tab:{id:""}});break;case"closeOffscreenDocument":chrome.runtime.sendMessage({main_op:"closeOffscreenDocument",target:"background",tab:{id:""}})}})),window.onload=()=>{"true"===i&&function(){const n=window.document;t=e[r].ajs_worker_uri;const i=n.createElement("iframe");i.setAttribute("src",t),i.setAttribute("id","ajs-worker-iframe"),n.getElementById("cdn-dnr-iframe").appendChild(i)}()};