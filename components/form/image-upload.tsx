"use client"

import { Upload } from "lucide-react"
import { toast } from "sonner"
import { Dropzone, DropzoneEmptyState } from "@/components/kibo-ui/dropzone"
import { ImagePreviewCarousel } from "@/components/form/image-preview-carousel"

interface ImageUploadProps {
  id?: string
  value?: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
  const handleDrop = (acceptedFiles: File[]) => {
    const promises = acceptedFiles.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (typeof e.target?.result === "string") {
              resolve(e.target.result)
            } else {
              reject(new Error("Failed to read file"))
            }
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
    )

    Promise.all(promises)
      .then((base64Strings) => {
        onChange([...value, ...base64Strings])
        toast.success(`Successfully uploaded ${acceptedFiles.length} image(s)`)
      })
      .catch((err) => {
        console.error("Error reading files:", err)
        toast.error("Failed to read uploaded files")
      })
  }

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, i) => i !== indexToRemove))
  }

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <ImagePreviewCarousel images={value} disabled={disabled} onRemove={handleRemove} />
      )}

      {!disabled && (
        <Dropzone
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          maxFiles={10}
          maxSize={1024 * 1024 * 10}
          onDrop={handleDrop}
          onError={(err) => {
            console.error(err)
            toast.error(err.message || "File upload failed")
          }}
          className="border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/10 transition-all py-6 rounded-xl"
        >
          <DropzoneEmptyState className="py-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1">
              <Upload className="h-4 w-4" />
            </div>
            <p className="font-semibold text-xs text-foreground">Upload weighment images</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Drag &amp; drop or click to browse (Max 10MB each)
            </p>
          </DropzoneEmptyState>
        </Dropzone>
      )}
    </div>
  )
}
