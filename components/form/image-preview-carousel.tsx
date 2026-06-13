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

interface ImagePreviewCarouselProps {
  images: string[]
  disabled?: boolean
  onRemove: (index: number) => void
}

export function ImagePreviewCarousel({
  images,
  disabled,
  onRemove,
}: ImagePreviewCarouselProps) {
  return (
    <div className="flex justify-center w-full px-8">
      <Carousel opts={{ align: "start" }} className="w-full relative px-10 max-w-xs sm:max-w-sm">
        <CarouselContent>
          {images.map((src, index) => {
            const imageSrc =
              src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/")
                ? src
                : `/${src}`
            return (
              <CarouselItem key={index} className="basis-full flex items-center justify-center">
                <div className="p-1 w-full">
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
