// ==UserScript==
// @name         Open All Folders
// @namespace    http://vmix.dev/
// @version      1.0
// @description  Add "Open All Folders" button on OWA for Tampermonkey.
// @author       vmi@nifty.com
// @match        https://outlook.office.com/mail/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const newMessageLocation = '//span[text()="新しいメッセージ"]';

  function __oaf_openAllFolders(retries = 0) {
    let opened = 0;
    let closedList = document.querySelectorAll('i[data-icon-name="ChevronRightMed"]');
    closedList.forEach(elem => {
      let tree = elem.parentElement.parentElement.parentElement;
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
  };

  function __oaf_clickOpenAllFoldersButton() {
    __oaf_openAllFolders();
  }

  function __oaf_addOpenAllFoldersButton() {
    const r = document.evaluate(newMessageLocation, document.body, null, 9, null);
    const nm4 = r.singleNodeValue; // span
    const nm3 = nm4.parentElement; // span
    const nm2 = nm3.parentElement; // span
    const nm1 = nm2.parentElement; // button
    const div = nm1.parentElement; // div
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
  };

  window.addEventListener('load', __oaf_addOpenAllFoldersButton, false);
})();
