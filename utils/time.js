export const toTimeDate = (time) => {
    return new Date(`1970-01-01T${time}.000Z`);
};

export const formatTime = (date) => {
    return date.toISOString().substring(11, 19);
};