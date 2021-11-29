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

  $("footer").prepend(`<div class="tweetResponseDate"><time class="tweetPostDate">${timeago.format("2021-11-17 8:00:00", "en")}</time></div>`);
  //$("time.timeago").timeago();
});
