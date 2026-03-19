import { Button } from "@procore/core-react";
import Link from "next/link";

export default function HomeContent() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Procore Prototype</h1>
      <p>Your Next.js app is configured with @procore/core-react.</p>
      <Button variant="primary" onClick={() => alert("It works!")}>
        Click Me
      </Button>
      <p style={{ marginTop: 24 }}>
        <Link href="/inspections">Go to Inspections page</Link>
      </p>
    </div>
  );
}
