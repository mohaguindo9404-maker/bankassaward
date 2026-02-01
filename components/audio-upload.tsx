"use client"

import { useState, useRef } from "react"
import { Upload, X, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioUploadProps {
  currentAudio?: string
  onAudioChange: (audioUrl: string) => void
  label?: string
}

export function AudioUpload({ currentAudio, onAudioChange, label = "Fichier audio" }: AudioUploadProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(currentAudio || null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      onAudioChange(url)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // Play only 30 seconds
      audioRef.current.currentTime = 0
      audioRef.current.play()
      
      // Stop after 30 seconds
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          setIsPlaying(false)
        }
      }, 30000)
    }
    setIsPlaying(!isPlaying)
  }

  const removeAudio = () => {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    onAudioChange("")
    setIsPlaying(false)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      {audioUrl ? (
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause (30s)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Écouter (30s)
                </>
              )}
            </Button>
            
            <span className="text-sm text-muted-foreground flex-1 truncate">
              Fichier audio chargé
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={removeAudio}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ L'aperçu est limité à 30 secondes
          </p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            
            <div>
              <p className="text-sm font-medium">Télécharger un fichier audio</p>
              <p className="text-xs text-muted-foreground">
                MP3, WAV, OGG (Max. 10MB)
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choisir un fichier
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
