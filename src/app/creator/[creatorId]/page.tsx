import StreamView from "@/components/StreamView";
export default function CreatorDashboard({
  params: { creatorId },
}: {
  params: { creatorId: string };
}) {
  return <StreamView creatorId={creatorId} />;
}

// import StreamView from "@/components/StreamView";

// type Props = {
//   params: Promise<{ creatorId: string }>;
// };

// export default function CreatorDashboard({ params }: Props) {
//   //@ts-ignore
//   return <StreamView creatorId={params.creatorId} />;
// }