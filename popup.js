document.getElementById("Summerize").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // this means "hey chrome, run the fucntion getPageText() inside the webpage(where content.js usually runs)"
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getPageText,
    },
    (results) => {
      const pageText = results[0].result;
      document.getElementById("summary").textContent =
        "page text length: " + pageText.lenght;
    }
  );
});
