"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db, rtdb } from "@/firebase-config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, set } from "firebase/database";

export default function LiveWorkout() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [counts, setCounts] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);

  // Start camera and begin analysis
  const startWorkout = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setPermissionGranted(true);
        setAnalyzing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setFeedback(["Camera access required. Please enable permissions."]);
    }
  };

  // Stop camera and analysis; update Firebase and navigate back
  const endWorkout = async () => {
    // Save workout data in Firebase
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          workouts: arrayUnion({
            date: new Date().toISOString(),
            type: "squats",
            correct: counts.correct,
            incorrect: counts.incorrect,
          }),
        });
        await set(ref(rtdb, `workoutStats/${user.uid}`), {
          totalCorrect: counts.correct,
          totalIncorrect: counts.incorrect,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving workout data:", error);
      }
    }
    setAnalyzing(false);
    if (analysisInterval.current) clearInterval(analysisInterval.current);
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    router.push("/workouts");
  };

  // Capture a frame from the video and send it to your Python API
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Convert canvas to blob (JPEG)
    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");
        try {
          const res = await fetch("http://localhost:8000/analyze-squat", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.hip_angle) {
            // Update counts based on feedback
            if (data.feedback && data.feedback[0].toLowerCase().includes("good"))
              setCounts((prev) => ({ ...prev, correct: prev.correct + 1 }));
            else setCounts((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
            setFeedback(data.feedback);
          } else if (data.error) {
            setFeedback([data.error]);
          }
        } catch (error) {
          console.error("Error analyzing frame:", error);
        }
      }
    }, "image/jpeg", 0.8);
  };

  // Set up interval for analysis when 'analyzing' is true
  useEffect(() => {
    if (analyzing) {
      analysisInterval.current = setInterval(captureAndAnalyze, 2000); // every 2 seconds
    }
    return () => {
      if (analysisInterval.current) clearInterval(analysisInterval.current);
    };
  }, [analyzing]);

  return (
    <div className="container mx-auto p-4">
      <Card className="border-primary/20 border-2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Live Squat Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded-lg text-white">
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-green-400">{counts.correct}</p>
                  <p className="text-sm">Correct Squats</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{counts.incorrect}</p>
                  <p className="text-sm">Incorrect Form</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {feedback.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.toLowerCase().includes("good")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            {!permissionGranted ? (
              <Button
                size="lg"
                onClick={startWorkout}
                className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg"
              >
                Start Workout
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="lg"
                onClick={endWorkout}
                className="px-8 py-4 text-lg"
              >
                End Workout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


