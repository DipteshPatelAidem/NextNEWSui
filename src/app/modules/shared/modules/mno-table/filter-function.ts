export function filterMultipleField(row, filter) {
    let isInFilter = false;
    let noFilter = true;

    for (var columnName in filter) {
      if (row[columnName] == null) {
        return isInFilter;
      }
      noFilter = false;
      let rowValue: String = row[columnName].toString().toLowerCase();
      let filterMatchMode: String = filter[columnName].matchMode;
      const value = filter[columnName].value && filter[columnName].value;
      if (filterMatchMode.includes("contains") && rowValue.includes((value || "").toLowerCase())) {
        isInFilter = true;
      } else if (filterMatchMode.includes("startsWith") && rowValue.indexOf((value || "").toLowerCase()) > -1) {
        isInFilter = true;
      } else if (filterMatchMode.includes("in") && (value || "").includes(rowValue)) {
        isInFilter = true;
      }
    }

    if (noFilter) { isInFilter = true; }

    return isInFilter;
  }