export const toBrewingP = (value: number): string => {
  if (value === null) {
    return '';
  }

  value = 135.997 * Math.pow(value, 3) - 630.272 * Math.pow(value, 2) + 1111.14 * value - 616.868;

  if (Math.abs(value) < 0.3) {
    return '0';
  } else if (value < -5) {
    return '0';
  }
  return value.toFixed(1) + '°P';
};

export const toBrewingBX = (value: number): string => {
  if (value === null) {
    return '';
  }
  value = ((182.4601 * value - 775.6821) * value + 1262.7794) * value - 669.5622;

  if (Math.abs(value) < 0.3) {
    return '0';
  } else if (value < -5) {
    return '0';
  }
  return value.toFixed(1) + '°Bx';
};
