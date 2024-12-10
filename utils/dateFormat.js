const { format, isToday, isTomorrow, parseISO } = require("date-fns");

const formatValidUntil = (validUntil) => {
    
  if (!validUntil || typeof validUntil !== "string") {
    throw new Error("Invalid date string");
  }

  const parsedDate = parseISO(validUntil);

  if (isNaN(parsedDate)) {
    throw new Error("Invalid ISO date string");
  }

  if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, "hh:mm a")}`;
  } else if (isTomorrow(parsedDate)) {
    return `Tomorrow at ${format(parsedDate, "hh:mm a")}`;
  } else {
    return `${format(parsedDate, "EEEE")} at ${format(parsedDate, "hh:mm a")}`;
  }
};

module.exports = { formatValidUntil };
