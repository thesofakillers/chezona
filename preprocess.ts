import {
  rename,
  createWriteStream,
  readFileSync,
  writeFileSync,
  existsSync,
} from "fs";
import fetch, { Headers } from "node-fetch";
import { pipeline } from "stream";
import { promisify } from "util";
import AdmZip from "adm-zip";
import moment from "moment";

// converting callback-based legacy methods to promise-based.
const asyncRename = promisify(rename);
const streamPipeline = promisify(pipeline);

/**
 * checks whether the raw zip file has changed over the last 24 hours.
 **/
async function checkChanged(
  apiUrl: string,
  pathArg: string,
  compareDate: Date,
  checkFrequency: number
): Promise<boolean> {
  // build url for getting latest commit
  var url = new URL(apiUrl);
  var params = { path: pathArg, page: 1, per_page: 1 };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  // http GET the url we built
  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({ accept: "application/vnd.github.v3+json" }),
  });
  // check if the file has changed since our last run
  const json = await response.json();
  let commitDate = new Date(json[0].commit.committer.date);
  let timeDiff = (compareDate.getTime() - commitDate.getTime()) / 3.6e6;
  if (timeDiff < checkFrequency) return Promise.resolve(true);
  else return Promise.resolve(false);
}

/**
 * downloads the zip file containing the relevant data
 **/
async function downloadZip(fileUrl: string, savePath: string): Promise<void> {
  const zipResponse = await fetch(fileUrl);

  if (!zipResponse.ok)
    throw new Error(`unexpected response ${zipResponse.statusText}`);

  await streamPipeline(zipResponse.body, createWriteStream(savePath));
}

/**
 * unzips the raw file we downloaded from GitHub, renaming the unzipped file.
 **/
async function unzipToJson(zipPath: string, jsonPath: string): Promise<void> {
  var zip = new AdmZip(zipPath);
  var zipEntries = zip.getEntries();
  var entryName = zipEntries[0].name;
  zip.extractEntryTo(entryName, "./", false, true);
  return asyncRename(entryName, jsonPath).catch((err) => {
    if (err)
      throw new Error(
        `something went wrong when renaming the unzipped json file`
      );
  });
}

/**
 * Processes the raw JSON file to a more comfortable format.
 **/
async function processJson(
  jsonPath: string,
  processedPath: string,
  compareDate: Date
): Promise<void> {
  // reading and parsing JSON
  const jsonBuffer = readFileSync(jsonPath);
  const rawData = JSON.parse(jsonBuffer.toString());
  // processing JSON: only keeping relevant properties of active dates.
  let processedArray = rawData.features.reduce(
    (filtered: Array<Object>, feature: any) => {
      let featureProperties = feature.properties;
      let startDate = moment(
        featureProperties.datasetIni,
        "DD/MM/YYYY"
      ).toDate();
      let endDate = moment(featureProperties.datasetFin, "DD/MM/YYYY").toDate();
      if (endDate.getTime() > compareDate.getTime()) {
        let color: string;
        switch (featureProperties.legSpecRif) {
          case "art.1":
            color = "yellow";
            break;
          case "art.2":
            color = "orange";
            break;
          case "art.3":
            color = "red";
            break;
          default:
            throw new Error("Could not determine region colour");
        }
        filtered.push({
          regionName: featureProperties.nomeTesto,
          regionalegLink: featureProperties.legLink,
          legLink: featureProperties.legGU_Link,
          legName: featureProperties.legNomeBre,
          author: featureProperties.nomeAutCom,
          color,
          startDate,
          endDate,
          level: featureProperties.legLivello,
        });
      }
      return filtered;
    },
    []
  );
  writeFileSync(processedPath, JSON.stringify(processedArray));
  return Promise.resolve();
}

/**
 * Checks if data file has changed
 * if so downloads it, unzips it to json, parses JSON
 * and finally processes the data into a more comfortable json shape
 **/ async function main(config: {
  fileUrl: string;
  zip: {
    savePath: string;
  };
  json: {
    savePath: string;
    processedPath: string;
  };
  github: {
    apiUrl: string;
    pathArg: string;
    checkFrequency: number;
  };
  dateToCompare: Date;
}): Promise<void> {
  // preprocess either if the db.json doesn't exist or if the remote zip changed.
  console.log("Checking if preprocessing is necessary");
  if (
    !existsSync(config.json.processedPath) ||
    (await checkChanged(
      config.github.apiUrl,
      config.github.pathArg,
      config.dateToCompare,
      config.github.checkFrequency
    ))
  ) {
    console.log("Downloading zip...");
    await downloadZip(config.fileUrl, config.zip.savePath);
    console.log("Unzipping new zip to JSON...");
    await unzipToJson(config.zip.savePath, config.json.savePath);
    console.log("Processing the raw JSON data...");
    await processJson(
      config.json.savePath,
      config.json.processedPath,
      config.dateToCompare
    );
  } else {
    console.log("No preprocessing was necessary.");
    return Promise.resolve();
  }
  console.log("Preprocessing complete.");
}

main({
  fileUrl:
    "https://github.com/pcm-dpc/COVID-19/raw/master/aree/geojson/dpc-covid-19-ita-aree-nuove-g-json.zip",
  zip: {
    savePath: "./raw.json.zip",
  },
  json: { savePath: "./raw.json", processedPath: "./db.json" },
  github: {
    apiUrl: "https://api.github.com/repos/pcm-dpc/COVID-19/commits",
    pathArg: "aree/geojson/dpc-covid-19-ita-aree-nuove-g-json.zip",
    checkFrequency: 12,
  },
  dateToCompare: new Date(),
});
