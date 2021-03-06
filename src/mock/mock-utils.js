const getRandomNumber = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArray = (array) => {
  let newArray = [];

  array.forEach((item, i, arr) => {
    newArray[i] = arr[Math.floor(Math.random() * arr.length)];
  });

  return newArray;
};

const getRandomElement = (elements) => {
  return elements[Math.floor(Math.random() * elements.length)];
};

const getRandomInteger = (b = 1, a = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export {getRandomNumber, getRandomArray, getRandomElement, getRandomInteger};
