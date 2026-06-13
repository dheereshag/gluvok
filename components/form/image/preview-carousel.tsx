"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getDisplayName, splitFileName } from "@/lib/utils"

interface ImagePreviewCarouselProps {
  images: string[]
  fileNames?: string[]
  disabled?: boolean
  onRemove: (index: number) => void
}

export function ImagePreviewCarousel({
  images,
  fileNames,
  disabled,
  onRemove,
}: ImagePreviewCarouselProps) {
  return (
    <div className="flex justify-center w-full px-2 sm:px-4 overflow-hidden">
      <Carousel opts={{ align: "start" }} className="w-full relative px-8 sm:px-10 max-w-[220px] sm:max-w-[260px]">
        <CarouselContent>
          {images.map((src, index) => {
            const imageSrc =
              src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/")
                ? src
                : `/${src}`
            const displayName = getDisplayName(src, fileNames?.[index], index)
            return (
              <CarouselItem key={index} className="basis-full min-w-0 flex flex-col items-center justify-center">
                <div className="p-1 w-full">
                  {/* Image container — fixed aspect ratio keeps fill from overflowing */}
                  <div className="relative aspect-[4/3] w-full rounded-xl border border-muted-foreground/15 bg-card overflow-hidden shadow-sm group">
                    <Image
                      src={imageSrc}
                      alt={`Preview ${index + 1}`}
                      fill
                      sizes="(max-width: 384px) 100vw, 384px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono bg-background/80 text-foreground px-1.5 py-0.5 rounded shadow-xs border">
                        {index + 1} / {images.length}
                      </span>
                      {!disabled && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 rounded-full shadow-md active:scale-95 transition-transform"
                          onClick={() => onRemove(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Filename label */}
                  <div
                    title={displayName}
                    className="mt-1.5 flex justify-center text-[10px] font-mono text-muted-foreground w-full px-1 overflow-hidden whitespace-nowrap"
                  >
                    <span className="truncate">{splitFileName(displayName)[0]}</span>
                    <span className="shrink-0">{splitFileName(displayName)[1]}</span>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious
              type="button"
              className="left-0 h-8 w-8 rounded-full border bg-background/80 shadow hover:bg-background active:scale-95 transition-transform"
            />
            <CarouselNext
              type="button"
              className="right-0 h-8 w-8 rounded-full border bg-background/80 shadow hover:bg-background active:scale-95 transition-transform"
            />
          </>
        )}
      </Carousel>
    </div>
  )
}
