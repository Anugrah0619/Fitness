import { findAngle, getLandmarks } from './poseUtils'

interface ProcessResult {
  isCorrect: boolean
  feedback: string[]
}

export class PoseProcessor {
  private state = {
    squatCount: 0,
    incorrectCount: 0,
    lastState: '',
    hipThresholds: { min: 80, max: 100 },
    kneeThresholds: { min: 90, max: 120 }
  }

  async process(imageData: ImageData): Promise<ProcessResult | null> {
    const landmarks = await getLandmarks(imageData)
    if (!landmarks) return null

    const hipAngle = findAngle(landmarks.leftHip, landmarks.leftKnee, landmarks.leftAnkle)
    const kneeAngle = findAngle(landmarks.leftKnee, landmarks.leftHip, landmarks.leftAnkle)

    const feedback: string[] = []
    let isCorrect = true

    if (hipAngle < this.state.hipThresholds.min || hipAngle > this.state.hipThresholds.max) {
      feedback.push('Keep your hips aligned!')
      isCorrect = false
    }

    if (kneeAngle < this.state.kneeThresholds.min || kneeAngle > this.state.kneeThresholds.max) {
      feedback.push('Bend your knees properly!')
      isCorrect = false
    }

    if (isCorrect) {
      if (this.state.lastState === 'down') {
        this.state.squatCount++
      }
      this.state.lastState = 'up'
    } else {
      if (this.state.lastState === 'up') {
        this.state.incorrectCount++
      }
      this.state.lastState = 'down'
    }

    return {
      isCorrect,
      feedback: feedback.length > 0 ? feedback : ['Good form! Keep going!']
    }
  }
}