import React, { Component } from 'react';
import ArticleRow from './ArticleRowComponent';
import $ from 'jquery';

class Table extends Component {

  constructor(){
    super()
    this.sortBy = "submitted"
    this.articles = []
  }

  componentWillMount(){
    this.loadMore()
  }

  currentPage(){
    return (this.articles.length / 10)
    // 10 articles in state => page 1
  }

  loadMore(){
    // get the articles of "page 2"
    $.ajax({
      url: `http://localhost:3000/pages/${this.currentPage() + 1}`,
      type: "GET",
      contentType:"application/json; charset=utf-8",
      dataType:"json"
    })
    .done(function(data) {
      this.articles = [...this.articles, data]
    })
  }

  render() {

    let articleRows = this.articles.map((article)=>{
      <ArticleRow headline={article.headline} author={article.author} words={article.words} submitted={article.submitted}/>
    })

    return (
      <table>
        <thead><tr>
          <th className="title" >UNPUBLISHED ARTICLES</th>
          <th>AUTHOR</th>
          <th>WORDS</th>
          <th>SUBMITTED</th>
        </tr></thead>
        <tbody>
          {articleRows}
        </tbody>
        <tfoot><tr>
          <td><button>Load More</button></td>
        </tr></tfoot>
      </table>
    );
  }
}

export default Table;
