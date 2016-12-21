import React, { Component } from 'react';

class ArticleRow extends Component {

  fullName(){
    return this.props.profile.first_name + " " + this.props.profile.last_name
  }

  sincePublish(){
    let milliseconds = new Date() - new Date(this.props.publishAt),
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

  handleAuthorClick(event) {
    debugger

    this.props.getAuthorArticles(event.target.innerHTML)
  }

  render(){
    return (
      <tr>
        <td><img width="50px" height="50px" src={this.props.image}/></td>
        <td><a href={this.props.url}>{this.props.title}</a></td>
        <td><a href="javascript:" onClick={this.handleAuthorClick.bind(this)}>{this.fullName()}</a></td>
        <td className="words">{this.props.words}</td>
        <td className="publish_at">{this.sincePublish()}</td>
      </tr>
    );
  }
}

export default ArticleRow;
