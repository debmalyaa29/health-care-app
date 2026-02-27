import VideoCall from "./_components/video-call";


export default async function VideoCallPage({ searchParams }) {
  const { sessionId, token } = await searchParams;

  return <VideoCall sessionId={sessionId} token={token} />;
}