// ==UserScript==
// @name         Open All Folders
// @namespace    http://vmix.dev/
// @version      1.1
// @description  Add "Open All Folders" button on OWA for Tampermonkey.
// @author       vmi@nifty.com
// @match        https://outlook.office.com/mail/*
// @grant        none
// ==/UserScript==

// This is free and unencumbered software released into the public domain.
//
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// For more information, please refer to <https://unlicense.org>

(function() {
  'use strict';

  const newMessageLocation = '//span[text()="新しいメッセージ"]';

  function __oaf_openAllFolders(retries = 0) {
    let opened = 0;
    let closedList = document.querySelectorAll('i[data-icon-name="ChevronRightMed"]');
    closedList.forEach(elem => {
      let tree = elem.parentElement.parentElement.parentElement.parentElement;
      let title = tree.title;
      if (title && !title.startsWith("Personal Archive - ")) {
        elem.click();
        opened++;
        console.log(`Open: ${title}`);
      }
    });
    if (retries < 50 && opened > 0) {
      retries++;
      console.log(`Retries: ${retries}`);
      setTimeout(__oaf_openAllFolders, 100, retries);
    } else {
      console.log('Done.');
    }
  }

  function __oaf_clickOpenAllFoldersButton() {
    __oaf_openAllFolders();
  }

  function __oaf_addOpenAllFoldersButtonInternal() {
    var r = null;
    try {
      r = document.evaluate(newMessageLocation, document.body, null, 9, null);
    } catch(e) {
      return false;
    }
    const nm4 = r.singleNodeValue; // span
    if (!nm4) return false;
    const nm3 = nm4.parentElement; // span
    if (!nm3) return false;
    const nm2 = nm3.parentElement; // span
    if (!nm2) return false;
    const nm1 = nm2.parentElement; // button
    if (!nm1) return false;
    const div = nm1.parentElement; // div
    if (!div) return false;
    const b1 = document.createElement('button');
    const b2 = document.createElement('span');
    const b3 = document.createElement('span');
    const b4 = document.createElement('span');
    b4.innerText = 'Open All Folders';
    b4.className = nm4.className;
    b4.addEventListener('click', __oaf_clickOpenAllFoldersButton, false);
    b3.className = nm3.className;
    b2.className = nm2.className;
    b1.className = nm1.className;
    b3.appendChild(b4);
    b2.appendChild(b3);
    b1.appendChild(b2);
    div.appendChild(b1);
    return true;
  }

  var retries = 0;
  const max_retries = 300;

  function __oaf_addOpenAllFoldersButton() {
    if (!__oaf_addOpenAllFoldersButtonInternal() && retries <= max_retries) {
      retries++;
      console.log(`Failed to add "Open All Folders" button. Retry: ${retries}/${max_retries}`);
      window.setTimeout(__oaf_addOpenAllFoldersButton, 1000);
    }
  }

  window.addEventListener('load', __oaf_addOpenAllFoldersButton, false);
})();
