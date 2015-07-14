# Echochamber.js [_super alpha_]

## All of the commenting, none of the comments.

Echochamber.js is a third-party script you can install to add a simple comment
form to your blog post or website.

_why not just use disqus?_

Because then there'd be a chance that someone would read the comments. _You_
might have to read those comments. You don't want that.

When a user submits a comment, echochamber.js will save the comment to the user's
LocalStorage, so when they return to the page, they can be confident that their
voice is being heard, and feel _engaged_ with your very engaging content. It does
not make any HTTP requests. Since LocalStorage is only local, you and your database
need not be burdened with other people's opinions.

## Features

- No server required!
- 100% spam-proof!
- Compatible with most blog and static site software
- Styles itself nicely to match your site's colours and fonts

## Installation

Copy and paste the following code where you want your comments to appear:

```html
  <script id="echochamber">
    var EchoChamber = window.EchoChamber || {};
    (function() {
      EchoChamber.discussionURL = window.location;
      var script = document.createElement('script');
      script.src = 'https://s3.amazonaws.com/echochamberjs/dist/main.js';
      script.async = true;
      var entry = document.getElementsByTagName('script')[0];
      entry.parentNode.insertBefore(script, entry);
    })();
  </script>

```

## Screenshot

![screenshot](https://s3.amazonaws.com/f.cl.ly/items/1C2d1h3E2D07432A1W2Q/Screen%20Shot%202015-07-14%20at%206.19.28%20PM.png)
