
$(document).ready(() => {
  const $body = $('body');
  $body.html(''); // clear the body
  const $siteTitle = $('<h1>Garble</h1>'); // create the website's big display name/title
  $body.append($siteTitle);
  const $siteLogo = $('<image src="https://img00.deviantart.net/a76c/i/2011/030/8/b/wh40k_adeptus_mechanicus_icon_by_hedge_ki_sama-d38exra.png"><br>'); // create the website's logo image
  $body.append($siteLogo);
  const $refreshButton = $('<button><div class="buttonChild">Refresh Messages</div></button>'); // create a refresh button to allow for manual refresh of tweets
  $body.append($refreshButton);
  const $homeButton = $('<button><div class="buttonChild">Home (show all messages)</div></button>'); // create a home button to allow to switch back to the home stream (includes all tweets) and to refresh
  $body.append($homeButton);
  const $messageInputForm = $('<form></form>'); // create a form that allows users to post messages that will show up in the stream
  $body.append($messageInputForm);
  const $tweetsContainer = $('<div></div>'); // create a container div to separate the tweets from the rest of the body
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
      streamSource = streams.users[$(this).attr('id')];
      refresh(streamSource);
    });

    // STYLING (for everything contained inside of the tweets container div)
    $('.username').hover( // usernames change color when hovered over
      function() {
        $(this).css("color", "blue");
        $(this).css("text-decoration", "underline");
      },
      function() {
        $(this).css("color", "black");
        $(this).css("text-decoration", "unset");
      }
    );

    $('.tweet').css('margin', '1.5%').css('background-image', 'linear-gradient(white, darkgray)').css('border-style', 'solid').css('border-width', '5px').css('border-color', 'orange');
    $('.username').css('float', 'left');
    $('.message').css('white-space', 'pre-wrap');
  };

  refresh(); // initial use of refresh function to prevent empty page on start up

  const addInputMessage = function(inputName, inputMessage) { // pushes a new user-created tweet to both streams
    window.visitor = inputName; // sets the global visitor property to the input name (is used in writeTweet function)
    if(streams.users[inputName] === undefined) { // creates a property in streams.users from inputName and assigns it to an empty array if said property doesn't already exist
      streams.users[inputName] = [];
    }
    writeTweet(inputMessage); // calls writeTweet utility function with the input message to create and push a new tweet to both streams
    const timestamp = new Date(); // create a new timestamp to give the new tweet
    // While it is probably safe to just instantly modify the last object in streams.home, a loop is used here in case a randomized tweet is somehow made before the loop runs and after the user-made tweet is added to stream.home.
    for (let i = streams.home.length - 1; i >= 0; i--) { // loop backward through streams.home to find the last tweet made with a user property equal to the input name
      if (streams.home[i].user === inputName) { // if the names match,...
        streams.home[i].created_at = timestamp; // then give that tweet object a created_at property (used for timestamp)
        break; // stop the loop
      }
    }
    // Since the new property in streams.users is not affected by the random tweet generator, we can just modify the last tweet in the property's array to have a created_at property (timestamp).
    streams.users[inputName][streams.users[inputName].length - 1].created_at = timestamp;
  };

  $messageInputForm.append('<label for="inputName">Name:</label><br>',
    '<input type="text" id="inputName" name="inputName"><br><br>',
    '<label for="inputMessage">Message:</label><br>',
    '<textarea type="text" id="inputMessage" name="inputMessage"></textarea><br><br>',
    '<input type="submit" id="submit" value="Submit">'); // populate the input form with various input fields

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
  $body.css('background-image', 'url(https://media.giphy.com/media/YFI1WOcZaYKZsbVWhF/giphy.gif)').css('background-size', '100%').css('font-size', '300%');
  $siteTitle.css('color', 'red').css('padding-left', '115px').css('padding-top', '2%').css('font-family', 'fantasy');
  $messageInputForm.css('background-image', 'linear-gradient(darkgray, grey, orange, red)').css('margin', 'auto').css('padding-bottom', '10px').css('width', '75%').css('border-radius', '15px');
  $('#inputName').css('margin', 'auto').css('display', 'grid').css('width', '90%').css('font-size', '50px').css('font-family', 'serif');
  $('#inputMessage').css('margin', 'auto').css('display', 'grid').css('width', '90%').css('font-size', '50px').css('font-family', 'serif');
  $('#submit').css('background-image', 'radial-gradient(cyan, blue, darkgray, black)').css('margin', 'auto').css('display', 'grid').css('font-size', '150%').css('font-family', 'serif').css('border-radius', '100%');
  $tweetsContainer.css('background-color', 'green').css('margin', 'auto').css('margin-top', '10px').css('display', 'grid').css('width', '50%').css('border-radius', '30px');
  $('button').css('background-image', 'repeating-linear-gradient(45deg, rgb(150, 150, 150) 0px, black 30px, yellow 30px, maroon 60px)').css('margin-left', '20%').css('margin-bottom', '10px').width('20%').height('100px').css('border-style', 'solid').css('border-width', '10px').css('border-color', 'silver');
  $('.buttonChild').css('background-color', 'gray').css('font-size', '40px').css('font-family', 'serif').css('font-weight', 'bold').css('border-radius', '15px');
  $('title').text('Garble');
});
