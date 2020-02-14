const fs = require("fs");
const _ = require("lodash");

const defaultDelimiter = ','

module.exports = function processCSV(filename, delimiter) {
  let data = fs.readFileSync(filename, { encoding: "utf-8" });
  data = _.map(data.split("\n"), d => d.split(delimiter || defaultDelimiter));
  data = _.dropRightWhile(data, val => _.isEqual(val, [""]));
  const headers = _.first(data);
  data.shift();
  return { data, headers };
};
