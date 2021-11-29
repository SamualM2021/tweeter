// Note: Used a different naming convention than what was asked for consistency
$(document).ready(function() {
  const BACKSPACE_KEY = "Backspace";
  const DELETE_KEY = "Delete";
  const MAXIMUM_COUNT = 140;
  const MINIMUM_COUNT = 0;

  /**
   * This registers a keyup event so we can modify the counter for
   * the tweet submission form
   */
  document.getElementById("tweetText").addEventListener("keyup", function(event) {
    // Went from keydown to keyup after noticing an issue with backspace
    let $tweetCharCount = $(this).val().length;
    let $currentCount = $(this).closest("form").find(".counter").text();
    let newCount = MAXIMUM_COUNT - $tweetCharCount;
    let $tweetCounter = $(this).closest("form").find(".counter");
    $tweetCounter.text(newCount);
    if (newCount < MINIMUM_COUNT) {
      $tweetCounter.addClass("invalidTweetLength")
    } else {
      $tweetCounter.removeClass("invalidTweetLength")
    }
 }, false);
});