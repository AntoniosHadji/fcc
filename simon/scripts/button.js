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
                 * Class constructor for Button MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialButton = function MaterialButton(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialButton'] = MaterialButton;

  /**
                                              * Store constants in one place so they can be updated easily.
                                              *
                                              * @enum {string | number}
                                              * @private
                                              */
  MaterialButton.prototype.Constant_ = {
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
  MaterialButton.prototype.CssClasses_ = {
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-button__ripple-container',
    RIPPLE: 'mdl-ripple' };


  /**
                             * Handle blur of element.
                             *
                             * @param {Event} event The event that fired.
                             * @private
                             */
  MaterialButton.prototype.blurHandler_ = function (event) {
    if (event) {
      this.element_.blur();
    }
  };

  // Public methods.

  /**
   * Disable button.
   *
   * @public
   */
  MaterialButton.prototype.disable = function () {
    this.element_.disabled = true;
  };
  MaterialButton.prototype['disable'] = MaterialButton.prototype.disable;

  /**
                                                                           * Enable button.
                                                                           *
                                                                           * @public
                                                                           */
  MaterialButton.prototype.enable = function () {
    this.element_.disabled = false;
  };
  MaterialButton.prototype['enable'] = MaterialButton.prototype.enable;

  /**
                                                                         * Initialize element.
                                                                         */
  MaterialButton.prototype.init = function () {
    if (this.element_) {
      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
        this.rippleElement_ = document.createElement('span');
        this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
        rippleContainer.appendChild(this.rippleElement_);
        this.boundRippleBlurHandler = this.blurHandler_.bind(this);
        this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
        this.element_.appendChild(rippleContainer);
      }
      this.boundButtonBlurHandler = this.blurHandler_.bind(this);
      this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
      this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialButton,
    classAsString: 'MaterialButton',
    cssClass: 'mdl-js-button',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbi5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbEJ1dHRvbiIsImVsZW1lbnQiLCJlbGVtZW50XyIsImluaXQiLCJ3aW5kb3ciLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJDc3NDbGFzc2VzXyIsIlJJUFBMRV9FRkZFQ1QiLCJSSVBQTEVfQ09OVEFJTkVSIiwiUklQUExFIiwiYmx1ckhhbmRsZXJfIiwiZXZlbnQiLCJibHVyIiwiZGlzYWJsZSIsImRpc2FibGVkIiwiZW5hYmxlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJyaXBwbGVDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhZGQiLCJyaXBwbGVFbGVtZW50XyIsImFwcGVuZENoaWxkIiwiYm91bmRSaXBwbGVCbHVySGFuZGxlciIsImJpbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiYm91bmRCdXR0b25CbHVySGFuZGxlciIsImNvbXBvbmVudEhhbmRsZXIiLCJyZWdpc3RlciIsImNvbnN0cnVjdG9yIiwiY2xhc3NBc1N0cmluZyIsImNzc0NsYXNzIiwid2lkZ2V0Il0sIm1hcHBpbmdzIjoiY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxZQUFXO0FBQ1Y7O0FBRUE7Ozs7Ozs7QUFPQSxNQUFJQSxpQkFBaUIsU0FBU0EsY0FBVCxDQUF3QkMsT0FBeEIsRUFBaUM7QUFDcEQsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7O0FBRUE7QUFDQSxTQUFLRSxJQUFMO0FBQ0QsR0FMRDtBQU1BQyxTQUFPLGdCQUFQLElBQTJCSixjQUEzQjs7QUFFQTs7Ozs7O0FBTUFBLGlCQUFlSyxTQUFmLENBQXlCQyxTQUF6QixHQUFxQztBQUNuQztBQURtQyxHQUFyQzs7QUFJQTs7Ozs7Ozs7QUFRQU4saUJBQWVLLFNBQWYsQ0FBeUJFLFdBQXpCLEdBQXVDO0FBQ3JDQyxtQkFBZSxzQkFEc0I7QUFFckNDLHNCQUFrQiw4QkFGbUI7QUFHckNDLFlBQVEsWUFINkIsRUFBdkM7OztBQU1BOzs7Ozs7QUFNQVYsaUJBQWVLLFNBQWYsQ0FBeUJNLFlBQXpCLEdBQXdDLFVBQVNDLEtBQVQsRUFBZ0I7QUFDdEQsUUFBSUEsS0FBSixFQUFXO0FBQ1QsV0FBS1YsUUFBTCxDQUFjVyxJQUFkO0FBQ0Q7QUFDRixHQUpEOztBQU1BOztBQUVBOzs7OztBQUtBYixpQkFBZUssU0FBZixDQUF5QlMsT0FBekIsR0FBbUMsWUFBVztBQUM1QyxTQUFLWixRQUFMLENBQWNhLFFBQWQsR0FBeUIsSUFBekI7QUFDRCxHQUZEO0FBR0FmLGlCQUFlSyxTQUFmLENBQXlCLFNBQXpCLElBQXNDTCxlQUFlSyxTQUFmLENBQXlCUyxPQUEvRDs7QUFFQTs7Ozs7QUFLQWQsaUJBQWVLLFNBQWYsQ0FBeUJXLE1BQXpCLEdBQWtDLFlBQVc7QUFDM0MsU0FBS2QsUUFBTCxDQUFjYSxRQUFkLEdBQXlCLEtBQXpCO0FBQ0QsR0FGRDtBQUdBZixpQkFBZUssU0FBZixDQUF5QixRQUF6QixJQUFxQ0wsZUFBZUssU0FBZixDQUF5QlcsTUFBOUQ7O0FBRUE7OztBQUdBaEIsaUJBQWVLLFNBQWYsQ0FBeUJGLElBQXpCLEdBQWdDLFlBQVc7QUFDekMsUUFBSSxLQUFLRCxRQUFULEVBQW1CO0FBQ2pCLFVBQUksS0FBS0EsUUFBTCxDQUFjZSxTQUFkLENBQXdCQyxRQUF4QixDQUFpQyxLQUFLWCxXQUFMLENBQWlCQyxhQUFsRCxDQUFKLEVBQXNFO0FBQ3BFLFlBQUlXLGtCQUFrQkMsU0FBU0MsYUFBVCxDQUF1QixNQUF2QixDQUF0QjtBQUNBRix3QkFBZ0JGLFNBQWhCLENBQTBCSyxHQUExQixDQUE4QixLQUFLZixXQUFMLENBQWlCRSxnQkFBL0M7QUFDQSxhQUFLYyxjQUFMLEdBQXNCSCxTQUFTQyxhQUFULENBQXVCLE1BQXZCLENBQXRCO0FBQ0EsYUFBS0UsY0FBTCxDQUFvQk4sU0FBcEIsQ0FBOEJLLEdBQTlCLENBQWtDLEtBQUtmLFdBQUwsQ0FBaUJHLE1BQW5EO0FBQ0FTLHdCQUFnQkssV0FBaEIsQ0FBNEIsS0FBS0QsY0FBakM7QUFDQSxhQUFLRSxzQkFBTCxHQUE4QixLQUFLZCxZQUFMLENBQWtCZSxJQUFsQixDQUF1QixJQUF2QixDQUE5QjtBQUNBLGFBQUtILGNBQUwsQ0FBb0JJLGdCQUFwQixDQUFxQyxTQUFyQyxFQUFnRCxLQUFLRixzQkFBckQ7QUFDQSxhQUFLdkIsUUFBTCxDQUFjc0IsV0FBZCxDQUEwQkwsZUFBMUI7QUFDRDtBQUNELFdBQUtTLHNCQUFMLEdBQThCLEtBQUtqQixZQUFMLENBQWtCZSxJQUFsQixDQUF1QixJQUF2QixDQUE5QjtBQUNBLFdBQUt4QixRQUFMLENBQWN5QixnQkFBZCxDQUErQixTQUEvQixFQUEwQyxLQUFLQyxzQkFBL0M7QUFDQSxXQUFLMUIsUUFBTCxDQUFjeUIsZ0JBQWQsQ0FBK0IsWUFBL0IsRUFBNkMsS0FBS0Msc0JBQWxEO0FBQ0Q7QUFDRixHQWhCRDs7QUFrQkE7QUFDQTtBQUNBQyxtQkFBaUJDLFFBQWpCLENBQTBCO0FBQ3hCQyxpQkFBYS9CLGNBRFc7QUFFeEJnQyxtQkFBZSxnQkFGUztBQUd4QkMsY0FBVSxlQUhjO0FBSXhCQyxZQUFRLElBSmdCLEVBQTFCOztBQU1ELENBekdEIiwiZmlsZSI6ImJ1dHRvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIEJ1dHRvbiBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbEJ1dHRvbiA9IGZ1bmN0aW9uIE1hdGVyaWFsQnV0dG9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxCdXR0b24nXSA9IE1hdGVyaWFsQnV0dG9uO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICAvLyBOb25lIGZvciBub3cuXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICBSSVBQTEVfQ09OVEFJTkVSOiAnbWRsLWJ1dHRvbl9fcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgUklQUExFOiAnbWRsLXJpcHBsZSdcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGJsdXIgb2YgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUuYmx1ckhhbmRsZXJfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uYmx1cigpO1xuICAgIH1cbiAgfTtcblxuICAvLyBQdWJsaWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGlzYWJsZSBidXR0b24uXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50Xy5kaXNhYmxlZCA9IHRydWU7XG4gIH07XG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZVsnZGlzYWJsZSddID0gTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlLmRpc2FibGU7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBidXR0b24uXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmRpc2FibGVkID0gZmFsc2U7XG4gIH07XG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZVsnZW5hYmxlJ10gPSBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUuZW5hYmxlO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICB2YXIgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9DT05UQUlORVIpO1xuICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEUpO1xuICAgICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yaXBwbGVFbGVtZW50Xyk7XG4gICAgICAgIHRoaXMuYm91bmRSaXBwbGVCbHVySGFuZGxlciA9IHRoaXMuYmx1ckhhbmRsZXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRSaXBwbGVCbHVySGFuZGxlcik7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQocmlwcGxlQ29udGFpbmVyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYm91bmRCdXR0b25CbHVySGFuZGxlciA9IHRoaXMuYmx1ckhhbmRsZXJfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmJvdW5kQnV0dG9uQmx1ckhhbmRsZXIpO1xuICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5ib3VuZEJ1dHRvbkJsdXJIYW5kbGVyKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbEJ1dHRvbixcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxCdXR0b24nLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLWJ1dHRvbicsXG4gICAgd2lkZ2V0OiB0cnVlXG4gIH0pO1xufSkoKTtcbiJdfQ==
