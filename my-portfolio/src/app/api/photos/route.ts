// app/api/photos/route.ts (또는 해당 API 파일)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. 서버에서는 필터링하지 말고 'space' 카테고리 전체를 가져옵니다.
    const allPhotos = await prisma.photo.findMany({
      where: { category: "space" },
      // orderBy는 없어도 프론트에서 정렬하므로 상관없지만 유지해도 좋습니다.
      orderBy: { title: "asc" },
    });

    // 2. 가공하지 않은 전체 리스트를 그대로 반환합니다.
    return NextResponse.json(allPhotos);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}
