import React from "react";
import { Link } from "gatsby";

export default function Home() {
  return (
    <div style={{ color: `purple` }}>
      <h1>In che zona siamo?</h1>
      <Link to="/info/">Informazioni</Link>
    </div>
  );
}
