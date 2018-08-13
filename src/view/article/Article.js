/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';
import { type User } from '../../domain/user';
import type {
  Article as ArticleType,
  ArticleSlug,
  Comment as CommentType
} from '../../domain/article';
import { article } from '../../state/article';
import TagList from '../tag/TagList';
import ArticleMeta from './ArticleMeta';
import CommentForm from './CommentForm';
import Comment from './Comment';

type Props = {
  user: ?User,
  articleSlug: ArticleSlug,
  article: ?ArticleType,
  comments: Array<CommentType>,
  isLoading: bool,
  loadArticle: (ArticleSlug) => void,
  loadComments: (ArticleSlug) => void
};

class Article extends Component<Props> {
  componentDidMount() {
    const {
      loadArticle,
      loadComments,
      articleSlug
    } = this.props;

    loadArticle(articleSlug);
    loadComments(articleSlug);
  }

  render() {
    const { user, article, comments, isLoading } = this.props;

    if(isLoading || !article) {
      return null;
    }

    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">
            <h1>{ article.title }</h1>

            <ArticleMeta article={ article } currentUser={ user } />
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <Markdown source={ article.body } />
              <TagList
                tags={ article.tagList }
                tagClassName="tag-outline"
              />
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <ArticleMeta article={ article } currentUser={ user } />
          </div>

          <div className="row">

            <div className="col-xs-12 col-md-8 offset-md-2">

              {
                user && (
                  <CommentForm currentUser={ user } />
                )
              }

              {
                comments.map((comment) =>
                  <Comment
                    key={ comment.id }
                    comment={ comment }
                  />
                )
              }
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ article, user }, props) => ({
  user,
  article: article.article,
  comments: article.comments,
  isLoading: article.isLoading,
  articleSlug: props.match.params.slug
});

const mapDispatchToProps = {
  loadArticle: article.loadArticle,
  loadComments: article.loadComments,
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
