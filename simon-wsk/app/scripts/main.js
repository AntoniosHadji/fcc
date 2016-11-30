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
(function() {
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

  if ('serviceWorker' in window.navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    window.navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
          // updatefound is fired if service-worker.js changes.
          registration.onupdatefound = function() {
            // updatefound is also fired the very first time the SW is
            // installed,
            // and there's no need to prompt for a reload at that point.
            // So check here to see if the page is already controlled,
            // i.e. whether there's an existing service worker.
            if (window.navigator.serviceWorker.controller) {
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
  // hold sequence of values 0-3
  app.sequence = [];
  // index list of buttons 0-3
  app.buttons = [
    'button-green',
    'button-red',
    'button-yellow',
    'button-blue'
  ];
  app.gameOn = false;
  app.playersTurn = true;
  // keep track of players sequence
  app.counter = 0;

  document.getElementById('switch1').addEventListener('change', function(e) {
    app.strictMode = e.target.checked;
    console.log('strictMode: ' + app.strictMode);
  });

  document.getElementById('reset-button').addEventListener('click', function() {
    app.resetGame();
  }, false);

  app.resetGame = function() {
    console.log('reset');
    app.gameOn = false;
    app.sequence = [];
    document.getElementById('step-counter').innerHTML = 'Steps: 00';
  };

  document.getElementById('start-button').addEventListener('click', function() {
    app.nextPlay();
  }, false);

  app.nextPlay = function() {
    console.log('nextPlay');
    app.clearWin();
    app.gameOn = true;
    app.playersTurn = false;
    app.createSequence();
    app.playSequence(0);
    console.log(`current sequence: ${app.sequence}`);
  };

  app.clearWin = function() {
    let t = document.getElementById('title');
    if (t.innerHTML.endsWith('!!')) {
      t.innerHTML = 'Simon';
    }
  };

  app.setupSquareEventListeners = function() {
    let sqrCollection = document.getElementsByClassName('squares');
    for (let i = 0; i < sqrCollection.length; i++) {
      sqrCollection.item(i).addEventListener('click', app.squareClickEvent);
      console.log('event handler added for: ' + sqrCollection.item(i).id);
    }
  };

  app.squareClickEvent = function(e) {
    if (app.gameOn && app.playersTurn) {
      app.play(e.target.id);
      app.isCorrect(e.target.id);
    } else if (!app.gameOn) {
      app.updateTitle('Game not Started');
    } else if (!app.playersTurn) {
      app.updateTitle('Not your turn');
    }
  };

  app.updateTitle = function(message) {
    let t = document.getElementById('title');
    t.innerHTML = 'Simon - ' + message;
  };

  app.isCorrect = function(id) {
    let index = app.buttons.indexOf(id);
    if (index === app.sequence[app.counter]) {
      console.log(
        `correct: app.counter:${app.counter} sequence: ${app.sequence.length}`);

      app.updateTitle(`Correct for ${app.counter + 1} steps`);

      if (app.counter === app.sequence.length - 1) {
        console.log('end of sequence');

        if (app.sequence.length < 20) {
          window.setTimeout(function() {
            app.nextPlay();
          }, 2000);
        } else {
          app.updateTitle(
            `Correct for ${app.sequence.length} steps!! You Win!!`
          );
          app.resetGame();
        }
      }
    } else {
      app.updateTitle(`Wrong on step # ${app.counter}`);
      console.log('wrong');
      let el = document.getElementById(id);
      el.className += ' wrong-square';
      document.getElementById('sound-wrong').play();
      window.setTimeout(function() {
        el.className = el.className.replace(' wrong-square', '');
      }, 1000);

      if (app.strictMode) {
        window.setTimeout(function() {
          app.resetGame();
        }, 2000);
      } else {
        window.setTimeout(function() {
          app.playSequence(0);
        }, 2000);
      }
    }
    app.counter++;
    console.log(`count: ${app.counter}`);
  };

  app.play = function(id) {
    // get square by id
    let el = document.getElementById(id);
    // get color of square from preset id name
    let color = id.substr(7);
    console.log(`id: ${id}, sound: ${color}`);

    // add css class to lighten color (white background + opacity)
    el.className += ' shift-color';

    // play sound preset id contains specified format
    document.getElementById('sound-' + color).play();

    // create a timer to return color to normal 300ms is enough to notice
    // setTimeout executes the function after the specified time
    window.setTimeout(function() {
      el.className = el.className.replace(' shift-color', '');
    }, 500);
  };

  app.playSequence = function(i) {
    if (i < app.sequence.length) {
      app.play(app.buttons[app.sequence[i]]);
      window.setTimeout(function() {
        console.log('i: ' + i);
        app.playSequence(i + 1);
      }, 1000);
    } else {
      app.playersTurn = true;
      app.counter = 0;
      console.log(`game: ${app.gameOn} player: ${app.playersTurn}`);
    }
  };

  app.createSequence = function() {
    let n = getRandomIntInclusive(3);
    app.sequence.push(n);
    document.getElementById('step-counter').innerHTML =
      'Steps: ' + app.sequence.length;
  };

  /**
  *  Using Math.round() will give you a non-uniform distribution!
  *  @param {integer} max maximum value
  *  @param {integer} min minimum value
  *  @return {number} - Returns a random integer between 0 and max (inclusive)
  */
  function getRandomIntInclusive(max, min) {
    min = min || 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.onload = function() {
    console.log('loaded javascript');
    app.setupSquareEventListeners();
  };
})();
