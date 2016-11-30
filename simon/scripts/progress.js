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
                 * Class constructor for Progress MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialProgress = function MaterialProgress(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialProgress'] = MaterialProgress;

  /**
                                                  * Store constants in one place so they can be updated easily.
                                                  *
                                                  * @enum {string | number}
                                                  * @private
                                                  */
  MaterialProgress.prototype.Constant_ = {};


  /**
                                              * Store strings for class names defined by this component that are used in
                                              * JavaScript. This allows us to simply change it in one place should we
                                              * decide to modify at a later date.
                                              *
                                              * @enum {string}
                                              * @private
                                              */
  MaterialProgress.prototype.CssClasses_ = {
    INDETERMINATE_CLASS: 'mdl-progress__indeterminate' };


  /**
                                                           * Set the current progress of the progressbar.
                                                           *
                                                           * @param {number} p Percentage of the progress (0-100)
                                                           * @public
                                                           */
  MaterialProgress.prototype.setProgress = function (p) {
    if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
      return;
    }

    this.progressbar_.style.width = p + '%';
  };
  MaterialProgress.prototype['setProgress'] =
  MaterialProgress.prototype.setProgress;

  /**
                                           * Set the current progress of the buffer.
                                           *
                                           * @param {number} p Percentage of the buffer (0-100)
                                           * @public
                                           */
  MaterialProgress.prototype.setBuffer = function (p) {
    this.bufferbar_.style.width = p + '%';
    this.auxbar_.style.width = 100 - p + '%';
  };
  MaterialProgress.prototype['setBuffer'] =
  MaterialProgress.prototype.setBuffer;

  /**
                                         * Initialize element.
                                         */
  MaterialProgress.prototype.init = function () {
    if (this.element_) {
      var el = document.createElement('div');
      el.className = 'progressbar bar bar1';
      this.element_.appendChild(el);
      this.progressbar_ = el;

      el = document.createElement('div');
      el.className = 'bufferbar bar bar2';
      this.element_.appendChild(el);
      this.bufferbar_ = el;

      el = document.createElement('div');
      el.className = 'auxbar bar bar3';
      this.element_.appendChild(el);
      this.auxbar_ = el;

      this.progressbar_.style.width = '0%';
      this.bufferbar_.style.width = '100%';
      this.auxbar_.style.width = '0%';

      this.element_.classList.add('is-upgraded');
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialProgress,
    classAsString: 'MaterialProgress',
    cssClass: 'mdl-js-progress',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2dyZXNzLmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUHJvZ3Jlc3MiLCJlbGVtZW50IiwiZWxlbWVudF8iLCJpbml0Iiwid2luZG93IiwicHJvdG90eXBlIiwiQ29uc3RhbnRfIiwiQ3NzQ2xhc3Nlc18iLCJJTkRFVEVSTUlOQVRFX0NMQVNTIiwic2V0UHJvZ3Jlc3MiLCJwIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwcm9ncmVzc2Jhcl8iLCJzdHlsZSIsIndpZHRoIiwic2V0QnVmZmVyIiwiYnVmZmVyYmFyXyIsImF1eGJhcl8iLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImFwcGVuZENoaWxkIiwiYWRkIiwiY29tcG9uZW50SGFuZGxlciIsInJlZ2lzdGVyIiwiY29uc3RydWN0b3IiLCJjbGFzc0FzU3RyaW5nIiwiY3NzQ2xhc3MiLCJ3aWRnZXQiXSwibWFwcGluZ3MiOiJjQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxDQUFDLFlBQVc7QUFDVjs7QUFFQTs7Ozs7Ozs7QUFRQSxNQUFJQSxtQkFBbUIsU0FBU0EsZ0JBQVQsQ0FBMEJDLE9BQTFCLEVBQW1DO0FBQ3hELFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCOztBQUVBO0FBQ0EsU0FBS0UsSUFBTDtBQUNELEdBTEQ7QUFNQUMsU0FBTyxrQkFBUCxJQUE2QkosZ0JBQTdCOztBQUVBOzs7Ozs7QUFNQUEsbUJBQWlCSyxTQUFqQixDQUEyQkMsU0FBM0IsR0FBdUMsRUFBdkM7OztBQUdBOzs7Ozs7OztBQVFBTixtQkFBaUJLLFNBQWpCLENBQTJCRSxXQUEzQixHQUF5QztBQUN2Q0MseUJBQXFCLDZCQURrQixFQUF6Qzs7O0FBSUE7Ozs7OztBQU1BUixtQkFBaUJLLFNBQWpCLENBQTJCSSxXQUEzQixHQUF5QyxVQUFTQyxDQUFULEVBQVk7QUFDbkQsUUFBSSxLQUFLUixRQUFMLENBQWNTLFNBQWQsQ0FBd0JDLFFBQXhCLENBQWlDLEtBQUtMLFdBQUwsQ0FBaUJDLG1CQUFsRCxDQUFKLEVBQTRFO0FBQzFFO0FBQ0Q7O0FBRUQsU0FBS0ssWUFBTCxDQUFrQkMsS0FBbEIsQ0FBd0JDLEtBQXhCLEdBQWdDTCxJQUFJLEdBQXBDO0FBQ0QsR0FORDtBQU9BVixtQkFBaUJLLFNBQWpCLENBQTJCLGFBQTNCO0FBQ0lMLG1CQUFpQkssU0FBakIsQ0FBMkJJLFdBRC9COztBQUdBOzs7Ozs7QUFNQVQsbUJBQWlCSyxTQUFqQixDQUEyQlcsU0FBM0IsR0FBdUMsVUFBU04sQ0FBVCxFQUFZO0FBQ2pELFNBQUtPLFVBQUwsQ0FBZ0JILEtBQWhCLENBQXNCQyxLQUF0QixHQUE4QkwsSUFBSSxHQUFsQztBQUNBLFNBQUtRLE9BQUwsQ0FBYUosS0FBYixDQUFtQkMsS0FBbkIsR0FBNEIsTUFBTUwsQ0FBUCxHQUFZLEdBQXZDO0FBQ0QsR0FIRDtBQUlBVixtQkFBaUJLLFNBQWpCLENBQTJCLFdBQTNCO0FBQ0lMLG1CQUFpQkssU0FBakIsQ0FBMkJXLFNBRC9COztBQUdBOzs7QUFHQWhCLG1CQUFpQkssU0FBakIsQ0FBMkJGLElBQTNCLEdBQWtDLFlBQVc7QUFDM0MsUUFBSSxLQUFLRCxRQUFULEVBQW1CO0FBQ2pCLFVBQUlpQixLQUFLQyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQVQ7QUFDQUYsU0FBR0csU0FBSCxHQUFlLHNCQUFmO0FBQ0EsV0FBS3BCLFFBQUwsQ0FBY3FCLFdBQWQsQ0FBMEJKLEVBQTFCO0FBQ0EsV0FBS04sWUFBTCxHQUFvQk0sRUFBcEI7O0FBRUFBLFdBQUtDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBTDtBQUNBRixTQUFHRyxTQUFILEdBQWUsb0JBQWY7QUFDQSxXQUFLcEIsUUFBTCxDQUFjcUIsV0FBZCxDQUEwQkosRUFBMUI7QUFDQSxXQUFLRixVQUFMLEdBQWtCRSxFQUFsQjs7QUFFQUEsV0FBS0MsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFMO0FBQ0FGLFNBQUdHLFNBQUgsR0FBZSxpQkFBZjtBQUNBLFdBQUtwQixRQUFMLENBQWNxQixXQUFkLENBQTBCSixFQUExQjtBQUNBLFdBQUtELE9BQUwsR0FBZUMsRUFBZjs7QUFFQSxXQUFLTixZQUFMLENBQWtCQyxLQUFsQixDQUF3QkMsS0FBeEIsR0FBZ0MsSUFBaEM7QUFDQSxXQUFLRSxVQUFMLENBQWdCSCxLQUFoQixDQUFzQkMsS0FBdEIsR0FBOEIsTUFBOUI7QUFDQSxXQUFLRyxPQUFMLENBQWFKLEtBQWIsQ0FBbUJDLEtBQW5CLEdBQTJCLElBQTNCOztBQUVBLFdBQUtiLFFBQUwsQ0FBY1MsU0FBZCxDQUF3QmEsR0FBeEIsQ0FBNEIsYUFBNUI7QUFDRDtBQUNGLEdBdkJEOztBQXlCQTtBQUNBO0FBQ0FDLG1CQUFpQkMsUUFBakIsQ0FBMEI7QUFDeEJDLGlCQUFhM0IsZ0JBRFc7QUFFeEI0QixtQkFBZSxrQkFGUztBQUd4QkMsY0FBVSxpQkFIYztBQUl4QkMsWUFBUSxJQUpnQixFQUExQjs7QUFNRCxDQXpHRCIsImZpbGUiOiJwcm9ncmVzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFByb2dyZXNzIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbFByb2dyZXNzID0gZnVuY3Rpb24gTWF0ZXJpYWxQcm9ncmVzcyhlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsUHJvZ3Jlc3MnXSA9IE1hdGVyaWFsUHJvZ3Jlc3M7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBJTkRFVEVSTUlOQVRFX0NMQVNTOiAnbWRsLXByb2dyZXNzX19pbmRldGVybWluYXRlJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb2YgdGhlIHByb2dyZXNzYmFyLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcCBQZXJjZW50YWdlIG9mIHRoZSBwcm9ncmVzcyAoMC0xMDApXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUHJvZ3Jlc3MucHJvdG90eXBlLnNldFByb2dyZXNzID0gZnVuY3Rpb24ocCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklOREVURVJNSU5BVEVfQ0xBU1MpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9ncmVzc2Jhcl8uc3R5bGUud2lkdGggPSBwICsgJyUnO1xuICB9O1xuICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZVsnc2V0UHJvZ3Jlc3MnXSA9XG4gICAgICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZS5zZXRQcm9ncmVzcztcblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IHByb2dyZXNzIG9mIHRoZSBidWZmZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwIFBlcmNlbnRhZ2Ugb2YgdGhlIGJ1ZmZlciAoMC0xMDApXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUHJvZ3Jlc3MucHJvdG90eXBlLnNldEJ1ZmZlciA9IGZ1bmN0aW9uKHApIHtcbiAgICB0aGlzLmJ1ZmZlcmJhcl8uc3R5bGUud2lkdGggPSBwICsgJyUnO1xuICAgIHRoaXMuYXV4YmFyXy5zdHlsZS53aWR0aCA9ICgxMDAgLSBwKSArICclJztcbiAgfTtcbiAgTWF0ZXJpYWxQcm9ncmVzcy5wcm90b3R5cGVbJ3NldEJ1ZmZlciddID1cbiAgICAgIE1hdGVyaWFsUHJvZ3Jlc3MucHJvdG90eXBlLnNldEJ1ZmZlcjtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxQcm9ncmVzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVsLmNsYXNzTmFtZSA9ICdwcm9ncmVzc2JhciBiYXIgYmFyMSc7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3NiYXJfID0gZWw7XG5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbC5jbGFzc05hbWUgPSAnYnVmZmVyYmFyIGJhciBiYXIyJztcbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgdGhpcy5idWZmZXJiYXJfID0gZWw7XG5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbC5jbGFzc05hbWUgPSAnYXV4YmFyIGJhciBiYXIzJztcbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgdGhpcy5hdXhiYXJfID0gZWw7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NiYXJfLnN0eWxlLndpZHRoID0gJzAlJztcbiAgICAgIHRoaXMuYnVmZmVyYmFyXy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIHRoaXMuYXV4YmFyXy5zdHlsZS53aWR0aCA9ICcwJSc7XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCgnaXMtdXBncmFkZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFByb2dyZXNzLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFByb2dyZXNzJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1wcm9ncmVzcycsXG4gICAgd2lkZ2V0OiB0cnVlXG4gIH0pO1xufSkoKTtcbiJdfQ==
