// utils/poseUtils.ts
import { Pose } from '@mediapipe/pose';

// Initialize MediaPipe Pose instance
const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

// Configure pose detection settings
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

interface PoseLandmarks {
  [key: string]: Landmark;
  leftHip: Landmark;
  leftKnee: Landmark;
  leftAnkle: Landmark;
  rightHip: Landmark;
  rightKnee: Landmark;
  rightAnkle: Landmark;
}

// Process video frame and extract landmarks
export async function getLandmarks(videoElement: HTMLVideoElement): Promise<PoseLandmarks | null> {
  try {
    const results = await pose.send({ image: videoElement });
    if (!results.poseLandmarks) return null;

    return {
      leftHip: results.poseLandmarks[23],
      leftKnee: results.poseLandmarks[25],
      leftAnkle: results.poseLandmarks[27],
      rightHip: results.poseLandmarks[24],
      rightKnee: results.poseLandmarks[26],
      rightAnkle: results.poseLandmarks[28]
    };
  } catch (error) {
    console.error('Error processing pose:', error);
    return null;
  }
}

// Calculate angle between three points
export function findAngle(
  a: Landmark,
  b: Landmark,
  c: Landmark
): number {
  // Calculate vectors
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  // Calculate dot product and magnitudes
  const dotProduct = ba.x * bc.x + ba.y * bc.y;
  const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2);
  const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2);

  // Avoid division by zero
  if (magBA === 0 || magBC === 0) return 0;

  // Calculate angle in radians and convert to degrees
  const cosineTheta = Math.max(-1, Math.min(1, dotProduct / (magBA * magBC)));
  const angleRad = Math.acos(cosineTheta);
  return (angleRad * 180) / Math.PI;
}