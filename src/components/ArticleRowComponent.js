import React, { Component } from 'react';
import elapsedSincePublish from '../actions/articlePublishAtToElapsedTime'

class ArticleRow extends Component {

  fullName(){
    return this.props.profile.first_name + " " + this.props.profile.last_name
  }

  handleAuthorClick(event) {
    this.props.getAuthorArticles(event.target.innerHTML)
  }

  render(){
    return (
      <tr>
        <td><img width="60px" src={this.props.image}/></td>
        <td><a href={this.props.url}>{this.props.title}</a></td>
        <td><a href="javascript:" onClick={this.handleAuthorClick.bind(this)}>{this.fullName()}</a></td>
        <td className="words">{this.props.words}</td>
        <td className="publish_at">{elapsedSincePublish(this.props.publishAt)}</td>
      </tr>
    );
  }
}

export default ArticleRow;
