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
                 * Class constructor for Slider MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialSlider = function MaterialSlider(element) {
    this.element_ = element;
    // Browser feature detection.
    this.isIE_ = window.navigator.msPointerEnabled;
    // Initialize instance.
    this.init();
  };
  window['MaterialSlider'] = MaterialSlider;

  /**
                                              * Store constants in one place so they can be updated easily.
                                              *
                                              * @enum {string | number}
                                              * @private
                                              */
  MaterialSlider.prototype.Constant_ = {
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
  MaterialSlider.prototype.CssClasses_ = {
    IE_CONTAINER: 'mdl-slider__ie-container',
    SLIDER_CONTAINER: 'mdl-slider__container',
    BACKGROUND_FLEX: 'mdl-slider__background-flex',
    BACKGROUND_LOWER: 'mdl-slider__background-lower',
    BACKGROUND_UPPER: 'mdl-slider__background-upper',
    IS_LOWEST_VALUE: 'is-lowest-value',
    IS_UPGRADED: 'is-upgraded' };


  /**
                                   * Handle input on element.
                                   *
                                   * @param {Event} event The event that fired.
                                   * @private
                                   */
  MaterialSlider.prototype.onInput_ = function (event) {
    this.updateValueStyles_();
  };

  /**
      * Handle change on element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialSlider.prototype.onChange_ = function (event) {
    this.updateValueStyles_();
  };

  /**
      * Handle mouseup on element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialSlider.prototype.onMouseUp_ = function (event) {
    event.target.blur();
  };

  /**
      * Handle mousedown on container element.
      * This handler is purpose is to not require the use to click
      * exactly on the 2px slider element, as FireFox seems to be very
      * strict about this.
      *
      * @param {Event} event The event that fired.
      * @private
      * @suppress {missingProperties}
      */
  MaterialSlider.prototype.onContainerMouseDown_ = function (event) {
    // If this click is not on the parent element (but rather some child)
    // ignore. It may still bubble up.
    if (event.target !== this.element_.parentElement) {
      return;
    }

    // Discard the original event and create a new event that
    // is on the slider element.
    event.preventDefault();
    var newEvent = new MouseEvent('mousedown', {
      target: event.target,
      buttons: event.buttons,
      clientX: event.clientX,
      clientY: this.element_.getBoundingClientRect().y });

    this.element_.dispatchEvent(newEvent);
  };

  /**
      * Handle updating of values.
      *
      * @private
      */
  MaterialSlider.prototype.updateValueStyles_ = function () {
    // Calculate and apply percentages to div structure behind slider.
    var fraction = (this.element_.value - this.element_.min) / (
    this.element_.max - this.element_.min);

    if (fraction === 0) {
      this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
    }

    if (!this.isIE_) {
      this.backgroundLower_.style.flex = fraction;
      this.backgroundLower_.style.webkitFlex = fraction;
      this.backgroundUpper_.style.flex = 1 - fraction;
      this.backgroundUpper_.style.webkitFlex = 1 - fraction;
    }
  };

  // Public methods.

  /**
   * Disable slider.
   *
   * @public
   */
  MaterialSlider.prototype.disable = function () {
    this.element_.disabled = true;
  };
  MaterialSlider.prototype['disable'] = MaterialSlider.prototype.disable;

  /**
                                                                           * Enable slider.
                                                                           *
                                                                           * @public
                                                                           */
  MaterialSlider.prototype.enable = function () {

    this.element_.disabled = false;
  };
  MaterialSlider.prototype['enable'] = MaterialSlider.prototype.enable;

  /**
                                                                         * Update slider value.
                                                                         *
                                                                         * @param {number} value The value to which to set the control (optional).
                                                                         * @public
                                                                         */
  MaterialSlider.prototype.change = function (value) {

    if (typeof value !== 'undefined') {
      this.element_.value = value;
    }
    this.updateValueStyles_();
  };
  MaterialSlider.prototype['change'] = MaterialSlider.prototype.change;

  /**
                                                                         * Initialize element.
                                                                         */
  MaterialSlider.prototype.init = function () {

    if (this.element_) {
      if (this.isIE_) {
        // Since we need to specify a very large height in IE due to
        // implementation limitations, we add a parent here that trims it down to
        // a reasonable size.
        var containerIE = document.createElement('div');
        containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
        this.element_.parentElement.insertBefore(containerIE, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        containerIE.appendChild(this.element_);
      } else {
        // For non-IE browsers, we need a div structure that sits behind the
        // slider and allows us to style the left and right sides of it with
        // different colors.
        var container = document.createElement('div');
        container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        var backgroundFlex = document.createElement('div');
        backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
        container.appendChild(backgroundFlex);
        this.backgroundLower_ = document.createElement('div');
        this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
        backgroundFlex.appendChild(this.backgroundLower_);
        this.backgroundUpper_ = document.createElement('div');
        this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
        backgroundFlex.appendChild(this.backgroundUpper_);
      }

      this.boundInputHandler = this.onInput_.bind(this);
      this.boundChangeHandler = this.onChange_.bind(this);
      this.boundMouseUpHandler = this.onMouseUp_.bind(this);
      this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
      this.element_.addEventListener('input', this.boundInputHandler);
      this.element_.addEventListener('change', this.boundChangeHandler);
      this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
      this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);

      this.updateValueStyles_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialSlider,
    classAsString: 'MaterialSlider',
    cssClass: 'mdl-js-slider',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlci5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbFNsaWRlciIsImVsZW1lbnQiLCJlbGVtZW50XyIsImlzSUVfIiwid2luZG93IiwibmF2aWdhdG9yIiwibXNQb2ludGVyRW5hYmxlZCIsImluaXQiLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJDc3NDbGFzc2VzXyIsIklFX0NPTlRBSU5FUiIsIlNMSURFUl9DT05UQUlORVIiLCJCQUNLR1JPVU5EX0ZMRVgiLCJCQUNLR1JPVU5EX0xPV0VSIiwiQkFDS0dST1VORF9VUFBFUiIsIklTX0xPV0VTVF9WQUxVRSIsIklTX1VQR1JBREVEIiwib25JbnB1dF8iLCJldmVudCIsInVwZGF0ZVZhbHVlU3R5bGVzXyIsIm9uQ2hhbmdlXyIsIm9uTW91c2VVcF8iLCJ0YXJnZXQiLCJibHVyIiwib25Db250YWluZXJNb3VzZURvd25fIiwicGFyZW50RWxlbWVudCIsInByZXZlbnREZWZhdWx0IiwibmV3RXZlbnQiLCJNb3VzZUV2ZW50IiwiYnV0dG9ucyIsImNsaWVudFgiLCJjbGllbnRZIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieSIsImRpc3BhdGNoRXZlbnQiLCJmcmFjdGlvbiIsInZhbHVlIiwibWluIiwibWF4IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiYmFja2dyb3VuZExvd2VyXyIsInN0eWxlIiwiZmxleCIsIndlYmtpdEZsZXgiLCJiYWNrZ3JvdW5kVXBwZXJfIiwiZGlzYWJsZSIsImRpc2FibGVkIiwiZW5hYmxlIiwiY2hhbmdlIiwiY29udGFpbmVySUUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJyZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiY29udGFpbmVyIiwiYmFja2dyb3VuZEZsZXgiLCJib3VuZElucHV0SGFuZGxlciIsImJpbmQiLCJib3VuZENoYW5nZUhhbmRsZXIiLCJib3VuZE1vdXNlVXBIYW5kbGVyIiwiYm91bmRDb250YWluZXJNb3VzZURvd25IYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBvbmVudEhhbmRsZXIiLCJyZWdpc3RlciIsImNvbnN0cnVjdG9yIiwiY2xhc3NBc1N0cmluZyIsImNzc0NsYXNzIiwid2lkZ2V0Il0sIm1hcHBpbmdzIjoiY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxZQUFXO0FBQ1Y7O0FBRUE7Ozs7Ozs7O0FBUUEsTUFBSUEsaUJBQWlCLFNBQVNBLGNBQVQsQ0FBd0JDLE9BQXhCLEVBQWlDO0FBQ3BELFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCO0FBQ0E7QUFDQSxTQUFLRSxLQUFMLEdBQWFDLE9BQU9DLFNBQVAsQ0FBaUJDLGdCQUE5QjtBQUNBO0FBQ0EsU0FBS0MsSUFBTDtBQUNELEdBTkQ7QUFPQUgsU0FBTyxnQkFBUCxJQUEyQkosY0FBM0I7O0FBRUE7Ozs7OztBQU1BQSxpQkFBZVEsU0FBZixDQUF5QkMsU0FBekIsR0FBcUM7QUFDbkM7QUFEbUMsR0FBckM7O0FBSUE7Ozs7Ozs7O0FBUUFULGlCQUFlUSxTQUFmLENBQXlCRSxXQUF6QixHQUF1QztBQUNyQ0Msa0JBQWMsMEJBRHVCO0FBRXJDQyxzQkFBa0IsdUJBRm1CO0FBR3JDQyxxQkFBaUIsNkJBSG9CO0FBSXJDQyxzQkFBa0IsOEJBSm1CO0FBS3JDQyxzQkFBa0IsOEJBTG1CO0FBTXJDQyxxQkFBaUIsaUJBTm9CO0FBT3JDQyxpQkFBYSxhQVB3QixFQUF2Qzs7O0FBVUE7Ozs7OztBQU1BakIsaUJBQWVRLFNBQWYsQ0FBeUJVLFFBQXpCLEdBQW9DLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbEQsU0FBS0Msa0JBQUw7QUFDRCxHQUZEOztBQUlBOzs7Ozs7QUFNQXBCLGlCQUFlUSxTQUFmLENBQXlCYSxTQUF6QixHQUFxQyxVQUFTRixLQUFULEVBQWdCO0FBQ25ELFNBQUtDLGtCQUFMO0FBQ0QsR0FGRDs7QUFJQTs7Ozs7O0FBTUFwQixpQkFBZVEsU0FBZixDQUF5QmMsVUFBekIsR0FBc0MsVUFBU0gsS0FBVCxFQUFnQjtBQUNwREEs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QkFBYXBFLGNBRFc7QUFFeEJxRSxtQkFBZSxnQkFGUztBQUd4QkMsY0FBVSxlQUhjO0FBSXhCQyxZQUFRLElBSmdCLEVBQTFCOztBQU1ELENBbE9EIiwiZmlsZSI6InNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFNsaWRlciBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuICB2YXIgTWF0ZXJpYWxTbGlkZXIgPSBmdW5jdGlvbiBNYXRlcmlhbFNsaWRlcihlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG4gICAgLy8gQnJvd3NlciBmZWF0dXJlIGRldGVjdGlvbi5cbiAgICB0aGlzLmlzSUVfID0gd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkO1xuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxTbGlkZXInXSA9IE1hdGVyaWFsU2xpZGVyO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICAvLyBOb25lIGZvciBub3cuXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgSUVfQ09OVEFJTkVSOiAnbWRsLXNsaWRlcl9faWUtY29udGFpbmVyJyxcbiAgICBTTElERVJfQ09OVEFJTkVSOiAnbWRsLXNsaWRlcl9fY29udGFpbmVyJyxcbiAgICBCQUNLR1JPVU5EX0ZMRVg6ICdtZGwtc2xpZGVyX19iYWNrZ3JvdW5kLWZsZXgnLFxuICAgIEJBQ0tHUk9VTkRfTE9XRVI6ICdtZGwtc2xpZGVyX19iYWNrZ3JvdW5kLWxvd2VyJyxcbiAgICBCQUNLR1JPVU5EX1VQUEVSOiAnbWRsLXNsaWRlcl9fYmFja2dyb3VuZC11cHBlcicsXG4gICAgSVNfTE9XRVNUX1ZBTFVFOiAnaXMtbG93ZXN0LXZhbHVlJyxcbiAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgaW5wdXQgb24gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUub25JbnB1dF8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMudXBkYXRlVmFsdWVTdHlsZXNfKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBjaGFuZ2Ugb24gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUub25DaGFuZ2VfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlU3R5bGVzXygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbW91c2V1cCBvbiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5vbk1vdXNlVXBfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC50YXJnZXQuYmx1cigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbW91c2Vkb3duIG9uIGNvbnRhaW5lciBlbGVtZW50LlxuICAgKiBUaGlzIGhhbmRsZXIgaXMgcHVycG9zZSBpcyB0byBub3QgcmVxdWlyZSB0aGUgdXNlIHRvIGNsaWNrXG4gICAqIGV4YWN0bHkgb24gdGhlIDJweCBzbGlkZXIgZWxlbWVudCwgYXMgRmlyZUZveCBzZWVtcyB0byBiZSB2ZXJ5XG4gICAqIHN0cmljdCBhYm91dCB0aGlzLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICogQHN1cHByZXNzIHttaXNzaW5nUHJvcGVydGllc31cbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5vbkNvbnRhaW5lck1vdXNlRG93bl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIC8vIElmIHRoaXMgY2xpY2sgaXMgbm90IG9uIHRoZSBwYXJlbnQgZWxlbWVudCAoYnV0IHJhdGhlciBzb21lIGNoaWxkKVxuICAgIC8vIGlnbm9yZS4gSXQgbWF5IHN0aWxsIGJ1YmJsZSB1cC5cbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEaXNjYXJkIHRoZSBvcmlnaW5hbCBldmVudCBhbmQgY3JlYXRlIGEgbmV3IGV2ZW50IHRoYXRcbiAgICAvLyBpcyBvbiB0aGUgc2xpZGVyIGVsZW1lbnQuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudCgnbW91c2Vkb3duJywge1xuICAgICAgdGFyZ2V0OiBldmVudC50YXJnZXQsXG4gICAgICBidXR0b25zOiBldmVudC5idXR0b25zLFxuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IHRoaXMuZWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueVxuICAgIH0pO1xuICAgIHRoaXMuZWxlbWVudF8uZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSB1cGRhdGluZyBvZiB2YWx1ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUudXBkYXRlVmFsdWVTdHlsZXNfID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gQ2FsY3VsYXRlIGFuZCBhcHBseSBwZXJjZW50YWdlcyB0byBkaXYgc3RydWN0dXJlIGJlaGluZCBzbGlkZXIuXG4gICAgdmFyIGZyYWN0aW9uID0gKHRoaXMuZWxlbWVudF8udmFsdWUgLSB0aGlzLmVsZW1lbnRfLm1pbikgL1xuICAgICAgICAodGhpcy5lbGVtZW50Xy5tYXggLSB0aGlzLmVsZW1lbnRfLm1pbik7XG5cbiAgICBpZiAoZnJhY3Rpb24gPT09IDApIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0xPV0VTVF9WQUxVRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0xPV0VTVF9WQUxVRSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzSUVfKSB7XG4gICAgICB0aGlzLmJhY2tncm91bmRMb3dlcl8uc3R5bGUuZmxleCA9IGZyYWN0aW9uO1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kTG93ZXJfLnN0eWxlLndlYmtpdEZsZXggPSBmcmFjdGlvbjtcbiAgICAgIHRoaXMuYmFja2dyb3VuZFVwcGVyXy5zdHlsZS5mbGV4ID0gMSAtIGZyYWN0aW9uO1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kVXBwZXJfLnN0eWxlLndlYmtpdEZsZXggPSAxIC0gZnJhY3Rpb247XG4gICAgfVxuICB9O1xuXG4gIC8vIFB1YmxpYyBtZXRob2RzLlxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHNsaWRlci5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgfTtcbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlWydkaXNhYmxlJ10gPSBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUuZGlzYWJsZTtcblxuICAvKipcbiAgICogRW5hYmxlIHNsaWRlci5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5lbGVtZW50Xy5kaXNhYmxlZCA9IGZhbHNlO1xuICB9O1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGVbJ2VuYWJsZSddID0gTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmVuYWJsZTtcblxuICAvKipcbiAgICogVXBkYXRlIHNsaWRlciB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIFRoZSB2YWx1ZSB0byB3aGljaCB0byBzZXQgdGhlIGNvbnRyb2wgKG9wdGlvbmFsKS5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmNoYW5nZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5lbGVtZW50Xy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVZhbHVlU3R5bGVzXygpO1xuICB9O1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGVbJ2NoYW5nZSddID0gTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmNoYW5nZTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICBpZiAodGhpcy5pc0lFXykge1xuICAgICAgICAvLyBTaW5jZSB3ZSBuZWVkIHRvIHNwZWNpZnkgYSB2ZXJ5IGxhcmdlIGhlaWdodCBpbiBJRSBkdWUgdG9cbiAgICAgICAgLy8gaW1wbGVtZW50YXRpb24gbGltaXRhdGlvbnMsIHdlIGFkZCBhIHBhcmVudCBoZXJlIHRoYXQgdHJpbXMgaXQgZG93biB0b1xuICAgICAgICAvLyBhIHJlYXNvbmFibGUgc2l6ZS5cbiAgICAgICAgdmFyIGNvbnRhaW5lcklFID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lcklFLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JRV9DT05UQUlORVIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lcklFLCB0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgICBjb250YWluZXJJRS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBub24tSUUgYnJvd3NlcnMsIHdlIG5lZWQgYSBkaXYgc3RydWN0dXJlIHRoYXQgc2l0cyBiZWhpbmQgdGhlXG4gICAgICAgIC8vIHNsaWRlciBhbmQgYWxsb3dzIHVzIHRvIHN0eWxlIHRoZSBsZWZ0IGFuZCByaWdodCBzaWRlcyBvZiBpdCB3aXRoXG4gICAgICAgIC8vIGRpZmZlcmVudCBjb2xvcnMuXG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5TTElERVJfQ09OVEFJTkVSKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjb250YWluZXIsIHRoaXMuZWxlbWVudF8pO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgdmFyIGJhY2tncm91bmRGbGV4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJhY2tncm91bmRGbGV4LmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5CQUNLR1JPVU5EX0ZMRVgpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYmFja2dyb3VuZEZsZXgpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmRMb3dlcl8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTG93ZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5CQUNLR1JPVU5EX0xPV0VSKTtcbiAgICAgICAgYmFja2dyb3VuZEZsZXguYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kTG93ZXJfKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kVXBwZXJfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFVwcGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQkFDS0dST1VORF9VUFBFUik7XG4gICAgICAgIGJhY2tncm91bmRGbGV4LmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZFVwcGVyXyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYm91bmRJbnB1dEhhbmRsZXIgPSB0aGlzLm9uSW5wdXRfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJvdW5kQ2hhbmdlSGFuZGxlciA9IHRoaXMub25DaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJvdW5kTW91c2VVcEhhbmRsZXIgPSB0aGlzLm9uTW91c2VVcF8uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYm91bmRDb250YWluZXJNb3VzZURvd25IYW5kbGVyID0gdGhpcy5vbkNvbnRhaW5lck1vdXNlRG93bl8uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmJvdW5kSW5wdXRIYW5kbGVyKTtcbiAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIpO1xuICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyKTtcbiAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmJvdW5kQ29udGFpbmVyTW91c2VEb3duSGFuZGxlcik7XG5cbiAgICAgIHRoaXMudXBkYXRlVmFsdWVTdHlsZXNfKCk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxTbGlkZXIsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsU2xpZGVyJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1zbGlkZXInLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
