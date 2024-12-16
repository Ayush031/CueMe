import StreamView from "@/components/StreamView";
import { creatorId } from "../lib/utils";

export default function Dashboard() {
  return <StreamView creatorId={creatorId} />;
}
