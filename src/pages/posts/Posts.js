import React, {Component} from 'react';
import './Posts.css';

// react-bootstrap imports
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Requset Import
import request from 'request-promise-native';

// react-markdown imports
import ReactMarkdown from 'react-markdown';

class Posts extends Component {

  constructor(props) {
    super(props);

    let posts = [
      'first_post',
      'second_post'
    ];

    posts.forEach(post => {
      request({
        uri: window.origin + '/post_content/' + post + '.md',
        headers: {},
        json: true
      })
        .then(data => {
          this.setState({
            posts: [...this.state.posts, {name: post, content: data}]
          });
        });
    });

    let selected = '';
    if (window.location.hash !== '') {
      selected = window.location.hash.substr(1);
    }

    // Initialize state
    this.state = {
      posts: [],
      selected: selected
    };
  }

  updateSelected = (action) => {
    this.setState({
      selected: action.target.getAttribute('value')
    });
  }

  render() {

    // List of Posts
    const postContent = this.state.posts
      .sort((a, b) => a.name > b.name)
      .map(post => {


        return (
          <Tab.Pane
            key={post.name}
            active={post.name === this.state.selected}
            eventKey={'#' + post.name}
          >
            <ReactMarkdown source={post.content}/>
          </Tab.Pane>
        );
      });

    // List of Posts
    const postList = this.state.posts
      .sort((a, b) => a.name > b.name)
      .map(post => {
        return (
          <ListGroup.Item
            action
            active={post.name === this.state.selected}
            href={'#' + post.name}
            key={post.name}
            value={post.name}
            onClick={this.updateSelected}
          >
            {post.name}
          </ListGroup.Item>
        );
      });


    return (
      <div className="Posts">
        <Container>
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
              <Col sm={10}>
                <Tab.Content>
                  {postContent}
                </Tab.Content>
              </Col>
              <Col sm={2}>
                <ListGroup>
                  {postList}
                </ListGroup>
              </Col>
            </Row>
          </Tab.Container>
        </Container>

      </div>
    );
  }
}

export default Posts;
