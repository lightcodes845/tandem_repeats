const fs = require("fs");
const ErrorResponse = require("./errorResponse");

async function deleteFileorFolder(path) {
  try {
    if (path) {
      const value = await fileOrPathExists(path);
      if (value) {
        // console.log('exists: ', path);
        fs.rm(path, { recursive: true }, (err) => {
          if (err) console.log(err.message);
          else {
            // console.log(path, ' deleted');
          }
        });
      } else {
        throw new ErrorResponse(`Problem with deleting file`, 500);
      }
    } else {
      throw new ErrorResponse(`Path not specified`, 500);
    }
  } catch (e) {
    console.log(e);
  }
}

function fileOrPathExists(path) {
  return new Promise((resolve) => {
    if (!path) {
      resolve(false);
    }
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

function fileSizeMb(path) {
  return new Promise((resolve) => {
    fs.stat(path, (err, stat) => {
      if (err) {
        resolve(undefined);
      }
      const mb = stat.size / (1024 * 1024);
      resolve(mb);
    });
  });
}

module.exports = { deleteFileorFolder, fileOrPathExists, fileSizeMb };
