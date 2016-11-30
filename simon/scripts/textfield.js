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
                 * Class constructor for Textfield MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialTextfield = function MaterialTextfield(element) {
    this.element_ = element;
    this.maxRows = this.Constant_.NO_MAX_ROWS;
    // Initialize instance.
    this.init();
  };
  window['MaterialTextfield'] = MaterialTextfield;

  /**
                                                    * Store constants in one place so they can be updated easily.
                                                    *
                                                    * @enum {string | number}
                                                    * @private
                                                    */
  MaterialTextfield.prototype.Constant_ = {
    NO_MAX_ROWS: -1,
    MAX_ROWS_ATTRIBUTE: 'maxrows' };


  /**
                                      * Store strings for class names defined by this component that are used in
                                      * JavaScript. This allows us to simply change it in one place should we
                                      * decide to modify at a later date.
                                      *
                                      * @enum {string}
                                      * @private
                                      */
  MaterialTextfield.prototype.CssClasses_ = {
    LABEL: 'mdl-textfield__label',
    INPUT: 'mdl-textfield__input',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded',
    HAS_PLACEHOLDER: 'has-placeholder' };


  /**
                                           * Handle input being entered.
                                           *
                                           * @param {Event} event The event that fired.
                                           * @private
                                           */
  MaterialTextfield.prototype.onKeyDown_ = function (event) {
    var currentRowCount = event.target.value.split('\n').length;
    if (event.keyCode === 13) {
      if (currentRowCount >= this.maxRows) {
        event.preventDefault();
      }
    }
  };

  /**
      * Handle focus.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialTextfield.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle lost focus.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialTextfield.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  /**
      * Handle reset event from out side.
      *
      * @param {Event} event The event that fired.
      * @private
      */
  MaterialTextfield.prototype.onReset_ = function (event) {
    this.updateClasses_();
  };

  /**
      * Handle class updates.
      *
      * @private
      */
  MaterialTextfield.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
    this.checkFocus();
  };

  // Public methods.

  /**
   * Check the disabled state and update field accordingly.
   *
   * @public
   */
  MaterialTextfield.prototype.checkDisabled = function () {
    if (this.input_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialTextfield.prototype['checkDisabled'] =
  MaterialTextfield.prototype.checkDisabled;

  /**
                                             * Check the focus state and update field accordingly.
                                             *
                                             * @public
                                             */
  MaterialTextfield.prototype.checkFocus = function () {
    if (Boolean(this.element_.querySelector(':focus'))) {
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    }
  };
  MaterialTextfield.prototype['checkFocus'] =
  MaterialTextfield.prototype.checkFocus;

  /**
                                           * Check the validity state and update field accordingly.
                                           *
                                           * @public
                                           */
  MaterialTextfield.prototype.checkValidity = function () {
    if (this.input_.validity) {
      if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
  };
  MaterialTextfield.prototype['checkValidity'] =
  MaterialTextfield.prototype.checkValidity;

  /**
                                              * Check the dirty state and update field accordingly.
                                              *
                                              * @public
                                              */
  MaterialTextfield.prototype.checkDirty = function () {
    if (this.input_.value && this.input_.value.length > 0) {
      this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
  };
  MaterialTextfield.prototype['checkDirty'] =
  MaterialTextfield.prototype.checkDirty;

  /**
                                           * Disable text field.
                                           *
                                           * @public
                                           */
  MaterialTextfield.prototype.disable = function () {
    this.input_.disabled = true;
    this.updateClasses_();
  };
  MaterialTextfield.prototype['disable'] = MaterialTextfield.prototype.disable;

  /**
                                                                                 * Enable text field.
                                                                                 *
                                                                                 * @public
                                                                                 */
  MaterialTextfield.prototype.enable = function () {
    this.input_.disabled = false;
    this.updateClasses_();
  };
  MaterialTextfield.prototype['enable'] = MaterialTextfield.prototype.enable;

  /**
                                                                               * Update text field value.
                                                                               *
                                                                               * @param {string} value The value to which to set the control (optional).
                                                                               * @public
                                                                               */
  MaterialTextfield.prototype.change = function (value) {

    this.input_.value = value || '';
    this.updateClasses_();
  };
  MaterialTextfield.prototype['change'] = MaterialTextfield.prototype.change;

  /**
                                                                               * Initialize element.
                                                                               */
  MaterialTextfield.prototype.init = function () {

    if (this.element_) {
      this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
      this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

      if (this.input_) {
        if (this.input_.hasAttribute(
        /** @type {string} */this.Constant_.MAX_ROWS_ATTRIBUTE)) {
          this.maxRows = parseInt(this.input_.getAttribute(
          /** @type {string} */this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
          if (isNaN(this.maxRows)) {
            this.maxRows = this.Constant_.NO_MAX_ROWS;
          }
        }

        if (this.input_.hasAttribute('placeholder')) {
          this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER);
        }

        this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
        this.boundFocusHandler = this.onFocus_.bind(this);
        this.boundBlurHandler = this.onBlur_.bind(this);
        this.boundResetHandler = this.onReset_.bind(this);
        this.input_.addEventListener('input', this.boundUpdateClassesHandler);
        this.input_.addEventListener('focus', this.boundFocusHandler);
        this.input_.addEventListener('blur', this.boundBlurHandler);
        this.input_.addEventListener('reset', this.boundResetHandler);

        if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
          // TODO: This should handle pasting multi line text.
          // Currently doesn't.
          this.boundKeyDownHandler = this.onKeyDown_.bind(this);
          this.input_.addEventListener('keydown', this.boundKeyDownHandler);
        }
        var invalid = this.element_.classList.
        contains(this.CssClasses_.IS_INVALID);
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        if (invalid) {
          this.element_.classList.add(this.CssClasses_.IS_INVALID);
        }
        if (this.input_.hasAttribute('autofocus')) {
          this.element_.focus();
          this.checkFocus();
        }
      }
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialTextfield,
    classAsString: 'MaterialTextfield',
    cssClass: 'mdl-js-textfield',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHRmaWVsZC5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbFRleHRmaWVsZCIsImVsZW1lbnQiLCJlbGVtZW50XyIsIm1heFJvd3MiLCJDb25zdGFudF8iLCJOT19NQVhfUk9XUyIsImluaXQiLCJ3aW5kb3ciLCJwcm90b3R5cGUiLCJNQVhfUk9XU19BVFRSSUJVVEUiLCJDc3NDbGFzc2VzXyIsIkxBQkVMIiwiSU5QVVQiLCJJU19ESVJUWSIsIklTX0ZPQ1VTRUQiLCJJU19ESVNBQkxFRCIsIklTX0lOVkFMSUQiLCJJU19VUEdSQURFRCIsIkhBU19QTEFDRUhPTERFUiIsIm9uS2V5RG93bl8iLCJldmVudCIsImN1cnJlbnRSb3dDb3VudCIsInRhcmdldCIsInZhbHVlIiwic3BsaXQiLCJsZW5ndGgiLCJrZXlDb2RlIiwicHJldmVudERlZmF1bHQiLCJvbkZvY3VzXyIsImNsYXNzTGlzdCIsImFkZCIsIm9uQmx1cl8iLCJyZW1vdmUiLCJvblJlc2V0XyIsInVwZGF0ZUNsYXNzZXNfIiwiY2hlY2tEaXNhYmxlZCIsImNoZWNrVmFsaWRpdHkiLCJjaGVja0RpcnR5IiwiY2hlY2tGb2N1cyIsImlucHV0XyIsImRpc2FibGVkIiwiQm9vbGVhbiIsInF1ZXJ5U2VsZWN0b3IiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZGlzYWJsZSIsImVuYWJsZSIsImNoYW5nZSIsImxhYmVsXyIsImhhc0F0dHJpYnV0ZSIsInBhcnNlSW50IiwiZ2V0QXR0cmlidXRlIiwiaXNOYU4iLCJib3VuZFVwZGF0ZUNsYXNzZXNIYW5kbGVyIiwiYmluZCIsImJvdW5kRm9jdXNIYW5kbGVyIiwiYm91bmRCbHVySGFuZGxlciIsImJvdW5kUmVzZXRIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvdW5kS2V5RG93bkhhbmRsZXIiLCJpbnZhbGlkIiwiY29udGFpbnMiLCJmb2N1cyIsImNvbXBvbmVudEhhbmRsZXIiLCJyZWdpc3RlciIsImNvbnN0cnVjdG9yIiwiY2xhc3NBc1N0cmluZyIsImNz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WUFBUSxJQUpnQixFQUExQjs7QUFNRCxDQTFRRCIsImZpbGUiOiJ0ZXh0ZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBUZXh0ZmllbGQgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbiAgdmFyIE1hdGVyaWFsVGV4dGZpZWxkID0gZnVuY3Rpb24gTWF0ZXJpYWxUZXh0ZmllbGQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuICAgIHRoaXMubWF4Um93cyA9IHRoaXMuQ29uc3RhbnRfLk5PX01BWF9ST1dTO1xuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxUZXh0ZmllbGQnXSA9IE1hdGVyaWFsVGV4dGZpZWxkO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICBOT19NQVhfUk9XUzogLTEsXG4gICAgTUFYX1JPV1NfQVRUUklCVVRFOiAnbWF4cm93cydcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBMQUJFTDogJ21kbC10ZXh0ZmllbGRfX2xhYmVsJyxcbiAgICBJTlBVVDogJ21kbC10ZXh0ZmllbGRfX2lucHV0JyxcbiAgICBJU19ESVJUWTogJ2lzLWRpcnR5JyxcbiAgICBJU19GT0NVU0VEOiAnaXMtZm9jdXNlZCcsXG4gICAgSVNfRElTQUJMRUQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgSVNfSU5WQUxJRDogJ2lzLWludmFsaWQnLFxuICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnLFxuICAgIEhBU19QTEFDRUhPTERFUjogJ2hhcy1wbGFjZWhvbGRlcidcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGlucHV0IGJlaW5nIGVudGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLm9uS2V5RG93bl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBjdXJyZW50Um93Q291bnQgPSBldmVudC50YXJnZXQudmFsdWUuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGlmIChjdXJyZW50Um93Q291bnQgPj0gdGhpcy5tYXhSb3dzKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgZm9jdXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLm9uRm9jdXNfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGxvc3QgZm9jdXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLm9uQmx1cl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgcmVzZXQgZXZlbnQgZnJvbSBvdXQgc2lkZS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUub25SZXNldF8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNsYXNzIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUudXBkYXRlQ2xhc3Nlc18gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcbiAgICB0aGlzLmNoZWNrVmFsaWRpdHkoKTtcbiAgICB0aGlzLmNoZWNrRGlydHkoKTtcbiAgICB0aGlzLmNoZWNrRm9jdXMoKTtcbiAgfTtcblxuICAvLyBQdWJsaWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGRpc2FibGVkIHN0YXRlIGFuZCB1cGRhdGUgZmllbGQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5jaGVja0Rpc2FibGVkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRfLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19ESVNBQkxFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZVsnY2hlY2tEaXNhYmxlZCddID1cbiAgICAgIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5jaGVja0Rpc2FibGVkO1xuXG4gIC8qKlxuICAqIENoZWNrIHRoZSBmb2N1cyBzdGF0ZSBhbmQgdXBkYXRlIGZpZWxkIGFjY29yZGluZ2x5LlxuICAqXG4gICogQHB1YmxpY1xuICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hlY2tGb2N1cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChCb29sZWFuKHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcignOmZvY3VzJykpKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19GT0NVU0VEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2NoZWNrRm9jdXMnXSA9XG4gICAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmNoZWNrRm9jdXM7XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSB2YWxpZGl0eSBzdGF0ZSBhbmQgdXBkYXRlIGZpZWxkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hlY2tWYWxpZGl0eSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlucHV0Xy52YWxpZGl0eSkge1xuICAgICAgaWYgKHRoaXMuaW5wdXRfLnZhbGlkaXR5LnZhbGlkKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0lOVkFMSUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfSU5WQUxJRCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2NoZWNrVmFsaWRpdHknXSA9XG4gICAgICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hlY2tWYWxpZGl0eTtcblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGRpcnR5IHN0YXRlIGFuZCB1cGRhdGUgZmllbGQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5jaGVja0RpcnR5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRfLnZhbHVlICYmIHRoaXMuaW5wdXRfLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0RJUlRZKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRElSVFkpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlWydjaGVja0RpcnR5J10gPVxuICAgICAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmNoZWNrRGlydHk7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgdGV4dCBmaWVsZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0Xy5kaXNhYmxlZCA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2Rpc2FibGUnXSA9IE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5kaXNhYmxlO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgdGV4dCBmaWVsZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRfLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2VuYWJsZSddID0gTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmVuYWJsZTtcblxuICAvKipcbiAgICogVXBkYXRlIHRleHQgZmllbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd2hpY2ggdG8gc2V0IHRoZSBjb250cm9sIChvcHRpb25hbCkuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXG4gICAgdGhpcy5pbnB1dF8udmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZVsnY2hhbmdlJ10gPSBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hhbmdlO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHRoaXMubGFiZWxfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uTEFCRUwpO1xuICAgICAgdGhpcy5pbnB1dF8gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JTlBVVCk7XG5cbiAgICAgIGlmICh0aGlzLmlucHV0Xykge1xuICAgICAgICBpZiAodGhpcy5pbnB1dF8uaGFzQXR0cmlidXRlKFxuICAgICAgICAgICAgICAvKiogQHR5cGUge3N0cmluZ30gKi8gKHRoaXMuQ29uc3RhbnRfLk1BWF9ST1dTX0FUVFJJQlVURSkpKSB7XG4gICAgICAgICAgdGhpcy5tYXhSb3dzID0gcGFyc2VJbnQodGhpcy5pbnB1dF8uZ2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAvKiogQHR5cGUge3N0cmluZ30gKi8gKHRoaXMuQ29uc3RhbnRfLk1BWF9ST1dTX0FUVFJJQlVURSkpLCAxMCk7XG4gICAgICAgICAgaWYgKGlzTmFOKHRoaXMubWF4Um93cykpIHtcbiAgICAgICAgICAgIHRoaXMubWF4Um93cyA9IHRoaXMuQ29uc3RhbnRfLk5PX01BWF9ST1dTO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlucHV0Xy5oYXNBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5IQVNfUExBQ0VIT0xERVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib3VuZFVwZGF0ZUNsYXNzZXNIYW5kbGVyID0gdGhpcy51cGRhdGVDbGFzc2VzXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJvdW5kRm9jdXNIYW5kbGVyID0gdGhpcy5vbkZvY3VzXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJvdW5kQmx1ckhhbmRsZXIgPSB0aGlzLm9uQmx1cl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5ib3VuZFJlc2V0SGFuZGxlciA9IHRoaXMub25SZXNldF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5pbnB1dF8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmJvdW5kVXBkYXRlQ2xhc3Nlc0hhbmRsZXIpO1xuICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuYm91bmRGb2N1c0hhbmRsZXIpO1xuICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5ib3VuZEJsdXJIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5pbnB1dF8uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCB0aGlzLmJvdW5kUmVzZXRIYW5kbGVyKTtcblxuICAgICAgICBpZiAodGhpcy5tYXhSb3dzICE9PSB0aGlzLkNvbnN0YW50Xy5OT19NQVhfUk9XUykge1xuICAgICAgICAgIC8vIFRPRE86IFRoaXMgc2hvdWxkIGhhbmRsZSBwYXN0aW5nIG11bHRpIGxpbmUgdGV4dC5cbiAgICAgICAgICAvLyBDdXJyZW50bHkgZG9lc24ndC5cbiAgICAgICAgICB0aGlzLmJvdW5kS2V5RG93bkhhbmRsZXIgPSB0aGlzLm9uS2V5RG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgICB0aGlzLmlucHV0Xy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZEtleURvd25IYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW52YWxpZCA9IHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0XG4gICAgICAgICAgLmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfSU5WQUxJRCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ2xhc3Nlc18oKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVVBHUkFERUQpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0lOVkFMSUQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlucHV0Xy5oYXNBdHRyaWJ1dGUoJ2F1dG9mb2N1cycpKSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50Xy5mb2N1cygpO1xuICAgICAgICAgIHRoaXMuY2hlY2tGb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxUZXh0ZmllbGQsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsVGV4dGZpZWxkJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy10ZXh0ZmllbGQnLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
