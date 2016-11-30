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
                 * Class constructor for Checkbox MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialCheckbox = function MaterialCheckbox(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialCheckbox'] = MaterialCheckbox;

  /**
                                                  * Store constants in one place so they can be updated easily.
                                                  *
                                                  * @enum {string | number}
                                                  * @private
                                                  */
  MaterialCheckbox.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001 };


  /**
                            * Store strings for class names defined by this component that are used in
                            * JavaScript. This allows us to simply change it in one place should we
                            * decide to modify at a later date.
                            *
                            * @enum {string}
                            * @private
                            */
  MaterialCheckbox.prototype.CssClasses_ = {
    INPUT: 'mdl-checkbox__input',
    BOX_OUTLINE: 'mdl-checkbox__box-outline',
    FOCUS_HELPER: 'mdl-checkbox__focus-helper',
    TICK_OUTLINE: 'mdl-checkbox__tick-outline',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked',
    IS_UPGRADED: 'is-upgraded' };


  /**
                                   * Handle change of state.
                                   *
                                   * @param {Event} event The event that fired.
                                   * @private
                                   */
  MaterialCheckbox.prototype.onChange_ = function (event) {
    this.updateClasses_();
  };

  /**
      * Handle focus of element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialCheckbox.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle lost focus of element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialCheckbox.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle mouseup.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialCheckbox.prototype.onMouseUp_ = function (event) {
    this.blur_();
  };

  /**
      * Handle class updates.
      *
      * @private
      */
  MaterialCheckbox.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
  };

  /**
      * Add blur.
      *
      * @private
      */
  MaterialCheckbox.prototype.blur_ = function () {
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
  MaterialCheckbox.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  MaterialCheckbox.prototype['checkToggleState'] =
  MaterialCheckbox.prototype.checkToggleState;

  /**
                                                * Check the inputs disabled state and update display.
                                                *
                                                * @public
                                                */
  MaterialCheckbox.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialCheckbox.prototype['checkDisabled'] =
  MaterialCheckbox.prototype.checkDisabled;

  /**
                                             * Disable checkbox.
                                             *
                                             * @public
                                             */
  MaterialCheckbox.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  MaterialCheckbox.prototype['disable'] = MaterialCheckbox.prototype.disable;

  /**
                                                                               * Enable checkbox.
                                                                               *
                                                                               * @public
                                                                               */
  MaterialCheckbox.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  MaterialCheckbox.prototype['enable'] = MaterialCheckbox.prototype.enable;

  /**
                                                                             * Check checkbox.
                                                                             *
                                                                             * @public
                                                                             */
  MaterialCheckbox.prototype.check = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  MaterialCheckbox.prototype['check'] = MaterialCheckbox.prototype.check;

  /**
                                                                           * Uncheck checkbox.
                                                                           *
                                                                           * @public
                                                                           */
  MaterialCheckbox.prototype.uncheck = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  MaterialCheckbox.prototype['uncheck'] = MaterialCheckbox.prototype.uncheck;

  /**
                                                                               * Initialize element.
                                                                               */
  MaterialCheckbox.prototype.init = function () {
    if (this.element_) {
      this.inputElement_ = this.element_.querySelector('.' +
      this.CssClasses_.INPUT);

      var boxOutline = document.createElement('span');
      boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);

      var tickContainer = document.createElement('span');
      tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);

      var tickOutline = document.createElement('span');
      tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);

      boxOutline.appendChild(tickOutline);

      this.element_.appendChild(tickContainer);
      this.element_.appendChild(boxOutline);

      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        this.rippleContainerElement_ = document.createElement('span');
        this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
        this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
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
      this.boundElementMouseUp = this.onMouseUp_.bind(this);
      this.inputElement_.addEventListener('change', this.boundInputOnChange);
      this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
      this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
      this.element_.addEventListener('mouseup', this.boundElementMouseUp);

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialCheckbox,
    classAsString: 'MaterialCheckbox',
    cssClass: 'mdl-js-checkbox',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWNrYm94LmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsQ2hlY2tib3giLCJlbGVtZW50IiwiZWxlbWVudF8iLCJpbml0Iiwid2luZG93IiwicHJvdG90eXBlIiwiQ29uc3RhbnRfIiwiVElOWV9USU1FT1VUIiwiQ3NzQ2xhc3Nlc18iLCJJTlBVVCIsIkJPWF9PVVRMSU5FIiwiRk9DVVNfSEVMUEVSIiwiVElDS19PVVRMSU5FIiwiUklQUExFX0VGRkVDVCIsIlJJUFBMRV9JR05PUkVfRVZFTlRTIiwiUklQUExFX0NPTlRBSU5FUiIsIlJJUFBMRV9DRU5URVIiLCJSSVBQTEUiLCJJU19GT0NVU0VEIiwiSVNfRElTQUJMRUQiLCJJU19DSEVDS0VEIiwiSVNfVVBHUkFERUQiLCJvbkNoYW5nZV8iLCJldmVudCIsInVwZGF0ZUNsYXNzZXNfIiwib25Gb2N1c18iLCJjbGFzc0xpc3QiLCJhZGQiLCJvbkJsdXJfIiwicmVtb3ZlIiwib25Nb3VzZVVwXyIsImJsdXJfIiwiY2hlY2tEaXNhYmxlZCIsImNoZWNrVG9nZ2xlU3RhdGUiLCJzZXRUaW1lb3V0IiwiaW5wdXRFbGVtZW50XyIsImJsdXIiLCJiaW5kIiwiY2hlY2tlZCIsImRpc2FibGVkIiwiZGlzYWJsZSIsImVuYWJsZSIsImNoZWNrIiwidW5jaGVjayIsInF1ZXJ5U2VsZWN0b3IiLCJib3hPdXRsaW5lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidGlja0NvbnRhaW5lciIsInRpY2tPdXRsaW5lIiwiYXBwZW5kQ2hpbGQiLCJjb250YWlucyIsInJpcHBsZUNvbnRhaW5lckVsZW1lbnRfIiwiYm91bmRSaXBwbGVNb3VzZVVwIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJpcHBsZSIsImJvdW5kSW5wdXRPbkNoYW5nZSIsImJvdW5kSW5wdXRPbkZvY3VzIiwiYm91bmRJbnB1dE9uQmx1ciIsImJvdW5kRWxlbWVudE1vdXNlVXAiLCJjb21wb25lbnRIYW5kbGVyIiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIs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Q0FBeEI7QUFDQSxXQUFLc0IsbUJBQUwsR0FBMkIsS0FBSzdCLFVBQUwsQ0FBZ0JPLElBQWhCLENBQXFCLElBQXJCLENBQTNCO0FBQ0EsV0FBS0YsYUFBTCxDQUFtQm1CLGdCQUFuQixDQUFvQyxRQUFwQyxFQUE4QyxLQUFLRSxrQkFBbkQ7QUFDQSxXQUFLckIsYUFBTCxDQUFtQm1CLGdCQUFuQixDQUFvQyxPQUFwQyxFQUE2QyxLQUFLRyxpQkFBbEQ7QUFDQSxXQUFLdEIsYUFBTCxDQUFtQm1CLGdCQUFuQixDQUFvQyxNQUFwQyxFQUE0QyxLQUFLSSxnQkFBakQ7QUFDQSxXQUFLeEQsUUFBTCxDQUFjb0QsZ0JBQWQsQ0FBK0IsU0FBL0IsRUFBMEMsS0FBS0ssbUJBQS9DOztBQUVBLFdBQUtuQyxjQUFMO0FBQ0EsV0FBS3RCLFFBQUwsQ0FBY3dCLFNBQWQsQ0FBd0JDLEdBQXhCLENBQTRCLEtBQUtuQixXQUFMLENBQWlCYSxXQUE3QztBQUNEO0FBQ0YsR0E5Q0Q7O0FBZ0RBO0FBQ0E7QUFDQXVDLG1CQUFpQkMsUUFBakIsQ0FBMEI7QUFDeEJDLGlCQUFhOUQsZ0JBRFc7QUFFeEIrRCxtQkFBZSxrQkFGUztBQUd4QkMsY0FBVSxpQkFIYztBQUl4QkMsWUFBUSxJQUpnQixFQUExQjs7QUFNRCxDQTNQRCIsImZpbGUiOiJjaGVja2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIENoZWNrYm94IE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbENoZWNrYm94ID0gZnVuY3Rpb24gTWF0ZXJpYWxDaGVja2JveChlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsQ2hlY2tib3gnXSA9IE1hdGVyaWFsQ2hlY2tib3g7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gICAgVElOWV9USU1FT1VUOiAwLjAwMVxuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgSU5QVVQ6ICdtZGwtY2hlY2tib3hfX2lucHV0JyxcbiAgICBCT1hfT1VUTElORTogJ21kbC1jaGVja2JveF9fYm94LW91dGxpbmUnLFxuICAgIEZPQ1VTX0hFTFBFUjogJ21kbC1jaGVja2JveF9fZm9jdXMtaGVscGVyJyxcbiAgICBUSUNLX09VVExJTkU6ICdtZGwtY2hlY2tib3hfX3RpY2stb3V0bGluZScsXG4gICAgUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICBSSVBQTEVfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcbiAgICBSSVBQTEVfQ09OVEFJTkVSOiAnbWRsLWNoZWNrYm94X19yaXBwbGUtY29udGFpbmVyJyxcbiAgICBSSVBQTEVfQ0VOVEVSOiAnbWRsLXJpcHBsZS0tY2VudGVyJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICBJU19GT0NVU0VEOiAnaXMtZm9jdXNlZCcsXG4gICAgSVNfRElTQUJMRUQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgSVNfQ0hFQ0tFRDogJ2lzLWNoZWNrZWQnLFxuICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnXG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBjaGFuZ2Ugb2Ygc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUub25DaGFuZ2VfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBmb2N1cyBvZiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLm9uRm9jdXNfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGxvc3QgZm9jdXMgb2YgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5vbkJsdXJfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIG1vdXNldXAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUub25Nb3VzZVVwXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5ibHVyXygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgY2xhc3MgdXBkYXRlcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLnVwZGF0ZUNsYXNzZXNfID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jaGVja0Rpc2FibGVkKCk7XG4gICAgdGhpcy5jaGVja1RvZ2dsZVN0YXRlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBibHVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuYmx1cl8gPSBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoeSB0aGVyZSdzIGEgZm9jdXMgZXZlbnQgYmVpbmcgZmlyZWQgYWZ0ZXIgb3VyIGJsdXIsXG4gICAgLy8gc28gdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBoYWNrLlxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmJsdXIoKTtcbiAgICB9LmJpbmQodGhpcyksIC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAodGhpcy5Db25zdGFudF8uVElOWV9USU1FT1VUKSk7XG4gIH07XG5cbiAgLy8gUHVibGljIG1ldGhvZHMuXG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBpbnB1dHMgdG9nZ2xlIHN0YXRlIGFuZCB1cGRhdGUgZGlzcGxheS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuY2hlY2tUb2dnbGVTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCkge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ0hFQ0tFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0NIRUNLRUQpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGVbJ2NoZWNrVG9nZ2xlU3RhdGUnXSA9XG4gICAgICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5jaGVja1RvZ2dsZVN0YXRlO1xuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgaW5wdXRzIGRpc2FibGVkIHN0YXRlIGFuZCB1cGRhdGUgZGlzcGxheS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuY2hlY2tEaXNhYmxlZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlucHV0RWxlbWVudF8uZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRElTQUJMRUQpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGVbJ2NoZWNrRGlzYWJsZWQnXSA9XG4gICAgICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5jaGVja0Rpc2FibGVkO1xuXG4gIC8qKlxuICAgKiBEaXNhYmxlIGNoZWNrYm94LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlWydkaXNhYmxlJ10gPSBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5kaXNhYmxlO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgY2hlY2tib3guXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgfTtcbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGVbJ2VuYWJsZSddID0gTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuZW5hYmxlO1xuXG4gIC8qKlxuICAgKiBDaGVjayBjaGVja2JveC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxDaGVja2JveC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZVsnY2hlY2snXSA9IE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlLmNoZWNrO1xuXG4gIC8qKlxuICAgKiBVbmNoZWNrIGNoZWNrYm94LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS51bmNoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRfLmNoZWNrZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsQ2hlY2tib3gucHJvdG90eXBlWyd1bmNoZWNrJ10gPSBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS51bmNoZWNrO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbENoZWNrYm94LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHRoaXMuaW5wdXRFbGVtZW50XyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcignLicgK1xuICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uSU5QVVQpO1xuXG4gICAgICB2YXIgYm94T3V0bGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGJveE91dGxpbmUuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkJPWF9PVVRMSU5FKTtcblxuICAgICAgdmFyIHRpY2tDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0aWNrQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5GT0NVU19IRUxQRVIpO1xuXG4gICAgICB2YXIgdGlja091dGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0aWNrT3V0bGluZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVElDS19PVVRMSU5FKTtcblxuICAgICAgYm94T3V0bGluZS5hcHBlbmRDaGlsZCh0aWNrT3V0bGluZSk7XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQodGlja0NvbnRhaW5lcik7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKGJveE91dGxpbmUpO1xuXG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfSUdOT1JFX0VWRU5UUyk7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9DT05UQUlORVIpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NFTlRFUik7XG4gICAgICAgIHRoaXMuYm91bmRSaXBwbGVNb3VzZVVwID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRSaXBwbGVNb3VzZVVwKTtcblxuICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRSk7XG5cbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5hcHBlbmRDaGlsZChyaXBwbGUpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8pO1xuICAgICAgfVxuICAgICAgdGhpcy5ib3VuZElucHV0T25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZElucHV0T25Gb2N1cyA9IHRoaXMub25Gb2N1c18uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYm91bmRJbnB1dE9uQmx1ciA9IHRoaXMub25CbHVyXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZEVsZW1lbnRNb3VzZVVwID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZElucHV0T25DaGFuZ2UpO1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5ib3VuZElucHV0T25Gb2N1cyk7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRJbnB1dE9uQmx1cik7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmJvdW5kRWxlbWVudE1vdXNlVXApO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxDaGVja2JveCxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxDaGVja2JveCcsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtY2hlY2tib3gnLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
