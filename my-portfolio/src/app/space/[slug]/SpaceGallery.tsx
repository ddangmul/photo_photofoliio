"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Photo } from "@prisma/client";
import Link from "next/link";

export default function SpaceGallery({ params }: { params: { slug: string } }) {
  const [projectPhotos, setProjectPhotos] = useState<Photo[]>([]); // 단일 객체에서 배열로 변경
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/photos");
        const data: Photo[] = await res.json();

        // 현재 슬러그와 일치하는 모든 사진 필터링 (예: "deepdive-0", "deepdive-1" 모두 포함)
        const targets = data
          .filter(
            (p) =>
              p.title.split("-")[0].toLowerCase().replace(/\s+/g, "") ===
              decodeURIComponent(params.slug).toLowerCase().replace(/\s+/g, ""),
          )
          .sort((a, b) => a.title.localeCompare(b.title)); // 번호순 정렬

        setProjectPhotos(targets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [params]);

  if (loading) return <div className="min-h-screen bg-[#fdfdfd]" />;
  if (projectPhotos.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-14 py-10 mix-blend-difference">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-tighter text-zinc-500 hover:text-white transition-colors"
        >
          Back to Index
        </Link>
      </nav>

      <main className="w-full max-w-[1400px] mx-auto px-6 md:px-14 pt-40 pb-32">
        {/* 프로젝트 타이틀 섹션 */}
        <div className="mb-20 uppercase tracking-tighter">
          <h1 className="text-[24px] font-medium">
            {decodeURIComponent(params.slug)}
          </h1>
          <p className="text-[11px] text-zinc-400 mt-2">Space Archive Series</p>
        </div>

        {/* 이미지 리스트: 모든 이미지를 세로로 나열 */}
        <div className="flex flex-col gap-20 md:gap-32">
          {projectPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }} // 스크롤 시 순차적으로 나타남
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
              className="w-full"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                width={2000}
                height={1500}
                priority={index === 0} // 첫 이미지만 우선 로딩
                className="photo-item-img w-full h-auto"
              />
            </motion.div>
          ))}
        </div>

        {/* 하단 설명 섹션 */}
        <footer className="mt-32 border-t border-black/5 pt-10 flex justify-between items-end uppercase tracking-tighter">
          <div className="text-[11px] text-zinc-400">
            <p>© 2026 Archive Studio</p>
            <p>All images are copyrighted.</p>
          </div>
          <Link href="/" className="text-[13px] font-medium hover:line-through">
            Next Project
          </Link>
        </footer>
      </main>
    </div>
  );
}
