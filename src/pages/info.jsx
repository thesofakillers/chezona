import React from "react";
import Layout from "../components/layout";

export default function Info() {
  return (
    <Layout>
      <h1>Info</h1>
      <p>
        Con la pioggia di decreti COVID per la classificazione in zone colorate
        del paese, mi ero fatto l'idea (forse un po' tardi) di creare un
        dashboard dove sintetizzare in modo chiaro qual era il colore di ogni
        regione e in quali giorni. Ho dunque ho iniziato a lavorare su questo
        sito ma mi sono poi accorto che la soluzione già esiste su{" "}
        <a
          href="https://covidzone.info"
          target="_blank"
          rel="noopener noreferrer"
        >
          covidzone.info
        </a>
        . Perciò ho abbandonato questo progetto. Visto il dominio abbastanza
        facile da ricordare, ho tenuto il sito comunque aperto, reindirizzando
        gli utenti su{" "}
        <a
          href="https://covidzone.info"
          target="_blank"
          rel="noopener noreferrer"
        >
          covidzone.info
        </a>
        . <br />
        Il codice ormai abbandonato e comunque incompleto lo trovate sul mio
        account{" "}
        <a
          href="https://github.com/thesofakillers/chezona"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </Layout>
  );
}
