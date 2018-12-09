'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} contributorList The parent element in which to render the contributor.
  */
  render(contributorList) {
    let li = Util.createAndAppend("li", contributorList, { class: "contributorItem" });
    Util.createAndAppend("img", li, {src: this.data.avatar_url, class: "contributorsAvatar"});
    Util.createAndAppend("a", li, 
    {text: this.data.login, href: this.data.html_url, target: "_blank", class: "contributorName"});
    Util.createAndAppend("div", li, {text: this.data.contributions, class: "contributorBadge"});
  }
}
