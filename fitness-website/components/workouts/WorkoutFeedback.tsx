"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEffect, useState } from "react"

export default function WorkoutFeedback({ messages }: { messages: string[] }) {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  useEffect(() => {
    if (messages.length > 0) {
      setVisibleMessages(messages);
    }
  }, [messages]);

  return (
    <div className="space-y-2">
      {visibleMessages.map((message, index) => (
        <Alert 
          key={`${message}-${index}`}
          variant={message.includes('Good') ? 'default' : 'destructive'}
          className="animate-fade-in"
        >
          <AlertDescription className="flex items-center gap-2">
            <span>{message}</span>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}