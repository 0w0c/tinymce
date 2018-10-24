import * as DomEvent from './DomEvent';
import * as Scroll from '../view/Scroll';
import Element from '../node/Element';

/* Some browsers (Firefox) fire a scroll event even if the values for scroll don't
 * change. This acts as an intermediary between the scroll event, and the value for scroll
 * changing
 */
var bind = function (doc: Element, handler) {
  var lastScroll = Scroll.get(doc);
  var scrollBinder = DomEvent.bind(doc, 'scroll', function (event) {
    var scroll = Scroll.get(doc);
    if( (scroll.top() !== lastScroll.top()) || (scroll.left() !== lastScroll.left()) )
      handler(scroll);
    lastScroll = scroll;
  });

  return {
    unbind: scrollBinder.unbind
  };
};

export {
  bind
};