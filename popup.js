import { GEMINI_API_KEY } from "./config.js";
const summarizeButton = document.getElementById("Summerize");
const summaryElement = document.getElementById("summary");

summarizeButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  summaryElement.textContent = "Generating summary for you...";

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getPageText,
    },
    async (results) => {
      const pageText = results[0].result;
      if (pageText) {
        //call the Gemini API to get the summary
        try {
          const summary = await getSummaryFromGemini(pageText);
          summaryElement.textContent = summary;
        } catch (error) {
          summaryElement.textContent = "Error:" + error.message;
        }
      } else {
        summaryElement.textContent = "Could not get text from this page";
      }
    }
  );
});

//this function is injected into the webpage to get its text
function getPageText() {
  return document.body.innerText.slice(0, 8000);
}

//this function calls the Gemini API
async function getSummaryFromGemini(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            // The prompt for the AI
            text: `Summarize the following text in a few sentences:\n\n${text}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates.length > 0) {
    const summary = data.candidates[0].content.parts[0].text;
    return summary.trim();
  } else {
    return "No summary could be generated. The content might be restricted.";
  }
}
