import SpaceGallery from "./SpaceGallery";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params; // 비동기로 params를 안전하게 처리
  return <SpaceGallery params={resolvedParams} />;
}
