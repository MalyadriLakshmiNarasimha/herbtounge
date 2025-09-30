"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void
  acceptedFormats?: string
}

export function FileUploadZone({ onFileUpload, acceptedFormats = ".csv,.json" }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        setUploadedFile(file)
        onFileUpload(file)
      }
    },
    [onFileUpload],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        setUploadedFile(file)
        onFileUpload(file)
      }
    },
    [onFileUpload],
  )

  const removeFile = () => {
    setUploadedFile(null)
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : uploadedFile
                ? "border-success bg-success/5"
                : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!uploadedFile ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm font-medium">Drag and drop sensor data file</p>
              <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
              <p className="mt-2 text-xs text-muted-foreground">Supports CSV, JSON formats</p>
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                accept={acceptedFormats}
                onChange={handleChange}
              />
            </>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
