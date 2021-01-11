import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout style={{ margin: `3rem auto`, maxWidth: 600 }}>
      <h1>Le regioni per colore</h1>
      <Link to="/info/">Informazioni</Link>
    </Layout>
  );
}
