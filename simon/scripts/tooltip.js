'use strict'; /**
               * @license
               * Copyright 2015 Google Inc. All Rights Reserved.
               *
               * Licensed under the Apache License, Version 2.0 (the "License");
               * you may not use this file except in compliance with the License.
               * You may obtain a copy of the License at
               *
               *      http://www.apache.org/licenses/LICENSE-2.0
               *
               * Unless required by applicable law or agreed to in writing, software
               * distributed under the License is distributed on an "AS IS" BASIS,
               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
               * See the License for the specific language governing permissions and
               * limitations under the License.
               */

(function () {
  'use strict';

  /**
                 * Class constructor for Tooltip MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialTooltip = function MaterialTooltip(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialTooltip'] = MaterialTooltip;

  /**
                                                * Store constants in one place so they can be updated easily.
                                                *
                                                * @enum {string | number}
                                                * @private
                                                */
  MaterialTooltip.prototype.Constant_ = {
    // None for now.
  };

  /**
      * Store strings for class names defined by this component that are used in
      * JavaScript. This allows us to simply change it in one place should we
      * decide to modify at a later date.
      *
      * @enum {string}
      * @private
      */
  MaterialTooltip.prototype.CssClasses_ = {
    IS_ACTIVE: 'is-active',
    BOTTOM: 'mdl-tooltip--bottom',
    LEFT: 'mdl-tooltip--left',
    RIGHT: 'mdl-tooltip--right',
    TOP: 'mdl-tooltip--top' };


  /**
                                * Handle mouseenter for tooltip.
                                *
                                * @param {Event} event The event that fired.
                                * @private
                                */
  MaterialTooltip.prototype.handleMouseEnter_ = function (event) {
    var props = event.target.getBoundingClientRect();
    var left = props.left + props.width / 2;
    var top = props.top + props.height / 2;
    var marginLeft = -1 * (this.element_.offsetWidth / 2);
    var marginTop = -1 * (this.element_.offsetHeight / 2);

    if (this.element_.classList.contains(this.CssClasses_.LEFT) || this.element_.classList.contains(this.CssClasses_.RIGHT)) {
      left = props.width / 2;
      if (top + marginTop < 0) {
        this.element_.style.top = '0';
        this.element_.style.marginTop = '0';
      } else {
        this.element_.style.top = top + 'px';
        this.element_.style.marginTop = marginTop + 'px';
      }
    } else {
      if (left + marginLeft < 0) {
        this.element_.style.left = '0';
        this.element_.style.marginLeft = '0';
      } else {
        this.element_.style.left = left + 'px';
        this.element_.style.marginLeft = marginLeft + 'px';
      }
    }

    if (this.element_.classList.contains(this.CssClasses_.TOP)) {
      this.element_.style.top = props.top - this.element_.offsetHeight - 10 + 'px';
    } else if (this.element_.classList.contains(this.CssClasses_.RIGHT)) {
      this.element_.style.left = props.left + props.width + 10 + 'px';
    } else if (this.element_.classList.contains(this.CssClasses_.LEFT)) {
      this.element_.style.left = props.left - this.element_.offsetWidth - 10 + 'px';
    } else {
      this.element_.style.top = props.top + props.height + 10 + 'px';
    }

    this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
  };

  /**
      * Hide tooltip on mouseleave or scroll
      *
      * @private
      */
  MaterialTooltip.prototype.hideTooltip_ = function () {
    this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
  };

  /**
      * Initialize element.
      */
  MaterialTooltip.prototype.init = function () {

    if (this.element_) {
      var forElId = this.element_.getAttribute('for') ||
      this.element_.getAttribute('data-mdl-for');

      if (forElId) {
        this.forElement_ = document.getElementById(forElId);
      }

      if (this.forElement_) {
        // It's left here because it prevents accidental text selection on Android
        if (!this.forElement_.hasAttribute('tabindex')) {
          this.forElement_.setAttribute('tabindex', '0');
        }

        this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
        this.boundMouseLeaveAndScrollHandler = this.hideTooltip_.bind(this);
        this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
        this.forElement_.addEventListener('touchend', this.boundMouseEnterHandler, false);
        this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveAndScrollHandler, false);
        window.addEventListener('scroll', this.boundMouseLeaveAndScrollHandler, true);
        window.addEventListener('touchstart', this.boundMouseLeaveAndScrollHandler);
      }
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialTooltip,
    classAsString: 'MaterialTooltip',
    cssClass: 'mdl-tooltip' });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxUb29sdGlwIiwiZWxlbWVudCIsImVsZW1lbnRfIiwiaW5pdCIsIndpbmRvdyIsInByb3RvdHlwZSIsIkNvbnN0YW50XyIsIkNzc0NsYXNzZXNfIiwiSVNfQUNUSVZFIiwiQk9UVE9NIiwiTEVGVCIsIlJJR0hUIiwiVE9QIiwiaGFuZGxlTW91c2VFbnRlcl8iLCJldmVudCIsInByb3BzIiwidGFyZ2V0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVmdCIsIndpZHRoIiwidG9wIiwiaGVpZ2h0IiwibWFyZ2luTGVmdCIsIm9mZnNldFdpZHRoIiwibWFyZ2luVG9wIiwib2Zmc2V0SGVpZ2h0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJzdHlsZSIsImFkZCIsImhpZGVUb29sdGlwXyIsInJlbW92ZSIsImZvckVsSWQiLCJnZXRBdHRyaWJ1dGUiLCJmb3JFbGVtZW50XyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJoYXNBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJib3VuZE1vdXNlRW50ZXJIYW5kbGVyIiwiYmluZCIsImJvdW5kTW91c2VMZWF2ZUFuZFNjcm9sbEhhbmRsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50SGFuZGxlciIsInJlZ2lzdGVyIiwiY29uc3RydWN0b3IiLCJjbGFzc0FzU3RyaW5nIiwiY3NzQ2xhc3MiXSwibWFwcGluZ3MiOiJjQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxDQUFDLFlBQVc7QUFDVjs7QUFFQTs7Ozs7Ozs7QUFRQSxNQUFJQSxrQkFBa0IsU0FBU0EsZUFBVCxDQUF5QkMsT0FBekIsRUFBa0M7QUFDdEQsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7O0FBRUE7QUFDQSxTQUFLRSxJQUFMO0FBQ0QsR0FMRDtBQU1BQyxTQUFPLGlCQUFQLElBQTRCSixlQUE1Qjs7QUFFQTs7Ozs7O0FBTUFBLGtCQUFnQkssU0FBaEIsQ0FBMEJDLFNBQTFC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QUE4QixVQUE5QixFQUEwQyxHQUExQztBQUNEOztBQUVELGFBQUtDLHNCQUFMLEdBQThCLEtBQUsxQixpQkFBTCxDQUF1QjJCLElBQXZCLENBQTRCLElBQTVCLENBQTlCO0FBQ0EsYUFBS0MsK0JBQUwsR0FBdUMsS0FBS1gsWUFBTCxDQUFrQlUsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBdkM7QUFDQSxhQUFLTixXQUFMLENBQWlCUSxnQkFBakIsQ0FBa0MsWUFBbEMsRUFBZ0QsS0FBS0gsc0JBQXJELEVBQTZFLEtBQTdFO0FBQ0EsYUFBS0wsV0FBTCxDQUFpQlEsZ0JBQWpCLENBQWtDLFVBQWxDLEVBQThDLEtBQUtILHNCQUFuRCxFQUEyRSxLQUEzRTtBQUNBLGFBQUtMLFdBQUwsQ0FBaUJRLGdCQUFqQixDQUFrQyxZQUFsQyxFQUFnRCxLQUFLRCwrQkFBckQsRUFBc0YsS0FBdEY7QUFDQXJDLGVBQU9zQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxLQUFLRCwrQkFBdkMsRUFBd0UsSUFBeEU7QUFDQXJDLGVBQU9zQyxnQkFBUCxDQUF3QixZQUF4QixFQUFzQyxLQUFLRCwrQkFBM0M7QUFDRDtBQUNGO0FBQ0YsR0F6QkQ7O0FBMkJBO0FBQ0E7QUFDQUUsbUJBQWlCQyxRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWE3QyxlQURXO0FBRXhCOEMsbUJBQWUsaUJBRlM7QUFHeEJDLGNBQVUsYUFIYyxFQUExQjs7QUFLRCxDQXhJRCIsImZpbGUiOiJ0b29sdGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgVG9vbHRpcCBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuICB2YXIgTWF0ZXJpYWxUb29sdGlwID0gZnVuY3Rpb24gTWF0ZXJpYWxUb29sdGlwKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxUb29sdGlwJ10gPSBNYXRlcmlhbFRvb2x0aXA7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRvb2x0aXAucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICAvLyBOb25lIGZvciBub3cuXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRvb2x0aXAucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIElTX0FDVElWRTogJ2lzLWFjdGl2ZScsXG4gICAgQk9UVE9NOiAnbWRsLXRvb2x0aXAtLWJvdHRvbScsXG4gICAgTEVGVDogJ21kbC10b29sdGlwLS1sZWZ0JyxcbiAgICBSSUdIVDogJ21kbC10b29sdGlwLS1yaWdodCcsXG4gICAgVE9QOiAnbWRsLXRvb2x0aXAtLXRvcCdcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIG1vdXNlZW50ZXIgZm9yIHRvb2x0aXAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxUb29sdGlwLnByb3RvdHlwZS5oYW5kbGVNb3VzZUVudGVyXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHByb3BzID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciBsZWZ0ID0gcHJvcHMubGVmdCArIChwcm9wcy53aWR0aCAvIDIpO1xuICAgIHZhciB0b3AgPSBwcm9wcy50b3AgKyAocHJvcHMuaGVpZ2h0IC8gMik7XG4gICAgdmFyIG1hcmdpbkxlZnQgPSAtMSAqICh0aGlzLmVsZW1lbnRfLm9mZnNldFdpZHRoIC8gMik7XG4gICAgdmFyIG1hcmdpblRvcCA9IC0xICogKHRoaXMuZWxlbWVudF8ub2Zmc2V0SGVpZ2h0IC8gMik7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5MRUZUKSB8fCB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlJJR0hUKSkge1xuICAgICAgbGVmdCA9IChwcm9wcy53aWR0aCAvIDIpO1xuICAgICAgaWYgKHRvcCArIG1hcmdpblRvcCA8IDApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSAnMCc7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblRvcCArICdweCc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChsZWZ0ICsgbWFyZ2luTGVmdCA8IDApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLm1hcmdpbkxlZnQgPSAnMCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5tYXJnaW5MZWZ0ID0gbWFyZ2luTGVmdCArICdweCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QKSkge1xuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSBwcm9wcy50b3AgLSB0aGlzLmVsZW1lbnRfLm9mZnNldEhlaWdodCAtIDEwICsgJ3B4JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uUklHSFQpKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmxlZnQgPSBwcm9wcy5sZWZ0ICsgcHJvcHMud2lkdGggKyAxMCArICdweCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkxFRlQpKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmxlZnQgPSBwcm9wcy5sZWZ0IC0gdGhpcy5lbGVtZW50Xy5vZmZzZXRXaWR0aCAtIDEwICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS50b3AgPSBwcm9wcy50b3AgKyBwcm9wcy5oZWlnaHQgKyAxMCArICdweCc7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgfTtcblxuICAvKipcbiAgICogSGlkZSB0b29sdGlwIG9uIG1vdXNlbGVhdmUgb3Igc2Nyb2xsXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRvb2x0aXAucHJvdG90eXBlLmhpZGVUb29sdGlwXyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHZhciBmb3JFbElkID0gdGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2ZvcicpIHx8XG4gICAgICAgICAgdGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWRsLWZvcicpO1xuXG4gICAgICBpZiAoZm9yRWxJZCkge1xuICAgICAgICB0aGlzLmZvckVsZW1lbnRfID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZm9yRWxJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmZvckVsZW1lbnRfKSB7XG4gICAgICAgIC8vIEl0J3MgbGVmdCBoZXJlIGJlY2F1c2UgaXQgcHJldmVudHMgYWNjaWRlbnRhbCB0ZXh0IHNlbGVjdGlvbiBvbiBBbmRyb2lkXG4gICAgICAgIGlmICghdGhpcy5mb3JFbGVtZW50Xy5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib3VuZE1vdXNlRW50ZXJIYW5kbGVyID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJvdW5kTW91c2VMZWF2ZUFuZFNjcm9sbEhhbmRsZXIgPSB0aGlzLmhpZGVUb29sdGlwXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmZvckVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLmJvdW5kTW91c2VFbnRlckhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuYm91bmRNb3VzZUVudGVySGFuZGxlciwgZmFsc2UpO1xuICAgICAgICB0aGlzLmZvckVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLmJvdW5kTW91c2VMZWF2ZUFuZFNjcm9sbEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuYm91bmRNb3VzZUxlYXZlQW5kU2Nyb2xsSGFuZGxlciwgdHJ1ZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5ib3VuZE1vdXNlTGVhdmVBbmRTY3JvbGxIYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFRvb2x0aXAsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsVG9vbHRpcCcsXG4gICAgY3NzQ2xhc3M6ICdtZGwtdG9vbHRpcCdcbiAgfSk7XG59KSgpO1xuIl19
