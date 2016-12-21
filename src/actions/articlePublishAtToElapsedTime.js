export default function(publishAt){
  let milliseconds = new Date() - new Date(publishAt),
    seconds = Math.floor(milliseconds / 1000 % 60),
    minutes = Math.floor(milliseconds / 1000 / 60 % 60),
    hours = Math.floor(milliseconds / 1000 / 60 / 60)
  let unit, value
  if (hours > 0) {
    value = hours
    unit = "hour"
  } else if (minutes > 0) {
    value = minutes
    unit = "minute"
  } else {
    value = seconds
    unit = "second"
  }
  return value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`
}
