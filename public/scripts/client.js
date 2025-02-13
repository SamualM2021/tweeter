//Global Const
const TWEET_ROUTE = "/tweets/";
const MAXIMUM_COUNT = 140;
const INVALID_TWEET_EMPTY_MESSAGE = "Invalid Tweet: No tweet text present!";
const INVALID_TWEET_TOO_LONG_MESSAGE = "Invalid Tweet: Tweet text has exceeded maximum length!";

/**
 * https://shashankvivek-7.medium.com/understanding-xss-and-preventing-it-using-pure-javascript-ef0668b37687
 * @returns XSS String escape prototype provided by
 * Shashank Vivek
 */
String.prototype.escape = function() {
  var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
  };
  return this.replace(/[&<>]/g, function(tag) {
      return tagsToReplace[tag] || tag;
  });
};

/**
 * This class is responsible for the logic of building a tweet
 */
class TweetBuilder {
  #tweet;
  constructor() {

  }

  //Helper Functions to Build individual components of a tweetDisplay Article
  buildTweetHeader = tweetDataObject => {
    return `
      <header>
        <img class = "tweetDisplayIcon" src=${tweetDataObject.user.avatars.escape()}>
        <div class="tweetDisplayName">${tweetDataObject.user.name.escape()}</div>
        <div class="tweetDisplayTag">${tweetDataObject.user.handle.escape()}</div>
      </header>
    `;
  }

  buildTweetContent = tweetDataObject => {
    return `
      <div class="tweetContent">${tweetDataObject.content.text.escape()}</div>
    `;
  }

  buildTweetFooter =  createdDate => {
    return `
      <footer>
        <div class="tweetResponseDate"><time class="tweetPostDate">${timeago.format(createdDate, "en")}</time></div>
        <div class= tweetResponseIcons><i class="fa fa-flag" aria-hidden="true"></i><i class="fa fa-retweet" aria-hidden="true"></i><i class="fa fa-heart" aria-hidden="true"></i></div>
      </footer>
    `;
  }

  build = (tweetDataObject) => {
    //Build the Header
    let tweetHeader = this.buildTweetHeader(tweetDataObject);

    //Build Content
    let tweetContent = this.buildTweetContent(tweetDataObject);

    //Build the Footer
    let createdDate = `${new Date(tweetDataObject.created_at)}`;
    let tweetFooter =  this.buildTweetFooter(createdDate);

    //Build the Article
    this.#tweet = `<article>${tweetHeader}${tweetContent}${tweetFooter}</article>`;
    return this.#tweet;
  };
}


/**
 * Given the metadata for a tweet this creates a tweet object and returns it
 * @param {The object we're creating an element for} tweetDataObject
 * @returns HTML markup of the element as a String
 */
const createTweetElement = tweetDataObject => {
  let tweetBuilder = new TweetBuilder();
  return tweetBuilder.build(tweetDataObject);
};

/**
 * Renders each object in the array into our tweetDisplay container
 * @param {the array of tweet data objects we have} tweetDataObjectArray
 */
const renderTweets = tweetDataObjectArray => {
  //Sort the array by date -- this will make the most recent tweets display at the top
  tweetDataObjectArray.sort((first, second) => {
    return new Date(second.created_at) - new Date(first.created_at);
  });

  // For each object in our array create a tweetElement for it
  tweetDataObjectArray.forEach(element => {
    $("section.tweetDisplay").append(createTweetElement(element));
  });
};

