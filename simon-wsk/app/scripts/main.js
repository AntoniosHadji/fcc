/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  let isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
      navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
          // updatefound is fired if service-worker.js changes.
          registration.onupdatefound = function() {
            // updatefound is also fired the very first time the SW is
            // installed,
            // and there's no need to prompt for a reload at that point.
            // So check here to see if the page is already controlled,
            // i.e. whether there's an existing service worker.
            if (navigator.serviceWorker.controller) {
              // The updatefound event implies that registration.installing is
              // set:
              // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
              let installingWorker = registration.installing;

              installingWorker.onstatechange = function() {
                switch (installingWorker.state) {
                  case 'installed':
                    // At this point, the old content will have been purged and
                    // the
                    // fresh content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in the page's
                    // interface.
                    break;

                  case 'redundant':
                    throw new Error('The installing ' +
                      'service worker became redundant.');

                  default:
                    // Ignore
                }
              };
            }
          };
        }).catch(function(e) {
          console.error('Error during service worker registration:', e);
        });
    }

  // Your custom JavaScript goes here

  let app = window.app || {};

  // hold strictMode boolean (change on event switch1.change)
  app.strictMode = document.getElementById('switch1').checked;
  // hold sequence of values
  app.sequence = [];
  // index list of buttons 0-3
  app.buttons = [
    'button-green',
    'button-red',
    'button-yellow',
    'button-blue',
  ];
  app.gameOn = false;

  document.getElementById('switch1').addEventListener('change', function(e) {
    app.strictMode = e.target.checked;
    console.log(app.strictMode);
  });

  document.getElementById('reset-button').addEventListener('click', function() {
    app.resetGame();
  });

  document.getElementById('start-button').addEventListener('click', function() {
    app.startGame();
  });

  let sqrCollection = document.getElementsByClassName('squares');
  for (let i = 0; i < sqrCollection.length; i++) {
    console.log('event handler added for: ' + sqrCollection.item(i).id);

    sqrCollection.item(i).addEventListener('click', function(e) {
      if (app.gameOn) app.play(e.target.id);
    });
  }

  app.play = function(id) {
    // get square by id
    let el = document.getElementById(id);
    // get color of square from preset id name
    let color = id.substr(7);
    console.log(id, color);

    // add css class to lighten color (white background + opacity)
    el.className += ' shift-color';

    // play sound preset id contains specified format
    document.getElementById('sound-' + color).play();

    // create a timer to return color to normal 300ms is enough to notice
    window.setTimeout(function() {
      el.className = el.className.replace(' shift-color', '');
    }, 500);
  };

  app.resetGame = function() {
    console.log('reset');
    app.gameOn = false;
    app.sequence = [];
  };

  app.startGame = function() {
    console.log('start');
    app.gameOn = true;
    app.createSequence();
    app.playSequence();
    console.log(app.sequence);
  };

  app.createSequence = function() {
    let n = getRandomIntInclusive(3);
    app.sequence.push(n);
    document.getElementById('step-counter').innerHTML =
      'Steps: ' + app.sequence.length;
  };

  /* TODO:
   * this plays the sequences too fast - why is not the setTimeout working? */
  app.playSequence = function() {
    app.sequence.forEach( function(element, index) {
      app.play(app.buttons[element]);
    });
  };

  /**
  *  Using Math.round() will give you a non-uniform distribution!
  *  @param {integer} max
  *  @param {integer} min
  *  @return {number} - Returns a random integer between 0 and max (inclusive)
  */
  function getRandomIntInclusive(max, min) {
    min = min || 0; // Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.onload = function() {
    console.log('loaded javascript');
  };

  // this allows me to set values from javascript
})();
// vim: set foldmethod=syntax :
