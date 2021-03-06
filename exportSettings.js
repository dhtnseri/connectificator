let ExportSettingsHandler = function() {

  let exportMenuBtn = document.getElementById('exportTriggersBtn');
  let importMenuBtn = document.getElementById('importTriggersBtn');
  let popupToggle = document.getElementById('popupClose');
  let exportPopupContent = document.getElementById('exportSettings-popup');
  let importPopupContent = document.getElementById('importSettings-popup');
  let exportPopupBtn = document.getElementById('exportSettings-copy');
  let importPopupBtn = document.getElementById('importSettings-load');
  let exportPopupValue = document.getElementById('exportSettings');
  let importPopupValue = document.getElementById('importSettings');

  function dismiss(element) {
    popupToggle.defaultOnChange = popupToggle.onchange;

    popupToggle.onchange = function() {
      element.style.display = 'none';
      // popupToggle.defaultOnChange(); hard to ensure no recursion or something
      popupToggle.onchange = popupToggle.defaultOnChange;
    };
  };

  exportMenuBtn.onclick = function() {
    // todo: dismiss the export div on close
    popupToggle.checked = true;
    exportPopupContent.style.display = 'block';
    dismiss(exportPopupContent);

    var data = {};
    data["triggers"] = window.localStorage.getItem('triggers') || "{}";
    data["options"] = window.localStorage.getItem('options') || "{}";
    data["version"] = window.localStorage.getItem('version') || 0;
    exportPopupValue.value = LZString.compressToBase64(JSON.stringify(data));

    exportPopupBtn.onclick = function() {
      exportPopupValue.select();
      document.execCommand("copy");
      exportPopupBtn.innerText = "Copied!";
    };
  };

  importMenuBtn.onclick = function() {
    popupToggle.checked = true;
    importPopupContent.style.display = 'block';
    importPopupValue.focus();
    dismiss(importPopupContent);

    importPopupBtn.onclick = function() {
      var data = JSON.parse(LZString.decompressFromBase64(importPopupValue.value));
      window.localStorage.setItem('triggers', data.triggers || '{}');
      window.localStorage.setItem('options', data.options || '{}');
      window.localStorage.setItem('version', data.version || 0);
      importPopupBtn.innerText = "Loaded!";
      location.reload(); // force reread everything. Easier than cleaning up. Running start() might initialize something twice.
    };
  };
};
let exportSettingsHandler = ExportSettingsHandler();
