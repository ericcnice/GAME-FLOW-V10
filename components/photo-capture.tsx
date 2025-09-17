"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"

interface PhotoCaptureProps {
  onPhotoCapture: (photoUrl: string) => void
  initialPhotoUrl?: string
}

export function PhotoCapture({ onPhotoCapture, initialPhotoUrl }: PhotoCaptureProps) {
  const [mode, setMode] = useState<"none" | "camera" | "upload">("none")
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialPhotoUrl)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Iniciar a câmera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setMode("camera")
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error)
      alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.")
    }
  }

  // Parar a câmera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setMode("none")
  }

  // Tirar foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const photo = canvas.toDataURL("image/jpeg")
        setPhotoUrl(photo)
        onPhotoCapture(photo)
        stopCamera()
      }
    }
  }

  // Upload de foto
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoUrl(result)
        onPhotoCapture(result)
      }
      reader.readAsDataURL(file)
      setMode("none")
    }
  }

  // Remover foto
  const removePhoto = () => {
    setPhotoUrl(undefined)
    onPhotoCapture("/placeholder.svg?height=150&width=150")
  }

  // Limpar recursos ao desmontar o componente
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="space-y-4">
      {mode === "camera" ? (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-input">
            <video ref={videoRef} autoPlay playsInline className="w-full h-[300px] object-cover" />
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={capturePhoto} type="button">
              Tirar Foto
            </Button>
            <Button onClick={stopCamera} variant="outline" type="button">
              Cancelar
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : photoUrl ? (
        <div className="space-y-4">
          <div className="relative w-full flex justify-center">
            <img
              src={photoUrl || "/placeholder.svg"}
              alt="Foto do jogador"
              className="h-[200px] w-[200px] object-cover rounded-full border border-input"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 rounded-full"
              onClick={removePhoto}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={() => setMode("upload")} variant="outline" type="button">
              <Upload className="h-4 w-4 mr-2" />
              Trocar Foto
            </Button>
            <Button onClick={startCamera} variant="outline" type="button">
              <Camera className="h-4 w-4 mr-2" />
              Nova Foto
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src="/placeholder.svg?height=150&width=150"
              alt="Foto do jogador"
              className="h-[200px] w-[200px] object-cover rounded-full border border-input"
            />
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={startCamera} type="button">
              <Camera className="h-4 w-4 mr-2" />
              Tirar Foto
            </Button>
            <Button onClick={() => setMode("upload")} variant="outline" type="button">
              <Upload className="h-4 w-4 mr-2" />
              Upload de Foto
            </Button>
          </div>
        </div>
      )}

      {mode === "upload" && (
        <div className="mt-2">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="photo-upload" />
          <label htmlFor="photo-upload" className="block w-full">
            <Button className="w-full" variant="outline" type="button" asChild>
              <span>Selecionar Arquivo</span>
            </Button>
          </label>
        </div>
      )}
    </div>
  )
}
