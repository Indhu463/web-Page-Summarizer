const output = document.getElementById("summary");
document.getElementById("Summerize").addEventListener("click", async () => {
  console.log("button clicked");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: () => {
        return document.body.innerText.slice(0, 4000);
      },
    },
    (results) => {
      const pageText = results[0]?.result;
      if (pageText) {
        output.textContent = "page text length: " + pageText.length;
      } else {
        output.textContent = "cannot access pae text";
      }
    }
  );
});
