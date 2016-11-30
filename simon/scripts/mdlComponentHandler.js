'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; /**
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

/**
                                                                                                                                                                                                                                                                                            * A component handler interface using the revealing module design pattern.
                                                                                                                                                                                                                                                                                            * More details on this design pattern here:
                                                                                                                                                                                                                                                                                            * https://github.com/jasonmayes/mdl-component-design-pattern
                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                            * @author Jason Mayes.
                                                                                                                                                                                                                                                                                            */
/* exported componentHandler */

// Pre-defining the componentHandler interface, for closure documentation and
// static verification.
var componentHandler = {
  /**
                          * Searches existing DOM for elements of our component type and upgrades them
                          * if they have not already been upgraded.
                          *
                          * @param {string=} optJsClass the programatic name of the element class we
                          * need to create a new instance of.
                          * @param {string=} optCssClass the name of the CSS class elements of this
                          * type will have.
                          */
  upgradeDom: function upgradeDom(optJsClass, optCssClass) {},
  /**
                                                                * Upgrades a specific element rather than all in the DOM.
                                                                *
                                                                * @param {!Element} element The element we wish to upgrade.
                                                                * @param {string=} optJsClass Optional name of the class we want to upgrade
                                                                * the element to.
                                                                */
  upgradeElement: function upgradeElement(element, optJsClass) {},
  /**
                                                                    * Upgrades a specific list of elements rather than all in the DOM.
                                                                    *
                                                                    * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
                                                                    * The elements we wish to upgrade.
                                                                    */
  upgradeElements: function upgradeElements(elements) {},
  /**
                                                           * Upgrades all registered components found in the current DOM. This is
                                                           * automatically called on window load.
                                                           */
  upgradeAllRegistered: function upgradeAllRegistered() {},
  /**
                                                             * Allows user to be alerted to any upgrades that are performed for a given
                                                             * component type
                                                             *
                                                             * @param {string} jsClass The class name of the MDL component we wish
                                                             * to hook into for any upgrades performed.
                                                             * @param {function(!HTMLElement)} callback The function to call upon an
                                                             * upgrade. This function should expect 1 parameter - the HTMLElement which
                                                             * got upgraded.
                                                             */
  registerUpgradedCallback: function registerUpgradedCallback(jsClass, callback) {},
  /**
                                                                                      * Registers a class for future use and attempts to upgrade existing DOM.
                                                                                      *
                                                                                      * @param {componentHandler.ComponentConfigPublic} config the registration configuration
                                                                                      */
  register: function register(config) {},
  /**
                                           * Downgrade either a given node, an array of nodes, or a NodeList.
                                           *
                                           * @param {!Node|!Array<!Node>|!NodeList} nodes
                                           */
  downgradeElements: function downgradeElements(nodes) {} };


