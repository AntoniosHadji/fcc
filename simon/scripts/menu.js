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
                 * Class constructor for dropdown MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialMenu = function MaterialMenu(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialMenu'] = MaterialMenu;

  /**
                                          * Store constants in one place so they can be updated easily.
                                          *
                                          * @enum {string | number}
                                          * @private
                                          */
  MaterialMenu.prototype.Constant_ = {
    // Total duration of the menu animation.
    TRANSITION_DURATION_SECONDS: 0.3,
    // The fraction of the total duration we want to use for menu item animations.
    TRANSITION_DURATION_FRACTION: 0.8,
    // How long the menu stays open after choosing an option (so the user can see
    // the ripple).
    CLOSE_TIMEOUT: 150 };


  /**
                           * Keycodes, for code readability.
                           *
                           * @enum {number}
                           * @private
                           */
  MaterialMenu.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    UP_ARROW: 38,
    DOWN_ARROW: 40 };


  /**
                       * Store strings for class names defined by this component that are used in
                       * JavaScript. This allows us to simply change it in one place should we
                       * decide to modify at a later date.
                       *
                       * @enum {string}
                       * @private
                       */
  MaterialMenu.prototype.CssClasses_ = {
    CONTAINER: 'mdl-menu__container',
    OUTLINE: 'mdl-menu__outline',
    ITEM: 'mdl-menu__item',
    ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE: 'mdl-ripple',
    // Statuses
    IS_UPGRADED: 'is-upgraded',
    IS_VISIBLE: 'is-visible',
    IS_ANIMATING: 'is-animating',
    // Alignment options
    BOTTOM_LEFT: 'mdl-menu--bottom-left', // This is the default.
    BOTTOM_RIGHT: 'mdl-menu--bottom-right',
    TOP_LEFT: 'mdl-menu--top-left',
    TOP_RIGHT: 'mdl-menu--top-right',
    UNALIGNED: 'mdl-menu--unaligned' };


  /**
                                         * Initialize element.
                                         */
  MaterialMenu.prototype.init = function () {
    if (this.element_) {
      // Create container for the menu.
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      this.container_ = container;

      // Create outline for the menu (shadow and background).
      var outline = document.createElement('div');
      outline.classList.add(this.CssClasses_.OUTLINE);
      this.outline_ = outline;
      container.insertBefore(outline, this.element_);

      // Find the "for" element and bind events to it.
      var forElId = this.element_.getAttribute('for') ||
      this.element_.getAttribute('data-mdl-for');
      var forEl = null;
      if (forElId) {
        forEl = document.getElementById(forElId);
        if (forEl) {
          this.forElement_ = forEl;
          forEl.addEventListener('click', this.handleForClick_.bind(this));
          forEl.addEventListener('keydown',
          this.handleForKeyboardEvent_.bind(this));
        }
      }

      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
      this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
      this.boundItemClick_ = this.handleItemClick_.bind(this);
      for (var i = 0; i < items.length; i++) {
        // Add a listener to each menu item.
        items[i].addEventListener('click', this.boundItemClick_);
        // Add a tab index to each menu item.
        items[i].tabIndex = '-1';
        // Add a keyboard listener to each menu item.
        items[i].addEventListener('keydown', this.boundItemKeydown_);
      }

      // Add ripple classes to each item, if the user has enabled ripples.
      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

        for (i = 0; i < items.length; i++) {
          var item = items[i];

          var rippleContainer = document.createElement('span');
          rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);

          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);

          item.appendChild(rippleContainer);
          item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        }
      }

      // Copy alignment classes to the container, so the outline can use them.
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        this.outline_.classList.add(this.CssClasses_.UNALIGNED);
      }

      container.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
      * Handles a click on the "for" element, by positioning the menu and then
      * toggling it.
      *
      * @param {Event} evt The event that fired.
      * @private
      */
  MaterialMenu.prototype.handleForClick_ = function (evt) {
    if (this.element_ && this.forElement_) {
      var rect = this.forElement_.getBoundingClientRect();
      var forRect = this.forElement_.parentElement.getBoundingClientRect();

      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        // Do not position the menu automatically. Requires the developer to
        // manually specify position.
      } else if (this.element_.classList.contains(
      this.CssClasses_.BOTTOM_RIGHT)) {
        // Position below the "for" element, aligned to its right.
        this.container_.style.right = forRect.right - rect.right + 'px';
        this.container_.style.top =
        this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        // Position above the "for" element, aligned to its left.
        this.container_.style.left = this.forElement_.offsetLeft + 'px';
        this.container_.style.bottom = forRect.bottom - rect.top + 'px';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        // Position above the "for" element, aligned to its right.
        this.container_.style.right = forRect.right - rect.right + 'px';
        this.container_.style.bottom = forRect.bottom - rect.top + 'px';
      } else {
        // Default: position below the "for" element, aligned to its left.
        this.container_.style.left = this.forElement_.offsetLeft + 'px';
        this.container_.style.top =
        this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
      }
    }

    this.toggle(evt);
  };

  /**
      * Handles a keyboard event on the "for" element.
      *
      * @param {Event} evt The event that fired.
      * @private
      */
  MaterialMenu.prototype.handleForKeyboardEvent_ = function (evt) {
    if (this.element_ && this.container_ && this.forElement_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM +
      ':not([disabled])');

      if (items && items.length > 0 &&
      this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          items[items.length - 1].focus();
        } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
          evt.preventDefault();
          items[0].focus();
        }
      }
    }
  };

  /**
      * Handles a keyboard event on an item.
      *
      * @param {Event} evt The event that fired.
      * @private
      */
  MaterialMenu.prototype.handleItemKeyboardEvent_ = function (evt) {
    if (this.element_ && this.container_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM +
      ':not([disabled])');

      if (items && items.length > 0 &&
      this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);

        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1].focus();
          } else {
            items[items.length - 1].focus();
          }
        } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
          evt.preventDefault();
          if (items.length > currentIndex + 1) {
            items[currentIndex + 1].focus();
          } else {
            items[0].focus();
          }
        } else if (evt.keyCode === this.Keycodes_.SPACE ||
        evt.keyCode === this.Keycodes_.ENTER) {
          evt.preventDefault();
          // Send mousedown and mouseup to trigger ripple.
          var e = new MouseEvent('mousedown');
          evt.target.dispatchEvent(e);
          e = new MouseEvent('mouseup');
          evt.target.dispatchEvent(e);
          // Send click.
          evt.target.click();
        } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
          evt.preventDefault();
          this.hide();
        }
      }
    }
  };

  /**
      * Handles a click event on an item.
      *
      * @param {Event} evt The event that fired.
      * @private
      */
  MaterialMenu.prototype.handleItemClick_ = function (evt) {
    if (evt.target.hasAttribute('disabled')) {
      evt.stopPropagation();
    } else {
      // Wait some time before closing menu, so the user can see the ripple.
      this.closing_ = true;
      window.setTimeout(function (evt) {
        this.hide();
        this.closing_ = false;
      }.bind(this), /** @type {number} */this.Constant_.CLOSE_TIMEOUT);
    }
  };

  /**
      * Calculates the initial clip (for opening the menu) or final clip (for closing
      * it), and applies it. This allows us to animate from or to the correct point,
      * that is, the point it's aligned to in the "for" element.
      *
      * @param {number} height Height of the clip rectangle
      * @param {number} width Width of the clip rectangle
      * @private
      */
  MaterialMenu.prototype.applyClip_ = function (height, width) {
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      // Do not clip.
      this.element_.style.clip = '';
    } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
      // Clip to the top right corner of the menu.
      this.element_.style.clip =
      'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
      // Clip to the bottom left corner of the menu.
      this.element_.style.clip =
      'rect(' + height + 'px 0 ' + height + 'px 0)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
      // Clip to the bottom right corner of the menu.
      this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' +
      height + 'px ' + width + 'px)';
    } else {
      // Default: do not clip (same as clipping to the top left corner).
      this.element_.style.clip = '';
    }
  };

  /**
      * Cleanup function to remove animation listeners.
      *
      * @param {Event} evt
      * @private
      */

  MaterialMenu.prototype.removeAnimationEndListener_ = function (evt) {
    evt.target.classList.remove(MaterialMenu.prototype.CssClasses_.IS_ANIMATING);
  };

  /**
      * Adds an event listener to clean up after the animation ends.
      *
      * @private
      */
  MaterialMenu.prototype.addAnimationEndListener_ = function () {
    this.element_.addEventListener('transitionend', this.removeAnimationEndListener_);
    this.element_.addEventListener('webkitTransitionEnd', this.removeAnimationEndListener_);
  };

  /**
      * Displays the menu.
      *
      * @public
      */
  MaterialMenu.prototype.show = function (evt) {
    if (this.element_ && this.container_ && this.outline_) {
      // Measure the inner element.
      var height = this.element_.getBoundingClientRect().height;
      var width = this.element_.getBoundingClientRect().width;

      // Apply the inner element's size to the container and outline.
      this.container_.style.width = width + 'px';
      this.container_.style.height = height + 'px';
      this.outline_.style.width = width + 'px';
      this.outline_.style.height = height + 'px';

      var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS *
      this.Constant_.TRANSITION_DURATION_FRACTION;

      // Calculate transition delays for individual menu items, so that they fade
      // in one at a time.
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
      for (var i = 0; i < items.length; i++) {
        var itemDelay = null;
        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ||
        this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
          itemDelay = (height - items[i].offsetTop - items[i].offsetHeight) /
          height * transitionDuration + 's';
        } else {
          itemDelay = items[i].offsetTop / height * transitionDuration + 's';
        }
        items[i].style.transitionDelay = itemDelay;
      }

      // Apply the initial clip to the text before we start animating.
      this.applyClip_(height, width);

      // Wait for the next frame, turn on animation, and apply the final clip.
      // Also make it visible. This triggers the transitions.
      window.requestAnimationFrame(function () {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
        this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this));

      // Clean up after the animation is complete.
      this.addAnimationEndListener_();

      // Add a click listener to the document, to close the menu.
      var callback = function (e) {
        // Check to see if the document is processing the same event that
        // displayed the menu in the first place. If so, do nothing.
        // Also check to see if the menu is in the process of closing itself, and
        // do nothing in that case.
        // Also check if the clicked element is a menu item
        // if so, do nothing.
        if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
          document.removeEventListener('click', callback);
          this.hide();
        }
      }.bind(this);
      document.addEventListener('click', callback);
    }
  };
  MaterialMenu.prototype['show'] = MaterialMenu.prototype.show;

  /**
                                                                 * Hides the menu.
                                                                 *
                                                                 * @public
                                                                 */
  MaterialMenu.prototype.hide = function () {
    if (this.element_ && this.container_ && this.outline_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);

      // Remove all transition delays; menu items fade out concurrently.
      for (var i = 0; i < items.length; i++) {
        items[i].style.removeProperty('transition-delay');
      }

      // Measure the inner element.
      var rect = this.element_.getBoundingClientRect();
      var height = rect.height;
      var width = rect.width;

      // Turn on animation, and apply the final clip. Also make invisible.
      // This triggers the transitions.
      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.applyClip_(height, width);
      this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);

      // Clean up after the animation is complete.
      this.addAnimationEndListener_();
    }
  };
  MaterialMenu.prototype['hide'] = MaterialMenu.prototype.hide;

  /**
                                                                 * Displays or hides the menu, depending on current state.
                                                                 *
                                                                 * @public
                                                                 */
  MaterialMenu.prototype.toggle = function (evt) {
    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };
  MaterialMenu.prototype['toggle'] = MaterialMenu.prototype.toggle;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnUuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxNZW51IiwiZWxlbWVudCIsImVsZW1lbnRfIiwiaW5pdCIsIndpbmRvdyIsInByb3RvdHlwZSIsIkNvbnN0YW50XyIsIlRSQU5TSVRJT05fRFVSQVRJT05fU0VDT05EUyIsIlRSQU5TSVRJT05fRFVSQVRJT05fRlJBQ1RJT04iLCJDTE9TRV9USU1FT1VUIiwiS2V5Y29kZXNfIiwiRU5URVIiLCJFU0NBUEUiLCJTUEFDRSIsIlVQX0FSUk9XIiwiRE9XTl9BUlJPVyIsIkNzc0NsYXNzZXNfIiwiQ09OVEFJTkVSIiwiT1VUTElORSIsIklURU0iLCJJVEVNX1JJUFBMRV9DT05UQUlORVIiLCJSSVBQTEVfRUZGRUNUIiwiUklQUExFX0lHTk9SRV9FVkVOVFMiLCJSSVBQTEUiLCJJU19VUEdSQURFRCIsIklTX1ZJU0lCTEUiLCJJU19BTklNQVRJTkciLCJCT1RUT01fTEVGVCIsIkJPVFRPTV9SSUdIVCIsIlRPUF9MRUZUIiwiVE9QX1JJR0hUIiwiVU5BTElHTkVEIiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicGFyZW50RWxlbWVudCIsImluc2VydEJlZm9yZSIsInJlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJjb250YWluZXJfIiwib3V0bGluZSIsIm91dGxpbmVfIiwiZm9yRWxJZCIsImdldEF0dHJpYnV0ZSIsImZvckVsIiwiZ2V0RWxlbWVudEJ5SWQiLCJmb3JFbGVtZW50XyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVGb3JDbGlja18iLCJiaW5kIiwiaGFuZGxlRm9yS2V5Ym9hcmRFdmVudF8iLCJpdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJib3VuZEl0ZW1LZXlkb3duXyIsImhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50XyIsImJvdW5kSXRlbUNsaWNrXyIsImhhbmRsZUl0ZW1DbGlja18iLCJpIiwibGVuZ3RoIiwidGFiSW5kZXgiLCJjb250YWlucyIsIml0ZW0iLCJyaXBwbGVDb250YWluZXIiLCJyaXBwbGUiLCJldnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZm9yUmVjdCIsInN0eWxlIiwicmlnaHQiLCJ0b3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRIZWlnaHQiLCJsZWZ0Iiwib2Zmc2V0TGVmdCIsImJvdHRvbSIsInRvZ2dsZSIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsImZvY3VzIiwiY3VycmVudEluZGV4IiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJpbmRleE9mIiwidGFyZ2V0IiwiZSIsIk1vdXNlRXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwiY2xpY2siLCJoaWRlIiwiaGFzQXR0cmlidXRlIiwic3RvcFByb3BhZ2F0aW9uIiwiY2xvc2luZ18iLCJzZXRUaW1lb3V0IiwiYXBwbHlDbGlwXyIsImhlaWdodCIsIndpZHRoIiwiY2xpcCIsInJlbW92ZUFuaW1hdGlvbkVuZExpc3RlbmVyXyIsInJlbW92ZSIsImFkZEFuaW1hdGlvbkVuZExpc3RlbmVyXyIsInNob3ciLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJpdGVtRGVsYXkiLCJ0cmFuc2l0aW9uRGVsYXkiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsInBhcmVudE5vZGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlUHJvcGVydHkiLCJjb21wb25lbnRIYW5kbGVyIiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyIsIndpZGdldCJdLCJtYXBwaW5ncyI6ImNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsWUFBVztBQUNWOztBQUVBOzs7Ozs7OztBQVFBLE1BQUlBLGVBQWUsU0FBU0EsWUFBVCxDQUFzQkMsT0FBdEIsRUFBK0I7QUFDaEQsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7O0FBRUE7QUFDQSxTQUFLRSxJQUFMO0FBQ0QsR0FMRDtBQU1BQyxTQUFPLGNBQVAsSUFBeUJK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O0FBQzVDLFFBQUksS0FBS3pCLFVBQUwsQ0FBZ0JOLFNBQWhCLENBQTBCMkIsUUFBMUIsQ0FBbUMsS0FBSzlDLFdBQUwsQ0FBaUJTLFVBQXBELENBQUosRUFBcUU7QUFDbkUsV0FBS21FLElBQUw7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLWSxJQUFMLENBQVV0QyxHQUFWO0FBQ0Q7QUFDRixHQU5EO0FBT0FsRSxlQUFhSyxTQUFiLENBQXVCLFFBQXZCLElBQW1DTCxhQUFhSyxTQUFiLENBQXVCeUUsTUFBMUQ7O0FBRUE7QUFDQTtBQUNBbUMsbUJBQWlCQyxRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWFuSCxZQURXO0FBRXhCb0gsbUJBQWUsY0FGUztBQUd4QkMsY0FBVSxhQUhjO0FBSXhCQyxZQUFRLElBSmdCLEVBQTFCOztBQU1ELENBaGREIiwiZmlsZSI6Im1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBkcm9wZG93biBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuICB2YXIgTWF0ZXJpYWxNZW51ID0gZnVuY3Rpb24gTWF0ZXJpYWxNZW51KGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxNZW51J10gPSBNYXRlcmlhbE1lbnU7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICAvLyBUb3RhbCBkdXJhdGlvbiBvZiB0aGUgbWVudSBhbmltYXRpb24uXG4gICAgVFJBTlNJVElPTl9EVVJBVElPTl9TRUNPTkRTOiAwLjMsXG4gICAgLy8gVGhlIGZyYWN0aW9uIG9mIHRoZSB0b3RhbCBkdXJhdGlvbiB3ZSB3YW50IHRvIHVzZSBmb3IgbWVudSBpdGVtIGFuaW1hdGlvbnMuXG4gICAgVFJBTlNJVElPTl9EVVJBVElPTl9GUkFDVElPTjogMC44LFxuICAgIC8vIEhvdyBsb25nIHRoZSBtZW51IHN0YXlzIG9wZW4gYWZ0ZXIgY2hvb3NpbmcgYW4gb3B0aW9uIChzbyB0aGUgdXNlciBjYW4gc2VlXG4gICAgLy8gdGhlIHJpcHBsZSkuXG4gICAgQ0xPU0VfVElNRU9VVDogMTUwXG4gIH07XG5cbiAgLyoqXG4gICAqIEtleWNvZGVzLCBmb3IgY29kZSByZWFkYWJpbGl0eS5cbiAgICpcbiAgICogQGVudW0ge251bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuS2V5Y29kZXNfID0ge1xuICAgIEVOVEVSOiAxMyxcbiAgICBFU0NBUEU6IDI3LFxuICAgIFNQQUNFOiAzMixcbiAgICBVUF9BUlJPVzogMzgsXG4gICAgRE9XTl9BUlJPVzogNDBcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgQ09OVEFJTkVSOiAnbWRsLW1lbnVfX2NvbnRhaW5lcicsXG4gICAgT1VUTElORTogJ21kbC1tZW51X19vdXRsaW5lJyxcbiAgICBJVEVNOiAnbWRsLW1lbnVfX2l0ZW0nLFxuICAgIElURU1fUklQUExFX0NPTlRBSU5FUjogJ21kbC1tZW51X19pdGVtLXJpcHBsZS1jb250YWluZXInLFxuICAgIFJJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgUklQUExFX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cycsXG4gICAgUklQUExFOiAnbWRsLXJpcHBsZScsXG4gICAgLy8gU3RhdHVzZXNcbiAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJyxcbiAgICBJU19WSVNJQkxFOiAnaXMtdmlzaWJsZScsXG4gICAgSVNfQU5JTUFUSU5HOiAnaXMtYW5pbWF0aW5nJyxcbiAgICAvLyBBbGlnbm1lbnQgb3B0aW9uc1xuICAgIEJPVFRPTV9MRUZUOiAnbWRsLW1lbnUtLWJvdHRvbS1sZWZ0JywgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQuXG4gICAgQk9UVE9NX1JJR0hUOiAnbWRsLW1lbnUtLWJvdHRvbS1yaWdodCcsXG4gICAgVE9QX0xFRlQ6ICdtZGwtbWVudS0tdG9wLWxlZnQnLFxuICAgIFRPUF9SSUdIVDogJ21kbC1tZW51LS10b3AtcmlnaHQnLFxuICAgIFVOQUxJR05FRDogJ21kbC1tZW51LS11bmFsaWduZWQnXG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICAvLyBDcmVhdGUgY29udGFpbmVyIGZvciB0aGUgbWVudS5cbiAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ09OVEFJTkVSKTtcbiAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY29udGFpbmVyLCB0aGlzLmVsZW1lbnRfKTtcbiAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgIHRoaXMuY29udGFpbmVyXyA9IGNvbnRhaW5lcjtcblxuICAgICAgLy8gQ3JlYXRlIG91dGxpbmUgZm9yIHRoZSBtZW51IChzaGFkb3cgYW5kIGJhY2tncm91bmQpLlxuICAgICAgdmFyIG91dGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG91dGxpbmUuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLk9VVExJTkUpO1xuICAgICAgdGhpcy5vdXRsaW5lXyA9IG91dGxpbmU7XG4gICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKG91dGxpbmUsIHRoaXMuZWxlbWVudF8pO1xuXG4gICAgICAvLyBGaW5kIHRoZSBcImZvclwiIGVsZW1lbnQgYW5kIGJpbmQgZXZlbnRzIHRvIGl0LlxuICAgICAgdmFyIGZvckVsSWQgPSB0aGlzLmVsZW1lbnRfLmdldEF0dHJpYnV0ZSgnZm9yJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmdldEF0dHJpYnV0ZSgnZGF0YS1tZGwtZm9yJyk7XG4gICAgICB2YXIgZm9yRWwgPSBudWxsO1xuICAgICAgaWYgKGZvckVsSWQpIHtcbiAgICAgICAgZm9yRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmb3JFbElkKTtcbiAgICAgICAgaWYgKGZvckVsKSB7XG4gICAgICAgICAgdGhpcy5mb3JFbGVtZW50XyA9IGZvckVsO1xuICAgICAgICAgIGZvckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVGb3JDbGlja18uYmluZCh0aGlzKSk7XG4gICAgICAgICAgZm9yRWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgICAgICAgIHRoaXMuaGFuZGxlRm9yS2V5Ym9hcmRFdmVudF8uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSk7XG4gICAgICB0aGlzLmJvdW5kSXRlbUtleWRvd25fID0gdGhpcy5oYW5kbGVJdGVtS2V5Ym9hcmRFdmVudF8uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYm91bmRJdGVtQ2xpY2tfID0gdGhpcy5oYW5kbGVJdGVtQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIEFkZCBhIGxpc3RlbmVyIHRvIGVhY2ggbWVudSBpdGVtLlxuICAgICAgICBpdGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRJdGVtQ2xpY2tfKTtcbiAgICAgICAgLy8gQWRkIGEgdGFiIGluZGV4IHRvIGVhY2ggbWVudSBpdGVtLlxuICAgICAgICBpdGVtc1tpXS50YWJJbmRleCA9ICctMSc7XG4gICAgICAgIC8vIEFkZCBhIGtleWJvYXJkIGxpc3RlbmVyIHRvIGVhY2ggbWVudSBpdGVtLlxuICAgICAgICBpdGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZEl0ZW1LZXlkb3duXyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCByaXBwbGUgY2xhc3NlcyB0byBlYWNoIGl0ZW0sIGlmIHRoZSB1c2VyIGhhcyBlbmFibGVkIHJpcHBsZXMuXG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfSUdOT1JFX0VWRU5UUyk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcblxuICAgICAgICAgIHZhciByaXBwbGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JVEVNX1JJUFBMRV9DT05UQUlORVIpO1xuXG4gICAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICAgICAgcmlwcGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKHJpcHBsZUNvbnRhaW5lcik7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29weSBhbGlnbm1lbnQgY2xhc3NlcyB0byB0aGUgY29udGFpbmVyLCBzbyB0aGUgb3V0bGluZSBjYW4gdXNlIHRoZW0uXG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fTEVGVCkpIHtcbiAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQk9UVE9NX0xFRlQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uQk9UVE9NX1JJR0hUKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fUklHSFQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX0xFRlQpKSB7XG4gICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlVOQUxJR05FRCkpIHtcbiAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVU5BTElHTkVEKTtcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19VUEdSQURFRCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEgY2xpY2sgb24gdGhlIFwiZm9yXCIgZWxlbWVudCwgYnkgcG9zaXRpb25pbmcgdGhlIG1lbnUgYW5kIHRoZW5cbiAgICogdG9nZ2xpbmcgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGFuZGxlRm9yQ2xpY2tfID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5mb3JFbGVtZW50Xykge1xuICAgICAgdmFyIHJlY3QgPSB0aGlzLmZvckVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdmFyIGZvclJlY3QgPSB0aGlzLmZvckVsZW1lbnRfLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlVOQUxJR05FRCkpIHtcbiAgICAgICAgLy8gRG8gbm90IHBvc2l0aW9uIHRoZSBtZW51IGF1dG9tYXRpY2FsbHkuIFJlcXVpcmVzIHRoZSBkZXZlbG9wZXIgdG9cbiAgICAgICAgLy8gbWFudWFsbHkgc3BlY2lmeSBwb3NpdGlvbi5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgdGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fUklHSFQpKSB7XG4gICAgICAgIC8vIFBvc2l0aW9uIGJlbG93IHRoZSBcImZvclwiIGVsZW1lbnQsIGFsaWduZWQgdG8gaXRzIHJpZ2h0LlxuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUucmlnaHQgPSAoZm9yUmVjdC5yaWdodCAtIHJlY3QucmlnaHQpICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnRvcCA9XG4gICAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfLm9mZnNldFRvcCArIHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCkpIHtcbiAgICAgICAgLy8gUG9zaXRpb24gYWJvdmUgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgbGVmdC5cbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLmxlZnQgPSB0aGlzLmZvckVsZW1lbnRfLm9mZnNldExlZnQgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUuYm90dG9tID0gKGZvclJlY3QuYm90dG9tIC0gcmVjdC50b3ApICsgJ3B4JztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfUklHSFQpKSB7XG4gICAgICAgIC8vIFBvc2l0aW9uIGFib3ZlIHRoZSBcImZvclwiIGVsZW1lbnQsIGFsaWduZWQgdG8gaXRzIHJpZ2h0LlxuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUucmlnaHQgPSAoZm9yUmVjdC5yaWdodCAtIHJlY3QucmlnaHQpICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLmJvdHRvbSA9IChmb3JSZWN0LmJvdHRvbSAtIHJlY3QudG9wKSArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZWZhdWx0OiBwb3NpdGlvbiBiZWxvdyB0aGUgXCJmb3JcIiBlbGVtZW50LCBhbGlnbmVkIHRvIGl0cyBsZWZ0LlxuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUubGVmdCA9IHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0TGVmdCArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS50b3AgPVxuICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRUb3AgKyB0aGlzLmZvckVsZW1lbnRfLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50b2dnbGUoZXZ0KTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBhIGtleWJvYXJkIGV2ZW50IG9uIHRoZSBcImZvclwiIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGFuZGxlRm9yS2V5Ym9hcmRFdmVudF8gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmNvbnRhaW5lcl8gJiYgdGhpcy5mb3JFbGVtZW50Xykge1xuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSArXG4gICAgICAgICc6bm90KFtkaXNhYmxlZF0pJyk7XG5cbiAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgdGhpcy5jb250YWluZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpKSB7XG4gICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uVVBfQVJST1cpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5ET1dOX0FSUk9XKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaXRlbXNbMF0uZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBhIGtleWJvYXJkIGV2ZW50IG9uIGFuIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGFuZGxlSXRlbUtleWJvYXJkRXZlbnRfID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfKSB7XG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNICtcbiAgICAgICAgJzpub3QoW2Rpc2FibGVkXSknKTtcblxuICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSkpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKS5pbmRleE9mKGV2dC50YXJnZXQpO1xuXG4gICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uVVBfQVJST1cpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgaXRlbXNbY3VycmVudEluZGV4IC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkRPV05fQVJST1cpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gY3VycmVudEluZGV4ICsgMSkge1xuICAgICAgICAgICAgaXRlbXNbY3VycmVudEluZGV4ICsgMV0uZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbXNbMF0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLlNQQUNFIHx8XG4gICAgICAgICAgICAgIGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5FTlRFUikge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIC8vIFNlbmQgbW91c2Vkb3duIGFuZCBtb3VzZXVwIHRvIHRyaWdnZXIgcmlwcGxlLlxuICAgICAgICAgIHZhciBlID0gbmV3IE1vdXNlRXZlbnQoJ21vdXNlZG93bicpO1xuICAgICAgICAgIGV2dC50YXJnZXQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICAgICAgICBlID0gbmV3IE1vdXNlRXZlbnQoJ21vdXNldXAnKTtcbiAgICAgICAgICBldnQudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgICAgLy8gU2VuZCBjbGljay5cbiAgICAgICAgICBldnQudGFyZ2V0LmNsaWNrKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkVTQ0FQRSkge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEgY2xpY2sgZXZlbnQgb24gYW4gaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVJdGVtQ2xpY2tfID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdhaXQgc29tZSB0aW1lIGJlZm9yZSBjbG9zaW5nIG1lbnUsIHNvIHRoZSB1c2VyIGNhbiBzZWUgdGhlIHJpcHBsZS5cbiAgICAgIHRoaXMuY2xvc2luZ18gPSB0cnVlO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB0aGlzLmNsb3NpbmdfID0gZmFsc2U7XG4gICAgICB9LmJpbmQodGhpcyksIC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAodGhpcy5Db25zdGFudF8uQ0xPU0VfVElNRU9VVCkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgaW5pdGlhbCBjbGlwIChmb3Igb3BlbmluZyB0aGUgbWVudSkgb3IgZmluYWwgY2xpcCAoZm9yIGNsb3NpbmdcbiAgICogaXQpLCBhbmQgYXBwbGllcyBpdC4gVGhpcyBhbGxvd3MgdXMgdG8gYW5pbWF0ZSBmcm9tIG9yIHRvIHRoZSBjb3JyZWN0IHBvaW50LFxuICAgKiB0aGF0IGlzLCB0aGUgcG9pbnQgaXQncyBhbGlnbmVkIHRvIGluIHRoZSBcImZvclwiIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgSGVpZ2h0IG9mIHRoZSBjbGlwIHJlY3RhbmdsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggV2lkdGggb2YgdGhlIGNsaXAgcmVjdGFuZ2xlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmFwcGx5Q2xpcF8gPSBmdW5jdGlvbihoZWlnaHQsIHdpZHRoKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgLy8gRG8gbm90IGNsaXAuXG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAnJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uQk9UVE9NX1JJR0hUKSkge1xuICAgICAgLy8gQ2xpcCB0byB0aGUgdG9wIHJpZ2h0IGNvcm5lciBvZiB0aGUgbWVudS5cbiAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9XG4gICAgICAgICAgJ3JlY3QoMCAnICsgd2lkdGggKyAncHggJyArICcwICcgKyB3aWR0aCArICdweCknO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCkpIHtcbiAgICAgIC8vIENsaXAgdG8gdGhlIGJvdHRvbSBsZWZ0IGNvcm5lciBvZiB0aGUgbWVudS5cbiAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9XG4gICAgICAgICAgJ3JlY3QoJyArIGhlaWdodCArICdweCAwICcgKyBoZWlnaHQgKyAncHggMCknO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfUklHSFQpKSB7XG4gICAgICAvLyBDbGlwIHRvIHRoZSBib3R0b20gcmlnaHQgY29ybmVyIG9mIHRoZSBtZW51LlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gJ3JlY3QoJyArIGhlaWdodCArICdweCAnICsgd2lkdGggKyAncHggJyArXG4gICAgICAgICAgaGVpZ2h0ICsgJ3B4ICcgKyB3aWR0aCArICdweCknO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWZhdWx0OiBkbyBub3QgY2xpcCAoc2FtZSBhcyBjbGlwcGluZyB0byB0aGUgdG9wIGxlZnQgY29ybmVyKS5cbiAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9ICcnO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2xlYW51cCBmdW5jdGlvbiB0byByZW1vdmUgYW5pbWF0aW9uIGxpc3RlbmVycy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUucmVtb3ZlQW5pbWF0aW9uRW5kTGlzdGVuZXJfID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKE1hdGVyaWFsTWVudS5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byBjbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGVuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmFkZEFuaW1hdGlvbkVuZExpc3RlbmVyXyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMucmVtb3ZlQW5pbWF0aW9uRW5kTGlzdGVuZXJfKTtcbiAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCB0aGlzLnJlbW92ZUFuaW1hdGlvbkVuZExpc3RlbmVyXyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BsYXlzIHRoZSBtZW51LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmNvbnRhaW5lcl8gJiYgdGhpcy5vdXRsaW5lXykge1xuICAgICAgLy8gTWVhc3VyZSB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIHZhciB3aWR0aCA9IHRoaXMuZWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cbiAgICAgIC8vIEFwcGx5IHRoZSBpbm5lciBlbGVtZW50J3Mgc2l6ZSB0byB0aGUgY29udGFpbmVyIGFuZCBvdXRsaW5lLlxuICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgICB0aGlzLm91dGxpbmVfLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgdGhpcy5vdXRsaW5lXy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gdGhpcy5Db25zdGFudF8uVFJBTlNJVElPTl9EVVJBVElPTl9TRUNPTkRTICpcbiAgICAgICAgICB0aGlzLkNvbnN0YW50Xy5UUkFOU0lUSU9OX0RVUkFUSU9OX0ZSQUNUSU9OO1xuXG4gICAgICAvLyBDYWxjdWxhdGUgdHJhbnNpdGlvbiBkZWxheXMgZm9yIGluZGl2aWR1YWwgbWVudSBpdGVtcywgc28gdGhhdCB0aGV5IGZhZGVcbiAgICAgIC8vIGluIG9uZSBhdCBhIHRpbWUuXG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW1EZWxheSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKSB8fFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfUklHSFQpKSB7XG4gICAgICAgICAgaXRlbURlbGF5ID0gKChoZWlnaHQgLSBpdGVtc1tpXS5vZmZzZXRUb3AgLSBpdGVtc1tpXS5vZmZzZXRIZWlnaHQpIC9cbiAgICAgICAgICAgICAgaGVpZ2h0ICogdHJhbnNpdGlvbkR1cmF0aW9uKSArICdzJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtRGVsYXkgPSAoaXRlbXNbaV0ub2Zmc2V0VG9wIC8gaGVpZ2h0ICogdHJhbnNpdGlvbkR1cmF0aW9uKSArICdzJztcbiAgICAgICAgfVxuICAgICAgICBpdGVtc1tpXS5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBpdGVtRGVsYXk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IHRoZSBpbml0aWFsIGNsaXAgdG8gdGhlIHRleHQgYmVmb3JlIHdlIHN0YXJ0IGFuaW1hdGluZy5cbiAgICAgIHRoaXMuYXBwbHlDbGlwXyhoZWlnaHQsIHdpZHRoKTtcblxuICAgICAgLy8gV2FpdCBmb3IgdGhlIG5leHQgZnJhbWUsIHR1cm4gb24gYW5pbWF0aW9uLCBhbmQgYXBwbHkgdGhlIGZpbmFsIGNsaXAuXG4gICAgICAvLyBBbHNvIG1ha2UgaXQgdmlzaWJsZS4gVGhpcyB0cmlnZ2VycyB0aGUgdHJhbnNpdGlvbnMuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAncmVjdCgwICcgKyB3aWR0aCArICdweCAnICsgaGVpZ2h0ICsgJ3B4IDApJztcbiAgICAgICAgdGhpcy5jb250YWluZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKTtcbiAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIGFmdGVyIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLmFkZEFuaW1hdGlvbkVuZExpc3RlbmVyXygpO1xuXG4gICAgICAvLyBBZGQgYSBjbGljayBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQsIHRvIGNsb3NlIHRoZSBtZW51LlxuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRvY3VtZW50IGlzIHByb2Nlc3NpbmcgdGhlIHNhbWUgZXZlbnQgdGhhdFxuICAgICAgICAvLyBkaXNwbGF5ZWQgdGhlIG1lbnUgaW4gdGhlIGZpcnN0IHBsYWNlLiBJZiBzbywgZG8gbm90aGluZy5cbiAgICAgICAgLy8gQWxzbyBjaGVjayB0byBzZWUgaWYgdGhlIG1lbnUgaXMgaW4gdGhlIHByb2Nlc3Mgb2YgY2xvc2luZyBpdHNlbGYsIGFuZFxuICAgICAgICAvLyBkbyBub3RoaW5nIGluIHRoYXQgY2FzZS5cbiAgICAgICAgLy8gQWxzbyBjaGVjayBpZiB0aGUgY2xpY2tlZCBlbGVtZW50IGlzIGEgbWVudSBpdGVtXG4gICAgICAgIC8vIGlmIHNvLCBkbyBub3RoaW5nLlxuICAgICAgICBpZiAoZSAhPT0gZXZ0ICYmICF0aGlzLmNsb3NpbmdfICYmIGUudGFyZ2V0LnBhcmVudE5vZGUgIT09IHRoaXMuZWxlbWVudF8pIHtcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNhbGxiYWNrKTtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYWxsYmFjayk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlWydzaG93J10gPSBNYXRlcmlhbE1lbnUucHJvdG90eXBlLnNob3c7XG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBtZW51LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmNvbnRhaW5lcl8gJiYgdGhpcy5vdXRsaW5lXykge1xuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSk7XG5cbiAgICAgIC8vIFJlbW92ZSBhbGwgdHJhbnNpdGlvbiBkZWxheXM7IG1lbnUgaXRlbXMgZmFkZSBvdXQgY29uY3VycmVudGx5LlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtc1tpXS5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbi1kZWxheScpO1xuICAgICAgfVxuXG4gICAgICAvLyBNZWFzdXJlIHRoZSBpbm5lciBlbGVtZW50LlxuICAgICAgdmFyIHJlY3QgPSB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdmFyIGhlaWdodCA9IHJlY3QuaGVpZ2h0O1xuICAgICAgdmFyIHdpZHRoID0gcmVjdC53aWR0aDtcblxuICAgICAgLy8gVHVybiBvbiBhbmltYXRpb24sIGFuZCBhcHBseSB0aGUgZmluYWwgY2xpcC4gQWxzbyBtYWtlIGludmlzaWJsZS5cbiAgICAgIC8vIFRoaXMgdHJpZ2dlcnMgdGhlIHRyYW5zaXRpb25zLlxuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgICAgIHRoaXMuYXBwbHlDbGlwXyhoZWlnaHQsIHdpZHRoKTtcbiAgICAgIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIGFmdGVyIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLmFkZEFuaW1hdGlvbkVuZExpc3RlbmVyXygpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZVsnaGlkZSddID0gTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oaWRlO1xuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyBvciBoaWRlcyB0aGUgbWVudSwgZGVwZW5kaW5nIG9uIGN1cnJlbnQgc3RhdGUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdyhldnQpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZVsndG9nZ2xlJ10gPSBNYXRlcmlhbE1lbnUucHJvdG90eXBlLnRvZ2dsZTtcblxuICAvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbiAgLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAgY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsTWVudSxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxNZW51JyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1tZW51JyxcbiAgICB3aWRnZXQ6IHRydWVcbiAgfSk7XG59KSgpO1xuIl19
