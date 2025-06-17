import * as React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

type CarouselDemoProps = {
  images: string[];
};

export function CarouselDemo({ images }: CarouselDemoProps) {
  return (
    <div className="w-full flex justify-center items-center">
      <Carousel className="w-full max-w-sm relative">
        {" "}
        {/* Smaller max width */}
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="aspect-[4/5] p-0 relative">
                    {" "}
                    {/* Slightly narrower than square */}
                    <img
                      src={src}
                      alt={`Carousel image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 text-black p-1 rounded-full shadow-md hover:bg-white" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 text-black p-1 rounded-full shadow-md hover:bg-white" />
      </Carousel>
    </div>
  );
}
