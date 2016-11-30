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
                 * Class constructor for Radio MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialRadio = function MaterialRadio(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialRadio'] = MaterialRadio;

  /**
                                            * Store constants in one place so they can be updated easily.
                                            *
                                            * @enum {string | number}
                                            * @private
                                            */
  MaterialRadio.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001 };


  /**
                            * Store strings for class names defined by this component that are used in
                            * JavaScript. This allows us to simply change it in one place should we
                            * decide to modify at a later date.
                            *
                            * @enum {string}
                            * @private
                            */
  MaterialRadio.prototype.CssClasses_ = {
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked',
    IS_UPGRADED: 'is-upgraded',
    JS_RADIO: 'mdl-js-radio',
    RADIO_BTN: 'mdl-radio__button',
    RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
    RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple' };


  /**
                             * Handle change of state.
                             *
                             * @param {Event} event The event that fired.
                             * @private
                             */
  MaterialRadio.prototype.onChange_ = function (event) {
    // Since other radio buttons don't get change events, we need to look for
    // them to update their classes.
    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
    for (var i = 0; i < radios.length; i++) {
      var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
      // Different name == different group, so no point updating those.
      if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
        radios[i]['MaterialRadio'].updateClasses_();
      }
    }
  };

  /**
      * Handle focus.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialRadio.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle lost focus.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialRadio.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle mouseup.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialRadio.prototype.onMouseup_ = function (event) {
    this.blur_();
  };

  /**
      * Update classes.
      *
      * @private
      */
  MaterialRadio.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
  };

  /**
      * Add blur.
      *
      * @private
      */
  MaterialRadio.prototype.blur_ = function () {

    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
      this.btnElement_.blur();
    }.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
  };

  // Public methods.

  /**
   * Check the components disabled state.
   *
   * @public
   */
  MaterialRadio.prototype.checkDisabled = function () {
    if (this.btnElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialRadio.prototype['checkDisabled'] =
  MaterialRadio.prototype.checkDisabled;

  /**
                                          * Check the components toggled state.
                                          *
                                          * @public
                                          */
  MaterialRadio.prototype.checkToggleState = function () {
    if (this.btnElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  MaterialRadio.prototype['checkToggleState'] =
  MaterialRadio.prototype.checkToggleState;

  /**
                                             * Disable radio.
                                             *
                                             * @public
                                             */
  MaterialRadio.prototype.disable = function () {
    this.btnElement_.disabled = true;
    this.updateClasses_();
  };
  MaterialRadio.prototype['disable'] = MaterialRadio.prototype.disable;

  /**
                                                                         * Enable radio.
                                                                         *
                                                                         * @public
                                                                         */
  MaterialRadio.prototype.enable = function () {
    this.btnElement_.disabled = false;
    this.updateClasses_();
  };
  MaterialRadio.prototype['enable'] = MaterialRadio.prototype.enable;

  /**
                                                                       * Check radio.
                                                                       *
                                                                       * @public
                                                                       */
  MaterialRadio.prototype.check = function () {
    this.btnElement_.checked = true;
    this.onChange_(null);
  };
  MaterialRadio.prototype['check'] = MaterialRadio.prototype.check;

  /**
                                                                     * Uncheck radio.
                                                                     *
                                                                     * @public
                                                                     */
  MaterialRadio.prototype.uncheck = function () {
    this.btnElement_.checked = false;
    this.onChange_(null);
  };
  MaterialRadio.prototype['uncheck'] = MaterialRadio.prototype.uncheck;

  /**
                                                                         * Initialize element.
                                                                         */
  MaterialRadio.prototype.init = function () {
    if (this.element_) {
      this.btnElement_ = this.element_.querySelector('.' +
      this.CssClasses_.RADIO_BTN);

      this.boundChangeHandler_ = this.onChange_.bind(this);
      this.boundFocusHandler_ = this.onChange_.bind(this);
      this.boundBlurHandler_ = this.onBlur_.bind(this);
      this.boundMouseUpHandler_ = this.onMouseup_.bind(this);

      var outerCircle = document.createElement('span');
      outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);

      var innerCircle = document.createElement('span');
      innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);

      this.element_.appendChild(outerCircle);
      this.element_.appendChild(innerCircle);

      var rippleContainer;
      if (this.element_.classList.contains(
      this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(
        this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        rippleContainer = document.createElement('span');
        rippleContainer.classList.add(
        this.CssClasses_.RIPPLE_CONTAINER);
        rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
        rippleContainer.addEventListener('mouseup', this.boundMouseUpHandler_);

        var ripple = document.createElement('span');
        ripple.classList.add(this.CssClasses_.RIPPLE);

        rippleContainer.appendChild(ripple);
        this.element_.appendChild(rippleContainer);
      }

      this.btnElement_.addEventListener('change', this.boundChangeHandler_);
      this.btnElement_.addEventListener('focus', this.boundFocusHandler_);
      this.btnElement_.addEventListener('blur', this.boundBlurHandler_);
      this.element_.addEventListener('mouseup', this.boundMouseUpHandler_);

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialRadio,
    classAsString: 'MaterialRadio',
    cssClass: 'mdl-js-radio',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhZGlvLmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUmFkaW8iLCJlbGVtZW50IiwiZWxlbWVudF8iLCJpbml0Iiwid2luZG93IiwicHJvdG90eXBlIiwiQ29uc3RhbnRfIiwiVElOWV9USU1FT1VUIiwiQ3NzQ2xhc3Nlc18iLCJJU19GT0NVU0VEIiwiSVNfRElTQUJMRUQiLCJJU19DSEVDS0VEIiwiSVNfVVBHUkFERUQiLCJKU19SQURJTyIsIlJBRElPX0JUTiIsIlJBRElPX09VVEVSX0NJUkNMRSIsIlJBRElPX0lOTkVSX0NJUkNMRSIsIlJJUFBMRV9FRkZFQ1QiLCJSSVBQTEVfSUdOT1JFX0VWRU5UUyIsIlJJUFBMRV9DT05UQUlORVIiLCJSSVBQTEVfQ0VOVEVSIiwiUklQUExFIiwib25DaGFuZ2VfIiwiZXZlbnQiLCJyYWRpb3MiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpIiwibGVuZ3RoIiwiYnV0dG9uIiwicXVlcnlTZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsImJ0bkVsZW1lbnRfIiwidXBkYXRlQ2xhc3Nlc18iLCJvbkZvY3VzXyIsImNsYXNzTGlzdCIsImFkZCIsIm9uQmx1cl8iLCJyZW1vdmUiLCJvbk1vdXNldXBfIiwiYmx1cl8iLCJjaGVja0Rpc2FibGVkIiwiY2hlY2tUb2dnbGVTdGF0ZSIsInNldFRpbWVvdXQiLCJibHVyIiwiYmluZCIsImRpc2FibGVkIiwiY2hlY2tlZCIsImRpc2FibGUiLCJlbmFibGUiLCJjaGVjayIsInVuY2hlY2siLCJib3VuZENoYW5nZUhhbmRsZXJfIiwiYm91bmRGb2N1c0hhbmRsZXJfIiwiYm91bmRCbHVySGFuZGxlcl8iLCJib3VuZE1vdXNlVXBIYW5kbGVyXyIsIm91dGVyQ2lyY2xlIiwiY3JlYXRlRWxlbWVudCIsImlubmVyQ2lyY2xlIiwiYXBwZW5kQ2hpbGQiLCJyaXBwbGVDb250YWluZXIiLCJjb250YWlucyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyaXBwbGUiLCJjb21wb25lbnRIYW5kbGVyIiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyIsIndpZGdldCJdLCJtYXBwaW5ncyI6ImNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsWUFBVztBQUNWOztBQUVBOzs7Ozs7OztBQVFBLE1BQUlBLGdCQUFnQixTQUFTQSxhQUFULENBQXVCQyxPQUF2QixFQUFnQztBQUNsRCxTQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjs7QUFFQTtBQUNBLFNBQUtFLElBQUw7QUFDRCxHQUxEO0FBTUFDLFNBQU8sZUFBUCxJQUEwQkosYUFBMUI7O0FBRUE7Ozs7OztBQU1BQSxnQkFBY0ssU0FBZCxDQUF3QkMsU0FBeEIsR0FBb0M7QUFDbENDLGtCQUFjLEtBRG9CLEVBQXBDOzs7QUFJQTs7Ozs7Ozs7QUFRQVAsZ0JBQWNLLFNBQWQsQ0FBd0JHLFdBQXhCLEdBQXNDO0FBQ3BDQyxnQkFBWSxZQUR3QjtBQUVwQ0MsaUJBQWEsYUFGdUI7QUFHcENDLGdCQUFZLFlBSHdCO0FBSXBDQyxpQkFBYSxhQUp1QjtBQUtwQ0MsY0FBVSxjQUwwQjtBQU1wQ0MsZUFBVyxtQkFOeUI7QUFPcENDLHdCQUFvQix5QkFQZ0I7QUFRcENDLHdCQUFvQix5QkFSZ0I7QUFTcENDLG1CQUFlLHNCQVRxQjtBQVVwQ0MsMEJBQXNCLHFDQVZjO0FBV3BDQyxzQkFBa0IsNkJBWGtCO0FBWXBDQyxtQkFBZSxvQkFacUI7QUFhcENDLFlBQVEsWUFiNEIsRUFBdEM7OztBQWdCQTs7Ozs7O0FBTUFyQixnQkFBY0ssU0FBZCxDQUF3QmlCLFNBQXhCLEdBQW9DLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbEQ7QUFDQTtBQUNBLFFBQUlDLFNBQVNDLFNBQVNDLHNCQUFULENBQWdDLEtBQUtsQixXQUFMLENBQWlCSyxRQUFqRCxDQUFiO0FBQ0EsU0FBSyxJQUFJYyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE9BQU9JLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUN0QyxVQUFJRSxTQUFTTCxPQUFP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QyxhQUFULENBQXVCLE1BQXZCLENBQWI7QUFDQU0sZUFBTzVCLFNBQVAsQ0FBaUJDLEdBQWpCLENBQXFCLEtBQUs1QixXQUFMLENBQWlCYSxNQUF0Qzs7QUFFQXVDLHdCQUFnQkQsV0FBaEIsQ0FBNEJJLE1BQTVCO0FBQ0EsYUFBSzdELFFBQUwsQ0FBY3lELFdBQWQsQ0FBMEJDLGVBQTFCO0FBQ0Q7O0FBRUQsV0FBSzVCLFdBQUwsQ0FBaUI4QixnQkFBakIsQ0FBa0MsUUFBbEMsRUFBNEMsS0FBS1YsbUJBQWpEO0FBQ0EsV0FBS3BCLFdBQUwsQ0FBaUI4QixnQkFBakIsQ0FBa0MsT0FBbEMsRUFBMkMsS0FBS1Qsa0JBQWhEO0FBQ0EsV0FBS3JCLFdBQUwsQ0FBaUI4QixnQkFBakIsQ0FBa0MsTUFBbEMsRUFBMEMsS0FBS1IsaUJBQS9DO0FBQ0EsV0FBS3BELFFBQUwsQ0FBYzRELGdCQUFkLENBQStCLFNBQS9CLEVBQTBDLEtBQUtQLG9CQUEvQzs7QUFFQSxXQUFLdEIsY0FBTDtBQUNBLFdBQUsvQixRQUFMLENBQWNpQyxTQUFkLENBQXdCQyxHQUF4QixDQUE0QixLQUFLNUIsV0FBTCxDQUFpQkksV0FBN0M7QUFDRDtBQUNGLEdBOUNEOztBQWdEQTtBQUNBO0FBQ0FvRCxtQkFBaUJDLFFBQWpCLENBQTBCO0FBQ3hCQyxpQkFBYWxFLGFBRFc7QUFFeEJtRSxtQkFBZSxlQUZTO0FBR3hCQyxjQUFVLGNBSGM7QUFJeEJDLFlBQVEsSUFKZ0IsRUFBMUI7O0FBTUQsQ0FyUUQiLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBSYWRpbyBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuICB2YXIgTWF0ZXJpYWxSYWRpbyA9IGZ1bmN0aW9uIE1hdGVyaWFsUmFkaW8oZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbFJhZGlvJ10gPSBNYXRlcmlhbFJhZGlvO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxSYWRpby5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIFRJTllfVElNRU9VVDogMC4wMDFcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIElTX0ZPQ1VTRUQ6ICdpcy1mb2N1c2VkJyxcbiAgICBJU19ESVNBQkxFRDogJ2lzLWRpc2FibGVkJyxcbiAgICBJU19DSEVDS0VEOiAnaXMtY2hlY2tlZCcsXG4gICAgSVNfVVBHUkFERUQ6ICdpcy11cGdyYWRlZCcsXG4gICAgSlNfUkFESU86ICdtZGwtanMtcmFkaW8nLFxuICAgIFJBRElPX0JUTjogJ21kbC1yYWRpb19fYnV0dG9uJyxcbiAgICBSQURJT19PVVRFUl9DSVJDTEU6ICdtZGwtcmFkaW9fX291dGVyLWNpcmNsZScsXG4gICAgUkFESU9fSU5ORVJfQ0lSQ0xFOiAnbWRsLXJhZGlvX19pbm5lci1jaXJjbGUnLFxuICAgIFJJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgUklQUExFX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cycsXG4gICAgUklQUExFX0NPTlRBSU5FUjogJ21kbC1yYWRpb19fcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgUklQUExFX0NFTlRFUjogJ21kbC1yaXBwbGUtLWNlbnRlcicsXG4gICAgUklQUExFOiAnbWRsLXJpcHBsZSdcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNoYW5nZSBvZiBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZS5vbkNoYW5nZV8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIC8vIFNpbmNlIG90aGVyIHJhZGlvIGJ1dHRvbnMgZG9uJ3QgZ2V0IGNoYW5nZSBldmVudHMsIHdlIG5lZWQgdG8gbG9vayBmb3JcbiAgICAvLyB0aGVtIHRvIHVwZGF0ZSB0aGVpciBjbGFzc2VzLlxuICAgIHZhciByYWRpb3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuQ3NzQ2xhc3Nlc18uSlNfUkFESU8pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYnV0dG9uID0gcmFkaW9zW2ldLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5SQURJT19CVE4pO1xuICAgICAgLy8gRGlmZmVyZW50IG5hbWUgPT0gZGlmZmVyZW50IGdyb3VwLCBzbyBubyBwb2ludCB1cGRhdGluZyB0aG9zZS5cbiAgICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKCduYW1lJykgPT09IHRoaXMuYnRuRWxlbWVudF8uZ2V0QXR0cmlidXRlKCduYW1lJykpIHtcbiAgICAgICAgcmFkaW9zW2ldWydNYXRlcmlhbFJhZGlvJ10udXBkYXRlQ2xhc3Nlc18oKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBmb2N1cy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZS5vbkZvY3VzXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBsb3N0IGZvY3VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLm9uQmx1cl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbW91c2V1cC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZS5vbk1vdXNldXBfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmJsdXJfKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBjbGFzc2VzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxSYWRpby5wcm90b3R5cGUudXBkYXRlQ2xhc3Nlc18gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICB0aGlzLmNoZWNrVG9nZ2xlU3RhdGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGJsdXIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZS5ibHVyXyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gVE9ETzogZmlndXJlIG91dCB3aHkgdGhlcmUncyBhIGZvY3VzIGV2ZW50IGJlaW5nIGZpcmVkIGFmdGVyIG91ciBibHVyLFxuICAgIC8vIHNvIHRoYXQgd2UgY2FuIGF2b2lkIHRoaXMgaGFjay5cbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYnRuRWxlbWVudF8uYmx1cigpO1xuICAgIH0uYmluZCh0aGlzKSwgLyoqIEB0eXBlIHtudW1iZXJ9ICovICh0aGlzLkNvbnN0YW50Xy5USU5ZX1RJTUVPVVQpKTtcbiAgfTtcblxuICAvLyBQdWJsaWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbXBvbmVudHMgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5idG5FbGVtZW50Xy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRElTQUJMRUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19ESVNBQkxFRCk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZVsnY2hlY2tEaXNhYmxlZCddID1cbiAgICAgIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQ7XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnRzIHRvZ2dsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmNoZWNrVG9nZ2xlU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5idG5FbGVtZW50Xy5jaGVja2VkKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19DSEVDS0VEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ0hFQ0tFRCk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZVsnY2hlY2tUb2dnbGVTdGF0ZSddID1cbiAgICAgIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmNoZWNrVG9nZ2xlU3RhdGU7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgcmFkaW8uXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJ0bkVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlWydkaXNhYmxlJ10gPSBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZS5kaXNhYmxlO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgcmFkaW8uXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYnRuRWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlWydlbmFibGUnXSA9IE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmVuYWJsZTtcblxuICAvKipcbiAgICogQ2hlY2sgcmFkaW8uXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUmFkaW8ucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5idG5FbGVtZW50Xy5jaGVja2VkID0gdHJ1ZTtcbiAgICB0aGlzLm9uQ2hhbmdlXyhudWxsKTtcbiAgfTtcbiAgTWF0ZXJpYWxSYWRpby5wcm90b3R5cGVbJ2NoZWNrJ10gPSBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZS5jaGVjaztcblxuICAvKipcbiAgICogVW5jaGVjayByYWRpby5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxSYWRpby5wcm90b3R5cGUudW5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYnRuRWxlbWVudF8uY2hlY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMub25DaGFuZ2VfKG51bGwpO1xuICB9O1xuICBNYXRlcmlhbFJhZGlvLnByb3RvdHlwZVsndW5jaGVjayddID0gTWF0ZXJpYWxSYWRpby5wcm90b3R5cGUudW5jaGVjaztcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxSYWRpby5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICB0aGlzLmJ0bkVsZW1lbnRfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCcuJyArXG4gICAgICAgICAgdGhpcy5Dc3NDbGFzc2VzXy5SQURJT19CVE4pO1xuXG4gICAgICB0aGlzLmJvdW5kQ2hhbmdlSGFuZGxlcl8gPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZEZvY3VzSGFuZGxlcl8gPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZEJsdXJIYW5kbGVyXyA9IHRoaXMub25CbHVyXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyXyA9IHRoaXMub25Nb3VzZXVwXy5iaW5kKHRoaXMpO1xuXG4gICAgICB2YXIgb3V0ZXJDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBvdXRlckNpcmNsZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUkFESU9fT1VURVJfQ0lSQ0xFKTtcblxuICAgICAgdmFyIGlubmVyQ2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgaW5uZXJDaXJjbGUuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJBRElPX0lOTkVSX0NJUkNMRSk7XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpO1xuICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSk7XG5cbiAgICAgIHZhciByaXBwbGVDb250YWluZXI7XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgdGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVCk7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NFTlRFUik7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyXyk7XG5cbiAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEUpO1xuXG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyaXBwbGUpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHJpcHBsZUNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnRuRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXJfKTtcbiAgICAgIHRoaXMuYnRuRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmJvdW5kRm9jdXNIYW5kbGVyXyk7XG4gICAgICB0aGlzLmJ0bkVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJvdW5kQmx1ckhhbmRsZXJfKTtcbiAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRNb3VzZVVwSGFuZGxlcl8pO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxSYWRpbyxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxSYWRpbycsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtcmFkaW8nLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