componentHandler = function () {
  'use strict';

  /** @type {!Array<componentHandler.ComponentConfig>} */
  var registeredComponents_ = [];

  /** @type {!Array<componentHandler.Component>} */
  var createdComponents_ = [];

  var componentConfigProperty_ = 'mdlComponentConfigInternal_';

  /**
                                                                 * Searches registered components for a class we are interested in using.
                                                                 * Optionally replaces a match with passed object if specified.
                                                                 *
                                                                 * @param {string} name The name of a class we want to use.
                                                                 * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
                                                                 * @return {!Object|boolean}
                                                                 * @private
                                                                 */
  function findRegisteredClass_(name, optReplace) {
    for (var i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (typeof optReplace !== 'undefined') {
          registeredComponents_[i] = optReplace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }

  /**
     * Returns an array of the classNames of the upgraded classes on the element.
     *
     * @param {!Element} element The element to fetch data from.
     * @return {!Array<string>}
     * @private
     */
  function getUpgradedListOfElement_(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
  }

  /**
     * Returns true if the given element has already been upgraded for the given
     * class.
     *
     * @param {!Element} element The element we want to check.
     * @param {string} jsClass The class to check for.
     * @returns {boolean}
     * @private
     */
  function isElementUpgraded_(element, jsClass) {
    var upgradedList = getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  }

  /**
     * Searches existing DOM for elements of our component type and upgrades them
     * if they have not already been upgraded.
     *
     * @param {string=} optJsClass the programatic name of the element class we
     * need to create a new instance of.
     * @param {string=} optCssClass the name of the CSS class elements of this
     * type will have.
     */
  function upgradeDomInternal(optJsClass, optCssClass) {
    if (typeof optJsClass === 'undefined' &&
    typeof optCssClass === 'undefined') {
      for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className,
        registeredComponents_[i].cssClass);
      }
    } else {
      var jsClass = /** @type {string} */optJsClass;
      if (typeof optCssClass === 'undefined') {
        var registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll('.' + optCssClass);
      for (var n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }

  /**
     * Upgrades a specific element rather than all in the DOM.
     *
     * @param {!Element} element The element we wish to upgrade.
     * @param {string=} optJsClass Optional name of the class we want to upgrade
     * the element to.
     */
  function upgradeElementInternal(element, optJsClass) {
    // Verify argument type.
    if (!((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element instanceof Element)) {
      throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    var upgradedList = getUpgradedListOfElement_(element);
    var classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      var classList = element.classList;
      registeredComponents_.forEach(function (component) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (classList.contains(component.cssClass) &&
        classesToUpgrade.indexOf(component) === -1 &&
        !isElementUpgraded_(element, component.className)) {
          classesToUpgrade.push(component);
        }
      });
    } else if (!isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute('data-upgraded', upgradedList.join(','));
        var instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error(
        'Unable to find a registered component for the given class.');
      }

      var ev;
      if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
        ev = new CustomEvent('mdl-componentupgraded', {
          bubbles: true, cancelable: false });

      } else {
        ev = document.createEvent('Events');
        ev.initEvent('mdl-componentupgraded', true, true);
      }
      element.dispatchEvent(ev);
    }
  }

  /**
     * Upgrades a specific list of elements rather than all in the DOM.
     *
     * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
     * The elements we wish to upgrade.
     */
  function upgradeElementsInternal(elements) {
    if (!Array.isArray(elements)) {
      if (elements instanceof Element) {
        elements = [elements];
      } else {
        elements = Array.prototype.slice.call(elements);
      }
    }
    for (var i = 0, n = elements.length, element; i < n; i++) {
      element = elements[i];
      if (element instanceof HTMLElement) {
        upgradeElementInternal(element);
        if (element.children.length > 0) {
          upgradeElementsInternal(element.children);
        }
      }
    }
  }

  /**
     * Registers a class for future use and attempts to upgrade existing DOM.
     *
     * @param {componentHandler.ComponentConfigPublic} config
     */
  function registerInternal(config) {
    // In order to support both Closure-compiled and uncompiled code accessing
    // this method, we need to allow for both the dot and array syntax for
    // property access. You'll therefore see the `foo.bar || foo['bar']`
    // pattern repeated across this method.
    var widgetMissing = typeof config.widget === 'undefined' &&
    typeof config['widget'] === 'undefined';
    var widget = true;

    if (!widgetMissing) {
      widget = config.widget || config['widget'];
    }

    var newConfig = /** @type {componentHandler.ComponentConfig} */{
      classConstructor: config.constructor || config['constructor'],
      className: config.classAsString || config['classAsString'],
      cssClass: config.cssClass || config['cssClass'],
      widget: widget,
      callbacks: [] };


    registeredComponents_.forEach(function (item) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
      }
      if (item.className === newConfig.className) {
        throw new Error('The provided className has already been registered');
      }
    });

    if (config.constructor.prototype.
    hasOwnProperty(componentConfigProperty_)) {
      throw new Error(
      'MDL component classes must not have ' + componentConfigProperty_ +
      ' defined as a property.');
    }

    var found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  }

  /**
     * Allows user to be alerted to any upgrades that are performed for a given
     * component type
     *
     * @param {string} jsClass The class name of the MDL component we wish
     * to hook into for any upgrades performed.
     * @param {function(!HTMLElement)} callback The function to call upon an
     * upgrade. This function should expect 1 parameter - the HTMLElement which
     * got upgraded.
     */
  function registerUpgradedCallbackInternal(jsClass, callback) {
    var regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }

  /**
     * Upgrades all registered components found in the current DOM. This is
     * automatically called on window load.
     */
  function upgradeAllRegisteredInternal() {
    for (var n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }

  /**
     * Check the component for the downgrade method.
     * Execute if found.
     * Remove component from createdComponents list.
     *
     * @param {?componentHandler.Component} component
     */
  function deconstructComponentInternal(component) {
    if (component) {
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
      var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute('data-upgraded', upgrades.join(','));

      var ev;
      if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
        ev = new CustomEvent('mdl-componentdowngraded', {
          bubbles: true, cancelable: false });

      } else {
        ev = document.createEvent('Events');
        ev.initEvent('mdl-componentdowngraded', true, true);
      }
      component.element_.dispatchEvent(ev);
    }
  }

  /**
     * Downgrade either a given node, an array of nodes, or a NodeList.
     *
     * @param {!Node|!Array<!Node>|!NodeList} nodes
     */
  function downgradeNodesInternal(nodes) {
    /**
                                           * Auxiliary function to downgrade a single node.
                                           * @param  {!Node} node the node to be downgraded
                                           */
    var downgradeNode = function downgradeNode(node) {
      createdComponents_.filter(function (item) {
        return item.element_ === node;
      }).forEach(deconstructComponentInternal);
    };
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error('Invalid argument provided to downgrade MDL nodes.');
    }
  }

  // Now return the functions that should be made public with their publicly
  // facing names...
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeElements: upgradeElementsInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal,
    downgradeElements: downgradeNodesInternal };

}();

/**
      * Describes the type of a registered component type managed by
      * componentHandler. Provided for benefit of the Closure compiler.
      *
      * @typedef {{
      *   constructor: Function,
      *   classAsString: string,
      *   cssClass: string,
      *   widget: (string|boolean|undefined)
      * }}
      */
componentHandler.ComponentConfigPublic; // jshint ignore:line

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: !Function,
 *   className: string,
 *   cssClass: string,
 *   widget: (string|boolean),
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
 */
componentHandler.ComponentConfig; // jshint ignore:line

/**
 * Created component (i.e., upgraded element) type as managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   element_: !HTMLElement,
 *   className: string,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: string
 * }}
 */
componentHandler.Component; // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
componentHandler['upgradeDom'] = componentHandler.upgradeDom;
componentHandler['upgradeElement'] = componentHandler.upgradeElement;
componentHandler['upgradeElements'] = componentHandler.upgradeElements;
componentHandler['upgradeAllRegistered'] =
componentHandler.upgradeAllRegistered;
componentHandler['registerUpgradedCallback'] =
componentHandler.registerUpgradedCallback;
componentHandler['register'] = componentHandler.register;
componentHandler['downgradeElements'] = componentHandler.downgradeElements;
window.componentHandler = componentHandler;
window['componentHandler'] = componentHandler;

