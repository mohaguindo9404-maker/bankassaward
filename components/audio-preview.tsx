"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPreviewProps {
  audioUrl?: string
  songTitle?: string
  artistName?: string
}

export function AudioPreview({ audioUrl, songTitle, artistName }: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(30) // Default 30 seconds
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      
      // Update time every 100ms
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
          
          // Stop at 30 seconds
          if (audioRef.current.currentTime >= 30) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setIsPlaying(false)
            setCurrentTime(0)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
          }
        }
      }, 100)
    }
    setIsPlaying(!isPlaying)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      // Set duration to min(30, actual duration)
      setDuration(Math.min(30, audioRef.current.duration))
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!audioUrl) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }}
        className="hidden"
      />
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={togglePlayPause}
          className="flex items-center gap-2 bg-background/80"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium truncate">
              {songTitle || "Aperçu audio"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground min-w-[80px] text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          {artistName && (
            <p className="text-xs text-muted-foreground">{artistName}</p>
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        🎵 Aperçu de 30 secondes
      </p>
    </div>
  )
}
