const extractTime = (str) => {
  let time = 0;
  const timeRegex = /\d+-?\d* min/g;
  const timeMatches = str.match(timeRegex);

  if (timeMatches) {
    timeMatches.forEach((match) => {
      const range = match.split("-");
      if (range.length === 2) {
        // If it's a range, take the larger number
        time += Math.max(parseInt(range[0]), parseInt(range[1]));
      } else {
        // If it's a single number, just add it
        time += parseInt(range[0]);
      }
    });
  }

  return time;
};
export default extractTime;