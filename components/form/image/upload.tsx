"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { Dropzone, DropzoneEmptyState } from "@/components/kibo-ui/dropzone"
import { ImagePreviewCarousel } from "@/components/form/image/preview-carousel"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/lib/store"
import { Role } from "@/lib/constants/enums"

interface ImageUploadProps {
  id?: string
  value?: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
  const [fileNameMap, setFileNameMap] = useState<Record<string, string>>({})
  const user = useAuthStore((state) => state.user)
  const factoryId = user?.profile?.factory_id ?? user?.customer?.factory_id
  const isSuperAdmin = user?.role === Role.SUPER_ADMIN
  const factoryPrefix = isSuperAdmin ? "global" : String(factoryId ?? "unknown")

  const handleDrop = async (acceptedFiles: File[]) => {
    toast.loading("Uploading images...", { id: "upload-progress" })
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const fileExt = file.name.split(".").pop()
        const uniqueId = Math.random().toString(36).substring(2, 15) + "-" + Date.now()
        const filePath = `f_${factoryPrefix}/weighments/${uniqueId}.${fileExt}`

        const { error } = await supabase.storage
          .from("gluvok")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (error) {
          throw error
        }

        const { data } = supabase.storage
          .from("gluvok")
          .getPublicUrl(filePath)

        return {
          url: data.publicUrl,
          name: file.name,
        }
      })

      const results = await Promise.all(uploadPromises)

      setFileNameMap((prev) => {
        const next = { ...prev }
        results.forEach((res) => {
          next[res.url] = res.name
        })
        return next
      })

      const newUrls = results.map((res) => res.url)
      onChange([...value, ...newUrls])
      toast.success(`Successfully uploaded ${acceptedFiles.length} image(s)`, { id: "upload-progress" })
    } catch (err: unknown) {
      console.error("Error uploading files:", err)
      const message = err instanceof Error ? err.message : "Failed to upload files to storage"
      toast.error(message, { id: "upload-progress" })
    }
  }

  const handleRemove = async (indexToRemove: number) => {
    const urlToDelete = value[indexToRemove]
    onChange(value.filter((_, i) => i !== indexToRemove))

    if (urlToDelete.includes("/public/gluvok/")) {
      const filePath = urlToDelete.split("/public/gluvok/")[1]
      const { error } = await supabase.storage
        .from("gluvok")
        .remove([filePath])

      if (error) {
        console.error("Failed to delete image from Supabase storage:", error.message)
        toast.error("Failed to delete image from storage server")
      } else {
        toast.success("Image deleted from storage")
      }
    }
  }

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <ImagePreviewCarousel
          images={value}
          fileNames={value.map((v) => fileNameMap[v])}
          disabled={disabled}
          onRemove={handleRemove}
        />
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
