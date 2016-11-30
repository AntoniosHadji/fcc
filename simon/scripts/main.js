'use strict'; /*
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

(function (window, document) {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
  /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));



  if ('serviceWorker' in window.navigator && (
  window.location.protocol === 'https:' || isLocalhost)) {
    window.navigator.serviceWorker.register('service-worker.js').
    then(function (registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function () {
        // updatefound is also fired the very first time the SW is
        // installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (window.navigator.serviceWorker.controller) {(function () {
            // The updatefound event implies that registration.installing is
            // set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
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
            };})();
        }
      };
    }).catch(function (e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here

  var app = window.app || {};

  // hold strictMode boolean (change on event switch1.change)
  app.strictMode = document.getElementById('switch1').checked;
  // hold sequence of values 0-3
  app.sequence = [];
  // index list of buttons 0-3
  app.buttons = [
  'button-green',
  'button-red',
  'button-yellow',
  'button-blue'];

  app.gameOn = false;
  app.playersTurn = true;
  // keep track of players sequence
  app.counter = 0;

  document.getElementById('switch1').addEventListener('change', function (e) {
    app.strictMode = e.target.checked;
    console.log('strictMode: ' + app.strictMode);
  });

  document.getElementById('reset-button').addEventListener('click', function () {
    app.resetGame();
  }, false);

  app.resetGame = function (event) {
    console.log('reset');
    app.gameOn = false;
    app.sequence = [];
    document.getElementById('step-counter').innerHTML = 'Steps: 00';
  };

  document.getElementById('start-button').addEventListener('click', function () {
    app.nextPlay();
  }, false);

  app.nextPlay = function (e) {
    console.log('nextPlay');
    app.clearWin();
    app.gameOn = true;
    app.playersTurn = false;
    app.createSequence();
    app.playSequence(0);
    console.log('current sequence: ' + app.sequence);
  };

  app.clearWin = function () {
    var t = document.getElementById('title');
    if (t.innerHTML.endsWith('!!')) {
      t.innerHTML = 'Simon';
    }
  };

  app.setupSquareEventListeners = function () {
    var sqrCollection = document.getElementsByClassName('squares');
    for (var i = 0; i < sqrCollection.length; i++) {
      sqrCollection.item(i).addEventListener('click', app.squareClickEvent);
      console.log('event handler added for: ' + sqrCollection.item(i).id);
    }
  };

  app.squareClickEvent = function (e) {
    if (app.gameOn && app.playersTurn) {
      app.play(e.target.id);
      app.isCorrect(e.target.id);
    } else {
      if (!app.gameOn) {
        app.updateTitle('Game not Started');
      } else if (!app.playersTurn) {
        app.updateTitle('Not your turn');
      }
    }
  };

  app.updateTitle = function (message) {
    var t = document.getElementById('title');
    t.innerHTML = 'Simon - ' + message;
  };

  app.isCorrect = function (id) {
    var index = app.buttons.indexOf(id);
    if (index === app.sequence[app.counter]) {
      console.log('correct: app.counter:' +
      app.counter + ' sequence: ' + app.sequence.length);

      app.updateTitle('Correct for ' + (app.counter + 1) + ' steps');

      if (app.counter === app.sequence.length - 1) {
        console.log('end of sequence');

        if (app.sequence.length < 20) {
          window.setTimeout(function () {
            app.nextPlay();
          }, 2000);
        } else {
          app.updateTitle('Correct for ' +
          app.sequence.length + ' steps!! You Win!!');

          app.resetGame();
        }
      }
    } else {(function () {
        app.updateTitle('Wrong on step # ' + app.counter);
        console.log('wrong');
        var el = document.getElementById(id);
        el.className += ' wrong-square';
        document.getElementById('sound-wrong').play();
        window.setTimeout(function () {
          el.className = el.className.replace(' wrong-square', '');
        }, 1000);

        if (app.strictMode) {
          window.setTimeout(function () {
            app.resetGame();
          }, 2000);
        } else {
          window.setTimeout(function () {
            app.playSequence(0);
          }, 2000);
        }})();
    }
    app.counter++;
    console.log('count: ' + app.counter);
  };

  app.play = function (id) {
    // get square by id
    var el = document.getElementById(id);
    // get color of square from preset id name
    var color = id.substr(7);
    console.log('id: ' + id + ', sound: ' + color);

    // add css class to lighten color (white background + opacity)
    el.className += ' shift-color';

    // play sound preset id contains specified format
    document.getElementById('sound-' + color).play();

    // create a timer to return color to normal 300ms is enough to notice
    // setTimeout executes the function after the specified time
    window.setTimeout(function () {
      el.className = el.className.replace(' shift-color', '');
    }, 500);
  };

  app.playSequence = function (i) {
    if (i < app.sequence.length) {
      app.play(app.buttons[app.sequence[i]]);
      window.setTimeout(function () {
        console.log('i: ' + i);
        app.playSequence(i + 1);
      }, 1000);
    } else {
      app.playersTurn = true;
      app.counter = 0;
      console.log('game: ' + app.gameOn + ' player: ' + app.playersTurn);
    }
  };

  app.createSequence = function () {
    var n = getRandomIntInclusive(3);
    app.sequence.push(n);
    document.getElementById('step-counter').innerHTML =
    'Steps: ' + app.sequence.length;
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

  window.onload = function () {
    console.log('loaded javascript');
    app.setupSquareEventListeners();
  };
})(window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsid2luZG93IiwiZG9jdW1lbnQiLCJpc0xvY2FsaG9zdCIsIkJvb2xlYW4iLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwibWF0Y2giLCJuYXZpZ2F0b3IiLCJwcm90b2NvbCIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInRoZW4iLCJyZWdpc3RyYXRpb24iLCJvbnVwZGF0ZWZvdW5kIiwiY29udHJvbGxlciIsImluc3RhbGxpbmdXb3JrZXIiLCJpbnN0YWxsaW5nIiwib25zdGF0ZWNoYW5nZSIsInN0YXRlIiwiRXJyb3IiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJhcHAiLCJzdHJpY3RNb2RlIiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGVja2VkIiwic2VxdWVuY2UiLCJidXR0b25zIiwiZ2FtZU9uIiwicGxheWVyc1R1cm4iLCJjb3VudGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRhcmdldCIsImxvZyIsInJlc2V0R2FtZSIsImV2ZW50IiwiaW5uZXJIVE1MIiwibmV4dFBsYXkiLCJjbGVhcldpbiIsImNyZWF0ZVNlcXVlbmNlIiwicGxheVNlcXVlbmNlIiwidCIsImVuZHNXaXRoIiwic2V0dXBTcXVhcmVFdmVudExpc3RlbmVycyIsInNxckNvbGxlY3Rpb24iLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaSIsImxlbmd0aCIsIml0ZW0iLCJzcXVhcmVDbGlja0V2ZW50IiwiaWQiLCJwbGF5IiwiaXNDb3JyZWN0IiwidXBkYXRlVGl0bGUiLCJtZXNzYWdlIiwiaW5kZXgiLCJpbmRleE9mIiwic2V0VGltZW91dCIsImVsIiwiY2xhc3NOYW1lIiwicmVwbGFjZSIsImNvbG9yIiwic3Vic3RyIiwibiIsImdldFJhbmRvbUludEluY2x1c2l2ZSIsInB1c2giLCJtYXgiLCJtaW4iLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJvbmxvYWQiXSwibWFwcGluZ3MiOiJjQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJB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QSxVQUFNQSxPQUFPLENBQWIsQ0FEdUMsQ0FDdkI7QUFDaEJELFVBQU1FLEtBQUtDLEtBQUwsQ0FBV0gsR0FBWCxDQUFOO0FBQ0EsV0FBT0UsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLE1BQWlCSixNQUFNQyxHQUFOLEdBQVksQ0FBN0IsQ0FBWCxJQUE4Q0EsR0FBckQ7QUFDRDs7QUFFRHJFLFNBQU95RSxNQUFQLEdBQWdCLFlBQVc7QUFDekJuRCxZQUFRYSxHQUFSLENBQVksbUJBQVo7QUFDQVgsUUFBSXFCLHlCQUFKO0FBQ0QsR0FIRDtBQUlELENBdFBELEVBc1BHN0MsTUF0UEgsRUFzUFdDLFFBdFBYIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICpcbiAqICBXZWIgU3RhcnRlciBLaXRcbiAqICBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwczovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlXG4gKlxuICovXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDaGVjayB0byBtYWtlIHN1cmUgc2VydmljZSB3b3JrZXJzIGFyZSBzdXBwb3J0ZWQgaW4gdGhlIGN1cnJlbnQgYnJvd3NlcixcbiAgLy8gYW5kIHRoYXQgdGhlIGN1cnJlbnQgcGFnZSBpcyBhY2Nlc3NlZCBmcm9tIGEgc2VjdXJlIG9yaWdpbi4gVXNpbmcgYVxuICAvLyBzZXJ2aWNlIHdvcmtlciBmcm9tIGFuIGluc2VjdXJlIG9yaWdpbiB3aWxsIHRyaWdnZXIgSlMgY29uc29sZSBlcnJvcnMuIFNlZVxuICAvLyBodHRwOi8vd3d3LmNocm9taXVtLm9yZy9Ib21lL2Nocm9taXVtLXNlY3VyaXR5L3ByZWZlci1zZWN1cmUtb3JpZ2lucy1mb3ItcG93ZXJmdWwtbmV3LWZlYXR1cmVzXG4gIGxldCBpc0xvY2FsaG9zdCA9IEJvb2xlYW4od2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0JyB8fFxuICAgIC8vIFs6OjFdIGlzIHRoZSBJUHY2IGxvY2FsaG9zdCBhZGRyZXNzLlxuICAgIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ1s6OjFdJyB8fFxuICAgIC8vIDEyNy4wLjAuMS84IGlzIGNvbnNpZGVyZWQgbG9jYWxob3N0IGZvciBJUHY0LlxuICAgIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5tYXRjaChcbiAgICAgIC9eMTI3KD86XFwuKD86MjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KSl7M30kL1xuICAgIClcbik7XG5cbiAgaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgfHwgaXNMb2NhbGhvc3QpKSB7XG4gICAgICB3aW5kb3cubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJ3NlcnZpY2Utd29ya2VyLmpzJylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgICAgLy8gdXBkYXRlZm91bmQgaXMgZmlyZWQgaWYgc2VydmljZS13b3JrZXIuanMgY2hhbmdlcy5cbiAgICAgICAgICByZWdpc3RyYXRpb24ub251cGRhdGVmb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gdXBkYXRlZm91bmQgaXMgYWxzbyBmaXJlZCB0aGUgdmVyeSBmaXJzdCB0aW1lIHRoZSBTVyBpc1xuICAgICAgICAgICAgLy8gaW5zdGFsbGVkLFxuICAgICAgICAgICAgLy8gYW5kIHRoZXJlJ3Mgbm8gbmVlZCB0byBwcm9tcHQgZm9yIGEgcmVsb2FkIGF0IHRoYXQgcG9pbnQuXG4gICAgICAgICAgICAvLyBTbyBjaGVjayBoZXJlIHRvIHNlZSBpZiB0aGUgcGFnZSBpcyBhbHJlYWR5IGNvbnRyb2xsZWQsXG4gICAgICAgICAgICAvLyBpLmUuIHdoZXRoZXIgdGhlcmUncyBhbiBleGlzdGluZyBzZXJ2aWNlIHdvcmtlci5cbiAgICAgICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAvLyBUaGUgdXBkYXRlZm91bmQgZXZlbnQgaW1wbGllcyB0aGF0IHJlZ2lzdHJhdGlvbi5pbnN0YWxsaW5nIGlzXG4gICAgICAgICAgICAgIC8vIHNldDpcbiAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9zbGlnaHRseW9mZi5naXRodWIuaW8vU2VydmljZVdvcmtlci9zcGVjL3NlcnZpY2Vfd29ya2VyL2luZGV4Lmh0bWwjc2VydmljZS13b3JrZXItY29udGFpbmVyLXVwZGF0ZWZvdW5kLWV2ZW50XG4gICAgICAgICAgICAgIGxldCBpbnN0YWxsaW5nV29ya2VyID0gcmVnaXN0cmF0aW9uLmluc3RhbGxpbmc7XG5cbiAgICAgICAgICAgICAgaW5zdGFsbGluZ1dvcmtlci5vbnN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbnN0YWxsaW5nV29ya2VyLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdpbnN0YWxsZWQnOlxuICAgICAgICAgICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgb2xkIGNvbnRlbnQgd2lsbCBoYXZlIGJlZW4gcHVyZ2VkIGFuZFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJlc2ggY29udGVudCB3aWxsIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgY2FjaGUuXG4gICAgICAgICAgICAgICAgICAgIC8vIEl0J3MgdGhlIHBlcmZlY3QgdGltZSB0byBkaXNwbGF5IGEgXCJOZXcgY29udGVudCBpc1xuICAgICAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGU7IHBsZWFzZSByZWZyZXNoLlwiIG1lc3NhZ2UgaW4gdGhlIHBhZ2Unc1xuICAgICAgICAgICAgICAgICAgICAvLyBpbnRlcmZhY2UuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICBjYXNlICdyZWR1bmRhbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBpbnN0YWxsaW5nICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdzZXJ2aWNlIHdvcmtlciBiZWNhbWUgcmVkdW5kYW50LicpO1xuXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGR1cmluZyBzZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb246JywgZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAvLyBZb3VyIGN1c3RvbSBKYXZhU2NyaXB0IGdvZXMgaGVyZVxuXG4gIGxldCBhcHAgPSB3aW5kb3cuYXBwIHx8IHt9O1xuXG4gIC8vIGhvbGQgc3RyaWN0TW9kZSBib29sZWFuIChjaGFuZ2Ugb24gZXZlbnQgc3dpdGNoMS5jaGFuZ2UpXG4gIGFwcC5zdHJpY3RNb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaDEnKS5jaGVja2VkO1xuICAvLyBob2xkIHNlcXVlbmNlIG9mIHZhbHVlcyAwLTNcbiAgYXBwLnNlcXVlbmNlID0gW107XG4gIC8vIGluZGV4IGxpc3Qgb2YgYnV0dG9ucyAwLTNcbiAgYXBwLmJ1dHRvbnMgPSBbXG4gICAgJ2J1dHRvbi1ncmVlbicsXG4gICAgJ2J1dHRvbi1yZWQnLFxuICAgICdidXR0b24teWVsbG93JyxcbiAgICAnYnV0dG9uLWJsdWUnLFxuICBdO1xuICBhcHAuZ2FtZU9uID0gZmFsc2U7XG4gIGFwcC5wbGF5ZXJzVHVybiA9IHRydWU7XG4gIC8vIGtlZXAgdHJhY2sgb2YgcGxheWVycyBzZXF1ZW5jZVxuICBhcHAuY291bnRlciA9IDA7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaDEnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgYXBwLnN0cmljdE1vZGUgPSBlLnRhcmdldC5jaGVja2VkO1xuICAgIGNvbnNvbGUubG9nKCdzdHJpY3RNb2RlOiAnICsgYXBwLnN0cmljdE1vZGUpO1xuICB9KTtcblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBhcHAucmVzZXRHYW1lKCk7XG4gIH0sIGZhbHNlKTtcblxuICBhcHAucmVzZXRHYW1lID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBjb25zb2xlLmxvZygncmVzZXQnKTtcbiAgICBhcHAuZ2FtZU9uID0gZmFsc2U7XG4gICAgYXBwLnNlcXVlbmNlID0gW107XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0ZXAtY291bnRlcicpLmlubmVySFRNTCA9ICdTdGVwczogMDAnO1xuICB9O1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydC1idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGFwcC5uZXh0UGxheSgpO1xuICB9LCBmYWxzZSk7XG5cbiAgYXBwLm5leHRQbGF5ID0gZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKCduZXh0UGxheScpO1xuICAgIGFwcC5jbGVhcldpbigpO1xuICAgIGFwcC5nYW1lT24gPSB0cnVlO1xuICAgIGFwcC5wbGF5ZXJzVHVybiA9IGZhbHNlO1xuICAgIGFwcC5jcmVhdGVTZXF1ZW5jZSgpO1xuICAgIGFwcC5wbGF5U2VxdWVuY2UoMCk7XG4gICAgY29uc29sZS5sb2coYGN1cnJlbnQgc2VxdWVuY2U6ICR7YXBwLnNlcXVlbmNlfWApO1xuICB9O1xuXG4gIGFwcC5jbGVhcldpbiA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJyk7XG4gICAgaWYgKHQuaW5uZXJIVE1MLmVuZHNXaXRoKCchIScpKSB7XG4gICAgICB0LmlubmVySFRNTCA9ICdTaW1vbic7XG4gICAgfVxuICB9O1xuXG4gIGFwcC5zZXR1cFNxdWFyZUV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNxckNvbGxlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzcXVhcmVzJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcXJDb2xsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzcXJDb2xsZWN0aW9uLml0ZW0oaSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhcHAuc3F1YXJlQ2xpY2tFdmVudCk7XG4gICAgICBjb25zb2xlLmxvZygnZXZlbnQgaGFuZGxlciBhZGRlZCBmb3I6ICcgKyBzcXJDb2xsZWN0aW9uLml0ZW0oaSkuaWQpO1xuICAgIH1cbiAgfTtcblxuICBhcHAuc3F1YXJlQ2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoYXBwLmdhbWVPbiAmJiBhcHAucGxheWVyc1R1cm4pIHtcbiAgICAgIGFwcC5wbGF5KGUudGFyZ2V0LmlkKTtcbiAgICAgIGFwcC5pc0NvcnJlY3QoZS50YXJnZXQuaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWFwcC5nYW1lT24pIHtcbiAgICAgICAgYXBwLnVwZGF0ZVRpdGxlKCdHYW1lIG5vdCBTdGFydGVkJyk7XG4gICAgICB9IGVsc2UgaWYgKCFhcHAucGxheWVyc1R1cm4pIHtcbiAgICAgICAgYXBwLnVwZGF0ZVRpdGxlKCdOb3QgeW91ciB0dXJuJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGFwcC51cGRhdGVUaXRsZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGxldCB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJyk7XG4gICAgICB0LmlubmVySFRNTCA9ICdTaW1vbiAtICcgKyBtZXNzYWdlO1xuICB9O1xuXG4gIGFwcC5pc0NvcnJlY3QgPSBmdW5jdGlvbihpZCkge1xuICAgIGxldCBpbmRleCA9IGFwcC5idXR0b25zLmluZGV4T2YoaWQpO1xuICAgIGlmIChpbmRleCA9PT0gYXBwLnNlcXVlbmNlW2FwcC5jb3VudGVyXSkge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBjb3JyZWN0OiBhcHAuY291bnRlcjoke2FwcC5jb3VudGVyfSBzZXF1ZW5jZTogJHthcHAuc2VxdWVuY2UubGVuZ3RofWApO1xuXG4gICAgICBhcHAudXBkYXRlVGl0bGUoYENvcnJlY3QgZm9yICR7YXBwLmNvdW50ZXIrMX0gc3RlcHNgKTtcblxuICAgICAgaWYgKCBhcHAuY291bnRlciA9PT0gYXBwLnNlcXVlbmNlLmxlbmd0aCAtIDEgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlbmQgb2Ygc2VxdWVuY2UnKTtcblxuICAgICAgICBpZiAoYXBwLnNlcXVlbmNlLmxlbmd0aCA8IDIwICkge1xuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFwcC5uZXh0UGxheSgpO1xuICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFwcC51cGRhdGVUaXRsZShcbiAgICAgICAgICAgIGBDb3JyZWN0IGZvciAke2FwcC5zZXF1ZW5jZS5sZW5ndGh9IHN0ZXBzISEgWW91IFdpbiEhYFxuICAgICAgICAgICk7XG4gICAgICAgICAgYXBwLnJlc2V0R2FtZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcC51cGRhdGVUaXRsZShgV3Jvbmcgb24gc3RlcCAjICR7YXBwLmNvdW50ZXJ9YCk7XG4gICAgICBjb25zb2xlLmxvZygnd3JvbmcnKTtcbiAgICAgIGxldCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgIGVsLmNsYXNzTmFtZSArPSAnIHdyb25nLXNxdWFyZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmQtd3JvbmcnKS5wbGF5KCk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKCcgd3Jvbmctc3F1YXJlJywgJycpO1xuICAgICAgfSwgMTAwMCk7XG5cbiAgICAgIGlmIChhcHAuc3RyaWN0TW9kZSkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYXBwLnJlc2V0R2FtZSgpO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhcHAucGxheVNlcXVlbmNlKDApO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXBwLmNvdW50ZXIrKztcbiAgICBjb25zb2xlLmxvZyhgY291bnQ6ICR7YXBwLmNvdW50ZXJ9YCk7XG4gIH07XG5cbiAgYXBwLnBsYXkgPSBmdW5jdGlvbihpZCkge1xuICAgIC8vIGdldCBzcXVhcmUgYnkgaWRcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgLy8gZ2V0IGNvbG9yIG9mIHNxdWFyZSBmcm9tIHByZXNldCBpZCBuYW1lXG4gICAgbGV0IGNvbG9yID0gaWQuc3Vic3RyKDcpO1xuICAgIGNvbnNvbGUubG9nKGBpZDogJHtpZH0sIHNvdW5kOiAke2NvbG9yfWApO1xuXG4gICAgLy8gYWRkIGNzcyBjbGFzcyB0byBsaWdodGVuIGNvbG9yICh3aGl0ZSBiYWNrZ3JvdW5kICsgb3BhY2l0eSlcbiAgICBlbC5jbGFzc05hbWUgKz0gJyBzaGlmdC1jb2xvcic7XG5cbiAgICAvLyBwbGF5IHNvdW5kIHByZXNldCBpZCBjb250YWlucyBzcGVjaWZpZWQgZm9ybWF0XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvdW5kLScgKyBjb2xvcikucGxheSgpO1xuXG4gICAgLy8gY3JlYXRlIGEgdGltZXIgdG8gcmV0dXJuIGNvbG9yIHRvIG5vcm1hbCAzMDBtcyBpcyBlbm91Z2ggdG8gbm90aWNlXG4gICAgLy8gc2V0VGltZW91dCBleGVjdXRlcyB0aGUgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNwZWNpZmllZCB0aW1lXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgnIHNoaWZ0LWNvbG9yJywgJycpO1xuICAgIH0sIDUwMCk7XG4gIH07XG5cbiAgYXBwLnBsYXlTZXF1ZW5jZSA9IGZ1bmN0aW9uKGkpIHtcbiAgICBpZiAoaSA8IGFwcC5zZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgIGFwcC5wbGF5KGFwcC5idXR0b25zW2FwcC5zZXF1ZW5jZVtpXV0pO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaTogJyArIGkpO1xuICAgICAgICBhcHAucGxheVNlcXVlbmNlKGkrMSk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBwLnBsYXllcnNUdXJuID0gdHJ1ZTtcbiAgICAgIGFwcC5jb3VudGVyID0gMDtcbiAgICAgIGNvbnNvbGUubG9nKGBnYW1lOiAke2FwcC5nYW1lT259IHBsYXllcjogJHthcHAucGxheWVyc1R1cm59YCk7XG4gICAgfVxuICB9O1xuXG4gIGFwcC5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBuID0gZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDMpO1xuICAgIGFwcC5zZXF1ZW5jZS5wdXNoKG4pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGVwLWNvdW50ZXInKS5pbm5lckhUTUwgPVxuICAgICAgJ1N0ZXBzOiAnICsgYXBwLnNlcXVlbmNlLmxlbmd0aDtcbiAgfTtcblxuXG4gIC8qKlxuICAqICBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcbiAgKiAgQHBhcmFtIHtpbnRlZ2VyfSBtYXhcbiAgKiAgQHBhcmFtIHtpbnRlZ2VyfSBtaW5cbiAgKiAgQHJldHVybiB7bnVtYmVyfSAtIFJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDAgYW5kIG1heCAoaW5jbHVzaXZlKVxuICAqL1xuICBmdW5jdGlvbiBnZXRSYW5kb21JbnRJbmNsdXNpdmUobWF4LCBtaW4pIHtcbiAgICBtaW4gPSBtaW4gfHwgMDsgLy8gTWF0aC5jZWlsKG1pbik7XG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICB9XG5cbiAgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdsb2FkZWQgamF2YXNjcmlwdCcpO1xuICAgIGFwcC5zZXR1cFNxdWFyZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH07XG59KSh3aW5kb3csIGRvY3VtZW50KTtcbiJdfQ==
