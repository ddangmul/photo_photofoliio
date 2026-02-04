import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 [Prisma] 데이터 주입 프로세스를 시작합니다...");

  try {
    await prisma.$connect();
    console.log("🔗 데이터베이스 연결 완료.");

    // 기존 데이터 초기화
    await prisma.photo.deleteMany();
    console.log("🧹 기존 데이터를 삭제했습니다.");

    const categories = ["space", "brand", "snap", "portrait"];

    for (const category of categories) {
      const dirPath = path.join(process.cwd(), "public", "images", category);

      if (fs.existsSync(dirPath)) {
        // 1. 파일 목록 읽기 및 필터링
        const files = fs.readdirSync(dirPath);
        const imageFiles = files
          .filter((file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
          // 2. 중요: 파일명 순으로 정렬 (장소명-0, 장소명-1 순서 보장)
          .sort((a, b) =>
            a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );

        console.log(
          `📂 ${category}: ${imageFiles.length}개의 이미지 정렬 완료`,
        );

        for (const file of imageFiles) {
          await prisma.photo.create({
            data: {
              // 파일명에서 확장자를 제외한 이름을 title로 사용 (예: "seoul-0")
              title: path.parse(file).name,
              url: `/images/${category}/${file}`,
              category: category,
            },
          });
        }
      } else {
        console.warn(`⚠️ 폴더 없음: ${dirPath}`);
      }
    }

    console.log("✨ 모든 데이터가 순서대로 주입되었습니다!");
  } catch (error) {
    console.error("❌ 에러 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
