import $ from 'jquery';

export const loadMain = function(){
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

export const loadMore = function(){
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
