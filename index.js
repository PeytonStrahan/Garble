
$(document).ready(() => {
  const $body = $('body');
  $body.html(''); // clear the body
  const $refreshButton = $('<button>Refresh Tweets</button>'); //.width('100').height('40'); // create a refresh button to allow for manual refresh of tweets
  $body.append($refreshButton);
  const $tweetsContainer = $('<div></div>'); //.attr('id', 'tweets-container'); // create a container div to separate the tweets from the rest of the body
  $body.append($tweetsContainer);

  const refresh = function() { // create a function that will refresh the tweets on the page whenever it is called
    $tweetsContainer.html(''); // clear the tweets container div
    const $tweets = streams.home.map((tweet) => { // create an array of tweet divs
      const $tweet = $('<div></div>'); // create the tweet div
      const text = `@${tweet.user}: ${tweet.message}`; // put the current tweet's author (user) and message into the div
  
      $tweet.text(text);

      const $timestamp = $('<div><div>').addClass('timestamp'); // create a div for the timestamp
      let relTimestamp = moment(tweet.created_at).fromNow(); // use moment to get a relative timestamp from the created_at property of the current tweet object and then put it into the timestamp div
      $timestamp.text(relTimestamp);
      $tweet.append($timestamp); // append the timestamp div to the tweet div
  
      return $tweet;
    });
    $tweetsContainer.append($tweets.reverse()); // append the array of tweet divs to the tweets container div, making sure to reverse it so that the newest tweets show up first
  };

  refresh(); // initial use of refresh function to prevent empty page on start up
  $refreshButton.on('click', function() { // give the refresh button the ability to refresh the tweets when clicked
    refresh();
  });
});
