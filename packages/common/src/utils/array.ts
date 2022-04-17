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

export const shuffle = <T>(arr: T[]) => {
  let currentIndex = arr.length;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }

  return arr;
};
