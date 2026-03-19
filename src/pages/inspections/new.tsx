import dynamic from "next/dynamic";

const NewInspectionContent = dynamic(
  () => import("@/components/NewInspectionContent"),
  {
    ssr: false,
    loading: () => <p style={{ padding: 40 }}>Loading…</p>,
  }
);

export default function NewInspectionPage() {
  return <NewInspectionContent />;
}
