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
  endDate.setDate(endDate.getDate() + 0);

  return {
    startDate,
    endDate,
  };
};


const dayMap = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const getNextCollectionDate = (scheduledDay) => {
  const today = new Date();

  const targetDay = dayMap[scheduledDay];
  const currentDay = today.getDay();

  let diff = targetDay - currentDay;
  if (diff <= 0) {
    diff += 7;
  }

  const collectionDate = new Date(today);
  collectionDate.setDate(today.getDate() + diff);

  collectionDate.setHours(0, 0, 0, 0);

  return collectionDate;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB");
};