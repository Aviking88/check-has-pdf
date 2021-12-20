import queryString from "querystring";
import { parse } from "url";
const { http, https } = require("follow-redirects");

function getFileFromUrl(url, fileType = "*") {
  return new Promise(async (resolve, reject) => {
    let urlInstance = new URL(url);
    const options = {
      hostname: urlInstance.hostname,
      path: urlInstance.pathname + (urlInstance.search || ""),
      headers: { "User-Agent": "Mozilla/5.0" }
    };

    console.log(options, url);

    https
      .get(options, (res) => {
        console.log("res", res);
        res.headers["content-disposition"] = "attachment";

        const statusCode = res.statusCode;
        const contentType = res.headers["content-type"];
        const contentDisposition = res.headers["content-disposition"];
        const regexp = /filename=\"(.*)\"/gi;

        if (statusCode !== 200) {
          return reject("Cannot download file from given URL");
        } else if (
          fileType === "pdf" &&
          !/^application\/pdf/.test(contentType || "")
        ) {
          return reject(
            `Invalid content-type. Expected application/pdf but received ${contentType}`
          );
        } else if (regexp.test(contentDisposition)) {
          // cheap solution, handle inline disposition later
          return reject(
            `Invalid content-disposition. Expected none but received ${contentDisposition}`
          );
        } else {
          res.on("error", (err) => {
            reject(err);
          });
        }
      })
      .on("error", (err) => {
        return reject(err);
      });
  });
}

getFileFromUrl("https://osf.io/preprints/socarxiv/y594q/download").then(
  (res) => {
    console.log(res);
  }
);
