
$(document).ready(() => {
  const $body = $('body');
  $body.html(''); // clear the body
  const $siteTitle = $('<h1>Garble</h1>'); // create the website's big display name/title
  $body.append($siteTitle);
  const $refreshButton = $('<button>Refresh Tweets</button>'); //.width('100').height('40'); // create a refresh button to allow for manual refresh of tweets
  $body.append($refreshButton);
  const $homeButton = $('<button>Home (show all tweets)</button>'); //.width('100').height('40'); // create a home button to allow to switch back to the home stream (includes all tweets) and to refresh
  $body.append($homeButton);
  const $messageInputForm = $('<form></form>').css('background-color', 'darkgray'); // create a form that allows users to post messages that will show up in the stream
  $body.append($messageInputForm);
  const $tweetsContainer = $('<div></div>').css('background-color', 'green'); //.attr('id', 'tweets-container'); // create a container div to separate the tweets from the rest of the body
  $body.append($tweetsContainer);
  let streamSource = streams.home; // create a stream source variable that is set to the array of tweets in home by default (this array includes all tweets by all users)

  const refresh = function(inputStreamSource = streams.home) { // create a function that takes in an array of tweets (is home by default) and will refresh the tweets on the page to be the tweets from the given array whenever it is called 
    $tweetsContainer.html(''); // clear the tweets container div
    const $tweets = inputStreamSource.map((tweet) => { // create an array of tweet divs
      const $tweet = $('<div></div>').addClass('tweet'); // create the tweet div
      const $username = $(`<div>@${tweet.user}:</div>`).addClass('username').attr('id', tweet.user); // create the username div
      const $message = $(`<div> ${tweet.message}</div>`).addClass('message'); // create the message div

      $tweet.append([$username, $message]); // put the current tweet's author (username) div and message div into the tweet div

      const $timestamp = $('<div></div>').addClass('timestamp'); // create a div for the timestamp
      const formTimestamp = moment(tweet.created_at).format('MMMM DD, YYYY LT'); // use moment to create and format a timestamp (date and time) derived from the current tweet object's created_at property
      const relTimestamp = moment(tweet.created_at).fromNow(); // use moment to get a relative timestamp from the created_at property of the current tweet object
      $timestamp.text(`${formTimestamp} (${relTimestamp})`); // apply both the formatted timestamp and the relative timestamp to the timestamp div
      $tweet.append($timestamp); // append the timestamp div to the tweet div
  
      return $tweet;
    });
    $tweetsContainer.append($tweets.reverse()); // append the array of tweet divs to the tweets container div, making sure to reverse it so that the newest tweets show up first

    $('.username').on('click', function() { // Changes the current stream source to be the one associated with the clicked-on username. This also refreshes the stream's tweets.
      //const userTimeline = streams.home.filter((tweet) => tweet.user === $(this).attr('id'));
      streamSource = streams.users[$(this).attr('id')];
      refresh(streamSource);
    });

    // STYLING (for everything contained inside of the tweets container div)
    $('.username').hover( // usernames change color when hovered over
      function() {
        $(this).css("color", "blue");
      },
      function() {
        $(this).css("color", "black");
      }
    );

    $('.tweet').css('margin', '10px').css('background-color', 'orange');
    $('.username').css('float', 'left');
    $('.message').css('white-space', 'pre-wrap');
  };

  refresh(); // initial use of refresh function to prevent empty page on start up

  const addInputMessage = function(inputName, inputMessage) { // create a function that takes in a name and a message, creates a tweet object, creates a user property in streams.users (if it doesn't already exist), pushes the tweet to both the array in the newly created user property in streams.users and the array in streams.home
    console.log(arguments);
    window.visitor = inputName;
    // const tweet = {
    //   user: 1,
    //   message: 1,
    //   created_at: 1
    // };
    // addTweet(tweet);
    writeTweet(inputMessage);
  };

  $messageInputForm.append('<label for="inputName">Name:</label><br>', '<input type="text" id="inputName" name="inputName"><br><br>', '<label for="inputMessage">Message:</label><br>', '<textarea type="text" id="inputMessage" name="inputMessage"></textarea><br><br>', '<input type="submit" id="submit" value="Submit">'); // populate the input form with various input fields

  $messageInputForm.attr('onSubmit', 'return false'); // prevent the submit button from refreshing the page

  $('#submit').on('click', function() { // give the submit button the ability to call the addInputMessage function (when clicked) using the values in the message input form as arguments
    addInputMessage($('#inputName').val(), $('#inputMessage').val());
  });

  $refreshButton.on('click', function() { // give the refresh button the ability to refresh the current stream's tweets when clicked
    refresh(streamSource);
  });

  $homeButton.on('click', function() { // give the home button the ability to reset the current stream source to home and to refresh the stream's tweets
    streamSource = streams.home;
    refresh();
  });

  // STYLING (general)

});
