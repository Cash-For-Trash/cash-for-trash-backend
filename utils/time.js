export const toTimeDate = (time) => {
    return new Date(`1970-01-01T${time}.000Z`);
};

export const formatTime = (date) => {
    return date.toISOString().substring(11, 19);
};

export const getNext7DaysRange = () => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  return {
    startDate,
    endDate,
  };
};