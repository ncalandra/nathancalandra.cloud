import React, {Component} from 'react';
import './Blogs.css';

// react-bootstrap imports

// Requset Import
import request from 'request-promise-native';

// react-markdown imports
import ReactMarkdown from 'react-markdown';

class Blogs extends Component {

  constructor(props) {
    super(props);

    let posts = [
      require('./posts/first_post.md'),
      require('./posts/second_post.md')
    ];

    posts.forEach(post => {
      request({
        uri: window.origin + '/' + post,
        headers: {},
        json: true
      })
        .then(data => {
          this.setState({
            posts: [...this.state.posts, data]
          });
        });
    });

    // Initialize state
    this.state = {
      posts: []
    };
  }
  render() {
    return (
      <div className="Blogs">
        <ReactMarkdown source={this.state.posts[0]} />
        <ReactMarkdown source={this.state.posts[1]} />
      </div>
    );
  }
}

export default Blogs;
