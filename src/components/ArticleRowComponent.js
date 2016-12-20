import React from 'react';

function ArticleRow(props) {

  let author = props.profile.first_name + " " + props.profile.last_name

  let milliseconds = new Date() - new Date(props.publishAt),
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

  let sincePublish = value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`

  return (
    <tr>
      <td><img width="50px" height="50px" src={props.image}/></td>
      <td><a href={props.url}>{props.title}</a></td>
      <td>{author}</td>
      <td className="words">{props.words}</td>
      <td className="publish_at">{sincePublish}</td>
    </tr>
  );
}

export default ArticleRow;
