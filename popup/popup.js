document.getElementById("scanBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "scanPage" }, (data) => {
    const type = document.getElementById("schemaType").value;
    const schema = SchemaTemplates[type](data[type] || DummyData);
    document.getElementById("output").textContent = JSON.stringify(schema, null, 2);
  });
});

document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(document.getElementById("output").textContent);
  alert("JSON-LD copied!");
});
