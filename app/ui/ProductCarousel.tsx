import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
export function ProductCarousel({ images }: { images: string[] }) {
  return (
    <Carousel className="w-full max-h-sm max-w-xs  mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square max-h-xs overflow-hidden items-center justify-center p-6">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    objectFit="cover"
                    height={300}
                    width={300}
                  />
                  {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md">
        <span className="text-gray-600">&lt;</span>
      </CarouselPrevious>
      <CarouselNext className="absolute right-0 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md">
        <span className="text-gray-600">&gt;</span>
      </CarouselNext>
    </Carousel>
  );
}