window.addEventListener('load', function () {
  'use strict';

  /**
                 * Performs a "Cutting the mustard" test. If the browser supports the features
                 * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
                 * components requiring JavaScript.
                 */
  if ('classList' in document.createElement('div') &&
  'querySelector' in document &&
  'addEventListener' in window && Array.prototype.forEach) {
    document.documentElement.classList.add('mdl-js');
    componentHandler.upgradeAllRegistered();
  } else {
    /**
           * Dummy function to avoid JS errors.
           */
    componentHandler.upgradeElement = function () {};
    /**
                                                       * Dummy function to avoid JS errors.
                                                       */
    componentHandler.register = function () {};
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1kbENvbXBvbmVudEhhbmRsZXIuanMiXSwibmFtZXMiOlsiY29tcG9uZW50SGFuZGxlciIsInVwZ3JhZGVEb20iLCJvcHRKc0NsYXNzIiwib3B0Q3NzQ2xhc3MiLCJ1cGdyYWRlRWxlbWVudCIsImVsZW1lbnQiLCJ1cGdyYWRlRWxlbWVudHMiLCJlbGVtZW50cyIsInVwZ3JhZGVBbGxSZWdpc3RlcmVkIiwicmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrIiwianNDbGFzcyIsImNhbGxiYWNrIiwicmVnaXN0ZXIiLCJjb25maWciLCJkb3duZ3JhZGVFbGVtZW50cyIsIm5vZGVzIiwicmVnaXN0ZXJlZENvbXBvbmVudHNfIiwiY3JlYXRlZENvbXBvbmVudHNfIiwiY29tcG9uZW50Q29uZmlnUHJvcGVydHlfIiwiZmluZFJlZ2lzdGVyZWRDbGFzc18iLCJuYW1lIiwib3B0UmVwbGFjZSIsImkiLCJsZW5ndGgiLCJjbGFzc05hbWUiLCJnZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfIiwiZGF0YVVwZ3JhZGVkIiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJpc0VsZW1lbnRVcGdyYWRlZF8iLCJ1cGdyYWRlZExpc3QiLCJpbmRleE9mIiwidXBncmFkZURvbUludGVybmFsIiwiY3NzQ2xhc3MiLCJyZWdpc3RlcmVkQ2xhc3MiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJuIiwidXBncmFkZUVsZW1lbnRJbnRlcm5hbCIsIkVsZW1lbnQiLCJFcnJvciIsImNsYXNzZXNUb1VwZ3JhZGUiLCJjbGFzc0xpc3QiLCJmb3JFYWNoIiwiY29tcG9uZW50IiwiY29udGFpbnMiLCJwdXNoIiwic2V0QXR0cmlidXRlIiwiam9pbiIsImluc3RhbmNlIiwiY2xhc3NDb25zdHJ1Y3RvciIsImoiLCJtIiwiY2FsbGJhY2tzIiwid2lkZ2V0IiwiZXYiLCJ3aW5kb3ciLCJDdXN0b21FdmVudCIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiY3JlYXRlRXZlbnQiLCJpbml0RXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwidXBncmFkZUVsZW1lbnRzSW50ZXJuYWwiLCJBcnJheSIsImlzQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJIVE1MRWxlbWVudCIsImNoaWxkcmVuIiwicmVnaXN0ZXJJbnRlcm5hbCIsIndpZGdldE1pc3NpbmciLCJuZXdDb25maWciLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJpdGVtIiwiaGFzT3duUHJvcGVydHkiLCJmb3VuZCIsInJlZ2lzdGVyVXBncmFkZWRDYWxsYmFja0ludGVybmFsIiwicmVnQ2xhc3MiLCJ1cGdyYWRlQWxsUmVnaXN0ZXJlZEludGVybmFsIiwiZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbCIsImNvbXBvbmVudEluZGV4Iiwic3BsaWNlIiwidXBncmFkZXMiLCJlbGVtZW50XyIsImNvbXBvbmVudFBsYWNlIiwiZG93bmdyYWRlTm9kZXNJbnRlcm5hbCIsImRvd25ncmFkZU5vZGUiLCJub2RlIiwiZmlsdGVyIiwiTm9kZUxpc3QiLCJOb2RlIiwiQ29tcG9uZW50Q29uZmlnUHVibGljIiwiQ29tcG9uZW50Q29uZmlnIiwiQ29tcG9uZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNyZWF0ZUVsZW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJhZGQiXSwibWFwcGluZ3MiOiJ1UkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkE7Ozs7Ozs7QUFPQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSUEsbUJBQW1CO0FBQ3JCOzs7Ozs7Ozs7QUFTQUMsY0FBWSxvQkFBU0MsVUFBVCxFQUFxQkMsV0FBckIsRUFBa0MsQ0FBRSxDQVYzQjtBQVdyQjs7Ozs7OztBQU9BQyxrQkFBZ0Isd0JBQVNDLE9BQVQsRUFBa0JILFVBQWxCLEVBQThCLENBQUUsQ0FsQjNCO0FBbUJyQjs7Ozs7O0FBTUFJLG1CQUFpQix5QkFBU0MsUUFBVCxFQUFtQixDQUFFLENBekJqQjtBQTBCckI7Ozs7QUFJQUMsd0JBQXNCLGdDQUFXLENBQUUsQ0E5QmQ7QUErQnJC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d0JBRHJCO0FBRUFULGlCQUFpQixVQUFqQixJQUErQkEsaUJBQWlCWSxRQUFoRDtBQUNBWixpQkFBaUIsbUJBQWpCLElBQXdDQSxpQkFBaUJjLGlCQUF6RDtBQUNBMEMsT0FBT3hELGdCQUFQLEdBQTBCQSxnQkFBMUI7QUFDQXdELE9BQU8sa0JBQVAsSUFBNkJ4RCxnQkFBN0I7O0FBRUF3RCxPQUFPeUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBVztBQUN6Qzs7QUFFQTs7Ozs7QUFLQSxNQUFJLGVBQWU5RCxTQUFTK0QsYUFBVCxDQUF1QixLQUF2QixDQUFmO0FBQ0EscUJBQW1CL0QsUUFEbkI7QUFFQSx3QkFBc0JxQixNQUZ0QixJQUVnQ1EsTUFBTUUsU0FBTixDQUFnQnZCLE9BRnBELEVBRTZEO0FBQzNEUixhQUFTZ0UsZUFBVCxDQUF5QnpELFNBQXpCLENBQW1DMEQsR0FBbkMsQ0FBdUMsUUFBdkM7QUFDQXBHLHFCQUFpQlEsb0JBQWpCO0FBQ0QsR0FMRCxNQUtPO0FBQ0w7OztBQUdBUixxQkFBaUJJLGNBQWpCLEdBQWtDLFlBQVcsQ0FBRSxDQUEvQztBQUNBOzs7QUFHQUoscUJBQWlCWSxRQUFqQixHQUE0QixZQUFXLENBQUUsQ0FBekM7QUFDRDtBQUNGLENBdkJEIiwiZmlsZSI6Im1kbENvbXBvbmVudEhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBBIGNvbXBvbmVudCBoYW5kbGVyIGludGVyZmFjZSB1c2luZyB0aGUgcmV2ZWFsaW5nIG1vZHVsZSBkZXNpZ24gcGF0dGVybi5cbiAqIE1vcmUgZGV0YWlscyBvbiB0aGlzIGRlc2lnbiBwYXR0ZXJuIGhlcmU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gKlxuICogQGF1dGhvciBKYXNvbiBNYXllcy5cbiAqL1xuLyogZXhwb3J0ZWQgY29tcG9uZW50SGFuZGxlciAqL1xuXG4vLyBQcmUtZGVmaW5pbmcgdGhlIGNvbXBvbmVudEhhbmRsZXIgaW50ZXJmYWNlLCBmb3IgY2xvc3VyZSBkb2N1bWVudGF0aW9uIGFuZFxuLy8gc3RhdGljIHZlcmlmaWNhdGlvbi5cbnZhciBjb21wb25lbnRIYW5kbGVyID0ge1xuICAvKipcbiAgICogU2VhcmNoZXMgZXhpc3RpbmcgRE9NIGZvciBlbGVtZW50cyBvZiBvdXIgY29tcG9uZW50IHR5cGUgYW5kIHVwZ3JhZGVzIHRoZW1cbiAgICogaWYgdGhleSBoYXZlIG5vdCBhbHJlYWR5IGJlZW4gdXBncmFkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyB0aGUgcHJvZ3JhbWF0aWMgbmFtZSBvZiB0aGUgZWxlbWVudCBjbGFzcyB3ZVxuICAgKiBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZi5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRDc3NDbGFzcyB0aGUgbmFtZSBvZiB0aGUgQ1NTIGNsYXNzIGVsZW1lbnRzIG9mIHRoaXNcbiAgICogdHlwZSB3aWxsIGhhdmUuXG4gICAqL1xuICB1cGdyYWRlRG9tOiBmdW5jdGlvbihvcHRKc0NsYXNzLCBvcHRDc3NDbGFzcykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhIHNwZWNpZmljIGVsZW1lbnQgcmF0aGVyIHRoYW4gYWxsIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgd2Ugd2lzaCB0byB1cGdyYWRlLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgT3B0aW9uYWwgbmFtZSBvZiB0aGUgY2xhc3Mgd2Ugd2FudCB0byB1cGdyYWRlXG4gICAqIHRoZSBlbGVtZW50IHRvLlxuICAgKi9cbiAgdXBncmFkZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdEpzQ2xhc3MpIHt9LFxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBsaXN0IG9mIGVsZW1lbnRzIHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fCFBcnJheTwhRWxlbWVudD58IU5vZGVMaXN0fCFIVE1MQ29sbGVjdGlvbn0gZWxlbWVudHNcbiAgICogVGhlIGVsZW1lbnRzIHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICovXG4gIHVwZ3JhZGVFbGVtZW50czogZnVuY3Rpb24oZWxlbWVudHMpIHt9LFxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICAqIEFsbG93cyB1c2VyIHRvIGJlIGFsZXJ0ZWQgdG8gYW55IHVwZ3JhZGVzIHRoYXQgYXJlIHBlcmZvcm1lZCBmb3IgYSBnaXZlblxuICAgKiBjb21wb25lbnQgdHlwZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgTURMIGNvbXBvbmVudCB3ZSB3aXNoXG4gICAqIHRvIGhvb2sgaW50byBmb3IgYW55IHVwZ3JhZGVzIHBlcmZvcm1lZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbighSFRNTEVsZW1lbnQpfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbCB1cG9uIGFuXG4gICAqIHVwZ3JhZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGV4cGVjdCAxIHBhcmFtZXRlciAtIHRoZSBIVE1MRWxlbWVudCB3aGljaFxuICAgKiBnb3QgdXBncmFkZWQuXG4gICAqL1xuICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IGZ1bmN0aW9uKGpzQ2xhc3MsIGNhbGxiYWNrKSB7fSxcbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNsYXNzIGZvciBmdXR1cmUgdXNlIGFuZCBhdHRlbXB0cyB0byB1cGdyYWRlIGV4aXN0aW5nIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ1B1YmxpY30gY29uZmlnIHRoZSByZWdpc3RyYXRpb24gY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGNvbmZpZykge30sXG4gIC8qKlxuICAgKiBEb3duZ3JhZGUgZWl0aGVyIGEgZ2l2ZW4gbm9kZSwgYW4gYXJyYXkgb2Ygbm9kZXMsIG9yIGEgTm9kZUxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7IU5vZGV8IUFycmF5PCFOb2RlPnwhTm9kZUxpc3R9IG5vZGVzXG4gICAqL1xuICBkb3duZ3JhZGVFbGVtZW50czogZnVuY3Rpb24obm9kZXMpIHt9XG59O1xuXG5jb21wb25lbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc+fSAqL1xuICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHNfID0gW107XG5cbiAgLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ+fSAqL1xuICB2YXIgY3JlYXRlZENvbXBvbmVudHNfID0gW107XG5cbiAgdmFyIGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XyA9ICdtZGxDb21wb25lbnRDb25maWdJbnRlcm5hbF8nO1xuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm9yIGEgY2xhc3Mgd2UgYXJlIGludGVyZXN0ZWQgaW4gdXNpbmcuXG4gICAqIE9wdGlvbmFsbHkgcmVwbGFjZXMgYSBtYXRjaCB3aXRoIHBhc3NlZCBvYmplY3QgaWYgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBhIGNsYXNzIHdlIHdhbnQgdG8gdXNlLlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnPX0gb3B0UmVwbGFjZSBPcHRpb25hbCBvYmplY3QgdG8gcmVwbGFjZSBtYXRjaCB3aXRoLlxuICAgKiBAcmV0dXJuIHshT2JqZWN0fGJvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kUmVnaXN0ZXJlZENsYXNzXyhuYW1lLCBvcHRSZXBsYWNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY2xhc3NOYW1lID09PSBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0UmVwbGFjZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0gPSBvcHRSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkQ29tcG9uZW50c19baV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjbGFzc05hbWVzIG9mIHRoZSB1cGdyYWRlZCBjbGFzc2VzIG9uIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZldGNoIGRhdGEgZnJvbS5cbiAgICogQHJldHVybiB7IUFycmF5PHN0cmluZz59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfKGVsZW1lbnQpIHtcbiAgICB2YXIgZGF0YVVwZ3JhZGVkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKTtcbiAgICAvLyBVc2UgYFsnJ11gIGFzIGRlZmF1bHQgdmFsdWUgdG8gY29uZm9ybSB0aGUgYCxuYW1lLG5hbWUuLi5gIHN0eWxlLlxuICAgIHJldHVybiBkYXRhVXBncmFkZWQgPT09IG51bGwgPyBbJyddIDogZGF0YVVwZ3JhZGVkLnNwbGl0KCcsJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gdXBncmFkZWQgZm9yIHRoZSBnaXZlblxuICAgKiBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3YW50IHRvIGNoZWNrLlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgdG8gY2hlY2sgZm9yLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGlzRWxlbWVudFVwZ3JhZGVkXyhlbGVtZW50LCBqc0NsYXNzKSB7XG4gICAgdmFyIHVwZ3JhZGVkTGlzdCA9IGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCk7XG4gICAgcmV0dXJuIHVwZ3JhZGVkTGlzdC5pbmRleE9mKGpzQ2xhc3MpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyBleGlzdGluZyBET00gZm9yIGVsZW1lbnRzIG9mIG91ciBjb21wb25lbnQgdHlwZSBhbmQgdXBncmFkZXMgdGhlbVxuICAgKiBpZiB0aGV5IGhhdmUgbm90IGFscmVhZHkgYmVlbiB1cGdyYWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIHRoZSBwcm9ncmFtYXRpYyBuYW1lIG9mIHRoZSBlbGVtZW50IGNsYXNzIHdlXG4gICAqIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdENzc0NsYXNzIHRoZSBuYW1lIG9mIHRoZSBDU1MgY2xhc3MgZWxlbWVudHMgb2YgdGhpc1xuICAgKiB0eXBlIHdpbGwgaGF2ZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVEb21JbnRlcm5hbChvcHRKc0NsYXNzLCBvcHRDc3NDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygb3B0SnNDbGFzcyA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdHlwZW9mIG9wdENzc0NsYXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdXBncmFkZURvbUludGVybmFsKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jbGFzc05hbWUsXG4gICAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY3NzQ2xhc3MpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIganNDbGFzcyA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAob3B0SnNDbGFzcyk7XG4gICAgICBpZiAodHlwZW9mIG9wdENzc0NsYXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgcmVnaXN0ZXJlZENsYXNzID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oanNDbGFzcyk7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkQ2xhc3MpIHtcbiAgICAgICAgICBvcHRDc3NDbGFzcyA9IHJlZ2lzdGVyZWRDbGFzcy5jc3NDbGFzcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIG9wdENzc0NsYXNzKTtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgZWxlbWVudHMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgdXBncmFkZUVsZW1lbnRJbnRlcm5hbChlbGVtZW50c1tuXSwganNDbGFzcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgZWxlbWVudCByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyBPcHRpb25hbCBuYW1lIG9mIHRoZSBjbGFzcyB3ZSB3YW50IHRvIHVwZ3JhZGVcbiAgICogdGhlIGVsZW1lbnQgdG8uXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnQsIG9wdEpzQ2xhc3MpIHtcbiAgICAvLyBWZXJpZnkgYXJndW1lbnQgdHlwZS5cbiAgICBpZiAoISh0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gdXBncmFkZSBNREwgZWxlbWVudC4nKTtcbiAgICB9XG4gICAgdmFyIHVwZ3JhZGVkTGlzdCA9IGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCk7XG4gICAgdmFyIGNsYXNzZXNUb1VwZ3JhZGUgPSBbXTtcbiAgICAvLyBJZiBqc0NsYXNzIGlzIG5vdCBwcm92aWRlZCBzY2FuIHRoZSByZWdpc3RlcmVkIGNvbXBvbmVudHMgdG8gZmluZCB0aGVcbiAgICAvLyBvbmVzIG1hdGNoaW5nIHRoZSBlbGVtZW50J3MgQ1NTIGNsYXNzTGlzdC5cbiAgICBpZiAoIW9wdEpzQ2xhc3MpIHtcbiAgICAgIHZhciBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzXy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyBNYXRjaCBDU1MgJiBOb3QgdG8gYmUgdXBncmFkZWQgJiBOb3QgdXBncmFkZWQuXG4gICAgICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMoY29tcG9uZW50LmNzc0NsYXNzKSAmJlxuICAgICAgICAgICAgY2xhc3Nlc1RvVXBncmFkZS5pbmRleE9mKGNvbXBvbmVudCkgPT09IC0xICYmXG4gICAgICAgICAgICAhaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIGNvbXBvbmVudC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgY2xhc3Nlc1RvVXBncmFkZS5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIWlzRWxlbWVudFVwZ3JhZGVkXyhlbGVtZW50LCBvcHRKc0NsYXNzKSkge1xuICAgICAgY2xhc3Nlc1RvVXBncmFkZS5wdXNoKGZpbmRSZWdpc3RlcmVkQ2xhc3NfKG9wdEpzQ2xhc3MpKTtcbiAgICB9XG5cbiAgICAvLyBVcGdyYWRlIHRoZSBlbGVtZW50IGZvciBlYWNoIGNsYXNzZXMuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjbGFzc2VzVG9VcGdyYWRlLmxlbmd0aCwgcmVnaXN0ZXJlZENsYXNzOyBpIDwgbjsgaSsrKSB7XG4gICAgICByZWdpc3RlcmVkQ2xhc3MgPSBjbGFzc2VzVG9VcGdyYWRlW2ldO1xuICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAvLyBNYXJrIGVsZW1lbnQgYXMgdXBncmFkZWQuXG4gICAgICAgIHVwZ3JhZGVkTGlzdC5wdXNoKHJlZ2lzdGVyZWRDbGFzcy5jbGFzc05hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcsIHVwZ3JhZGVkTGlzdC5qb2luKCcsJykpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgcmVnaXN0ZXJlZENsYXNzLmNsYXNzQ29uc3RydWN0b3IoZWxlbWVudCk7XG4gICAgICAgIGluc3RhbmNlW2NvbXBvbmVudENvbmZpZ1Byb3BlcnR5X10gPSByZWdpc3RlcmVkQ2xhc3M7XG4gICAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5wdXNoKGluc3RhbmNlKTtcbiAgICAgICAgLy8gQ2FsbCBhbnkgY2FsbGJhY2tzIHRoZSB1c2VyIGhhcyByZWdpc3RlcmVkIHdpdGggdGhpcyBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIG0gPSByZWdpc3RlcmVkQ2xhc3MuY2FsbGJhY2tzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgICAgICAgIHJlZ2lzdGVyZWRDbGFzcy5jYWxsYmFja3Nbal0oZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVnaXN0ZXJlZENsYXNzLndpZGdldCkge1xuICAgICAgICAgIC8vIEFzc2lnbiBwZXIgZWxlbWVudCBpbnN0YW5jZSBmb3IgY29udHJvbCBvdmVyIEFQSVxuICAgICAgICAgIGVsZW1lbnRbcmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZV0gPSBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IGZvciB0aGUgZ2l2ZW4gY2xhc3MuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBldjtcbiAgICAgIGlmICgnQ3VzdG9tRXZlbnQnIGluIHdpbmRvdyAmJiB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGV2ID0gbmV3IEN1c3RvbUV2ZW50KCdtZGwtY29tcG9uZW50dXBncmFkZWQnLCB7XG4gICAgICAgICAgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudHMnKTtcbiAgICAgICAgZXYuaW5pdEV2ZW50KCdtZGwtY29tcG9uZW50dXBncmFkZWQnLCB0cnVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgbGlzdCBvZiBlbGVtZW50cyByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudHwhQXJyYXk8IUVsZW1lbnQ+fCFOb2RlTGlzdHwhSFRNTENvbGxlY3Rpb259IGVsZW1lbnRzXG4gICAqIFRoZSBlbGVtZW50cyB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbChlbGVtZW50cykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICAgIGlmIChlbGVtZW50cyBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbGVtZW50cyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gZWxlbWVudHMubGVuZ3RoLCBlbGVtZW50OyBpIDwgbjsgaSsrKSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbChlbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjbGFzcyBmb3IgZnV0dXJlIHVzZSBhbmQgYXR0ZW1wdHMgdG8gdXBncmFkZSBleGlzdGluZyBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWdQdWJsaWN9IGNvbmZpZ1xuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJJbnRlcm5hbChjb25maWcpIHtcbiAgICAvLyBJbiBvcmRlciB0byBzdXBwb3J0IGJvdGggQ2xvc3VyZS1jb21waWxlZCBhbmQgdW5jb21waWxlZCBjb2RlIGFjY2Vzc2luZ1xuICAgIC8vIHRoaXMgbWV0aG9kLCB3ZSBuZWVkIHRvIGFsbG93IGZvciBib3RoIHRoZSBkb3QgYW5kIGFycmF5IHN5bnRheCBmb3JcbiAgICAvLyBwcm9wZXJ0eSBhY2Nlc3MuIFlvdSdsbCB0aGVyZWZvcmUgc2VlIHRoZSBgZm9vLmJhciB8fCBmb29bJ2JhciddYFxuICAgIC8vIHBhdHRlcm4gcmVwZWF0ZWQgYWNyb3NzIHRoaXMgbWV0aG9kLlxuICAgIHZhciB3aWRnZXRNaXNzaW5nID0gKHR5cGVvZiBjb25maWcud2lkZ2V0ID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2YgY29uZmlnWyd3aWRnZXQnXSA9PT0gJ3VuZGVmaW5lZCcpO1xuICAgIHZhciB3aWRnZXQgPSB0cnVlO1xuXG4gICAgaWYgKCF3aWRnZXRNaXNzaW5nKSB7XG4gICAgICB3aWRnZXQgPSBjb25maWcud2lkZ2V0IHx8IGNvbmZpZ1snd2lkZ2V0J107XG4gICAgfVxuXG4gICAgdmFyIG5ld0NvbmZpZyA9IC8qKiBAdHlwZSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWd9ICovICh7XG4gICAgICBjbGFzc0NvbnN0cnVjdG9yOiBjb25maWcuY29uc3RydWN0b3IgfHwgY29uZmlnWydjb25zdHJ1Y3RvciddLFxuICAgICAgY2xhc3NOYW1lOiBjb25maWcuY2xhc3NBc1N0cmluZyB8fCBjb25maWdbJ2NsYXNzQXNTdHJpbmcnXSxcbiAgICAgIGNzc0NsYXNzOiBjb25maWcuY3NzQ2xhc3MgfHwgY29uZmlnWydjc3NDbGFzcyddLFxuICAgICAgd2lkZ2V0OiB3aWRnZXQsXG4gICAgICBjYWxsYmFja3M6IFtdXG4gICAgfSk7XG5cbiAgICByZWdpc3RlcmVkQ29tcG9uZW50c18uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBpZiAoaXRlbS5jc3NDbGFzcyA9PT0gbmV3Q29uZmlnLmNzc0NsYXNzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIGNzc0NsYXNzIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZDogJyArIGl0ZW0uY3NzQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uY2xhc3NOYW1lID09PSBuZXdDb25maWcuY2xhc3NOYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIGNsYXNzTmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb25maWcuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICAgIC5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnRDb25maWdQcm9wZXJ0eV8pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ01ETCBjb21wb25lbnQgY2xhc3NlcyBtdXN0IG5vdCBoYXZlICcgKyBjb21wb25lbnRDb25maWdQcm9wZXJ0eV8gK1xuICAgICAgICAgICcgZGVmaW5lZCBhcyBhIHByb3BlcnR5LicpO1xuICAgIH1cblxuICAgIHZhciBmb3VuZCA9IGZpbmRSZWdpc3RlcmVkQ2xhc3NfKGNvbmZpZy5jbGFzc0FzU3RyaW5nLCBuZXdDb25maWcpO1xuXG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLnB1c2gobmV3Q29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHVzZXIgdG8gYmUgYWxlcnRlZCB0byBhbnkgdXBncmFkZXMgdGhhdCBhcmUgcGVyZm9ybWVkIGZvciBhIGdpdmVuXG4gICAqIGNvbXBvbmVudCB0eXBlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyBuYW1lIG9mIHRoZSBNREwgY29tcG9uZW50IHdlIHdpc2hcbiAgICogdG8gaG9vayBpbnRvIGZvciBhbnkgdXBncmFkZXMgcGVyZm9ybWVkLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCFIVE1MRWxlbWVudCl9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBjYWxsIHVwb24gYW5cbiAgICogdXBncmFkZS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgZXhwZWN0IDEgcGFyYW1ldGVyIC0gdGhlIEhUTUxFbGVtZW50IHdoaWNoXG4gICAqIGdvdCB1cGdyYWRlZC5cbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFja0ludGVybmFsKGpzQ2xhc3MsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlZ0NsYXNzID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oanNDbGFzcyk7XG4gICAgaWYgKHJlZ0NsYXNzKSB7XG4gICAgICByZWdDbGFzcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGFsbCByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm91bmQgaW4gdGhlIGN1cnJlbnQgRE9NLiBUaGlzIGlzXG4gICAqIGF1dG9tYXRpY2FsbHkgY2FsbGVkIG9uIHdpbmRvdyBsb2FkLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZUFsbFJlZ2lzdGVyZWRJbnRlcm5hbCgpIHtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IG4rKykge1xuICAgICAgdXBncmFkZURvbUludGVybmFsKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tuXS5jbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY29tcG9uZW50IGZvciB0aGUgZG93bmdyYWRlIG1ldGhvZC5cbiAgICogRXhlY3V0ZSBpZiBmb3VuZC5cbiAgICogUmVtb3ZlIGNvbXBvbmVudCBmcm9tIGNyZWF0ZWRDb21wb25lbnRzIGxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7P2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50fSBjb21wb25lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29uc3RydWN0Q29tcG9uZW50SW50ZXJuYWwoY29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgdmFyIGNvbXBvbmVudEluZGV4ID0gY3JlYXRlZENvbXBvbmVudHNfLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5zcGxpY2UoY29tcG9uZW50SW5kZXgsIDEpO1xuXG4gICAgICB2YXIgdXBncmFkZXMgPSBjb21wb25lbnQuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBjb21wb25lbnRQbGFjZSA9IHVwZ3JhZGVzLmluZGV4T2YoY29tcG9uZW50W2NvbXBvbmVudENvbmZpZ1Byb3BlcnR5X10uY2xhc3NBc1N0cmluZyk7XG4gICAgICB1cGdyYWRlcy5zcGxpY2UoY29tcG9uZW50UGxhY2UsIDEpO1xuICAgICAgY29tcG9uZW50LmVsZW1lbnRfLnNldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcsIHVwZ3JhZGVzLmpvaW4oJywnKSk7XG5cbiAgICAgIHZhciBldjtcbiAgICAgIGlmICgnQ3VzdG9tRXZlbnQnIGluIHdpbmRvdyAmJiB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGV2ID0gbmV3IEN1c3RvbUV2ZW50KCdtZGwtY29tcG9uZW50ZG93bmdyYWRlZCcsIHtcbiAgICAgICAgICBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50cycpO1xuICAgICAgICBldi5pbml0RXZlbnQoJ21kbC1jb21wb25lbnRkb3duZ3JhZGVkJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBjb21wb25lbnQuZWxlbWVudF8uZGlzcGF0Y2hFdmVudChldik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERvd25ncmFkZSBlaXRoZXIgYSBnaXZlbiBub2RlLCBhbiBhcnJheSBvZiBub2Rlcywgb3IgYSBOb2RlTGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHshTm9kZXwhQXJyYXk8IU5vZGU+fCFOb2RlTGlzdH0gbm9kZXNcbiAgICovXG4gIGZ1bmN0aW9uIGRvd25ncmFkZU5vZGVzSW50ZXJuYWwobm9kZXMpIHtcbiAgICAvKipcbiAgICAgKiBBdXhpbGlhcnkgZnVuY3Rpb24gdG8gZG93bmdyYWRlIGEgc2luZ2xlIG5vZGUuXG4gICAgICogQHBhcmFtICB7IU5vZGV9IG5vZGUgdGhlIG5vZGUgdG8gYmUgZG93bmdyYWRlZFxuICAgICAqL1xuICAgIHZhciBkb3duZ3JhZGVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgY3JlYXRlZENvbXBvbmVudHNfLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmVsZW1lbnRfID09PSBub2RlO1xuICAgICAgfSkuZm9yRWFjaChkZWNvbnN0cnVjdENvbXBvbmVudEludGVybmFsKTtcbiAgICB9O1xuICAgIGlmIChub2RlcyBpbnN0YW5jZW9mIEFycmF5IHx8IG5vZGVzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbm9kZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgZG93bmdyYWRlTm9kZShub2Rlc1tuXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIGRvd25ncmFkZU5vZGUobm9kZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gZG93bmdyYWRlIE1ETCBub2Rlcy4nKTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3cgcmV0dXJuIHRoZSBmdW5jdGlvbnMgdGhhdCBzaG91bGQgYmUgbWFkZSBwdWJsaWMgd2l0aCB0aGVpciBwdWJsaWNseVxuICAvLyBmYWNpbmcgbmFtZXMuLi5cbiAgcmV0dXJuIHtcbiAgICB1cGdyYWRlRG9tOiB1cGdyYWRlRG9tSW50ZXJuYWwsXG4gICAgdXBncmFkZUVsZW1lbnQ6IHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwsXG4gICAgdXBncmFkZUVsZW1lbnRzOiB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbCxcbiAgICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogdXBncmFkZUFsbFJlZ2lzdGVyZWRJbnRlcm5hbCxcbiAgICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFja0ludGVybmFsLFxuICAgIHJlZ2lzdGVyOiByZWdpc3RlckludGVybmFsLFxuICAgIGRvd25ncmFkZUVsZW1lbnRzOiBkb3duZ3JhZGVOb2Rlc0ludGVybmFsXG4gIH07XG59KSgpO1xuXG4vKipcbiAqIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IHR5cGUgbWFuYWdlZCBieVxuICogY29tcG9uZW50SGFuZGxlci4gUHJvdmlkZWQgZm9yIGJlbmVmaXQgb2YgdGhlIENsb3N1cmUgY29tcGlsZXIuXG4gKlxuICogQHR5cGVkZWYge3tcbiAqICAgY29uc3RydWN0b3I6IEZ1bmN0aW9uLFxuICogICBjbGFzc0FzU3RyaW5nOiBzdHJpbmcsXG4gKiAgIGNzc0NsYXNzOiBzdHJpbmcsXG4gKiAgIHdpZGdldDogKHN0cmluZ3xib29sZWFufHVuZGVmaW5lZClcbiAqIH19XG4gKi9cbmNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljOyAgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSB0eXBlIG9mIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgdHlwZSBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBjb25zdHJ1Y3RvcjogIUZ1bmN0aW9uLFxuICogICBjbGFzc05hbWU6IHN0cmluZyxcbiAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAqICAgd2lkZ2V0OiAoc3RyaW5nfGJvb2xlYW4pLFxuICogICBjYWxsYmFja3M6ICFBcnJheTxmdW5jdGlvbighSFRNTEVsZW1lbnQpPlxuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc7ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLyoqXG4gKiBDcmVhdGVkIGNvbXBvbmVudCAoaS5lLiwgdXBncmFkZWQgZWxlbWVudCkgdHlwZSBhcyBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBlbGVtZW50XzogIUhUTUxFbGVtZW50LFxuICogICBjbGFzc05hbWU6IHN0cmluZyxcbiAqICAgY2xhc3NBc1N0cmluZzogc3RyaW5nLFxuICogICBjc3NDbGFzczogc3RyaW5nLFxuICogICB3aWRnZXQ6IHN0cmluZ1xuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ7ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLy8gRXhwb3J0IGFsbCBzeW1ib2xzLCBmb3IgdGhlIGJlbmVmaXQgb2YgQ2xvc3VyZSBjb21waWxlci5cbi8vIE5vIGVmZmVjdCBvbiB1bmNvbXBpbGVkIGNvZGUuXG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRG9tJ10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVEb207XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRWxlbWVudCddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudDtcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVFbGVtZW50cyddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudHM7XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlQWxsUmVnaXN0ZXJlZCddID1cbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkO1xuY29tcG9uZW50SGFuZGxlclsncmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrJ10gPVxuICAgIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrO1xuY29tcG9uZW50SGFuZGxlclsncmVnaXN0ZXInXSA9IGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXI7XG5jb21wb25lbnRIYW5kbGVyWydkb3duZ3JhZGVFbGVtZW50cyddID0gY29tcG9uZW50SGFuZGxlci5kb3duZ3JhZGVFbGVtZW50cztcbndpbmRvdy5jb21wb25lbnRIYW5kbGVyID0gY29tcG9uZW50SGFuZGxlcjtcbndpbmRvd1snY29tcG9uZW50SGFuZGxlciddID0gY29tcG9uZW50SGFuZGxlcjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIFwiQ3V0dGluZyB0aGUgbXVzdGFyZFwiIHRlc3QuIElmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBmZWF0dXJlc1xuICAgKiB0ZXN0ZWQsIGFkZHMgYSBtZGwtanMgY2xhc3MgdG8gdGhlIDxodG1sPiBlbGVtZW50LiBJdCB0aGVuIHVwZ3JhZGVzIGFsbCBNRExcbiAgICogY29tcG9uZW50cyByZXF1aXJpbmcgSmF2YVNjcmlwdC5cbiAgICovXG4gIGlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAmJlxuICAgICAgJ3F1ZXJ5U2VsZWN0b3InIGluIGRvY3VtZW50ICYmXG4gICAgICAnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93ICYmIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kbC1qcycpO1xuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUFsbFJlZ2lzdGVyZWQoKTtcbiAgfSBlbHNlIHtcbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvbiB0byBhdm9pZCBKUyBlcnJvcnMuXG4gICAgICovXG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudCA9IGZ1bmN0aW9uKCkge307XG4gICAgLyoqXG4gICAgICogRHVtbXkgZnVuY3Rpb24gdG8gYXZvaWQgSlMgZXJyb3JzLlxuICAgICAqL1xuICAgIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHt9O1xuICB9XG59KTtcbiJdfQ==
