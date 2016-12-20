import React, { Component } from 'react';
import ArticleRow from './ArticleRowComponent';
import $ from 'jquery';

class Table extends Component {

  constructor(){
    super()
    this.state = {sortBy: null, pages: 1, articles: []}
    this.showTenMore = this.showTenMore.bind(this)
    this.sortByPublished = this.sortByPublished.bind(this)
    this.sortByWords = this.sortByWords.bind(this)
  }

  componentWillMount(){
    this.loadMain()
  }

  showing() {
    return this.state.articles.slice(0, this.state.pages * 10)
  }

  showTenMore(){
    if (this.showing().length === this.state.articles.length) {
      this.loadMore()
    }
    this.setState({pages: this.state.pages + 1})
    this.sort()
  }

  loadMain(){
    $.ajax({
      context: this,
      url: "more-articles.json",
      type: "GET",
      contentType:"application/json; charset=utf-8",
      dataType:"json"
    }).done(function(data){
      this.setState({articles: data})
    })
  }

  loadMore(){
    $.ajax({
      context: this,
      url: "articles.json",
      type: "GET",
      contentType:"application/json; charset=utf-8",
      dataType:"json"
    }).done(function(data){
      this.setState({articles: this.state.articles.concat(data)})
    })
  }

  sort(){
    let type = this.state.sortBy
    return this.showing().sort((a, b)=>{
      if (a[type] > b[type]) {
        return -1
      } else if (a[type] < b[type]) {
        return 1
      } else {
        return 0
      }
    })
  }

  sortByPublished(){
    this.setState({sortBy: "publish_at"})
    this.sort()
  }

  sortByWords(){
    this.setState({sortBy: "words"})
    this.sort()
  }

  render() {
    let articleRows = this.sort().map((article, index)=>{
      return(
        <ArticleRow key={`article${index}`} title={article.title} profile={article.profile} words={article.words} publishAt={article.publish_at} url={article.url} image={article.image}/>
      )
    })

    return (
      <table>
        <thead><tr>
          <th colSpan="2" className="title" > UNPUBLISHED ARTICLES (60) </th>
          <th>AUTHOR</th>
          <th className="words" onClick={this.sortByWords}>
            WORDS
            <div className={this.state.sortBy === "words" ? "currentSort" : "inactiveSort"}>&#9660;</div>
          </th>
          <th className="publish_at" onClick={this.sortByPublished}>
            SUBMITTED
            <div className={this.state.sortBy === "publish_at" ? "currentSort" : "inactiveSort"}>&#9660;</div>
          </th>
        </tr></thead>
        <tbody>
          {articleRows}
        </tbody>
        <tfoot><tr>
          <td colSpan="5"><button hidden={this.state.pages === 6} onClick={this.showTenMore}>Load more articles</button></td>
        </tr></tfoot>
      </table>
    );
  }
}

export default Table;
