'use strict';

function setStatus(message) {
  document.getElementById('status').innerHTML = message;
}

function postXMLData(data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/upload`);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/xml');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        const json = JSON.parse(xhr.responseText);
        resolve(json);
      } else {
        reject(new Error(`XHR failed: "${xhr.status}: ${xhr.statusText}"`));
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(data);
  });
}

function postFileData(data, filename) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/convert?filename=${encodeURIComponent(filename)}`);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(`XHR failed: "${xhr.status}: ${xhr.statusText}"`));
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(data);
  });
}

function handleFileData(data, filename) {
  setStatus('Sending to ScienceBeam...');
  const getResponseToFile = postFileData(data, filename);
  getResponseToFile.then((responseData) => {
    setStatus('Sending to XML to Libero Editor...');
    postXMLData(responseData).then((json) => {
      const link = `<a href="http://editor.localhost:4000/?articleId=${json.articleId}" target="_blank">View the article here</a>`;
      setStatus(link);
    }).catch( (reason) => {
      setStatus(`Failed to send file to Libero Editor: ${reason}`);
    });
  }).catch((reason) => {
    setStatus(`Failed to process PDF in ScienceBeam: ${reason}`);
  });
}

function handleUpload() {
  const file = document.getElementById("filePicker").files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    handleFileData(e.currentTarget.result, file.name);
  };

  reader.readAsArrayBuffer(file);
}

window.onload = () => {
  const fileUploader = document.getElementById("filePicker");
  if (fileUploader !== undefined) {
    fileUploader.addEventListener("change", handleUpload, false);
  }
}

