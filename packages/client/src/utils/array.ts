export const groupBy = <T>(arr: T[], size: number, evenly = false): T[][] => {
  if (!size) {
    return [];
  }
  const copy = [...arr];
  const groupsArray: T[][] = [];
  let groups = Math.ceil(copy.length / size);

  let groupSize = size;

  while (copy.length) {
    groupsArray.push(copy.splice(0, groupSize));
    groups--;
    if (evenly) {
      groupSize = copy.length % groups === 0 ? copy.length / groups : groupSize;
    }
  }

  return groupsArray;
};
