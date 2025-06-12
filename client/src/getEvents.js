import React from "react";
import axios from "axios";

/**
 * Fetches events from the server API.
 * @returns {Promise<Array>} Resolves to an array of event objects.
 */
export async function getEvents() {
  try {
    const response = await axios.get("http://localhost:5000/api/events");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export function GetEventsButton() {
  const handleClick = async () => {
    const events = await getEvents();
    console.log(events);
  };

  return <button onClick={handleClick}>Get Events</button>;
}
