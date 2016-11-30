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
                 * Class constructor for Spinner MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @param {HTMLElement} element The element that will be upgraded.
                 * @constructor
                 */
  var MaterialSpinner = function MaterialSpinner(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialSpinner'] = MaterialSpinner;

  /**
                                                * Store constants in one place so they can be updated easily.
                                                *
                                                * @enum {string | number}
                                                * @private
                                                */
  MaterialSpinner.prototype.Constant_ = {
    MDL_SPINNER_LAYER_COUNT: 4 };


  /**
                                   * Store strings for class names defined by this component that are used in
                                   * JavaScript. This allows us to simply change it in one place should we
                                   * decide to modify at a later date.
                                   *
                                   * @enum {string}
                                   * @private
                                   */
  MaterialSpinner.prototype.CssClasses_ = {
    MDL_SPINNER_LAYER: 'mdl-spinner__layer',
    MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
    MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
    MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
    MDL_SPINNER_LEFT: 'mdl-spinner__left',
    MDL_SPINNER_RIGHT: 'mdl-spinner__right' };


  /**
                                                * Auxiliary method to create a spinner layer.
                                                *
                                                * @param {number} index Index of the layer to be created.
                                                * @public
                                                */
  MaterialSpinner.prototype.createLayer = function (index) {
    var layer = document.createElement('div');
    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);

    var leftClipper = document.createElement('div');
    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);

    var gapPatch = document.createElement('div');
    gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);

    var rightClipper = document.createElement('div');
    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);

    var circleOwners = [leftClipper, gapPatch, rightClipper];

    for (var i = 0; i < circleOwners.length; i++) {
      var circle = document.createElement('div');
      circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
      circleOwners[i].appendChild(circle);
    }

    layer.appendChild(leftClipper);
    layer.appendChild(gapPatch);
    layer.appendChild(rightClipper);

    this.element_.appendChild(layer);
  };
  MaterialSpinner.prototype['createLayer'] =
  MaterialSpinner.prototype.createLayer;

  /**
                                          * Stops the spinner animation.
                                          * Public method for users who need to stop the spinner for any reason.
                                          *
                                          * @public
                                          */
  MaterialSpinner.prototype.stop = function () {
    this.element_.classList.remove('is-active');
  };
  MaterialSpinner.prototype['stop'] = MaterialSpinner.prototype.stop;

  /**
                                                                       * Starts the spinner animation.
                                                                       * Public method for users who need to manually start the spinner for any reason
                                                                       * (instead of just adding the 'is-active' class to their markup).
                                                                       *
                                                                       * @public
                                                                       */
  MaterialSpinner.prototype.start = function () {
    this.element_.classList.add('is-active');
  };
  MaterialSpinner.prototype['start'] = MaterialSpinner.prototype.start;

  /**
                                                                         * Initialize element.
                                                                         */
  MaterialSpinner.prototype.init = function () {
    if (this.element_) {
      for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
        this.createLayer(i);
      }

      this.element_.classList.add('is-upgraded');
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialSpinner,
    classAsString: 'MaterialSpinner',
    cssClass: 'mdl-js-spinner',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwaW5uZXIuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxTcGlubmVyIiwiZWxlbWVudCIsImVsZW1lbnRfIiwiaW5pdCIsIndpbmRvdyIsInByb3RvdHlwZSIsIkNvbnN0YW50XyIsIk1ETF9TUElOTkVSX0xBWUVSX0NPVU5UIiwiQ3NzQ2xhc3Nlc18iLCJNRExfU1BJTk5FUl9MQVlFUiIsIk1ETF9TUElOTkVSX0NJUkNMRV9DTElQUEVSIiwiTURMX1NQSU5ORVJfQ0lSQ0xFIiwiTURMX1NQSU5ORVJfR0FQX1BBVENIIiwiTURMX1NQSU5ORVJfTEVGVCIsIk1ETF9TUElOTkVSX1JJR0hUIiwiY3JlYXRlTGF5ZXIiLCJpbmRleCIsImxheWVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwibGVmdENsaXBwZXIiLCJnYXBQYXRjaCIsInJpZ2h0Q2xpcHBlciIsImNpcmNsZU93bmVycyIsImkiLCJsZW5ndGgiLCJjaXJjbGUiLCJhcHBlbmRDaGlsZCIsInN0b3AiLCJyZW1vdmUiLCJzdGFydCIsImNvbXBvbmVudEhhbmRsZXIiLCJyZWdpc3RlciIsImNvbnN0cnVjdG9yIiwiY2xhc3NBc1N0cmluZyIsImNzc0NsYXNzIiwid2lkZ2V0Il0sIm1hcHBpbmdzIjoiY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxZQUFXO0FBQ1Y7O0FBRUE7Ozs7Ozs7O0FBUUEsTUFBSUEsa0JBQWtCLFNBQVNBLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDO0FBQ3RELFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCOztBQUVBO0FBQ0EsU0FBS0UsSUFBTDtBQUNELEdBTEQ7QUFNQUMsU0FBTyxpQkFBUCxJQUE0QkosZUFBNUI7O0FBRUE7Ozs7OztBQU1BQSxrQkFBZ0JLLFNBQWhCLENBQTBCQyxTQUExQixHQUFzQztBQUNwQ0MsNkJBQXlCLENBRFcsRUFBdEM7OztBQUlBOzs7Ozs7OztBQVFBUCxrQkFBZ0JLLFNBQWhCLENBQTBCRyxXQUExQixH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bUI7QUFDakIsV0FBSyxJQUFJd0IsSUFBSSxDQUFiLEVBQWdCQSxLQUFLLEtBQUtwQixTQUFMLENBQWVDLHVCQUFwQyxFQUE2RG1CLEdBQTdELEVBQWtFO0FBQ2hFLGFBQUtYLFdBQUwsQ0FBaUJXLENBQWpCO0FBQ0Q7O0FBRUQsV0FBS3hCLFFBQUwsQ0FBY2tCLFNBQWQsQ0FBd0JDLEdBQXhCLENBQTRCLGFBQTVCO0FBQ0Q7QUFDRixHQVJEOztBQVVBO0FBQ0E7QUFDQVksbUJBQWlCQyxRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWFuQyxlQURXO0FBRXhCb0MsbUJBQWUsaUJBRlM7QUFHeEJDLGNBQVUsZ0JBSGM7QUFJeEJDLFlBQVEsSUFKZ0IsRUFBMUI7O0FBTUQsQ0FqSUQiLCJmaWxlIjoic3Bpbm5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFNwaW5uZXIgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgdmFyIE1hdGVyaWFsU3Bpbm5lciA9IGZ1bmN0aW9uIE1hdGVyaWFsU3Bpbm5lcihlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsU3Bpbm5lciddID0gTWF0ZXJpYWxTcGlubmVyO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTcGlubmVyLnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gICAgTURMX1NQSU5ORVJfTEFZRVJfQ09VTlQ6IDRcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsU3Bpbm5lci5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgTURMX1NQSU5ORVJfTEFZRVI6ICdtZGwtc3Bpbm5lcl9fbGF5ZXInLFxuICAgIE1ETF9TUElOTkVSX0NJUkNMRV9DTElQUEVSOiAnbWRsLXNwaW5uZXJfX2NpcmNsZS1jbGlwcGVyJyxcbiAgICBNRExfU1BJTk5FUl9DSVJDTEU6ICdtZGwtc3Bpbm5lcl9fY2lyY2xlJyxcbiAgICBNRExfU1BJTk5FUl9HQVBfUEFUQ0g6ICdtZGwtc3Bpbm5lcl9fZ2FwLXBhdGNoJyxcbiAgICBNRExfU1BJTk5FUl9MRUZUOiAnbWRsLXNwaW5uZXJfX2xlZnQnLFxuICAgIE1ETF9TUElOTkVSX1JJR0hUOiAnbWRsLXNwaW5uZXJfX3JpZ2h0J1xuICB9O1xuXG4gIC8qKlxuICAgKiBBdXhpbGlhcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIHNwaW5uZXIgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCBvZiB0aGUgbGF5ZXIgdG8gYmUgY3JlYXRlZC5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxTcGlubmVyLnByb3RvdHlwZS5jcmVhdGVMYXllciA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgdmFyIGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGF5ZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLk1ETF9TUElOTkVSX0xBWUVSKTtcbiAgICBsYXllci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uTURMX1NQSU5ORVJfTEFZRVIgKyAnLScgKyBpbmRleCk7XG5cbiAgICB2YXIgbGVmdENsaXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZWZ0Q2xpcHBlci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uTURMX1NQSU5ORVJfQ0lSQ0xFX0NMSVBQRVIpO1xuICAgIGxlZnRDbGlwcGVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5NRExfU1BJTk5FUl9MRUZUKTtcblxuICAgIHZhciBnYXBQYXRjaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdhcFBhdGNoLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5NRExfU1BJTk5FUl9HQVBfUEFUQ0gpO1xuXG4gICAgdmFyIHJpZ2h0Q2xpcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpZ2h0Q2xpcHBlci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uTURMX1NQSU5ORVJfQ0lSQ0xFX0NMSVBQRVIpO1xuICAgIHJpZ2h0Q2xpcHBlci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uTURMX1NQSU5ORVJfUklHSFQpO1xuXG4gICAgdmFyIGNpcmNsZU93bmVycyA9IFtsZWZ0Q2xpcHBlciwgZ2FwUGF0Y2gsIHJpZ2h0Q2xpcHBlcl07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNpcmNsZU93bmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5NRExfU1BJTk5FUl9DSVJDTEUpO1xuICAgICAgY2lyY2xlT3duZXJzW2ldLmFwcGVuZENoaWxkKGNpcmNsZSk7XG4gICAgfVxuXG4gICAgbGF5ZXIuYXBwZW5kQ2hpbGQobGVmdENsaXBwZXIpO1xuICAgIGxheWVyLmFwcGVuZENoaWxkKGdhcFBhdGNoKTtcbiAgICBsYXllci5hcHBlbmRDaGlsZChyaWdodENsaXBwZXIpO1xuXG4gICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZChsYXllcik7XG4gIH07XG4gIE1hdGVyaWFsU3Bpbm5lci5wcm90b3R5cGVbJ2NyZWF0ZUxheWVyJ10gPVxuICAgICAgTWF0ZXJpYWxTcGlubmVyLnByb3RvdHlwZS5jcmVhdGVMYXllcjtcblxuICAvKipcbiAgICogU3RvcHMgdGhlIHNwaW5uZXIgYW5pbWF0aW9uLlxuICAgKiBQdWJsaWMgbWV0aG9kIGZvciB1c2VycyB3aG8gbmVlZCB0byBzdG9wIHRoZSBzcGlubmVyIGZvciBhbnkgcmVhc29uLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbFNwaW5uZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuICB9O1xuICBNYXRlcmlhbFNwaW5uZXIucHJvdG90eXBlWydzdG9wJ10gPSBNYXRlcmlhbFNwaW5uZXIucHJvdG90eXBlLnN0b3A7XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgc3Bpbm5lciBhbmltYXRpb24uXG4gICAqIFB1YmxpYyBtZXRob2QgZm9yIHVzZXJzIHdobyBuZWVkIHRvIG1hbnVhbGx5IHN0YXJ0IHRoZSBzcGlubmVyIGZvciBhbnkgcmVhc29uXG4gICAqIChpbnN0ZWFkIG9mIGp1c3QgYWRkaW5nIHRoZSAnaXMtYWN0aXZlJyBjbGFzcyB0byB0aGVpciBtYXJrdXApLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbFNwaW5uZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcbiAgfTtcbiAgTWF0ZXJpYWxTcGlubmVyLnByb3RvdHlwZVsnc3RhcnQnXSA9IE1hdGVyaWFsU3Bpbm5lci5wcm90b3R5cGUuc3RhcnQ7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsU3Bpbm5lci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB0aGlzLkNvbnN0YW50Xy5NRExfU1BJTk5FUl9MQVlFUl9DT1VOVDsgaSsrKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlTGF5ZXIoaSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCgnaXMtdXBncmFkZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFNwaW5uZXIsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsU3Bpbm5lcicsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtc3Bpbm5lcicsXG4gICAgd2lkZ2V0OiB0cnVlXG4gIH0pO1xufSkoKTtcbiJdfQ==
