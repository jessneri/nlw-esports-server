export function formatMinutesToHours(minutesNumber: number) {
  const hours = Math.floor(minutesNumber / 60);
  const minutes = minutesNumber % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}
