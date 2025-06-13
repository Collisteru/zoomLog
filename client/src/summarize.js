export const handleSummarize = async (transcript) => {
  if (!transcript) return ""; // explicitly return empty string
  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcription: transcript }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.summary;
    } else {
      console.error("Error summarizing transcript:", data.error);
      return ""; // return fallback on error
    }
  } catch (error) {
    console.error("Error:", error);
    return ""; // return fallback on exception
  }
};
