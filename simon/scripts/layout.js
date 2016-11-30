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
                 * Class constructor for Layout MDL component.
                 * Implements MDL component design pattern defined at:
                 * https://github.com/jasonmayes/mdl-component-design-pattern
                 *
                 * @constructor
                 * @param {HTMLElement} element The element that will be upgraded.
                 */
  var MaterialLayout = function MaterialLayout(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialLayout'] = MaterialLayout;

  /**
                                              * Store constants in one place so they can be updated easily.
                                              *
                                              * @enum {string | number}
                                              * @private
                                              */
  MaterialLayout.prototype.Constant_ = {
    MAX_WIDTH: '(max-width: 1024px)',
    TAB_SCROLL_PIXELS: 100,
    RESIZE_TIMEOUT: 100,

    MENU_ICON: '&#xE5D2;',
    CHEVRON_LEFT: 'chevron_left',
    CHEVRON_RIGHT: 'chevron_right' };


  /**
                                       * Keycodes, for code readability.
                                       *
                                       * @enum {number}
                                       * @private
                                       */
  MaterialLayout.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32 };


  /**
                  * Modes.
                  *
                  * @enum {number}
                  * @private
                  */
  MaterialLayout.prototype.Mode_ = {
    STANDARD: 0,
    SEAMED: 1,
    WATERFALL: 2,
    SCROLL: 3 };


  /**
                  * Store strings for class names defined by this component that are used in
                  * JavaScript. This allows us to simply change it in one place should we
                  * decide to modify at a later date.
                  *
                  * @enum {string}
                  * @private
                  */
  MaterialLayout.prototype.CssClasses_ = {
    CONTAINER: 'mdl-layout__container',
    HEADER: 'mdl-layout__header',
    DRAWER: 'mdl-layout__drawer',
    CONTENT: 'mdl-layout__content',
    DRAWER_BTN: 'mdl-layout__drawer-button',

    ICON: 'material-icons',

    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
    RIPPLE: 'mdl-ripple',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',

    HEADER_SEAMED: 'mdl-layout__header--seamed',
    HEADER_WATERFALL: 'mdl-layout__header--waterfall',
    HEADER_SCROLL: 'mdl-layout__header--scroll',

    FIXED_HEADER: 'mdl-layout--fixed-header',
    OBFUSCATOR: 'mdl-layout__obfuscator',

    TAB_BAR: 'mdl-layout__tab-bar',
    TAB_CONTAINER: 'mdl-layout__tab-bar-container',
    TAB: 'mdl-layout__tab',
    TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
    TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
    TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
    PANEL: 'mdl-layout__tab-panel',

    HAS_DRAWER: 'has-drawer',
    HAS_TABS: 'has-tabs',
    HAS_SCROLLING_HEADER: 'has-scrolling-header',
    CASTING_SHADOW: 'is-casting-shadow',
    IS_COMPACT: 'is-compact',
    IS_SMALL_SCREEN: 'is-small-screen',
    IS_DRAWER_OPEN: 'is-visible',
    IS_ACTIVE: 'is-active',
    IS_UPGRADED: 'is-upgraded',
    IS_ANIMATING: 'is-animating',

    ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
    ON_SMALL_SCREEN: 'mdl-layout--small-screen-only' };



  /**
                                                         * Handles scrolling on the content.
                                                         *
                                                         * @private
                                                         */
  MaterialLayout.prototype.contentScrollHandler_ = function () {
    if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
      return;
    }

    var headerVisible =
    !this.element_.classList.contains(this.CssClasses_.IS_SMALL_SCREEN) ||
    this.element_.classList.contains(this.CssClasses_.FIXED_HEADER);

    if (this.content_.scrollTop > 0 &&
    !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
      this.header_.classList.add(this.CssClasses_.IS_COMPACT);
      if (headerVisible) {
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    } else if (this.content_.scrollTop <= 0 &&
    this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
      this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
      if (headerVisible) {
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    }
  };

  /**
      * Handles a keyboard event on the drawer.
      *
      * @param {Event} evt The event that fired.
      * @private
      */
  MaterialLayout.prototype.keyboardEventHandler_ = function (evt) {
    // Only react when the drawer is open.
    if (evt.keyCode === this.Keycodes_.ESCAPE &&
    this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
      this.toggleDrawer();
    }
  };

  /**
      * Handles changes in screen size.
      *
      * @private
      */
  MaterialLayout.prototype.screenSizeHandler_ = function () {
    if (this.screenSizeMediaQuery_.matches) {
      this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
      // Collapse drawer (if any) when moving to a large screen size.
      if (this.drawer_) {
        this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
        this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
      }
    }
  };

  /**
      * Handles events of drawer button.
      *
      * @param {Event} evt The event that fired.
      * @private
      */
  MaterialLayout.prototype.drawerToggleHandler_ = function (evt) {
    if (evt && evt.type === 'keydown') {
      if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
        // prevent scrolling in drawer nav
        evt.preventDefault();
      } else {
        // prevent other keys
        return;
      }
    }

    this.toggleDrawer();
  };

  /**
      * Handles (un)setting the `is-animating` class
      *
      * @private
      */
  MaterialLayout.prototype.headerTransitionEndHandler_ = function () {
    this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
  };

  /**
      * Handles expanding the header on click
      *
      * @private
      */
  MaterialLayout.prototype.headerClickHandler_ = function () {
    if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
      this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    }
  };

  /**
      * Reset tab state, dropping active classes
      *
      * @private
      */
  MaterialLayout.prototype.resetTabState_ = function (tabBar) {
    for (var k = 0; k < tabBar.length; k++) {
      tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
  };

  /**
      * Reset panel state, droping active classes
      *
      * @private
      */
  MaterialLayout.prototype.resetPanelState_ = function (panels) {
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
  };

  /**
     * Toggle drawer state
     *
     * @public
     */
  MaterialLayout.prototype.toggleDrawer = function () {
    var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
    this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);

    // Set accessibility properties.
    if (this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
      this.drawer_.setAttribute('aria-hidden', 'false');
      drawerButton.setAttribute('aria-expanded', 'true');
    } else {
      this.drawer_.setAttribute('aria-hidden', 'true');
      drawerButton.setAttribute('aria-expanded', 'false');
    }
  };
  MaterialLayout.prototype['toggleDrawer'] =
  MaterialLayout.prototype.toggleDrawer;

  /**
                                          * Initialize element.
                                          */
  MaterialLayout.prototype.init = function () {
    if (this.element_) {
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.CONTAINER);

      var focusedElement = this.element_.querySelector(':focus');

      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);

      if (focusedElement) {
        focusedElement.focus();
      }

      var directChildren = this.element_.childNodes;
      var numChildren = directChildren.length;
      for (var c = 0; c < numChildren; c++) {
        var child = directChildren[c];
        if (child.classList &&
        child.classList.contains(this.CssClasses_.HEADER)) {
          this.header_ = child;
        }

        if (child.classList &&
        child.classList.contains(this.CssClasses_.DRAWER)) {
          this.drawer_ = child;
        }

        if (child.classList &&
        child.classList.contains(this.CssClasses_.CONTENT)) {
          this.content_ = child;
        }
      }

      window.addEventListener('pageshow', function (e) {
        if (e.persisted) {// when page is loaded from back/forward cache
          // trigger repaint to let layout scroll in safari
          this.element_.style.overflowY = 'hidden';
          requestAnimationFrame(function () {
            this.element_.style.overflowY = '';
          }.bind(this));
        }
      }.bind(this), false);

      if (this.header_) {
        this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
      }

      var mode = this.Mode_.STANDARD;

      if (this.header_) {
        if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
          mode = this.Mode_.SEAMED;
        } else if (this.header_.classList.contains(
        this.CssClasses_.HEADER_WATERFALL)) {
          mode = this.Mode_.WATERFALL;
          this.header_.addEventListener('transitionend',
          this.headerTransitionEndHandler_.bind(this));
          this.header_.addEventListener('click',
          this.headerClickHandler_.bind(this));
        } else if (this.header_.classList.contains(
        this.CssClasses_.HEADER_SCROLL)) {
          mode = this.Mode_.SCROLL;
          container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
        }

        if (mode === this.Mode_.STANDARD) {
          this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
          if (this.tabBar_) {
            this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
          }
        } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
          this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
          if (this.tabBar_) {
            this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
          }
        } else if (mode === this.Mode_.WATERFALL) {
          // Add and remove shadows depending on scroll position.
          // Also add/remove auxiliary class for styling of the compact version of
          // the header.
          this.content_.addEventListener('scroll',
          this.contentScrollHandler_.bind(this));
          this.contentScrollHandler_();
        }
      }

      // Add drawer toggling button to our layout, if we have an openable drawer.
      if (this.drawer_) {
        var drawerButton = this.element_.querySelector('.' +
        this.CssClasses_.DRAWER_BTN);
        if (!drawerButton) {
          drawerButton = document.createElement('div');
          drawerButton.setAttribute('aria-expanded', 'false');
          drawerButton.setAttribute('role', 'button');
          drawerButton.setAttribute('tabindex', '0');
          drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);

          var drawerButtonIcon = document.createElement('i');
          drawerButtonIcon.classList.add(this.CssClasses_.ICON);
          drawerButtonIcon.innerHTML = this.Constant_.MENU_ICON;
          drawerButton.appendChild(drawerButtonIcon);
        }

        if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
          //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
          drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
        } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
          //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
          drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
        }

        drawerButton.addEventListener('click',
        this.drawerToggleHandler_.bind(this));

        drawerButton.addEventListener('keydown',
        this.drawerToggleHandler_.bind(this));

        // Add a class if the layout has a drawer, for altering the left padding.
        // Adds the HAS_DRAWER to the elements since this.header_ may or may
        // not be present.
        this.element_.classList.add(this.CssClasses_.HAS_DRAWER);

        // If we have a fixed header, add the button to the header rather than
        // the layout.
        if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
          this.header_.insertBefore(drawerButton, this.header_.firstChild);
        } else {
          this.element_.insertBefore(drawerButton, this.content_);
        }

        var obfuscator = document.createElement('div');
        obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
        this.element_.appendChild(obfuscator);
        obfuscator.addEventListener('click',
        this.drawerToggleHandler_.bind(this));
        this.obfuscator_ = obfuscator;

        this.drawer_.addEventListener('keydown', this.keyboardEventHandler_.bind(this));
        this.drawer_.setAttribute('aria-hidden', 'true');
      }

      // Keep an eye on screen size, and add/remove auxiliary class for styling
      // of small screens.
      this.screenSizeMediaQuery_ = window.matchMedia(
      /** @type {string} */this.Constant_.MAX_WIDTH);
      this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
      this.screenSizeHandler_();

      // Initialize tabs, if any.
      if (this.header_ && this.tabBar_) {
        this.element_.classList.add(this.CssClasses_.HAS_TABS);

        var tabContainer = document.createElement('div');
        tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
        this.header_.insertBefore(tabContainer, this.tabBar_);
        this.header_.removeChild(this.tabBar_);

        var leftButton = document.createElement('div');
        leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
        leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
        var leftButtonIcon = document.createElement('i');
        leftButtonIcon.classList.add(this.CssClasses_.ICON);
        leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
        leftButton.appendChild(leftButtonIcon);
        leftButton.addEventListener('click', function () {
          this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
        }.bind(this));

        var rightButton = document.createElement('div');
        rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
        rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
        var rightButtonIcon = document.createElement('i');
        rightButtonIcon.classList.add(this.CssClasses_.ICON);
        rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
        rightButton.appendChild(rightButtonIcon);
        rightButton.addEventListener('click', function () {
          this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
        }.bind(this));

        tabContainer.appendChild(leftButton);
        tabContainer.appendChild(this.tabBar_);
        tabContainer.appendChild(rightButton);

        // Add and remove tab buttons depending on scroll position and total
        // window size.
        var tabUpdateHandler = function () {
          if (this.tabBar_.scrollLeft > 0) {
            leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
          } else {
            leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
          }

          if (this.tabBar_.scrollLeft <
          this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
            rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
          } else {
            rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
          }
        }.bind(this);

        this.tabBar_.addEventListener('scroll', tabUpdateHandler);
        tabUpdateHandler();

        // Update tabs when the window resizes.
        var windowResizeHandler = function () {
          // Use timeouts to make sure it doesn't happen too often.
          if (this.resizeTimeoutId_) {
            clearTimeout(this.resizeTimeoutId_);
          }
          this.resizeTimeoutId_ = setTimeout(function () {
            tabUpdateHandler();
            this.resizeTimeoutId_ = null;
          }.bind(this), /** @type {number} */this.Constant_.RESIZE_TIMEOUT);
        }.bind(this);

        window.addEventListener('resize', windowResizeHandler);

        if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
          this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        }

        // Select element tabs, document panels
        var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
        var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);

        // Create new tabs for each tab element
        for (var i = 0; i < tabs.length; i++) {
          new MaterialLayoutTab(tabs[i], tabs, panels, this);
        }
      }

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
      * Constructor for an individual tab.
      *
      * @constructor
      * @param {HTMLElement} tab The HTML element for the tab.
      * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
      * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
      * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
      */
  function MaterialLayoutTab(tab, tabs, panels, layout) {

    /**
                                                          * Auxiliary method to programmatically select a tab in the UI.
                                                          */
    function selectTab() {
      var href = tab.href.split('#')[1];
      var panel = layout.content_.querySelector('#' + href);
      layout.resetTabState_(tabs);
      layout.resetPanelState_(panels);
      tab.classList.add(layout.CssClasses_.IS_ACTIVE);
      panel.classList.add(layout.CssClasses_.IS_ACTIVE);
    }

    if (layout.tabBar_.classList.contains(
    layout.CssClasses_.JS_RIPPLE_EFFECT)) {
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
      rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
      var ripple = document.createElement('span');
      ripple.classList.add(layout.CssClasses_.RIPPLE);
      rippleContainer.appendChild(ripple);
      tab.appendChild(rippleContainer);
    }

    tab.addEventListener('click', function (e) {
      if (tab.getAttribute('href').charAt(0) === '#') {
        e.preventDefault();
        selectTab();
      }
    });

    tab.show = selectTab;
  }
  window['MaterialLayoutTab'] = MaterialLayoutTab;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialLayout,
    classAsString: 'MaterialLayout',
    cssClass: 'mdl-js-layout' });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dC5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbExheW91dCIsImVsZW1lbnQiLCJlbGVtZW50XyIsImluaXQiLCJ3aW5kb3ciLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJNQVhfV0lEVEgiLCJUQUJfU0NST0xMX1BJWEVMUyIsIlJFU0laRV9USU1FT1VUIiwiTUVOVV9JQ09OIiwiQ0hFVlJPTl9MRUZUIiwiQ0hFVlJPTl9SSUdIVCIsIktleWNvZGVzXyIsIkVOVEVSIiwiRVNDQVBFIiwiU1BBQ0UiLCJNb2RlXyIsIlNUQU5EQVJEIiwiU0VBTUVEIiwiV0FURVJGQUxMIiwiU0NST0xMIiwiQ3NzQ2xhc3Nlc18iLCJDT05UQUlORVIiLCJIRUFERVIiLCJEUkFXRVIiLCJDT05URU5UIiwiRFJBV0VSX0JUTiIsIklDT04iLCJKU19SSVBQTEVfRUZGRUNUIiwiUklQUExFX0NPTlRBSU5FUiIsIlJJUFBMRSIsIlJJUFBMRV9JR05PUkVfRVZFTlRTIiwiSEVBREVSX1NFQU1FRCIsIkhFQURFUl9XQVRFUkZBTEwiLCJIRUFERVJfU0NST0xMIiwiRklYRURfSEVBREVSIiwiT0JGVVNDQVRPUiIsIlRBQl9CQVIiLCJUQUJfQ09OVEFJTkVSIiwiVEFCIiwiVEFCX0JBUl9CVVRUT04iLCJUQUJfQkFSX0xFRlRfQlVUVE9OIiwiVEFCX0JBUl9SSUdIVF9CVVRUT04iLCJQQU5FTCIsIkhBU19EUkFXRVIiLCJIQVNfVEFCUyIsIkhBU19TQ1JPTExJTkdfSEVBREVSIiwiQ0FTVElOR19TSEFET1ciLCJJU19DT01QQUNUIiwiSVNfU01BTExfU0NSRUVOIiwiSVNfRFJBV0VSX09QRU4iLCJJU19BQ1RJVkUiLCJJU19VUEdSQURFRCIsIklTX0FOSU1BVElORyIsIk9OX0xBUkdFX1NDUkVFTiIsIk9OX1NNQUxMX1NDUkVFTiIsImNvbnRlbnRTY3JvbGxIYW5kbGVyXyIsImhlYWRlcl8iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImhlYWRlclZpc2libGUiLCJjb250ZW50XyIsInNjcm9sbFRvcCIsImFkZCIsInJlbW92ZSIsImtleWJvYXJkRXZlbnRIYW5kbGVyXyIsImV2dCIsImtleUNvZGUiLCJkcmF3ZXJfIiwidG9nZ2xlRHJhd2VyIiwic2NyZWVuU2l6ZUhhbmRsZXJfIiwic2NyZWVuU2l6ZU1lZGlhUXVlcnlfIiwibWF0Y2hlcyIsIm9iZnVzY2F0b3JfIiwiZHJhd2VyVG9nZ2xlSGFuZGxlcl8iLCJ0eXBlIiwicHJldmVudERlZmF1bHQiLCJoZWFkZXJUcmFuc2l0aW9uRW5kSGFuZGxlcl8iLCJoZWFkZXJDbGlja0hhbmRsZXJfIiwicmVzZXRUYWJTdGF0ZV8iLCJ0YWJCYXIiLCJrIiwibGVuZ3RoIiwicmVzZXRQYW5lbFN0YXRlXyIsInBhbmVscyIsImoiLCJkcmF3ZXJCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwidG9nZ2xlIiwic2V0QXR0cmlidXRlIiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZm9jdXNlZEVsZW1lbnQiLCJwYXJlbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImZvY3VzIiwiZGlyZWN0Q2hpbGRyZW4iLCJjaGlsZE5vZGVzIiwibnVtQ2hpbGRyZW4iLCJjIiwiY2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInBlcnNpc3RlZCIsInN0eWxlIiwib3ZlcmZsb3dZIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiYmluZCIsInRhYkJhcl8iLCJtb2RlIiwiZHJhd2VyQnV0dG9uSWNvbiIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiLCJvYmZ1c2NhdG9yIiwibWF0Y2hNZWRpYSIsImFkZExpc3RlbmVyIiwidGFiQ29udGFpbmVyIiwibGVmdEJ1dHRvbiIsImxlZnRCdXR0b25JY29uIiwidGV4dENvbnRlbnQiLCJzY3JvbGxMZWZ0IiwicmlnaHRCdXR0b24iLCJyaWdodEJ1dHRvbkljb24iLCJ0YWJVcGRhdGVIYW5kbGVyIiwic2Nyb2xsV2lkdGgiLCJvZmZzZXRXaWR0aCIsIndpbmRvd1Jlc2l6ZUhhbmRsZXIiLCJyZXNpemVUaW1lb3V0SWRfIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInRhYnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsIk1hdGVyaWFsTGF5b3V0VGFiIiwidGFiIiwibGF5b3V0Iiwic2VsZWN0VGFiIiwiaHJlZiIsInNwbGl0IiwicGFuZWwiLCJyaXBwbGVDb250YWluZXIiLCJyaXBwbGUiLCJnZXRBdHRyaWJ1dGUiLCJjaGFyQXQiLCJzaG93IiwiY29tcG9uZW50SGFuZGxlciIsInJlZ2lzdGVyIiwiY29uc3RydWN0b3IiLCJjbGFzc0FzU3RyaW5nIiwiY3NzQ2xhc3MiXSwibWFwcGluZ3MiOiJjQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxDQUFDLFlBQVc7QUFDVjs7QUFFQTs7Ozs7Ozs7QUFRQSxNQUFJQSxpQkFBaUIsU0FBU0EsY0FBVCxDQUF3QkMsT0FBeEIsRUFBaUM7QUFDcEQsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7O0FBRUE7QUFDQSxTQUFLRSxJQUFMO0FBQ0QsR0FMRDtBQU1BQyxTQUFPLGdCQUFQLElBQTJCSixjQUEzQjs7QUFFQTs7Ozs7O0FBTUFBLGlCQUFlSyxTQUFmLENBQXlCQyxTQUF6QixHQUFxQztBQUNuQ0MsZUFBVyxxQkFEd0I7QUFFbkNDLHVCQUFtQixHQUZnQjtBQUduQ0Msb0JBQWdCLEdBSG1COztBQUtuQ0MsZUFBVyxVQUx3QjtBQU1uQ0Msa0JBQWMsY0FOcUI7QUFPbkNDLG1CQUFlLGVBUG9CLEVBQXJDOzs7QUFVQTs7Ozs7O0FBTUFaLGlCQUFlSyxTQUFmLENBQXlCUSxTQUF6QixHQUFxQztBQUNuQ0MsV0FBTyxFQUQ0QjtBQUVuQ0MsWUFBUSxFQUYyQjtBQUduQ0MsV0FBTyxFQUg0QixFQUFyQzs7O0FBTUE7Ozs7OztBQU1BaEIsaUJBQWVLLFNBQWYsQ0FBeUJZLEtBQXpCLEdBQWlDO0FBQy9CQyxjQUFVLENBRHFCO0FBRS9CQyxZQUFRLENBRnVCO0FBRy9CQyxlQUFXLENBSG9CO0FBSS9CQyxZ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Z0MsQ0FBaEMsTUFBdUMsR0FBM0MsRUFBZ0Q7QUFDOUN6QyxVQUFFN0IsY0FBRjtBQUNBK0Q7QUFDRDtBQUNGLEtBTEQ7O0FBT0FGLFFBQUlVLElBQUosR0FBV1IsU0FBWDtBQUNEO0FBQ0R4SSxTQUFPLG1CQUFQLElBQThCcUksaUJBQTlCOztBQUVBO0FBQ0E7QUFDQVksbUJBQWlCQyxRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWF2SixjQURXO0FBRXhCd0osbUJBQWUsZ0JBRlM7QUFHeEJDLGNBQVUsZUFIYyxFQUExQjs7QUFLRCxDQXhpQkQiLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgTGF5b3V0IE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbExheW91dCA9IGZ1bmN0aW9uIE1hdGVyaWFsTGF5b3V0KGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxMYXlvdXQnXSA9IE1hdGVyaWFsTGF5b3V0O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICBNQVhfV0lEVEg6ICcobWF4LXdpZHRoOiAxMDI0cHgpJyxcbiAgICBUQUJfU0NST0xMX1BJWEVMUzogMTAwLFxuICAgIFJFU0laRV9USU1FT1VUOiAxMDAsXG5cbiAgICBNRU5VX0lDT046ICcmI3hFNUQyOycsXG4gICAgQ0hFVlJPTl9MRUZUOiAnY2hldnJvbl9sZWZ0JyxcbiAgICBDSEVWUk9OX1JJR0hUOiAnY2hldnJvbl9yaWdodCdcbiAgfTtcblxuICAvKipcbiAgICogS2V5Y29kZXMsIGZvciBjb2RlIHJlYWRhYmlsaXR5LlxuICAgKlxuICAgKiBAZW51bSB7bnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLktleWNvZGVzXyA9IHtcbiAgICBFTlRFUjogMTMsXG4gICAgRVNDQVBFOiAyNyxcbiAgICBTUEFDRTogMzJcbiAgfTtcblxuICAvKipcbiAgICogTW9kZXMuXG4gICAqXG4gICAqIEBlbnVtIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuTW9kZV8gPSB7XG4gICAgU1RBTkRBUkQ6IDAsXG4gICAgU0VBTUVEOiAxLFxuICAgIFdBVEVSRkFMTDogMixcbiAgICBTQ1JPTEw6IDNcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBDT05UQUlORVI6ICdtZGwtbGF5b3V0X19jb250YWluZXInLFxuICAgIEhFQURFUjogJ21kbC1sYXlvdXRfX2hlYWRlcicsXG4gICAgRFJBV0VSOiAnbWRsLWxheW91dF9fZHJhd2VyJyxcbiAgICBDT05URU5UOiAnbWRsLWxheW91dF9fY29udGVudCcsXG4gICAgRFJBV0VSX0JUTjogJ21kbC1sYXlvdXRfX2RyYXdlci1idXR0b24nLFxuXG4gICAgSUNPTjogJ21hdGVyaWFsLWljb25zJyxcblxuICAgIEpTX1JJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgUklQUExFX0NPTlRBSU5FUjogJ21kbC1sYXlvdXRfX3RhYi1yaXBwbGUtY29udGFpbmVyJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICBSSVBQTEVfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcblxuICAgIEhFQURFUl9TRUFNRUQ6ICdtZGwtbGF5b3V0X19oZWFkZXItLXNlYW1lZCcsXG4gICAgSEVBREVSX1dBVEVSRkFMTDogJ21kbC1sYXlvdXRfX2hlYWRlci0td2F0ZXJmYWxsJyxcbiAgICBIRUFERVJfU0NST0xMOiAnbWRsLWxheW91dF9faGVhZGVyLS1zY3JvbGwnLFxuXG4gICAgRklYRURfSEVBREVSOiAnbWRsLWxheW91dC0tZml4ZWQtaGVhZGVyJyxcbiAgICBPQkZVU0NBVE9SOiAnbWRsLWxheW91dF9fb2JmdXNjYXRvcicsXG5cbiAgICBUQUJfQkFSOiAnbWRsLWxheW91dF9fdGFiLWJhcicsXG4gICAgVEFCX0NPTlRBSU5FUjogJ21kbC1sYXlvdXRfX3RhYi1iYXItY29udGFpbmVyJyxcbiAgICBUQUI6ICdtZGwtbGF5b3V0X190YWInLFxuICAgIFRBQl9CQVJfQlVUVE9OOiAnbWRsLWxheW91dF9fdGFiLWJhci1idXR0b24nLFxuICAgIFRBQl9CQVJfTEVGVF9CVVRUT046ICdtZGwtbGF5b3V0X190YWItYmFyLWxlZnQtYnV0dG9uJyxcbiAgICBUQUJfQkFSX1JJR0hUX0JVVFRPTjogJ21kbC1sYXlvdXRfX3RhYi1iYXItcmlnaHQtYnV0dG9uJyxcbiAgICBQQU5FTDogJ21kbC1sYXlvdXRfX3RhYi1wYW5lbCcsXG5cbiAgICBIQVNfRFJBV0VSOiAnaGFzLWRyYXdlcicsXG4gICAgSEFTX1RBQlM6ICdoYXMtdGFicycsXG4gICAgSEFTX1NDUk9MTElOR19IRUFERVI6ICdoYXMtc2Nyb2xsaW5nLWhlYWRlcicsXG4gICAgQ0FTVElOR19TSEFET1c6ICdpcy1jYXN0aW5nLXNoYWRvdycsXG4gICAgSVNfQ09NUEFDVDogJ2lzLWNvbXBhY3QnLFxuICAgIElTX1NNQUxMX1NDUkVFTjogJ2lzLXNtYWxsLXNjcmVlbicsXG4gICAgSVNfRFJBV0VSX09QRU46ICdpcy12aXNpYmxlJyxcbiAgICBJU19BQ1RJVkU6ICdpcy1hY3RpdmUnLFxuICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnLFxuICAgIElTX0FOSU1BVElORzogJ2lzLWFuaW1hdGluZycsXG5cbiAgICBPTl9MQVJHRV9TQ1JFRU46ICdtZGwtbGF5b3V0LS1sYXJnZS1zY3JlZW4tb25seScsXG4gICAgT05fU01BTExfU0NSRUVOOiAnbWRsLWxheW91dC0tc21hbGwtc2NyZWVuLW9ubHknXG5cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBzY3JvbGxpbmcgb24gdGhlIGNvbnRlbnQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuY29udGVudFNjcm9sbEhhbmRsZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlclZpc2libGUgPVxuICAgICAgICAhdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19TTUFMTF9TQ1JFRU4pIHx8XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRklYRURfSEVBREVSKTtcblxuICAgIGlmICh0aGlzLmNvbnRlbnRfLnNjcm9sbFRvcCA+IDAgJiZcbiAgICAgICAgIXRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19DT01QQUNUKSkge1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5DQVNUSU5HX1NIQURPVyk7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpO1xuICAgICAgaWYgKGhlYWRlclZpc2libGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jb250ZW50Xy5zY3JvbGxUb3AgPD0gMCAmJlxuICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ09NUEFDVCkpIHtcbiAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19DT01QQUNUKTtcbiAgICAgIGlmIChoZWFkZXJWaXNpYmxlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBrZXlib2FyZCBldmVudCBvbiB0aGUgZHJhd2VyLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUua2V5Ym9hcmRFdmVudEhhbmRsZXJfID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gT25seSByZWFjdCB3aGVuIHRoZSBkcmF3ZXIgaXMgb3Blbi5cbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkVTQ0FQRSAmJlxuICAgICAgICB0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRFJBV0VSX09QRU4pKSB7XG4gICAgICB0aGlzLnRvZ2dsZURyYXdlcigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBjaGFuZ2VzIGluIHNjcmVlbiBzaXplLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLnNjcmVlblNpemVIYW5kbGVyXyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNjcmVlblNpemVNZWRpYVF1ZXJ5Xy5tYXRjaGVzKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19TTUFMTF9TQ1JFRU4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19TTUFMTF9TQ1JFRU4pO1xuICAgICAgLy8gQ29sbGFwc2UgZHJhd2VyIChpZiBhbnkpIHdoZW4gbW92aW5nIHRvIGEgbGFyZ2Ugc2NyZWVuIHNpemUuXG4gICAgICBpZiAodGhpcy5kcmF3ZXJfKSB7XG4gICAgICAgIHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRFJBV0VSX09QRU4pO1xuICAgICAgICB0aGlzLm9iZnVzY2F0b3JfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGV2ZW50cyBvZiBkcmF3ZXIgYnV0dG9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuZHJhd2VyVG9nZ2xlSGFuZGxlcl8gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0ICYmIChldnQudHlwZSA9PT0gJ2tleWRvd24nKSkge1xuICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5TUEFDRSB8fCBldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRU5URVIpIHtcbiAgICAgICAgLy8gcHJldmVudCBzY3JvbGxpbmcgaW4gZHJhd2VyIG5hdlxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHByZXZlbnQgb3RoZXIga2V5c1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50b2dnbGVEcmF3ZXIoKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyAodW4pc2V0dGluZyB0aGUgYGlzLWFuaW1hdGluZ2AgY2xhc3NcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5oZWFkZXJUcmFuc2l0aW9uRW5kSGFuZGxlcl8gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgZXhwYW5kaW5nIHRoZSBoZWFkZXIgb24gY2xpY2tcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5oZWFkZXJDbGlja0hhbmRsZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19DT01QQUNUKSkge1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19DT01QQUNUKTtcbiAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRhYiBzdGF0ZSwgZHJvcHBpbmcgYWN0aXZlIGNsYXNzZXNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5yZXNldFRhYlN0YXRlXyA9IGZ1bmN0aW9uKHRhYkJhcikge1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGFiQmFyLmxlbmd0aDsgaysrKSB7XG4gICAgICB0YWJCYXJba10uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXNldCBwYW5lbCBzdGF0ZSwgZHJvcGluZyBhY3RpdmUgY2xhc3Nlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLnJlc2V0UGFuZWxTdGF0ZV8gPSBmdW5jdGlvbihwYW5lbHMpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhbmVscy5sZW5ndGg7IGorKykge1xuICAgICAgcGFuZWxzW2pdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgKiBUb2dnbGUgZHJhd2VyIHN0YXRlXG4gICpcbiAgKiBAcHVibGljXG4gICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS50b2dnbGVEcmF3ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZHJhd2VyQnV0dG9uID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uRFJBV0VSX0JUTik7XG4gICAgdGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC50b2dnbGUodGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTik7XG4gICAgdGhpcy5vYmZ1c2NhdG9yXy5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRFJBV0VSX09QRU4pO1xuXG4gICAgLy8gU2V0IGFjY2Vzc2liaWxpdHkgcHJvcGVydGllcy5cbiAgICBpZiAodGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX0RSQVdFUl9PUEVOKSkge1xuICAgICAgdGhpcy5kcmF3ZXJfLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXdlcl8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICBkcmF3ZXJCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGVbJ3RvZ2dsZURyYXdlciddID1cbiAgICAgIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS50b2dnbGVEcmF3ZXI7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ09OVEFJTkVSKTtcblxuICAgICAgdmFyIGZvY3VzZWRFbGVtZW50ID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKTtcblxuICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjb250YWluZXIsIHRoaXMuZWxlbWVudF8pO1xuICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF8pO1xuXG4gICAgICBpZiAoZm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgICAgZm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRpcmVjdENoaWxkcmVuID0gdGhpcy5lbGVtZW50Xy5jaGlsZE5vZGVzO1xuICAgICAgdmFyIG51bUNoaWxkcmVuID0gZGlyZWN0Q2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBudW1DaGlsZHJlbjsgYysrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGRpcmVjdENoaWxkcmVuW2NdO1xuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5IRUFERVIpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJfID0gY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5EUkFXRVIpKSB7XG4gICAgICAgICAgdGhpcy5kcmF3ZXJfID0gY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5DT05URU5UKSkge1xuICAgICAgICAgIHRoaXMuY29udGVudF8gPSBjaGlsZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBlcnNpc3RlZCkgeyAvLyB3aGVuIHBhZ2UgaXMgbG9hZGVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlXG4gICAgICAgICAgLy8gdHJpZ2dlciByZXBhaW50IHRvIGxldCBsYXlvdXQgc2Nyb2xsIGluIHNhZmFyaVxuICAgICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbic7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5vdmVyZmxvd1kgPSAnJztcbiAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgaWYgKHRoaXMuaGVhZGVyXykge1xuICAgICAgICB0aGlzLnRhYkJhcl8gPSB0aGlzLmhlYWRlcl8ucXVlcnlTZWxlY3RvcignLicgKyB0aGlzLkNzc0NsYXNzZXNfLlRBQl9CQVIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbW9kZSA9IHRoaXMuTW9kZV8uU1RBTkRBUkQ7XG5cbiAgICAgIGlmICh0aGlzLmhlYWRlcl8pIHtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5IRUFERVJfU0VBTUVEKSkge1xuICAgICAgICAgIG1vZGUgPSB0aGlzLk1vZGVfLlNFQU1FRDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgICAgdGhpcy5Dc3NDbGFzc2VzXy5IRUFERVJfV0FURVJGQUxMKSkge1xuICAgICAgICAgIG1vZGUgPSB0aGlzLk1vZGVfLldBVEVSRkFMTDtcbiAgICAgICAgICB0aGlzLmhlYWRlcl8uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICB0aGlzLmhlYWRlclRyYW5zaXRpb25FbmRIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICB0aGlzLmhlYWRlcl8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgdGhpcy5oZWFkZXJDbGlja0hhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLkhFQURFUl9TQ1JPTEwpKSB7XG4gICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uU0NST0xMO1xuICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSEFTX1NDUk9MTElOR19IRUFERVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGUgPT09IHRoaXMuTW9kZV8uU1RBTkRBUkQpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgICAgICBpZiAodGhpcy50YWJCYXJfKSB7XG4gICAgICAgICAgICB0aGlzLnRhYkJhcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gdGhpcy5Nb2RlXy5TRUFNRUQgfHwgbW9kZSA9PT0gdGhpcy5Nb2RlXy5TQ1JPTEwpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgICAgICBpZiAodGhpcy50YWJCYXJfKSB7XG4gICAgICAgICAgICB0aGlzLnRhYkJhcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gdGhpcy5Nb2RlXy5XQVRFUkZBTEwpIHtcbiAgICAgICAgICAvLyBBZGQgYW5kIHJlbW92ZSBzaGFkb3dzIGRlcGVuZGluZyBvbiBzY3JvbGwgcG9zaXRpb24uXG4gICAgICAgICAgLy8gQWxzbyBhZGQvcmVtb3ZlIGF1eGlsaWFyeSBjbGFzcyBmb3Igc3R5bGluZyBvZiB0aGUgY29tcGFjdCB2ZXJzaW9uIG9mXG4gICAgICAgICAgLy8gdGhlIGhlYWRlci5cbiAgICAgICAgICB0aGlzLmNvbnRlbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsXG4gICAgICAgICAgICAgIHRoaXMuY29udGVudFNjcm9sbEhhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICAgIHRoaXMuY29udGVudFNjcm9sbEhhbmRsZXJfKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGRyYXdlciB0b2dnbGluZyBidXR0b24gdG8gb3VyIGxheW91dCwgaWYgd2UgaGF2ZSBhbiBvcGVuYWJsZSBkcmF3ZXIuXG4gICAgICBpZiAodGhpcy5kcmF3ZXJfKSB7XG4gICAgICAgIHZhciBkcmF3ZXJCdXR0b24gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy4nICtcbiAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLkRSQVdFUl9CVE4pO1xuICAgICAgICBpZiAoIWRyYXdlckJ1dHRvbikge1xuICAgICAgICAgIGRyYXdlckJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICBkcmF3ZXJCdXR0b24uc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpO1xuICAgICAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgICAgICBkcmF3ZXJCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkRSQVdFUl9CVE4pO1xuXG4gICAgICAgICAgdmFyIGRyYXdlckJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uSWNvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSUNPTik7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uSWNvbi5pbm5lckhUTUwgPSB0aGlzLkNvbnN0YW50Xy5NRU5VX0lDT047XG4gICAgICAgICAgZHJhd2VyQnV0dG9uLmFwcGVuZENoaWxkKGRyYXdlckJ1dHRvbkljb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5PTl9MQVJHRV9TQ1JFRU4pKSB7XG4gICAgICAgICAgLy9JZiBkcmF3ZXIgaGFzIE9OX0xBUkdFX1NDUkVFTiBjbGFzcyB0aGVuIGFkZCBpdCB0byB0aGUgZHJhd2VyIHRvZ2dsZSBidXR0b24gYXMgd2VsbC5cbiAgICAgICAgICBkcmF3ZXJCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLk9OX0xBUkdFX1NDUkVFTik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLk9OX1NNQUxMX1NDUkVFTikpIHtcbiAgICAgICAgICAvL0lmIGRyYXdlciBoYXMgT05fU01BTExfU0NSRUVOIGNsYXNzIHRoZW4gYWRkIGl0IHRvIHRoZSBkcmF3ZXIgdG9nZ2xlIGJ1dHRvbiBhcyB3ZWxsLlxuICAgICAgICAgIGRyYXdlckJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uT05fU01BTExfU0NSRUVOKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICB0aGlzLmRyYXdlclRvZ2dsZUhhbmRsZXJfLmJpbmQodGhpcykpO1xuXG4gICAgICAgIGRyYXdlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgLy8gQWRkIGEgY2xhc3MgaWYgdGhlIGxheW91dCBoYXMgYSBkcmF3ZXIsIGZvciBhbHRlcmluZyB0aGUgbGVmdCBwYWRkaW5nLlxuICAgICAgICAvLyBBZGRzIHRoZSBIQVNfRFJBV0VSIHRvIHRoZSBlbGVtZW50cyBzaW5jZSB0aGlzLmhlYWRlcl8gbWF5IG9yIG1heVxuICAgICAgICAvLyBub3QgYmUgcHJlc2VudC5cbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSEFTX0RSQVdFUik7XG5cbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGZpeGVkIGhlYWRlciwgYWRkIHRoZSBidXR0b24gdG8gdGhlIGhlYWRlciByYXRoZXIgdGhhblxuICAgICAgICAvLyB0aGUgbGF5b3V0LlxuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5GSVhFRF9IRUFERVIpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJfLmluc2VydEJlZm9yZShkcmF3ZXJCdXR0b24sIHRoaXMuaGVhZGVyXy5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnRfLmluc2VydEJlZm9yZShkcmF3ZXJCdXR0b24sIHRoaXMuY29udGVudF8pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iZnVzY2F0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgb2JmdXNjYXRvci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uT0JGVVNDQVRPUik7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQob2JmdXNjYXRvcik7XG4gICAgICAgIG9iZnVzY2F0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgdGhpcy5kcmF3ZXJUb2dnbGVIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5vYmZ1c2NhdG9yXyA9IG9iZnVzY2F0b3I7XG5cbiAgICAgICAgdGhpcy5kcmF3ZXJfLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleWJvYXJkRXZlbnRIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5kcmF3ZXJfLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGFuIGV5ZSBvbiBzY3JlZW4gc2l6ZSwgYW5kIGFkZC9yZW1vdmUgYXV4aWxpYXJ5IGNsYXNzIGZvciBzdHlsaW5nXG4gICAgICAvLyBvZiBzbWFsbCBzY3JlZW5zLlxuICAgICAgdGhpcy5zY3JlZW5TaXplTWVkaWFRdWVyeV8gPSB3aW5kb3cubWF0Y2hNZWRpYShcbiAgICAgICAgICAvKiogQHR5cGUge3N0cmluZ30gKi8gKHRoaXMuQ29uc3RhbnRfLk1BWF9XSURUSCkpO1xuICAgICAgdGhpcy5zY3JlZW5TaXplTWVkaWFRdWVyeV8uYWRkTGlzdGVuZXIodGhpcy5zY3JlZW5TaXplSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNjcmVlblNpemVIYW5kbGVyXygpO1xuXG4gICAgICAvLyBJbml0aWFsaXplIHRhYnMsIGlmIGFueS5cbiAgICAgIGlmICh0aGlzLmhlYWRlcl8gJiYgdGhpcy50YWJCYXJfKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkhBU19UQUJTKTtcblxuICAgICAgICB2YXIgdGFiQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRhYkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVEFCX0NPTlRBSU5FUik7XG4gICAgICAgIHRoaXMuaGVhZGVyXy5pbnNlcnRCZWZvcmUodGFiQ29udGFpbmVyLCB0aGlzLnRhYkJhcl8pO1xuICAgICAgICB0aGlzLmhlYWRlcl8ucmVtb3ZlQ2hpbGQodGhpcy50YWJCYXJfKTtcblxuICAgICAgICB2YXIgbGVmdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZWZ0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQkFSX0JVVFRPTik7XG4gICAgICAgIGxlZnRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRBQl9CQVJfTEVGVF9CVVRUT04pO1xuICAgICAgICB2YXIgbGVmdEJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgIGxlZnRCdXR0b25JY29uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JQ09OKTtcbiAgICAgICAgbGVmdEJ1dHRvbkljb24udGV4dENvbnRlbnQgPSB0aGlzLkNvbnN0YW50Xy5DSEVWUk9OX0xFRlQ7XG4gICAgICAgIGxlZnRCdXR0b24uYXBwZW5kQ2hpbGQobGVmdEJ1dHRvbkljb24pO1xuICAgICAgICBsZWZ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy50YWJCYXJfLnNjcm9sbExlZnQgLT0gdGhpcy5Db25zdGFudF8uVEFCX1NDUk9MTF9QSVhFTFM7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdmFyIHJpZ2h0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQkFSX0JVVFRPTik7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQkFSX1JJR0hUX0JVVFRPTik7XG4gICAgICAgIHZhciByaWdodEJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgIHJpZ2h0QnV0dG9uSWNvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSUNPTik7XG4gICAgICAgIHJpZ2h0QnV0dG9uSWNvbi50ZXh0Q29udGVudCA9IHRoaXMuQ29uc3RhbnRfLkNIRVZST05fUklHSFQ7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmFwcGVuZENoaWxkKHJpZ2h0QnV0dG9uSWNvbik7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy50YWJCYXJfLnNjcm9sbExlZnQgKz0gdGhpcy5Db25zdGFudF8uVEFCX1NDUk9MTF9QSVhFTFM7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRCdXR0b24pO1xuICAgICAgICB0YWJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50YWJCYXJfKTtcbiAgICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0QnV0dG9uKTtcblxuICAgICAgICAvLyBBZGQgYW5kIHJlbW92ZSB0YWIgYnV0dG9ucyBkZXBlbmRpbmcgb24gc2Nyb2xsIHBvc2l0aW9uIGFuZCB0b3RhbFxuICAgICAgICAvLyB3aW5kb3cgc2l6ZS5cbiAgICAgICAgdmFyIHRhYlVwZGF0ZUhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAodGhpcy50YWJCYXJfLnNjcm9sbExlZnQgPiAwKSB7XG4gICAgICAgICAgICBsZWZ0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZWZ0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8uc2Nyb2xsTGVmdCA8XG4gICAgICAgICAgICAgIHRoaXMudGFiQmFyXy5zY3JvbGxXaWR0aCAtIHRoaXMudGFiQmFyXy5vZmZzZXRXaWR0aCkge1xuICAgICAgICAgICAgcmlnaHRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMudGFiQmFyXy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0YWJVcGRhdGVIYW5kbGVyKTtcbiAgICAgICAgdGFiVXBkYXRlSGFuZGxlcigpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0YWJzIHdoZW4gdGhlIHdpbmRvdyByZXNpemVzLlxuICAgICAgICB2YXIgd2luZG93UmVzaXplSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIFVzZSB0aW1lb3V0cyB0byBtYWtlIHN1cmUgaXQgZG9lc24ndCBoYXBwZW4gdG9vIG9mdGVuLlxuICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZVRpbWVvdXRJZF8pIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXRJZF8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXRJZF8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGFiVXBkYXRlSGFuZGxlcigpO1xuICAgICAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0SWRfID0gbnVsbDtcbiAgICAgICAgICB9LmJpbmQodGhpcyksIC8qKiBAdHlwZSB7bnVtYmVyfSAqLyAodGhpcy5Db25zdGFudF8uUkVTSVpFX1RJTUVPVVQpKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB3aW5kb3dSZXNpemVIYW5kbGVyKTtcblxuICAgICAgICBpZiAodGhpcy50YWJCYXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgICAgdGhpcy50YWJCYXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfSUdOT1JFX0VWRU5UUyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZWxlY3QgZWxlbWVudCB0YWJzLCBkb2N1bWVudCBwYW5lbHNcbiAgICAgICAgdmFyIHRhYnMgPSB0aGlzLnRhYkJhcl8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLlRBQik7XG4gICAgICAgIHZhciBwYW5lbHMgPSB0aGlzLmNvbnRlbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5QQU5FTCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0YWJzIGZvciBlYWNoIHRhYiBlbGVtZW50XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG5ldyBNYXRlcmlhbExheW91dFRhYih0YWJzW2ldLCB0YWJzLCBwYW5lbHMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhbiBpbmRpdmlkdWFsIHRhYi5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhYiBUaGUgSFRNTCBlbGVtZW50IGZvciB0aGUgdGFiLlxuICAgKiBAcGFyYW0geyFBcnJheTxIVE1MRWxlbWVudD59IHRhYnMgQXJyYXkgd2l0aCBIVE1MIGVsZW1lbnRzIGZvciBhbGwgdGFicy5cbiAgICogQHBhcmFtIHshQXJyYXk8SFRNTEVsZW1lbnQ+fSBwYW5lbHMgQXJyYXkgd2l0aCBIVE1MIGVsZW1lbnRzIGZvciBhbGwgcGFuZWxzLlxuICAgKiBAcGFyYW0ge01hdGVyaWFsTGF5b3V0fSBsYXlvdXQgVGhlIE1hdGVyaWFsTGF5b3V0IG9iamVjdCB0aGF0IG93bnMgdGhlIHRhYi5cbiAgICovXG4gIGZ1bmN0aW9uIE1hdGVyaWFsTGF5b3V0VGFiKHRhYiwgdGFicywgcGFuZWxzLCBsYXlvdXQpIHtcblxuICAgIC8qKlxuICAgICAqIEF1eGlsaWFyeSBtZXRob2QgdG8gcHJvZ3JhbW1hdGljYWxseSBzZWxlY3QgYSB0YWIgaW4gdGhlIFVJLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNlbGVjdFRhYigpIHtcbiAgICAgIHZhciBocmVmID0gdGFiLmhyZWYuc3BsaXQoJyMnKVsxXTtcbiAgICAgIHZhciBwYW5lbCA9IGxheW91dC5jb250ZW50Xy5xdWVyeVNlbGVjdG9yKCcjJyArIGhyZWYpO1xuICAgICAgbGF5b3V0LnJlc2V0VGFiU3RhdGVfKHRhYnMpO1xuICAgICAgbGF5b3V0LnJlc2V0UGFuZWxTdGF0ZV8ocGFuZWxzKTtcbiAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKGxheW91dC5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgcGFuZWwuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICB9XG5cbiAgICBpZiAobGF5b3V0LnRhYkJhcl8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICBsYXlvdXQuQ3NzQ2xhc3Nlc18uSlNfUklQUExFX0VGRkVDVCkpIHtcbiAgICAgIHZhciByaXBwbGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uSlNfUklQUExFX0VGRkVDVCk7XG4gICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQobGF5b3V0LkNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQocmlwcGxlKTtcbiAgICAgIHRhYi5hcHBlbmRDaGlsZChyaXBwbGVDb250YWluZXIpO1xuICAgIH1cblxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICh0YWIuZ2V0QXR0cmlidXRlKCdocmVmJykuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxlY3RUYWIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRhYi5zaG93ID0gc2VsZWN0VGFiO1xuICB9XG4gIHdpbmRvd1snTWF0ZXJpYWxMYXlvdXRUYWInXSA9IE1hdGVyaWFsTGF5b3V0VGFiO1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxMYXlvdXQsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsTGF5b3V0JyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1sYXlvdXQnXG4gIH0pO1xufSkoKTtcbiJdfQ==
