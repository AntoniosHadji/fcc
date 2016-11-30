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
                 * Class constructor for Data Table Card MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {Element} element The element that will be upgraded.
                 */
  var MaterialDataTable = function MaterialDataTable(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['MaterialDataTable'] = MaterialDataTable;

  /**
                                                    * Store constants in one place so they can be updated easily.
                                                    *
                                                    * @enum {string | number}
                                                    * @private
                                                    */
  MaterialDataTable.prototype.Constant_ = {
    // None at the moment.
  };

  /**
      * Store strings for class names defined by this component that are used in
      * JavaScript. This allows us to simply change it in one place should we
      * decide to modify at a later date.
      *
      * @enum {string}
      * @private
      */
  MaterialDataTable.prototype.CssClasses_ = {
    DATA_TABLE: 'mdl-data-table',
    SELECTABLE: 'mdl-data-table--selectable',
    SELECT_ELEMENT: 'mdl-data-table__select',
    IS_SELECTED: 'is-selected',
    IS_UPGRADED: 'is-upgraded' };


  /**
                                   * Generates and returns a function that toggles the selection state of a
                                   * single row (or multiple rows).
                                   *
                                   * @param {Element} checkbox Checkbox that toggles the selection state.
                                   * @param {Element} row Row to toggle when checkbox changes.
                                   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
                                   * @private
                                   */
  MaterialDataTable.prototype.selectRow_ = function (checkbox, row, opt_rows) {
    if (row) {
      return function () {
        if (checkbox.checked) {
          row.classList.add(this.CssClasses_.IS_SELECTED);
        } else {
          row.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      }.bind(this);
    }

    if (opt_rows) {
      return function () {
        var i;
        var el;
        if (checkbox.checked) {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
            el['MaterialCheckbox'].check();
            opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
          }
        } else {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
            el['MaterialCheckbox'].uncheck();
            opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
          }
        }
      }.bind(this);
    }
  };

  /**
      * Creates a checkbox for a single or or multiple rows and hooks up the
      * event handling.
      *
      * @param {Element} row Row to toggle when checkbox changes.
      * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
      * @private
      */
  MaterialDataTable.prototype.createCheckbox_ = function (row, opt_rows) {
    var label = document.createElement('label');
    var labelClasses = [
    'mdl-checkbox',
    'mdl-js-checkbox',
    'mdl-js-ripple-effect',
    this.CssClasses_.SELECT_ELEMENT];

    label.className = labelClasses.join(' ');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('mdl-checkbox__input');

    if (row) {
      checkbox.checked = row.classList.contains(this.CssClasses_.IS_SELECTED);
      checkbox.addEventListener('change', this.selectRow_(checkbox, row));
    } else if (opt_rows) {
      checkbox.addEventListener('change', this.selectRow_(checkbox, null, opt_rows));
    }

    label.appendChild(checkbox);
    componentHandler.upgradeElement(label, 'MaterialCheckbox');
    return label;
  };

  /**
      * Initialize element.
      */
  MaterialDataTable.prototype.init = function () {
    if (this.element_) {
      var firstHeader = this.element_.querySelector('th');
      var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
      var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
      var rows = bodyRows.concat(footRows);

      if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
        var th = document.createElement('th');
        var headerCheckbox = this.createCheckbox_(null, rows);
        th.appendChild(headerCheckbox);
        firstHeader.parentElement.insertBefore(th, firstHeader);

        for (var i = 0; i < rows.length; i++) {
          var firstCell = rows[i].querySelector('td');
          if (firstCell) {
            var td = document.createElement('td');
            if (rows[i].parentNode.nodeName.toUpperCase() === 'TBODY') {
              var rowCheckbox = this.createCheckbox_(rows[i]);
              td.appendChild(rowCheckbox);
            }
            rows[i].insertBefore(td, firstCell);
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialDataTable,
    classAsString: 'MaterialDataTable',
    cssClass: 'mdl-js-data-table' });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGEtdGFibGUuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxEYXRhVGFibGUiLCJlbGVtZW50IiwiZWxlbWVudF8iLCJpbml0Iiwid2luZG93IiwicHJvdG90eXBlIiwiQ29uc3RhbnRfIiwiQ3NzQ2xhc3Nlc18iLCJEQVRBX1RBQkxFIiwiU0VMRUNUQUJMRSIsIlNFTEVDVF9FTEVNRU5UIiwiSVNfU0VMRUNURUQiLCJJU19VUEdSQURFRCIsInNlbGVjdFJvd18iLCJjaGVja2JveCIsInJvdyIsIm9wdF9yb3dzIiwiY2hlY2tlZCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImJpbmQiLCJpIiwiZWwiLCJsZW5ndGgiLCJxdWVyeVNlbGVjdG9yIiwiY2hlY2siLCJ1bmNoZWNrIiwiY3JlYXRlQ2hlY2tib3hfIiwibGFiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJsYWJlbENsYXNzZXMiLCJjbGFzc05hbWUiLCJqb2luIiwidHlwZSIsImNvbnRhaW5zIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFwcGVuZENoaWxkIiwiY29tcG9uZW50SGFuZGxlciIsInVwZ3JhZGVFbGVtZW50IiwiZmlyc3RIZWFkZXIiLCJib2R5Um93cyIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwicXVlcnlTZWxlY3RvckFsbCIsImZvb3RSb3dzIiwicm93cyIsImNvbmNhdCIsInRoIiwiaGVhZGVyQ2hlY2tib3giLCJwYXJlbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDZWxsIiwidGQiLCJwYXJlbnROb2RlIiwibm9kZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInJvd0NoZWNrYm94IiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyJdLCJtYXBwaW5ncyI6ImNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsWUFBVztBQUNWOztBQUVBOzs7Ozs7OztBQVFBLE1BQUlBLG9CQUFvQixTQUFTQSxpQkFBVCxDQUEyQkMs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QXVCLElBQXZCLENBQVQ7QUFDQSxZQUFJb0IsaUJBQWlCLEtBQUt2QixlQUFMLENBQXFCLElBQXJCLEVBQTJCb0IsSUFBM0IsQ0FBckI7QUFDQUUsV0FBR1osV0FBSCxDQUFlYSxjQUFmO0FBQ0FWLG9CQUFZVyxhQUFaLENBQTBCQyxZQUExQixDQUF1Q0gsRUFBdkMsRUFBMkNULFdBQTNDOztBQUVBLGFBQUssSUFBSW5CLElBQUksQ0FBYixFQUFnQkEsSUFBSTBCLEtBQUt4QixNQUF6QixFQUFpQ0YsR0FBakMsRUFBc0M7QUFDcEMsY0FBSWdDLFlBQVlOLEtBQUsxQixDQUFMLEVBQVFHLGFBQVIsQ0FBc0IsSUFBdEIsQ0FBaEI7QUFDQSxjQUFJNkIsU0FBSixFQUFlO0FBQ2IsZ0JBQUlDLEtBQUt6QixTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQVQ7QUFDQSxnQkFBSWlCLEtBQUsxQixDQUFMLEVBQVFrQyxVQUFSLENBQW1CQyxRQUFuQixDQUE0QkMsV0FBNUIsT0FBOEMsT0FBbEQsRUFBMkQ7QUFDekQsa0JBQUlDLGNBQWMsS0FBSy9CLGVBQUwsQ0FBcUJvQixLQUFLMUIsQ0FBTCxDQUFyQixDQUFsQjtBQUNBaUMsaUJBQUdqQixXQUFILENBQWVxQixXQUFmO0FBQ0Q7QUFDRFgsaUJBQUsxQixDQUFMLEVBQVErQixZQUFSLENBQXFCRSxFQUFyQixFQUF5QkQsU0FBekI7QUFDRDtBQUNGO0FBQ0QsYUFBS3BELFFBQUwsQ0FBY2dCLFNBQWQsQ0FBd0JDLEdBQXhCLENBQTRCLEtBQUtaLFdBQUwsQ0FBaUJLLFdBQTdDO0FBQ0Q7QUFDRjtBQUNGLEdBM0JEOztBQTZCQTtBQUNBO0FBQ0EyQixtQkFBaUJxQixRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWE3RCxpQkFEVztBQUV4QjhELG1CQUFlLG1CQUZTO0FBR3hCQyxjQUFVLG1CQUhjLEVBQTFCOztBQUtELENBL0pEIiwiZmlsZSI6ImRhdGEtdGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBEYXRhIFRhYmxlIENhcmQgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuICB2YXIgTWF0ZXJpYWxEYXRhVGFibGUgPSBmdW5jdGlvbiBNYXRlcmlhbERhdGFUYWJsZShlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIHdpbmRvd1snTWF0ZXJpYWxEYXRhVGFibGUnXSA9IE1hdGVyaWFsRGF0YVRhYmxlO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxEYXRhVGFibGUucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICAvLyBOb25lIGF0IHRoZSBtb21lbnQuXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbERhdGFUYWJsZS5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgREFUQV9UQUJMRTogJ21kbC1kYXRhLXRhYmxlJyxcbiAgICBTRUxFQ1RBQkxFOiAnbWRsLWRhdGEtdGFibGUtLXNlbGVjdGFibGUnLFxuICAgIFNFTEVDVF9FTEVNRU5UOiAnbWRsLWRhdGEtdGFibGVfX3NlbGVjdCcsXG4gICAgSVNfU0VMRUNURUQ6ICdpcy1zZWxlY3RlZCcsXG4gICAgSVNfVVBHUkFERUQ6ICdpcy11cGdyYWRlZCdcbiAgfTtcblxuICAvKipcbiAgICogR2VuZXJhdGVzIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB0b2dnbGVzIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgYVxuICAgKiBzaW5nbGUgcm93IChvciBtdWx0aXBsZSByb3dzKS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBjaGVja2JveCBDaGVja2JveCB0aGF0IHRvZ2dsZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSByb3cgUm93IHRvIHRvZ2dsZSB3aGVuIGNoZWNrYm94IGNoYW5nZXMuXG4gICAqIEBwYXJhbSB7KEFycmF5PE9iamVjdD58Tm9kZUxpc3QpPX0gb3B0X3Jvd3MgUm93cyB0byB0b2dnbGUgd2hlbiBjaGVja2JveCBjaGFuZ2VzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxEYXRhVGFibGUucHJvdG90eXBlLnNlbGVjdFJvd18gPSBmdW5jdGlvbihjaGVja2JveCwgcm93LCBvcHRfcm93cykge1xuICAgIGlmIChyb3cpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1NFTEVDVEVEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByb3cuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX1NFTEVDVEVEKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChvcHRfcm93cykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGVsO1xuICAgICAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHRfcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZWwgPSBvcHRfcm93c1tpXS5xdWVyeVNlbGVjdG9yKCd0ZCcpLnF1ZXJ5U2VsZWN0b3IoJy5tZGwtY2hlY2tib3gnKTtcbiAgICAgICAgICAgIGVsWydNYXRlcmlhbENoZWNrYm94J10uY2hlY2soKTtcbiAgICAgICAgICAgIG9wdF9yb3dzW2ldLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19TRUxFQ1RFRCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHRfcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZWwgPSBvcHRfcm93c1tpXS5xdWVyeVNlbGVjdG9yKCd0ZCcpLnF1ZXJ5U2VsZWN0b3IoJy5tZGwtY2hlY2tib3gnKTtcbiAgICAgICAgICAgIGVsWydNYXRlcmlhbENoZWNrYm94J10udW5jaGVjaygpO1xuICAgICAgICAgICAgb3B0X3Jvd3NbaV0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX1NFTEVDVEVEKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjaGVja2JveCBmb3IgYSBzaW5nbGUgb3Igb3IgbXVsdGlwbGUgcm93cyBhbmQgaG9va3MgdXAgdGhlXG4gICAqIGV2ZW50IGhhbmRsaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHJvdyBSb3cgdG8gdG9nZ2xlIHdoZW4gY2hlY2tib3ggY2hhbmdlcy5cbiAgICogQHBhcmFtIHsoQXJyYXk8T2JqZWN0PnxOb2RlTGlzdCk9fSBvcHRfcm93cyBSb3dzIHRvIHRvZ2dsZSB3aGVuIGNoZWNrYm94IGNoYW5nZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbERhdGFUYWJsZS5wcm90b3R5cGUuY3JlYXRlQ2hlY2tib3hfID0gZnVuY3Rpb24ocm93LCBvcHRfcm93cykge1xuICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgdmFyIGxhYmVsQ2xhc3NlcyA9IFtcbiAgICAgICdtZGwtY2hlY2tib3gnLFxuICAgICAgJ21kbC1qcy1jaGVja2JveCcsXG4gICAgICAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgICAgdGhpcy5Dc3NDbGFzc2VzXy5TRUxFQ1RfRUxFTUVOVFxuICAgIF07XG4gICAgbGFiZWwuY2xhc3NOYW1lID0gbGFiZWxDbGFzc2VzLmpvaW4oJyAnKTtcbiAgICB2YXIgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LmNsYXNzTGlzdC5hZGQoJ21kbC1jaGVja2JveF9faW5wdXQnKTtcblxuICAgIGlmIChyb3cpIHtcbiAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSByb3cuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfU0VMRUNURUQpO1xuICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5zZWxlY3RSb3dfKGNoZWNrYm94LCByb3cpKTtcbiAgICB9IGVsc2UgaWYgKG9wdF9yb3dzKSB7XG4gICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnNlbGVjdFJvd18oY2hlY2tib3gsIG51bGwsIG9wdF9yb3dzKSk7XG4gICAgfVxuXG4gICAgbGFiZWwuYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnQobGFiZWwsICdNYXRlcmlhbENoZWNrYm94Jyk7XG4gICAgcmV0dXJuIGxhYmVsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbERhdGFUYWJsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICB2YXIgZmlyc3RIZWFkZXIgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJ3RoJyk7XG4gICAgICB2YXIgYm9keVJvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rib2R5IHRyJykpO1xuICAgICAgdmFyIGZvb3RSb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCd0Zm9vdCB0cicpKTtcbiAgICAgIHZhciByb3dzID0gYm9keVJvd3MuY29uY2F0KGZvb3RSb3dzKTtcblxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uU0VMRUNUQUJMRSkpIHtcbiAgICAgICAgdmFyIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgdmFyIGhlYWRlckNoZWNrYm94ID0gdGhpcy5jcmVhdGVDaGVja2JveF8obnVsbCwgcm93cyk7XG4gICAgICAgIHRoLmFwcGVuZENoaWxkKGhlYWRlckNoZWNrYm94KTtcbiAgICAgICAgZmlyc3RIZWFkZXIucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGgsIGZpcnN0SGVhZGVyKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZmlyc3RDZWxsID0gcm93c1tpXS5xdWVyeVNlbGVjdG9yKCd0ZCcpO1xuICAgICAgICAgIGlmIChmaXJzdENlbGwpIHtcbiAgICAgICAgICAgIHZhciB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgICAgICBpZiAocm93c1tpXS5wYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdUQk9EWScpIHtcbiAgICAgICAgICAgICAgdmFyIHJvd0NoZWNrYm94ID0gdGhpcy5jcmVhdGVDaGVja2JveF8ocm93c1tpXSk7XG4gICAgICAgICAgICAgIHRkLmFwcGVuZENoaWxkKHJvd0NoZWNrYm94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NbaV0uaW5zZXJ0QmVmb3JlKHRkLCBmaXJzdENlbGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxEYXRhVGFibGUsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsRGF0YVRhYmxlJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1kYXRhLXRhYmxlJ1xuICB9KTtcbn0pKCk7XG4iXX0=
