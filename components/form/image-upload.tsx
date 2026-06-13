"use client"

import * as React from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dropzone, DropzoneEmptyState } from "@/components/kibo-ui/dropzone"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { toast } from "sonner"

interface ImageUploadProps {
  id?: string
  value?: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
  const handleDrop = (acceptedFiles: File[]) => {
    const promises = acceptedFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
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
    })

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
        <div className="flex justify-center w-full px-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full relative px-10 max-w-xs sm:max-w-sm"
          >
            <CarouselContent>
              {value.map((src, index) => {
                const imageSrc = src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/") ? src : `/${src}`
                return (
                  <CarouselItem key={index} className="basis-full flex items-center justify-center">
                    <div className="p-1 w-full">
                      <div className="relative aspect-[4/3] w-full rounded-xl border border-muted-foreground/15 bg-card overflow-hidden shadow-sm group">
                        <img
                          src={imageSrc}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-mono bg-background/80 text-foreground px-1.5 py-0.5 rounded shadow-xs border">
                            {index + 1} / {value.length}
                          </span>
                          {!disabled && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-full shadow-md active:scale-95 transition-transform"
                              onClick={() => handleRemove(index)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            {value.length > 1 && (
              <>
                <CarouselPrevious className="left-0 h-8 w-8 rounded-full border bg-background/80 shadow hover:bg-background active:scale-95 transition-transform" />
                <CarouselNext className="right-0 h-8 w-8 rounded-full border bg-background/80 shadow hover:bg-background active:scale-95 transition-transform" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {!disabled && (
        <Dropzone
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          maxFiles={10}
          maxSize={1024 * 1024 * 10} // 10MB
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
            <p className="text-[10px] text-muted-foreground mt-0.5">Drag & drop or click to browse (Max 10MB each)</p>
          </DropzoneEmptyState>
        </Dropzone>
      )}
    </div>
  )
}
