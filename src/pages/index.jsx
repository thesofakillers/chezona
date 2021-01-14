import React from "react";
import { Link as a } from "gatsby";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout style={{ margin: `3rem auto`, maxWidth: 600 }}>
      <h1>Sito archiviato</h1>
      Recatevi a <a href="https://covidzone.info">covidzone.info</a>
    </Layout>
  );
}
