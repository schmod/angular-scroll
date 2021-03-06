angular.module('duScroll.scroller', ['duScroll.requestAnimation']).
factory('scroller',
  function($window, requestAnimation, scrollPosition, duScrollEasing) {

    function scrollTo(x, y, duration, context){
      if(!duration) {
        if(context){
          context.scrollLeft = x;
          context.scrollTop = y;
        } else {
          $window.scrollTo(x, y);
        }

        return;
      }
      var start = {
        y: scrollPosition.y(context),
        x: scrollPosition.x(context)
      };
      var delta = {
        y: Math.round(y - start.y),
        x: Math.round(x - start.x)
      };
      if(!delta.x && !delta.y) return;

      var frame = 0;
      var frames = Math.ceil(duration/60);
      var animate = function() {
        frame++;
        var percent = (frame === frames ? 1 : duScrollEasing(frame/frames));
        if(context){
          context.scrollLeft = start.x + Math.ceil(delta.x * percent);
          context.scrollTop = start.y + Math.ceil(delta.y * percent);
        } else {
          $window.scrollTo( start.x + Math.ceil(delta.x * percent), start.y + Math.ceil(delta.y * percent));
        }
        if(frame<frames) { requestAnimation(animate); }
      };
      animate();
    }
    
    function scrollDelta(x, y, duration, context){
      scrollTo(scrollPosition.x(context) + (x || 0), scrollPosition.y(context) + (y || 0), duration, context);
    }

    function scrollToElement(element, offset, duration, context){
      if(!angular.isElement(element)) { return; }
      //Remove jQuery wrapper (if any)
      element = element[0] || element;
      if(!element.getBoundingClientRect) return;

      if(!offset || isNaN(offset)) {
        offset = 0;
      } else {
        offset = -offset;
      }

      var pos = element.getBoundingClientRect();

      if(context) {
        var contextPos = context.getBoundingClientRect();
        offset -= contextPos.top;
      }

      scrollDelta(0, pos.top + offset, duration, context);
    }

    return {
      scrollTo:         scrollTo,
      scrollToElement:  scrollToElement,
      scrollDelta:      scrollDelta
    };
  }
);