const loadTweets = () => {
  $("article").remove();
  $.get(TWEET_ROUTE, function(data, status) {
    renderTweets(data);
  });
};

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
jQuery(document).ready(function() {
  const SECONDS = 60;
  const MINUTES = 60;
  const HOURS = 24;
  const SECONDS_IN_DAY = HOURS * MINUTES * SECONDS;

  const getTimeDifference = (first, second) => {

  };
  /**
   * Custom Locale calculations were provided by acusti
   * https://github.com/hustcc/timeago.js/issues/139#issuecomment-424162015
   * @param {*} number
   * @param {*} index
   * @param {*} timeDeltaInSecs
   * @returns
   */
  const humanizedDate = (number, index, timeDeltaInSecs) => {
    let needsCheckToConvertIntoDays = (index === 8);
    let needsCheckToAccountForMidnight = (index === 6 || index === 7)

    if (needsCheckToAccountForMidnight) {
      // Calculate seconds since midnight for right now
      const now = new Date();
      const secondsSinceMidnight =
          now.getSeconds() + (now.getMinutes() * SECONDS) + (now.getHours() * MINUTES * SECONDS);

      // Subtract seconds since midnight from total_sec, divide by seconds in a day, round down
      // Result is off-by-one number of days since datetime (unless time was at midnight)
      const daysFloored = Math.floor((timeDeltaInSecs - secondsSinceMidnight) / SECONDS_IN_DAY);
      // If time was at midnight (00:00), it will divide evenly with SECONDS_IN_DAY
      // That will make it count as from the previous day, which we do not want
      const remainder = (timeDeltaInSecs - secondsSinceMidnight) % SECONDS_IN_DAY;
      const days = remainder >= 1 ? daysFloored + 1 : daysFloored;
      const noun = days === 1 ? 'day' : 'days';
      return [`${days} ${noun} ago`, `in ${days} ${noun}`];
  }

    // Converts 1 week ago to _ days ago for dates longer than a week but less
    // than 2
    if (needsCheckToConvertIntoDays) {
      const days = Math.round(timeDeltaInSecs / SECONDS / MINUTES / HOURS);
      if (days > 8) {
          return [`${days} days ago`, `in ${days} days`];
      }
    }



    return [
      ['just now', 'right now'],
      ['%s seconds ago', 'in %s seconds'],
      ['1 minute ago', 'in 1 minute'],
      ['%s minutes ago', 'in %s minutes'],
      ['1 hour ago', 'in 1 hour'],
      ['%s hours ago', 'in %s hours'],
      ['1 day ago', 'in 1 day'],
      ['%s days ago', 'in %s days'],
      ['1 week ago', 'in 1 week'],
      ['%s weeks ago', 'in %s weeks'],
      ['1 month ago', 'in 1 month'],
      ['%s months ago', 'in %s months'],
      ['1 year ago', 'in 1 year'],
      ['%s years ago', 'in %s years']
    ][index];
  };

  timeago.register('en', humanizedDate);

  window.onscroll = function() {showNavToTop()};

  function showNavToTop() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      navToTopIcon.style.display = "block";
    } else {
      navToTopIcon.style.display = "none";
    }
  }
  $("#navToTopIcon").on("click", function(event) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Oper
  });

  $("#newTweetNavIcon").on("click", function(event) {

    $(".newTweet").slideToggle("slow")
    $("#tweetText").focus();
  });


  $("#newTweetButton").on("click", function(event) {
    //override the default behaviour
    event.preventDefault();

    let $form = $(this).closest("form");
    let $errorDisplay = $form.find("#newTweetErrorDisplay");
    let $tweetText = $form.find("#tweetText");
    let $formData = $tweetText.serialize();

    let $tweetTextVal = $tweetText.val().trim();
    let isTweetEmpty = ($tweetTextVal === "" || $tweetTextVal === null);
    let isTweetTooLong = $tweetTextVal.length > MAXIMUM_COUNT;
    if (isTweetEmpty) {
      $errorDisplay.slideDown("slow");
      $errorDisplay.text(INVALID_TWEET_EMPTY_MESSAGE).toggle(true);
    } else if (isTweetTooLong) {
      $errorDisplay.slideDown("slow");
      $errorDisplay.text(INVALID_TWEET_TOO_LONG_MESSAGE).toggle(true);
    } else {
      $errorDisplay.text("").toggle(false);
      $tweetText.val("");
      $(".counter").text(MAXIMUM_COUNT);
      // route to our tweets.js
      $.post(TWEET_ROUTE, $formData)
      .done(() => loadTweets());
    }


  });

  loadTweets();
});
