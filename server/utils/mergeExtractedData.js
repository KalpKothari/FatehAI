function isMeaningful(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value === null || value === undefined) {
    return false;
  }

  const str = String(value).trim().toLowerCase();
  return str !== "" && str !== "null" && str !== "undefined";
}

function mergeExtractedData(oldData = {}, newData = {}) {
  const merged = { ...oldData };

  for (const key of Object.keys(newData)) {
    const newValue = newData[key];
    const oldValue = oldData[key];

    if (Array.isArray(newValue)) {
      if (newValue.length > 0) {
        merged[key] = newValue;
      } else if (!Array.isArray(oldValue)) {
        merged[key] = [];
      }
      continue;
    }

    if (isMeaningful(newValue)) {
      merged[key] = newValue;
    } else {
      merged[key] = oldValue ?? "";
    }
  }

  return merged;
}

module.exports = mergeExtractedData;