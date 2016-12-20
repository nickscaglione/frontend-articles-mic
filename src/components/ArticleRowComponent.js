import React, { Component } from 'react';

class ArticleRow extends Component {
  render() {
    let sinceSubmit = this.props.submitted
    return (
      <tr>
        <td>{this.props.headline}</td>
        <td>{this.props.author}</td>
        <td>{this.props.words}</td>
        <td>{sinceSubmit}</td>
      </tr>
    );
  }
}

export default ArticleRow;
