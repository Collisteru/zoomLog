import React from "react";
import axios from "axios";

/**
 * Fetches events from the server API.
 * @returns {Promise<Array>} Resolves to an array of event objects.
 */
export async function fetchRecordings() {
  try {
    const response = await axios.get("http://localhost:5000/api/recordings");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recordings:", error);
    return [];
  }
}

export function FetchRecordingsButton() {
  const handleClick = async () => {
    console.log("Fetching recordings...");
    const recordings = await fetchRecordings();
    console.log(recordings);
  };

  return <button onClick={handleClick}>Get Recordings</button>;
}
