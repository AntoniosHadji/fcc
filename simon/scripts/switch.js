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
  var MaterialSwitch = function MaterialSwitch(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialSwitch'] = MaterialSwitch;

  /**
                                              * Store constants in one place so they can be updated easily.
                                              *
                                              * @enum {string | number}
                                              * @private
                                              */
  MaterialSwitch.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001 };


  /**
                            * Store strings for class names defined by this component that are used in
                            * JavaScript. This allows us to simply change it in one place should we
                            * decide to modify at a later date.
                            *
                            * @enum {string}
                            * @private
                            */
  MaterialSwitch.prototype.CssClasses_ = {
    INPUT: 'mdl-switch__input',
    TRACK: 'mdl-switch__track',
    THUMB: 'mdl-switch__thumb',
    FOCUS_HELPER: 'mdl-switch__focus-helper',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
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
  MaterialSwitch.prototype.onChange_ = function (event) {
    this.updateClasses_();
  };

  /**
      * Handle focus of element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialSwitch.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle lost focus of element.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialSwitch.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle mouseup.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialSwitch.prototype.onMouseUp_ = function (event) {
    this.blur_();
  };

  /**
      * Handle class updates.
      *
      * @private
      */
  MaterialSwitch.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
  };

  /**
      * Add blur.
      *
      * @private
      */
  MaterialSwitch.prototype.blur_ = function () {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
      this.inputElement_.blur();
    }.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
  };

  // Public methods.

  /**
   * Check the components disabled state.
   *
   * @public
   */
  MaterialSwitch.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialSwitch.prototype['checkDisabled'] =
  MaterialSwitch.prototype.checkDisabled;

  /**
                                           * Check the components toggled state.
                                           *
                                           * @public
                                           */
  MaterialSwitch.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  MaterialSwitch.prototype['checkToggleState'] =
  MaterialSwitch.prototype.checkToggleState;

  /**
                                              * Disable switch.
                                              *
                                              * @public
                                              */
  MaterialSwitch.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  MaterialSwitch.prototype['disable'] = MaterialSwitch.prototype.disable;

  /**
                                                                           * Enable switch.
                                                                           *
                                                                           * @public
                                                                           */
  MaterialSwitch.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  MaterialSwitch.prototype['enable'] = MaterialSwitch.prototype.enable;

  /**
                                                                         * Activate switch.
                                                                         *
                                                                         * @public
                                                                         */
  MaterialSwitch.prototype.on = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  MaterialSwitch.prototype['on'] = MaterialSwitch.prototype.on;

  /**
                                                                 * Deactivate switch.
                                                                 *
                                                                 * @public
                                                                 */
  MaterialSwitch.prototype.off = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  MaterialSwitch.prototype['off'] = MaterialSwitch.prototype.off;

  /**
                                                                   * Initialize element.
                                                                   */
  MaterialSwitch.prototype.init = function () {
    if (this.element_) {
      this.inputElement_ = this.element_.querySelector('.' +
      this.CssClasses_.INPUT);

      var track = document.createElement('div');
      track.classList.add(this.CssClasses_.TRACK);

      var thumb = document.createElement('div');
      thumb.classList.add(this.CssClasses_.THUMB);

      var focusHelper = document.createElement('span');
      focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);

      thumb.appendChild(focusHelper);

      this.element_.appendChild(track);
      this.element_.appendChild(thumb);

      this.boundMouseUpHandler = this.onMouseUp_.bind(this);

      if (this.element_.classList.contains(
      this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(
        this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        this.rippleContainerElement_ = document.createElement('span');
        this.rippleContainerElement_.classList.add(
        this.CssClasses_.RIPPLE_CONTAINER);
        this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
        this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);

        var ripple = document.createElement('span');
        ripple.classList.add(this.CssClasses_.RIPPLE);

        this.rippleContainerElement_.appendChild(ripple);
        this.element_.appendChild(this.rippleContainerElement_);
      }

      this.boundChangeHandler = this.onChange_.bind(this);
      this.boundFocusHandler = this.onFocus_.bind(this);
      this.boundBlurHandler = this.onBlur_.bind(this);

      this.inputElement_.addEventListener('change', this.boundChangeHandler);
      this.inputElement_.addEventListener('focus', this.boundFocusHandler);
      this.inputElement_.addEventListener('blur', this.boundBlurHandler);
      this.element_.addEventListener('mouseup', this.boundMouseUpHandler);

      this.updateClasses_();
      this.element_.classList.add('is-upgraded');
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialSwitch,
    classAsString: 'MaterialSwitch',
    cssClass: 'mdl-js-switch',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN3aXRjaC5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbFN3aXRjaCIsImVsZW1lbnQiLCJlbGVtZW50XyIsImluaXQiLCJ3aW5kb3ciLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJUSU5ZX1RJTUVPVVQiLCJDc3NDbGFzc2VzXyIsIklOUFVUIiwiVFJBQ0siLCJUSFVNQiIsIkZPQ1VTX0hFTFBFUiIsIlJJUFBMRV9FRkZFQ1QiLCJSSVBQTEVfSUdOT1JFX0VWRU5UUyIsIlJJUFBMRV9DT05UQUlORVIiLCJSSVBQTEVfQ0VOVEVSIiwiUklQUExFIiwiSVNfRk9DVVNFRCIsIklTX0RJU0FCTEVEIiwiSVNfQ0hFQ0tFRCIsIm9uQ2hhbmdlXyIsImV2ZW50IiwidXBkYXRlQ2xhc3Nlc18iLCJvbkZvY3VzXyIsImNsYXNzTGlzdCIsImFkZCIsIm9uQmx1cl8iLCJyZW1vdmUiLCJvbk1vdXNlVXBfIiwiYmx1cl8iLCJjaGVja0Rpc2FibGVkIiwiY2hlY2tUb2dnbGVTdGF0ZSIsInNldFRpbWVvdXQiLCJpbnB1dEVsZW1lbnRfIiwiYmx1ciIsImJpbmQiLCJkaXNhYmxlZCIsImNoZWNrZWQiLCJkaXNhYmxlIiwiZW5hYmxlIiwib24iLCJvZmYiLCJxdWVyeVNlbGVjdG9yIiwidHJhY2siLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0aHVtYiIsImZvY3VzSGVscGVyIiwiYXBwZW5kQ2hpbGQiLCJib3VuZE1vdXNlVXBIYW5kbGVyIiwiY29udGFpbnMiLCJyaXBwbGVDb250YWluZXJFbGVtZW50XyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyaXBwbGUiLCJib3VuZENoYW5nZUhhbmRsZXIiLCJib3VuZEZvY3VzSGFuZGxlciIsImJvdW5kQmx1ckhhbmRsZXIiLCJjb21wb25lbnRIYW5kbGVyIiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyIsIndpZGdldCJdLCJtYXBwaW5ncyI6ImNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FB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LENBQW9DLE1BQXBDLEVBQTRDLEtBQUtJLGdCQUFqRDtBQUNBLFdBQUt2RCxRQUFMLENBQWNtRCxnQkFBZCxDQUErQixTQUEvQixFQUEwQyxLQUFLSCxtQkFBL0M7O0FBRUEsV0FBSzNCLGNBQUw7QUFDQSxXQUFLckIsUUFBTCxDQUFjdUIsU0FBZCxDQUF3QkMsR0FBeEIsQ0FBNEIsYUFBNUI7QUFDRDtBQUNGLEdBbkREOztBQXFEQTtBQUNBO0FBQ0FnQyxtQkFBaUJDLFFBQWpCLENBQTBCO0FBQ3hCQyxpQkFBYTVELGNBRFc7QUFFeEI2RCxtQkFBZSxnQkFGUztBQUd4QkMsY0FBVSxlQUhjO0FBSXhCQyxZQUFRLElBSmdCLEVBQTFCOztBQU1ELENBL1BEIiwiZmlsZSI6InN3aXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIENoZWNrYm94IE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbFN3aXRjaCA9IGZ1bmN0aW9uIE1hdGVyaWFsU3dpdGNoKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxTd2l0Y2gnXSA9IE1hdGVyaWFsU3dpdGNoO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICBUSU5ZX1RJTUVPVVQ6IDAuMDAxXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgSU5QVVQ6ICdtZGwtc3dpdGNoX19pbnB1dCcsXG4gICAgVFJBQ0s6ICdtZGwtc3dpdGNoX190cmFjaycsXG4gICAgVEhVTUI6ICdtZGwtc3dpdGNoX190aHVtYicsXG4gICAgRk9DVVNfSEVMUEVSOiAnbWRsLXN3aXRjaF9fZm9jdXMtaGVscGVyJyxcbiAgICBSSVBQTEVfRUZGRUNUOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgIFJJUFBMRV9JR05PUkVfRVZFTlRTOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QtLWlnbm9yZS1ldmVudHMnLFxuICAgIFJJUFBMRV9DT05UQUlORVI6ICdtZGwtc3dpdGNoX19yaXBwbGUtY29udGFpbmVyJyxcbiAgICBSSVBQTEVfQ0VOVEVSOiAnbWRsLXJpcHBsZS0tY2VudGVyJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICBJU19GT0NVU0VEOiAnaXMtZm9jdXNlZCcsXG4gICAgSVNfRElTQUJMRUQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgSVNfQ0hFQ0tFRDogJ2lzLWNoZWNrZWQnXG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBjaGFuZ2Ugb2Ygc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlLm9uQ2hhbmdlXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgZm9jdXMgb2YgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUub25Gb2N1c18gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbG9zdCBmb2N1cyBvZiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5vbkJsdXJfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIG1vdXNldXAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlLm9uTW91c2VVcF8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuYmx1cl8oKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNsYXNzIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUudXBkYXRlQ2xhc3Nlc18gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICB0aGlzLmNoZWNrVG9nZ2xlU3RhdGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGJsdXIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUuYmx1cl8gPSBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoeSB0aGVyZSdzIGEgZm9jdXMgZXZlbnQgYmVpbmcgZmlyZWQgYWZ0ZXIgb3VyIGJsdXIsXG4gICAgLy8gc28gdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBoYWNrLlxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmJsdXIoKTtcbiAgICB9LmJpbmQodGhpcyksIC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAodGhpcy5Db25zdGFudF8uVElOWV9USU1FT1VUKSk7XG4gIH07XG5cbiAgLy8gUHVibGljIG1ldGhvZHMuXG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnRzIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUuY2hlY2tEaXNhYmxlZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlucHV0RWxlbWVudF8uZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRElTQUJMRUQpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlWydjaGVja0Rpc2FibGVkJ10gPVxuICAgICAgTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQ7XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnRzIHRvZ2dsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5jaGVja1RvZ2dsZVN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRFbGVtZW50Xy5jaGVja2VkKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19DSEVDS0VEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ0hFQ0tFRCk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGVbJ2NoZWNrVG9nZ2xlU3RhdGUnXSA9XG4gICAgICBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUuY2hlY2tUb2dnbGVTdGF0ZTtcblxuICAvKipcbiAgICogRGlzYWJsZSBzd2l0Y2guXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZVsnZGlzYWJsZSddID0gTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlLmRpc2FibGU7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBzd2l0Y2guXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZVsnZW5hYmxlJ10gPSBNYXRlcmlhbFN3aXRjaC5wcm90b3R5cGUuZW5hYmxlO1xuXG4gIC8qKlxuICAgKiBBY3RpdmF0ZSBzd2l0Y2guXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50Xy5jaGVja2VkID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZVsnb24nXSA9IE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5vbjtcblxuICAvKipcbiAgICogRGVhY3RpdmF0ZSBzd2l0Y2guXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudF8uY2hlY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgfTtcbiAgTWF0ZXJpYWxTd2l0Y2gucHJvdG90eXBlWydvZmYnXSA9IE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5vZmY7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsU3dpdGNoLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHRoaXMuaW5wdXRFbGVtZW50XyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcignLicgK1xuICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uSU5QVVQpO1xuXG4gICAgICB2YXIgdHJhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRyYWNrLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UUkFDSyk7XG5cbiAgICAgIHZhciB0aHVtYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGh1bWIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRIVU1CKTtcblxuICAgICAgdmFyIGZvY3VzSGVscGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgZm9jdXNIZWxwZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkZPQ1VTX0hFTFBFUik7XG5cbiAgICAgIHRodW1iLmFwcGVuZENoaWxkKGZvY3VzSGVscGVyKTtcblxuICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZCh0cmFjayk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKHRodW1iKTtcblxuICAgICAgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0lHTk9SRV9FVkVOVFMpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9DT05UQUlORVIpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXJFbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NFTlRFUik7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRNb3VzZVVwSGFuZGxlcik7XG5cbiAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEUpO1xuXG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyRWxlbWVudF8uYXBwZW5kQ2hpbGQocmlwcGxlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZCh0aGlzLnJpcHBsZUNvbnRhaW5lckVsZW1lbnRfKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIgPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZEZvY3VzSGFuZGxlciA9IHRoaXMub25Gb2N1c18uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYm91bmRCbHVySGFuZGxlciA9IHRoaXMub25CbHVyXy5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIpO1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5ib3VuZEZvY3VzSGFuZGxlcik7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRCbHVySGFuZGxlcik7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmJvdW5kTW91c2VVcEhhbmRsZXIpO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoJ2lzLXVwZ3JhZGVkJyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxTd2l0Y2gsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsU3dpdGNoJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1zd2l0Y2gnLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
