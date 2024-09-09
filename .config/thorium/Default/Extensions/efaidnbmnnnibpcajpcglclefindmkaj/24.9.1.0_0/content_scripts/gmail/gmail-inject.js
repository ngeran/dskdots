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
(()=>{const t=window._GM_setData;window._GM_setData=function(n){t.apply(this,arguments);try{const t=n?.Cl6csf?"Cl6csf":"a6jdv";n[t]?.[0]?.[2]&&document.dispatchEvent(new CustomEvent("acrobat-mail-data",{detail:{responseData:n[t][0][2],key:t,url:"gmSetData"}}))}catch(t){}}})(),function(){const t=XMLHttpRequest.prototype,n=t.send;t.send=function(){return this.addEventListener("load",(function(){const t=this.responseURL;if(t&&t.startsWith("https://mail.google.com/sync/u/")&&(-1!==t.indexOf("/fd")||-1!==t.indexOf("/i/s")||-1!==t.indexOf("/i/bv"))){const n=this.response;document.dispatchEvent(new CustomEvent("acrobat-mail-data",{detail:{responseData:n,url:t}}))}})),n.apply(this,arguments)}}();