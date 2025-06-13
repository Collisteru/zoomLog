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
    console.log("Back in client now.", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return ""; // return fallback on exception
  }
};
