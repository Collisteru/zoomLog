// zoomJwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 20 minute expiration
const EXPIRATION = 20 * 60; // seconds

export function generateZoomJwt() {
  const payload = {
    iss: process.env.ZOOM_ISSUER,
    exp: Math.floor(Date.now() / 1000) + EXPIRATION,
  };
  // Sign with your API Secret
  return jwt.sign(payload, process.env.ZOOM_SECRET, { algorithm: "HS256" });
}
