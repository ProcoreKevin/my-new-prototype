import dynamic from "next/dynamic";

const InspectionsContent = dynamic(
  () => import("@/components/InspectionsContent"),
  {
    ssr: false,
    loading: () => <p style={{ padding: 40 }}>Loading…</p>,
  }
);

export default function InspectionsPage() {
  return <InspectionsContent />;
}
