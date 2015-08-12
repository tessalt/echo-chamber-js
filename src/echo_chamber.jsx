var React = require('react');
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}


var App = {
  
  init: function () {
    var entry = document.getElementById('echochamber');
    var div = document.createElement('div');
    var container = entry.parentNode.insertBefore(div, entry)
    React.render(<Frame/>, div);
  }
}

var Frame = React.createClass({
  getInitialState: function () {
    return {
      height: 0,
      styles: {
        width: '100%',
        overflow: 'hidden',
        border: 'none',
        transition: 'opacity .5s',
        opacity: 0
      }
    }
  },
  componentDidMount: function() {
    var link   = document.createElement('link'),
        img    = document.createElement( "img" ),
        body   = document.body,
        head   = this.getDOMNode().contentDocument.head,
        cssURL = EchoChamber.host + '/main.css'; 
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssURL; 
    head.appendChild(link);
    body.appendChild(img);
    img.src = cssURL;
    img.onerror = function() {
      body.removeChild(img);
      _applyPageStyles(this.getDOMNode().contentDocument, this.pageStyles);
      this.setState({
        styles: Object.assign(this.state.styles, {
          opacity: 1
        })
      })
      React.render(<CommentBox path={window.location.href} onResize={this.onResize} />, this.getDOMNode().contentDocument.body);
    }.bind(this);
  },
  componentDidUpdate: function() {
    React.render(<CommentBox path={window.location.href}  onResize={this.onResize} />,  this.getDOMNode().contentDocument.body);
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  },
  onResize: function (height) {
    this.setState({
      height: height
    })
  },
  render: function () {
    var styles = {
      width: '100%',
      overflow: 'hidden',
      border: 'none',
      transition: 'opacity .5s'
    };
    return (
      <iframe height={this.state.height} style={styles} scrolling="false" horizontalscrolling="no" verticalscrolling="no"/>
    )
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      data: this.loadComments()
    }
  },
  loadComments: function () {
    var rawComments = localStorage.getItem(this.props.path) || '[]';
    return JSON.parse(rawComments);
  },
  saveComments: function () {
    localStorage.setItem(this.props.path, JSON.stringify(this.state.data));
  },
  componentDidMount: function () {
    this.updateHeight();
  },
  onCommentSubmit: function (comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({
      data: newComments
    }, function () {    
      this.saveComments();
      this.updateHeight();
    });
  },
  updateHeight: function () {
    var height = this.getDOMNode().clientHeight + 20;
    this.props.onResize(height);
  },
  render: function () {
    var length = this.state.data.length;
    var commentsWord = this.state.data.length === 1 ? 'comment' : 'comments';
    return (
      <div>
        <h1>{length} {commentsWord}</h1>
        <CommentForm onCommentSubmit={this.onCommentSubmit} />
        <CommentList comments={this.state.data} />
      </div>
    )
  }
});

var CommentList = React.createClass({
  render: function () {
    var comments = this.props.comments.map(function (comment) {
      return <Comment data={comment}/>
    })
    return (
      <div>
        {comments}
      </div>
    )
  }
});

var Comment = React.createClass({
  render: function () {
    return (
      <div>
        <h3>{this.props.data.author.name}</h3>
        <p>{this.props.data.author.email}</p>
        <p>{this.props.data.message}</p>
      </div>
    )
  }
});

var CommentForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var email = React.findDOMNode(this.refs.email).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author || !email) {
      return;
    }
    this.props.onCommentSubmit({
      author: {
        name: author, 
        email: email
      },
      message: text
    });
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="email" placeholder="Your email" ref="email" />
        <textarea placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    )
  }
});

var _applyPageStyles = function(doc, styles) {
  var body = doc.getElementsByTagName('body')[0];
  for (var property in styles) {
    if (!styles.hasOwnProperty(property)) {
      return;
    }
    body.style[property] = styles[property];
  }
  var buttons = doc.querySelectorAll(".button");
  var paragraphs = doc.getElementsByTagName('p');
  var bgColor;
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style['background-color'] = styles.anchorColor;
  }
};

var _getStyle = function(node, property) {
  var value;
  value = window.getComputedStyle(node, null).getPropertyValue(property);
  if (value === '' || value === 'transparent' || value === 'rgba(0,0,0,0)') {
    return _getStyle(node.parentNode, property);
  } else {
    return value || '';
  }
};

var _getBasicStyles = function(container) {
  var anchor = document.createElement('a');
  var paragraph = document.createElement('p');
  container.appendChild(anchor);
  container.appendChild(paragraph);
  var styles = {
    anchorColor: _getStyle(anchor, 'color'),
    paragraphColor: _getStyle(paragraph, 'color'),
    fontFamily: _getStyle(container, 'font-family').replace(/['"]/g, '')
  }
  anchor.parentNode.removeChild(anchor);
  paragraph.parentNode.removeChild(paragraph);
  return styles;
};

function _debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

module.exports = App;
