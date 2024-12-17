import StreamView from "@/components/StreamView";
import { creatorId } from "../lib/utils";

export default function Dashboard() {

  //@ts-expect-error ignore
  return <StreamView creatorId={creatorId} playVideo={true} />;
}
