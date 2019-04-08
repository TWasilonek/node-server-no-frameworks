exports.parseJSONToObject = function (string) {
  try {
    const obj = JSON.parse(string);
    return obj;
  } catch(err) {
    return {};
  }
}
