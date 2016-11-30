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
                 * Class constructor for icon toggle MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialIconToggle = function MaterialIconToggle(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialIconToggle'] = MaterialIconToggle;

  /**
                                                      * Store constants in one place so they can be updated easily.
                                                      *
                                                      * @enum {string | number}
                                                      * @private
                                                      */
  MaterialIconToggle.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001 };


  /**
                            * Store strings for class names defined by this component that are used in
                            * JavaScript. This allows us to simply change it in one place should we
                            * decide to modify at a later date.
                            *
                            * @enum {string}
                            * @private
                            */
  MaterialIconToggle.prototype.CssClasses_ = {
    INPUT: 'mdl-icon-toggle__input',
    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked' };


  /**
                                 * Handle change of state.
                                 *
                                 * @param {Event} event The event that fired.
                                 * @private
                                 */
  MaterialIconToggle.prototype.onChange_ = function (event) {
    this.updateClasses_();
  };

  /**
      * Handle focus of element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialIconToggle.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle lost focus of element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialIconToggle.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle mouseup.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialIconToggle.prototype.onMouseUp_ = function (event) {
    this.blur_();
  };

  /**
      * Handle class updates.
      *
      * @private
      */
  MaterialIconToggle.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
  };

  /**
      * Add blur.
      *
      * @private
      */
  MaterialIconToggle.prototype.blur_ = function () {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
      this.inputElement_.blur();
    }.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
  };

  // Public methods.

  /**
   * Check the inputs toggle state and update display.
   *
   * @public
   */
  MaterialIconToggle.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  MaterialIconToggle.prototype['checkToggleState'] =
  MaterialIconToggle.prototype.checkToggleState;

  /**
                                                  * Check the inputs disabled state and update display.
                                                  *
                                                  * @public
                                                  */
  MaterialIconToggle.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialIconToggle.prototype['checkDisabled'] =
  MaterialIconToggle.prototype.checkDisabled;

  /**
                                               * Disable icon toggle.
                                               *
                                               * @public
                                               */
  MaterialIconToggle.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  MaterialIconToggle.prototype['disable'] =
  MaterialIconToggle.prototype.disable;

  /**
                                         * Enable icon toggle.
                                         *
                                         * @public
                                         */
  MaterialIconToggle.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  MaterialIconToggle.prototype['enable'] = MaterialIconToggle.prototype.enable;

  /**
                                                                                 * Check icon toggle.
                                                                                 *
                                                                                 * @public
                                                                                 */
  MaterialIconToggle.prototype.check = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  MaterialIconToggle.prototype['check'] = MaterialIconToggle.prototype.check;

  /**
                                                                               * Uncheck icon toggle.
                                                                               *
                                                                               * @public
                                                                               */
  MaterialIconToggle.prototype.uncheck = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  MaterialIconToggle.prototype['uncheck'] =
  MaterialIconToggle.prototype.uncheck;

  /**
                                         * Initialize element.
                                         */
  MaterialIconToggle.prototype.init = function () {

    if (this.element_) {
      this.inputElement_ =
      this.element_.querySelector('.' + this.CssClasses_.INPUT);

      if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        this.rippleContainerElement_ = document.createElement('span');
        this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
        this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
        this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
        this.boundRippleMouseUp = this.onMouseUp_.bind(this);
        this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

        var ripple = document.createElement('span');
        ripple.classList.add(this.CssClasses_.RIPPLE);

        this.rippleContainerElement_.appendChild(ripple);
        this.element_.appendChild(this.rippleContainerElement_);
      }

      this.boundInputOnChange = this.onChange_.bind(this);
      this.boundInputOnFocus = this.onFocus_.bind(this);
      this.boundInputOnBlur = this.onBlur_.bind(this);
      this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
      this.inputElement_.addEventListener('change', this.boundInputOnChange);
      this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
      this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
      this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);

      this.updateClasses_();
      this.element_.classList.add('is-upgraded');
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialIconToggle,
    classAsString: 'MaterialIconToggle',
    cssClass: 'mdl-js-icon-toggle',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImljb24tdG9nZ2xlLmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsSWNvblRvZ2dsZSIsImVsZW1lbnQiLCJlbGVtZW50XyIsImluaXQiLCJ3aW5kb3ciLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJUSU5ZX1RJTUVPVVQiLCJDc3NDbGFzc2VzXyIsIklOUFVUIiwiSlNfUklQUExFX0VGRkVDVCIsIlJJUFBMRV9JR05PUkVfRVZFTlRTIiwiUklQUExFX0NPTlRBSU5FUiIsIlJJUFBMRV9DRU5URVIiLCJSSVBQTEUiLCJJU19GT0NVU0VEIiwiSVNfRElTQUJMRUQiLCJJU19DSEVDS0VEIiwib25DaGFuZ2VfIiwiZXZlbnQiLCJ1cGRhdGVDbGFzc2VzXyIsIm9uRm9jdXNfIiwiY2xhc3NMaXN0IiwiYWRkIiwib25CbHVyXyIsInJlbW92ZSIsIm9uTW91c2VVcF8iLCJibHVyXyIsImNoZWNrRGlzYWJsZWQiLCJjaGVja1RvZ2dsZVN0YXRlIiwic2V0VGltZW91dCIsImlucHV0RWxlbWVudF8iLCJibHVyIiwiYmluZCIsImNoZWNrZWQiLCJkaXNhYmxlZCIsImRpc2FibGUiLCJlbmFibGUiLCJjaGVjayIsInVuY2hlY2siLCJxdWVyeVNlbGVjdG9yIiwiY29udGFpbnMiLCJyaXBwbGVDb250YWluZXJFbGVtZW50XyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJvdW5kUmlwcGxlTW91c2VVcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyaXBwbGUiLCJhcHBlbmRDaGlsZCIsImJvdW5kSW5wdXRPbkNoYW5nZSIsImJvdW5kSW5wdXRPbkZvY3VzIiwiYm91bmRJbnB1dE9uQmx1ciIsImJvdW5kRWxlbWVudE9uTW91c2VVcCIsImNvbXBvbmVudEhhbmRsZXIiLCJyZWdpc3RlciIsImNvbnN0cnVjdG9yIiwiY2xhc3NBc1N0cmluZyIsImNzc0NsYXNzIiwid2lkZ2V0Il0sIm1hcHBpbmdzIjoiY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxZQUFXO0FBQ1Y7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LFdBQTdCLENBQXlDRCxNQUF6QztBQUNBLGFBQUs3QyxRQUFMLENBQWM4QyxXQUFkLENBQTBCLEtBQUtOLHVCQUEvQjtBQUNEOztBQUVELFdBQUtPLGtCQUFMLEdBQTBCLEtBQUsvQixTQUFMLENBQWVlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBMUI7QUFDQSxXQUFLaUIsaUJBQUwsR0FBeUIsS0FBSzdCLFFBQUwsQ0FBY1ksSUFBZCxDQUFtQixJQUFuQixDQUF6QjtBQUNBLFdBQUtrQixnQkFBTCxHQUF3QixLQUFLM0IsT0FBTCxDQUFhUyxJQUFiLENBQWtCLElBQWxCLENBQXhCO0FBQ0EsV0FBS21CLHFCQUFMLEdBQTZCLEtBQUsxQixVQUFMLENBQWdCTyxJQUFoQixDQUFxQixJQUFyQixDQUE3QjtBQUNBLFdBQUtGLGFBQUwsQ0FBbUJlLGdCQUFuQixDQUFvQyxRQUFwQyxFQUE4QyxLQUFLRyxrQkFBbkQ7QUFDQSxXQUFLbEIsYUFBTCxDQUFtQmUsZ0JBQW5CLENBQW9DLE9BQXBDLEVBQTZDLEtBQUtJLGlCQUFsRDtBQUNBLFdBQUtuQixhQUFMLENBQW1CZSxnQkFBbkIsQ0FBb0MsTUFBcEMsRUFBNEMsS0FBS0ssZ0JBQWpEO0FBQ0EsV0FBS2pELFFBQUwsQ0FBYzRDLGdCQUFkLENBQStCLFNBQS9CLEVBQTBDLEtBQUtNLHFCQUEvQzs7QUFFQSxXQUFLaEMsY0FBTDtBQUNBLFdBQUtsQixRQUFMLENBQWNvQixTQUFkLENBQXdCQyxHQUF4QixDQUE0QixhQUE1QjtBQUNEO0FBQ0YsR0FsQ0Q7O0FBb0NBO0FBQ0E7QUFDQThCLG1CQUFpQkMsUUFBakIsQ0FBMEI7QUFDeEJDLGlCQUFhdkQsa0JBRFc7QUFFeEJ3RCxtQkFBZSxvQkFGUztBQUd4QkMsY0FBVSxvQkFIYztBQUl4QkMsWUFBUSxJQUpnQixFQUExQjs7QUFNRCxDQTdPRCIsImZpbGUiOiJpY29uLXRvZ2dsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIGljb24gdG9nZ2xlIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbEljb25Ub2dnbGUgPSBmdW5jdGlvbiBNYXRlcmlhbEljb25Ub2dnbGUoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbEljb25Ub2dnbGUnXSA9IE1hdGVyaWFsSWNvblRvZ2dsZTtcblxuICAvKipcbiAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIFRJTllfVElNRU9VVDogMC4wMDFcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgSU5QVVQ6ICdtZGwtaWNvbi10b2dnbGVfX2lucHV0JyxcbiAgICBKU19SSVBQTEVfRUZGRUNUOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgIFJJUFBMRV9JR05PUkVfRVZFTlRTOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QtLWlnbm9yZS1ldmVudHMnLFxuICAgIFJJUFBMRV9DT05UQUlORVI6ICdtZGwtaWNvbi10b2dnbGVfX3JpcHBsZS1jb250YWluZXInLFxuICAgIFJJUFBMRV9DRU5URVI6ICdtZGwtcmlwcGxlLS1jZW50ZXInLFxuICAgIFJJUFBMRTogJ21kbC1yaXBwbGUnLFxuICAgIElTX0ZPQ1VTRUQ6ICdpcy1mb2N1c2VkJyxcbiAgICBJU19ESVNBQkxFRDogJ2lzLWRpc2FibGVkJyxcbiAgICBJU19DSEVDS0VEOiAnaXMtY2hlY2tlZCdcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNoYW5nZSBvZiBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLm9uQ2hhbmdlXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgZm9jdXMgb2YgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLm9uRm9jdXNfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGxvc3QgZm9jdXMgb2YgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLm9uQmx1cl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbW91c2V1cC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLm9uTW91c2VVcF8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuYmx1cl8oKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNsYXNzIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLnVwZGF0ZUNsYXNzZXNfID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jaGVja0Rpc2FibGVkKCk7XG4gICAgdGhpcy5jaGVja1RvZ2dsZVN0YXRlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBibHVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxJY29uVG9nZ2xlLnByb3RvdHlwZS5ibHVyXyA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgd2h5IHRoZXJlJ3MgYSBmb2N1cyBldmVudCBiZWluZyBmaXJlZCBhZnRlciBvdXIgYmx1cixcbiAgICAvLyBzbyB0aGF0IHdlIGNhbiBhdm9pZCB0aGlzIGhhY2suXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYmx1cigpO1xuICAgIH0uYmluZCh0aGlzKSwgLyoqIEB0eXBlIHtudW1iZXJ9ICovICh0aGlzLkNvbnN0YW50Xy5USU5ZX1RJTUVPVVQpKTtcbiAgfTtcblxuICAvLyBQdWJsaWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGlucHV0cyB0b2dnbGUgc3RhdGUgYW5kIHVwZGF0ZSBkaXNwbGF5LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLmNoZWNrVG9nZ2xlU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnRfLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0NIRUNLRUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19DSEVDS0VEKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGVbJ2NoZWNrVG9nZ2xlU3RhdGUnXSA9XG4gICAgICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLmNoZWNrVG9nZ2xlU3RhdGU7XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBpbnB1dHMgZGlzYWJsZWQgc3RhdGUgYW5kIHVwZGF0ZSBkaXNwbGF5LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19ESVNBQkxFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGVbJ2NoZWNrRGlzYWJsZWQnXSA9XG4gICAgICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQ7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgaWNvbiB0b2dnbGUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5kaXNhYmxlZCA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlWydkaXNhYmxlJ10gPVxuICAgICAgTWF0ZXJpYWxJY29uVG9nZ2xlLnByb3RvdHlwZS5kaXNhYmxlO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgaWNvbiB0b2dnbGUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlWydlbmFibGUnXSA9IE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGUuZW5hYmxlO1xuXG4gIC8qKlxuICAgKiBDaGVjayBpY29uIHRvZ2dsZS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxJY29uVG9nZ2xlLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5jaGVja2VkID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGVbJ2NoZWNrJ10gPSBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLmNoZWNrO1xuXG4gIC8qKlxuICAgKiBVbmNoZWNrIGljb24gdG9nZ2xlLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbEljb25Ub2dnbGUucHJvdG90eXBlLnVuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgfTtcbiAgTWF0ZXJpYWxJY29uVG9nZ2xlLnByb3RvdHlwZVsndW5jaGVjayddID1cbiAgICAgIE1hdGVyaWFsSWNvblRvZ2dsZS5wcm90b3R5cGUudW5jaGVjaztcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxJY29uVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfID1cbiAgICAgICAgICB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JTlBVVCk7XG5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50XyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfQ0VOVEVSKTtcbiAgICAgICAgdGhpcy5ib3VuZFJpcHBsZU1vdXNlVXAgPSB0aGlzLm9uTW91c2VVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZFJpcHBsZU1vdXNlVXApO1xuXG4gICAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFKTtcblxuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmFwcGVuZENoaWxkKHJpcHBsZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQodGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYm91bmRJbnB1dE9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYm91bmRJbnB1dE9uRm9jdXMgPSB0aGlzLm9uRm9jdXNfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJvdW5kSW5wdXRPbkJsdXIgPSB0aGlzLm9uQmx1cl8uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYm91bmRFbGVtZW50T25Nb3VzZVVwID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZElucHV0T25DaGFuZ2UpO1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5ib3VuZElucHV0T25Gb2N1cyk7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRJbnB1dE9uQmx1cik7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmJvdW5kRWxlbWVudE9uTW91c2VVcCk7XG5cbiAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCgnaXMtdXBncmFkZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbEljb25Ub2dnbGUsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsSWNvblRvZ2dsZScsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtaWNvbi10b2dnbGUnLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
