function calculateExpiry(startDate, validityDays) {
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + Number(validityDays));
  return expiry;
}

module.exports = calculateExpiry;
