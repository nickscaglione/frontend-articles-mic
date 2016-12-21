import React, { Component } from 'react';
import ArticleRow from './ArticleRowComponent';
import $ from 'jquery';

class Table extends Component {

  constructor(){
    super()
    this.state = {sortBy: null, pages: 1, articles: [], authorArticles: []}

    // bind user event functions
    this.showTenMore = this.showTenMore.bind(this)
    this.sortByPublished = this.sortByPublished.bind(this)
    this.sortByWords = this.sortByWords.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentWillMount(){
    // get stored sort preference
    this.setState({sortBy: window.localStorage.getItem("PubArt_SORTBY_PREF")})
    // Request original 30 articles
    this.loadMain()
  }

  showing() {
    // Access only the first (pages * 10) articles, called in sort()
    if (this.state.authorArticles.length > 0) {
      return this.state.authorArticles
    } else {
      return this.state.articles.slice(0, this.state.pages * 10)
    }
  }

  showTenMore(){
    // If already showing all stored articles, get more articles first
    if (this.showing().length === this.state.articles.length) {
      this.loadMore()
    }
    // Increment number of showing "pages"
    this.setState({pages: this.state.pages + 1})
  }

  loadMain(){
    // see loadMore()

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
    // typically we'd have a backend for articles, and send along a page number
    // backend would send back the next n articles
    // "next n" refers either to the n articles most recently entered into the database
    //   or the most recent n based on the publish_at attribute
    //   (if these conditions aren't equivalent)

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
    window.localStorage.setItem("PubArt_SORTBY_PREF", type)
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
    // handle sorting via sortBy attribute of the Table component's state
    // setState cause React to check if component needs to re-render
    //    render relies on the changed attribute sortBy via this.sort()
    this.state.sortBy === "publish_at" ?
      this.setState({sortBy: "null"}) : this.setState({sortBy: "publish_at"})
  }

  sortByWords(){
    this.state.sortBy === "words" ?
      this.setState({sortBy: "null"}) : this.setState({sortBy: "words"})
  }

  getAuthorArticles(fullName){
    // currently filters articles stored locally to show only those with the name of
    //    the clicked author
    // With a backend, this would instead just be a database query to get all of the author's
    //   unpublished articles, since we probably aren't looking for just the ones we
    //   currently have stored
    // With an author/profile model, this would go to 'profiles/:id/articles'

    let authorArticles = this.state.articles.filter((article)=>{
      return article.profile.first_name + " " + article.profile.last_name === fullName
    })
    this.setState({authorArticles: authorArticles})
  }

  goBack(){
    this.setState({authorArticles: []})
  }

  isAuthorShowing(){
    return this.state.authorArticles.length !== 0
  }

  render() {
    let articleRows = this.sort().map((article, index)=>{
      return(
        <ArticleRow key={`article${index}`} title={article.title} profile={article.profile} words={article.words} publishAt={article.publish_at} url={article.url} image={article.image} getAuthorArticles={this.getAuthorArticles.bind(this)}/>
      )
    })

    return (
      <table>
        <thead><tr>
          <th colSpan="2" className="title" > UNPUBLISHED ARTICLES ({this.showing().length}) </th>
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
          <td colSpan="5"><button hidden={this.state.pages === 6 && !this.isAuthorShowing()} onClick={this.isAuthorShowing() ? this.goBack : this.showTenMore}>{this.isAuthorShowing() ? "Go back" : "Load more articles"}</button></td>
        </tr></tfoot>
      </table>
    );
  }
}

export default Table;
