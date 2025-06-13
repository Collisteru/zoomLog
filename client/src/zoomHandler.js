// example: fetch meeting recordings
import axios from "axios";
import { generateZoomJwt } from "./zoomJwt";
import dotenv from "dotenv";
dotenv.config();

async function getMeetingRecordings(meetingId) {
  const token = generateZoomJwt();
  const res = await axios.get(
    `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

async function handleMeetingEnded(meeting) {
  const meetingId = meeting.id;
  // 1. Fetch recordings
  const recRes = await axios.get(
    `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
    {
      headers: { Authorization: `Bearer ${ZOOM_JWT}` },
    }
  );
  // 2. If Zoom auto-transcription enabled:
  const transcriptFile = recRes.data.recording_files.find(
    (f) => f.file_type === "TRANSCRIPT"
  );
  const transcriptUrl =
    transcriptFile.download_url + `?access_token=${ZOOM_JWT}`;
  const transcriptText = await axios.get(transcriptUrl).then((r) => r.data);
  // 3. Otherwise, download audio and send to a speech-to-text service
  //    e.g. OpenAI Whisper API
  // const audioUrl = recRes.data.recording_files.find(...).download_url;
  // const transcriptText = await transcribeWithWhisper(audioUrl);

  // 4. Extract summary/actions via NLP or keyword parsing
  const summary = await summarizeMeeting(transcriptText);

  // 5. Store into your database
  await prisma.event.update({
    where: { id: meetingId },
    data: { notes: transcriptText, next_steps: summary },
  });
}

export function zoomHandler() {}
