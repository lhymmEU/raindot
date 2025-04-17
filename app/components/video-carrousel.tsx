"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { YouTubeEmbed } from "@next/third-parties/google";

import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
}

interface VideoCarouselProps {
  videos?: Video[];
}

export default function VideoCarousel({
  videos = defaultVideos,
}: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full flex justify-center items-center py-4 border-b border-black">
      <div className="max-w-3xl w-full">
        <YouTubeEmbed videoid={videos[currentIndex].id} params="rel=0" />
        <div className="flex justify-center mt-4 space-x-2">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setCurrentIndex(index)}
              className="w-3 h-3 rounded-full border border-black"
              style={{
                backgroundColor: index === currentIndex ? "black" : "transparent",
              }}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const defaultVideos: Video[] = [
  {
    id: "ogfYd705cRs",
    title: "Next.js 13 Demo",
  },
  {
    id: "KagTlWEUYMQ",
    title: "Vercel AI SDK Introduction",
  },
  {
    id: "jCGbHb-2B2g",
    title: "Building with Server Components",
  },
  {
    id: "QcUZ0hnkk7I",
    title: "Next.js 14 Release",
  },
];
