"use client";

import { useState, useEffect, useMemo } from "react";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Photo } from "@prisma/client";

const breakpointColumnsObj = { default: 4, 1200: 3, 800: 2, 500: 1 };

export default function HomePage() {
  const [allData, setAllData] = useState<Photo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 비동기 함수로 정의하여 순차적 처리
    const initHomePage = async () => {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        setAllData(data);
        // 데이터 세팅이 끝난 후 마운트 상태로 변경
        setMounted(true);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setMounted(true); // 에러가 나더라도 무한 로딩 방지를 위해 set
      }
    };

    initHomePage();
  }, []);

  const displayPhotos = useMemo(() => {
    if (!allData.length) return [];
    const order = [
      "deepdive",
      "sinari",
      "index",
      "perkup",
      "gyeonghui",
      "Conferernce room",
      "parkjun",
      "sul",
      "maruone",
      "riel",
      "mongsan",
      "onandon",
      "ilasun",
      "samsung",
      "jeongwon",
      "engedi",
      "dumpinsight",
    ];
    const zeroPhotos = allData.filter((p) => p.title.endsWith("-0"));
    return order
      .map((name) => {
        const key = name.toLowerCase().replace(/\s+/g, "");
        return (
          zeroPhotos.find(
            (p) =>
              p.title.replace("-0", "").toLowerCase().replace(/\s+/g, "") ===
              key,
          ) || null
        );
      })
      .filter((p): p is Photo => p !== null);
  }, [allData]);

  // 마운트 전에는 레이아웃 깨짐 방지를 위해 아무것도 렌더링하지 않음
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-14 pt-32 pb-20">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {displayPhotos.map((photo, index) => (
            <PhotoCard key={photo.id} photo={photo} index={index} />
          ))}
        </Masonry>
      </main>
    </div>
  );
}

function PhotoCard({ photo, index }: { photo: Photo; index: number }) {
  const [isLandscape, setIsLandscape] = useState(false);
  const slug = photo.title.replace("-0", "").trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // 시작 위치를 살짝 더 아래로(20->30)
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 1.2, // 속도를 0.7에서 1.2로 늦춰 더 부드럽게
        ease: [0.22, 1, 0.36, 1], // 부드러운 Quintic ease-out 곡선
        delay: (index % 4) * 0.1, // 컬럼별로 미세한 시차를 둠
      }}
      className={`mb-10 md:mb-14 group flex flex-col transition-transform duration-700 ${
        isLandscape ? "md:pt-6 md:scale-110" : "scale-95"
      }`}
    >
      <Link href={`/space/${encodeURIComponent(slug)}`} className="w-full">
        <div className="overflow-hidden mb-2">
          <Image
            src={photo.url}
            alt={photo.title}
            width={1200}
            height={1400}
            className="photo-item-img w-full h-auto"
            onLoadingComplete={(img) => {
              if (img.naturalWidth > img.naturalHeight) setIsLandscape(true);
            }}
          />
        </div>
        <div className="text-right pr-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <h3 className="text-[10px] md:text-[11px] font-medium uppercase tracking-tighter">
            {slug}
          </h3>
          <p className="text-[9px] text-zinc-400 mt-0.5 uppercase tracking-tighter text-[#111]">
            2026, Space
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
