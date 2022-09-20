function findTeacher(arr: string[], query: string) {
  arr = arr.map((item) => {
    return item.toLowerCase();
  });
  query = query.toLowerCase();
  const count = arr.filter((el) => {
    return el.indexOf(query) != -1;
  });

  return count
    .map((item) => {
      return capitalize(item);
    })
    .sort();
}

function findGroup(arr: string[], query: string): string[] {
  if (query === "-") return arr;
  arr = arr.map(function (x) {
    return x.toUpperCase();
  });
  query = query.toUpperCase();
  let count = [];
  count = arr.filter((el) => {
    return el.indexOf(query) != -1;
  });

  if (query.charAt(0) !== "З") {
    return count
      .filter((el) => {
        return el.charAt(0) !== "З";
      })
      .sort();
  }

  if (query.charAt(0) == "З") {
    return count
      .map((el) => {
        if (el.charAt(0) == "З") return unCapitalize(el);
        else return el;
      })
      .filter((el) => el.charAt(0) === "з")
      .sort();
  }
  return [];
}

function capitalize(str: string) {
  return str.replace(/(^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function unCapitalize(str: string) {
  return str.replace(/(^|\s)\S/g, function (a) {
    return a.toLowerCase();
  });
}

export { findGroup, findTeacher };
