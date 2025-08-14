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

export function ClientLogo({ logo }: { logo: string[] }) {
  return (
    <Carousel className="mx-auto max-w-xs">
      <CarouselContent className="-ml-1">
        {logo.map((item, index) => (
          <CarouselItem key={index} className="">
            <div className="p-1">
              <Card className="w-20 h-20  items-center">
                <CardContent className="items-center mx-auto justify-center p-6">
                  <Image
                    key={item}
                    src={`/${item}`}
                    alt="Client Logo"
                    width={138}
                    height={100}
                    // className="w-24 h-24 mx-auto object-contain mx-auto my-4"
                  />
                  {/* <span className="text-2xl font-semibold">{index + 1}</span> */}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
