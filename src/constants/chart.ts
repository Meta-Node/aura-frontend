export const valueColorMap = {
  '-4': '#924848',
  '-3': '#DA6A6A',
  '-2': '#EE9D9D',
  '-1': '#F5BFBF',
  '1': '#D5ECDA',
  '2': '#B4E6C0',
  '3': '#72BF83',
  '4': '#5B9969',
};

export const userRatingColorMap = {
  '-4': '#D9C7F9',
  '-3': '#C2A8F3',
  '-2': '#AC89ED',
  '-1': '#956AE6',
  '1': '#8341DE',
  '2': '#6C34B3',
  '3': '#572988',
  '4': '#451F6D',
};

export const subjectRatingColorMap = {
  '-4': '#FAD7A0', // Lightest for the most negative
  '-3': '#F8C471', // Lighter
  '-2': '#F5B041', // Slightly muted
  '-1': '#F39C12', // Base color, softened
  '1': '#E67E22', // Base color
  '2': '#CA6A1A', // Slightly darker
  '3': '#AF5714', // Bold and dark
  '4': '#91450F', // Darkest, very bold
};

export const findNearestColor = (value: any, colorMap: any) => {
  const nearestValue = Object.keys(colorMap).reduce((prev, curr) =>
    Math.abs(Number(curr) - value) < Math.abs(Number(prev) - value)
      ? curr
      : prev,
  );
  return colorMap[nearestValue];
};
