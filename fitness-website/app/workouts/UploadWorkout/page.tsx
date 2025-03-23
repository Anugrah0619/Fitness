"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadWorkout() {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", videoFile);
    try {
      // Adjust URL if needed – your FastAPI endpoint for analyzing video
      const res = await fetch("http://localhost:8000/analyze-video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setFeedback(["No feedback returned."]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFeedback(["Error analyzing video. Please try again."]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="border-primary/20 border-2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Upload Recorded Workout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">
            If you’re not comfortable with a live workout, you can upload a recorded
            session instead.
          </p>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block"
          />
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleUpload}
              disabled={uploading || !videoFile}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => router.push("/workouts")}
              className="px-8 py-4 text-lg"
            >
              Cancel
            </Button>
          </div>
          {feedback.length > 0 && (
            <div className="space-y-2">
              {feedback.map((msg, idx) => (
                <p key={idx} className="p-2 bg-gray-100 rounded">
                  {msg}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
