"use client"

import { useState } from "react"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { AudioUpload } from "@/components/audio-upload"
import type { Candidate } from "@/lib/categories"

interface CandidateEditorProps {
  candidate: Candidate
  onSave: (candidate: Candidate) => void
  onCancel: () => void
}

export function CandidateEditor({ candidate, onSave, onCancel }: CandidateEditorProps) {
  const [editedCandidate, setEditedCandidate] = useState<Candidate>(candidate)

  const handleSave = () => {
    onSave(editedCandidate)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nom complet</Label>
          <Input
            value={editedCandidate.name}
            onChange={(e) => setEditedCandidate({ ...editedCandidate, name: e.target.value })}
            placeholder="Nom du candidat"
          />
        </div>
        <div>
          <Label>Alias/Nom d'artiste</Label>
          <Input
            value={editedCandidate.alias || ""}
            onChange={(e) => setEditedCandidate({ ...editedCandidate, alias: e.target.value })}
            placeholder="Nom d'artiste ou alias"
          />
        </div>
      </div>

      <div>
        <Label>Biographie</Label>
        <Textarea
          value={editedCandidate.bio}
          onChange={(e) => setEditedCandidate({ ...editedCandidate, bio: e.target.value })}
          rows={3}
          placeholder="Biographie du candidat..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre de chansons</Label>
          <Input
            type="number"
            value={editedCandidate.songCount || ""}
            onChange={(e) => setEditedCandidate({ ...editedCandidate, songCount: parseInt(e.target.value) || undefined })}
            placeholder="Ex: 12"
          />
        </div>
        <div>
          <Label>Chanson candidate</Label>
          <div className="space-y-2">
            <Input
              value={editedCandidate.candidateSong || ""}
              onChange={(e) => setEditedCandidate({ ...editedCandidate, candidateSong: e.target.value })}
              placeholder="Titre de la chanson candidate"
            />
            <AudioUpload
              currentAudio={editedCandidate.audioFile}
              onAudioChange={(audioFile) => setEditedCandidate({ ...editedCandidate, audioFile })}
              label="Fichier audio (30 secondes d'aperçu)"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Réalisations (une par ligne)</Label>
        <Textarea
          value={editedCandidate.achievements?.join("\n") || ""}
          onChange={(e) => setEditedCandidate({
            ...editedCandidate,
            achievements: e.target.value.split("\n").filter(a => a.trim())
          })}
          rows={4}
          placeholder="Réalisation 1&#10;Réalisation 2&#10;..."
        />
      </div>

      <div>
        <ImageUpload
          currentImage={editedCandidate.image}
          onImageChange={(image) => setEditedCandidate({ ...editedCandidate, image })}
          label="Photo du candidat"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>
    </div>
  )
}
