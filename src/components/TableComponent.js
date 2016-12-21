import React, { Component } from 'react';
import { loadMain, loadMore } from '../actions/fetchArticles.js'
import ArticleRow from './ArticleRowComponent';

class Table extends Component {

  constructor(){
    super()
    this.state = {sortBy: null, pages: 1, articles: [], authorArticles: []}

    this.loadMain = loadMain.bind(this)
    this.loadMore = loadMore.bind(this)

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

  sort(){
    // set localStorage sortBy preference, since sort actions will always trigger sort()
    window.localStorage.setItem("PubArt_SORTBY_PREF", this.state.sortBy);
    let type = (this.state.sortBy === "wordsASC" ? "words" : this.state.sortBy);
    let sortedArticles = this.showing().sort((a, b)=>{
      if (a[type] > b[type]) {
        return -1
      } else if (a[type] < b[type]) {
        return 1
      } else {
        return 0
      }
    })
    return this.state.sortBy === "wordsASC" ? sortedArticles.reverse() : sortedArticles;
  }

  showTenMore(){
    // If already showing all stored articles, get more articles first
    if (this.showing().length === this.state.articles.length) {
      this.loadMore()
    }
    // Increment number of showing "pages"
    this.setState({pages: this.state.pages + 1})
  }

  sortByPublished(){
    // handle sorting via sortBy attribute of the Table component's state
    // setState cause React to check if component needs to re-render
    //    render relies on the changed attribute sortBy via this.sort()
    this.state.sortBy === "publish_at" ?
      this.setState({sortBy: "null"}) : this.setState({sortBy: "publish_at"})
  }

  sortByWords(){
    if (this.state.sortBy === "words") {
      this.setState({sortBy: "wordsASC"})
    } else if (this.state.sortBy === "wordsASC") {
      this.setState({sortBy: "null"})
    } else {
      this.setState({sortBy: "words"})
    }
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

    // Another backend/database note: the title column header could show the total number of unpublished articles from the database (rather than the current number showing, which doesn't really benefit the user much)
    return (
      <table>
        <thead><tr>
          <th colSpan="2" className="title-column" > UNPUBLISHED ARTICLES ({this.showing().length}) </th>

          <th className="author-column">AUTHOR</th>

          <th className="words-column" onClick={this.sortByWords}>
            WORDS
            <div className={(this.state.sortBy === "words" || this.state.sortBy === "wordsASC") ? "currentSort" : "inactiveSort"}>{this.state.sortBy === "wordsASC" ?  "▲" : "▼"}</div>
          </th>

          <th className="publish-at-column" onClick={this.sortByPublished}>
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
