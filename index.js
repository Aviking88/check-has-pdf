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
        
        res.headers["content-disposition"] = "attachment";
        const statusCode = res.statusCode;
        const contentType = res.headers["content-type"];

        console.log("res", res.statusCode,contentType);
        resolve({
          statusCode,
          contentType,
          isPDF: /^application\/pdf/.test(contentType || "")
        })

      })
      .on("error", (err) => {
        return reject(err);
      });
  });
}

getFileFromUrl("https://aapm.onlinelibrary.wiley.com/doi/pdfdirect/10.1002/acm2.13189?download=true").then(
  (res) => {
    console.log(res);
  }
);
