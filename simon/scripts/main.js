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
(function () {
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

  app.resetGame = function () {
    console.log('reset');
    app.gameOn = false;
    app.sequence = [];
    document.getElementById('step-counter').innerHTML = 'Steps: 00';
  };

  document.getElementById('start-button').addEventListener('click', function () {
    app.nextPlay();
  }, false);

  app.nextPlay = function () {
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
    } else if (!app.gameOn) {
      app.updateTitle('Game not Started');
    } else if (!app.playersTurn) {
      app.updateTitle('Not your turn');
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
     *  @param {integer} max maximum value
     *  @param {integer} min minimum value
     *  @return {number} - Returns a random integer between 0 and max (inclusive)
     */
  function getRandomIntInclusive(max, min) {
    min = min || 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.onload = function () {
    console.log('loaded javascript');
    app.setupSquareEventListeners();
  };
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiaXNMb2NhbGhvc3QiLCJCb29sZWFuIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsIm1hdGNoIiwibmF2aWdhdG9yIiwicHJvdG9jb2wiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJ0aGVuIiwicmVnaXN0cmF0aW9uIiwib251cGRhdGVmb3VuZCIsImNvbnRyb2xsZXIiLCJpbnN0YWxsaW5nV29ya2VyIiwiaW5zdGFsbGluZyIsIm9uc3RhdGVjaGFuZ2UiLCJzdGF0ZSIsIkVycm9yIiwiY2F0Y2giLCJlIiwiY29uc29sZSIsImVycm9yIiwiYXBwIiwic3RyaWN0TW9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGVja2VkIiwic2VxdWVuY2UiLCJidXR0b25zIiwiZ2FtZU9uIiwicGxheWVyc1R1cm4iLCJjb3VudGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRhcmdldCIsImxvZyIsInJlc2V0R2FtZSIsImlubmVySFRNTCIsIm5leHRQbGF5IiwiY2xlYXJXaW4iLCJjcmVhdGVTZXF1ZW5jZSIsInBsYXlTZXF1ZW5jZSIsInQiLCJlbmRzV2l0aCIsInNldHVwU3F1YXJlRXZlbnRMaXN0ZW5lcnMiLCJzcXJDb2xsZWN0aW9uIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImkiLCJsZW5ndGgiLCJpdGVtIiwic3F1YXJlQ2xpY2tFdmVudCIsImlkIiwicGxheSIsImlzQ29ycmVjdCIsInVwZGF0ZVRpdGxlIiwibWVzc2FnZSIsImluZGV4IiwiaW5kZXhPZiIsInNldFRpbWVvdXQiLCJlbCIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJjb2xvciIsInN1YnN0ciIsIm4iLCJnZXRSYW5kb21JbnRJbmNsdXNpdmUiLCJwdXNoIiwibWF4IiwibWluIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwib25sb2FkIl0sIm1hcHBpbmdzIjoiY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLENBQUMsWUFB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TUFBTCxNQUFpQkosTUFBTUMsR0FBTixHQUFZLENBQTdCLENBQVgsSUFBOENBLEdBQXJEO0FBQ0Q7O0FBRURsRSxTQUFPc0UsTUFBUCxHQUFnQixZQUFXO0FBQ3pCbkQsWUFBUWMsR0FBUixDQUFZLG1CQUFaO0FBQ0FaLFFBQUlxQix5QkFBSjtBQUNELEdBSEQ7QUFJRCxDQWpQRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqXG4gKiAgV2ViIFN0YXJ0ZXIgS2l0XG4gKiAgQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cHM6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZVxuICpcbiAqL1xuKGZ1bmN0aW9uKCkge1xuICAvLyBDaGVjayB0byBtYWtlIHN1cmUgc2VydmljZSB3b3JrZXJzIGFyZSBzdXBwb3J0ZWQgaW4gdGhlIGN1cnJlbnQgYnJvd3NlcixcbiAgLy8gYW5kIHRoYXQgdGhlIGN1cnJlbnQgcGFnZSBpcyBhY2Nlc3NlZCBmcm9tIGEgc2VjdXJlIG9yaWdpbi4gVXNpbmcgYVxuICAvLyBzZXJ2aWNlIHdvcmtlciBmcm9tIGFuIGluc2VjdXJlIG9yaWdpbiB3aWxsIHRyaWdnZXIgSlMgY29uc29sZSBlcnJvcnMuIFNlZVxuICAvLyBodHRwOi8vd3d3LmNocm9taXVtLm9yZy9Ib21lL2Nocm9taXVtLXNlY3VyaXR5L3ByZWZlci1zZWN1cmUtb3JpZ2lucy1mb3ItcG93ZXJmdWwtbmV3LWZlYXR1cmVzXG4gIGxldCBpc0xvY2FsaG9zdCA9IEJvb2xlYW4od2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0JyB8fFxuICAgIC8vIFs6OjFdIGlzIHRoZSBJUHY2IGxvY2FsaG9zdCBhZGRyZXNzLlxuICAgIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ1s6OjFdJyB8fFxuICAgIC8vIDEyNy4wLjAuMS84IGlzIGNvbnNpZGVyZWQgbG9jYWxob3N0IGZvciBJUHY0LlxuICAgIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5tYXRjaChcbiAgICAgIC9eMTI3KD86XFwuKD86MjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KSl7M30kL1xuICAgIClcbik7XG5cbiAgaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgfHwgaXNMb2NhbGhvc3QpKSB7XG4gICAgd2luZG93Lm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCdzZXJ2aWNlLXdvcmtlci5qcycpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xuICAgICAgICAgIC8vIHVwZGF0ZWZvdW5kIGlzIGZpcmVkIGlmIHNlcnZpY2Utd29ya2VyLmpzIGNoYW5nZXMuXG4gICAgICAgICAgcmVnaXN0cmF0aW9uLm9udXBkYXRlZm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZWZvdW5kIGlzIGFsc28gZmlyZWQgdGhlIHZlcnkgZmlyc3QgdGltZSB0aGUgU1cgaXNcbiAgICAgICAgICAgIC8vIGluc3RhbGxlZCxcbiAgICAgICAgICAgIC8vIGFuZCB0aGVyZSdzIG5vIG5lZWQgdG8gcHJvbXB0IGZvciBhIHJlbG9hZCBhdCB0aGF0IHBvaW50LlxuICAgICAgICAgICAgLy8gU28gY2hlY2sgaGVyZSB0byBzZWUgaWYgdGhlIHBhZ2UgaXMgYWxyZWFkeSBjb250cm9sbGVkLFxuICAgICAgICAgICAgLy8gaS5lLiB3aGV0aGVyIHRoZXJlJ3MgYW4gZXhpc3Rpbmcgc2VydmljZSB3b3JrZXIuXG4gICAgICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgLy8gVGhlIHVwZGF0ZWZvdW5kIGV2ZW50IGltcGxpZXMgdGhhdCByZWdpc3RyYXRpb24uaW5zdGFsbGluZyBpc1xuICAgICAgICAgICAgICAvLyBzZXQ6XG4gICAgICAgICAgICAgIC8vIGh0dHBzOi8vc2xpZ2h0bHlvZmYuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvc3BlYy9zZXJ2aWNlX3dvcmtlci9pbmRleC5odG1sI3NlcnZpY2Utd29ya2VyLWNvbnRhaW5lci11cGRhdGVmb3VuZC1ldmVudFxuICAgICAgICAgICAgICBsZXQgaW5zdGFsbGluZ1dvcmtlciA9IHJlZ2lzdHJhdGlvbi5pbnN0YWxsaW5nO1xuXG4gICAgICAgICAgICAgIGluc3RhbGxpbmdXb3JrZXIub25zdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoaW5zdGFsbGluZ1dvcmtlci5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnaW5zdGFsbGVkJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCwgdGhlIG9sZCBjb250ZW50IHdpbGwgaGF2ZSBiZWVuIHB1cmdlZCBhbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIGZyZXNoIGNvbnRlbnQgd2lsbCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGNhY2hlLlxuICAgICAgICAgICAgICAgICAgICAvLyBJdCdzIHRoZSBwZXJmZWN0IHRpbWUgdG8gZGlzcGxheSBhIFwiTmV3IGNvbnRlbnQgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlOyBwbGVhc2UgcmVmcmVzaC5cIiBtZXNzYWdlIGluIHRoZSBwYWdlJ3NcbiAgICAgICAgICAgICAgICAgICAgLy8gaW50ZXJmYWNlLlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgY2FzZSAncmVkdW5kYW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaW5zdGFsbGluZyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnc2VydmljZSB3b3JrZXIgYmVjYW1lIHJlZHVuZGFudC4nKTtcblxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgc2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uOicsIGUpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8vIFlvdXIgY3VzdG9tIEphdmFTY3JpcHQgZ29lcyBoZXJlXG5cbiAgbGV0IGFwcCA9IHdpbmRvdy5hcHAgfHwge307XG5cbiAgLy8gaG9sZCBzdHJpY3RNb2RlIGJvb2xlYW4gKGNoYW5nZSBvbiBldmVudCBzd2l0Y2gxLmNoYW5nZSlcbiAgYXBwLnN0cmljdE1vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoMScpLmNoZWNrZWQ7XG4gIC8vIGhvbGQgc2VxdWVuY2Ugb2YgdmFsdWVzIDAtM1xuICBhcHAuc2VxdWVuY2UgPSBbXTtcbiAgLy8gaW5kZXggbGlzdCBvZiBidXR0b25zIDAtM1xuICBhcHAuYnV0dG9ucyA9IFtcbiAgICAnYnV0dG9uLWdyZWVuJyxcbiAgICAnYnV0dG9uLXJlZCcsXG4gICAgJ2J1dHRvbi15ZWxsb3cnLFxuICAgICdidXR0b24tYmx1ZSdcbiAgXTtcbiAgYXBwLmdhbWVPbiA9IGZhbHNlO1xuICBhcHAucGxheWVyc1R1cm4gPSB0cnVlO1xuICAvLyBrZWVwIHRyYWNrIG9mIHBsYXllcnMgc2VxdWVuY2VcbiAgYXBwLmNvdW50ZXIgPSAwO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2gxJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgIGFwcC5zdHJpY3RNb2RlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICBjb25zb2xlLmxvZygnc3RyaWN0TW9kZTogJyArIGFwcC5zdHJpY3RNb2RlKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0LWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgYXBwLnJlc2V0R2FtZSgpO1xuICB9LCBmYWxzZSk7XG5cbiAgYXBwLnJlc2V0R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdyZXNldCcpO1xuICAgIGFwcC5nYW1lT24gPSBmYWxzZTtcbiAgICBhcHAuc2VxdWVuY2UgPSBbXTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RlcC1jb3VudGVyJykuaW5uZXJIVE1MID0gJ1N0ZXBzOiAwMCc7XG4gIH07XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0LWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgYXBwLm5leHRQbGF5KCk7XG4gIH0sIGZhbHNlKTtcblxuICBhcHAubmV4dFBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnbmV4dFBsYXknKTtcbiAgICBhcHAuY2xlYXJXaW4oKTtcbiAgICBhcHAuZ2FtZU9uID0gdHJ1ZTtcbiAgICBhcHAucGxheWVyc1R1cm4gPSBmYWxzZTtcbiAgICBhcHAuY3JlYXRlU2VxdWVuY2UoKTtcbiAgICBhcHAucGxheVNlcXVlbmNlKDApO1xuICAgIGNvbnNvbGUubG9nKGBjdXJyZW50IHNlcXVlbmNlOiAke2FwcC5zZXF1ZW5jZX1gKTtcbiAgfTtcblxuICBhcHAuY2xlYXJXaW4gPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZScpO1xuICAgIGlmICh0LmlubmVySFRNTC5lbmRzV2l0aCgnISEnKSkge1xuICAgICAgdC5pbm5lckhUTUwgPSAnU2ltb24nO1xuICAgIH1cbiAgfTtcblxuICBhcHAuc2V0dXBTcXVhcmVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzcXJDb2xsZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3F1YXJlcycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3FyQ29sbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgc3FyQ29sbGVjdGlvbi5pdGVtKGkpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXBwLnNxdWFyZUNsaWNrRXZlbnQpO1xuICAgICAgY29uc29sZS5sb2coJ2V2ZW50IGhhbmRsZXIgYWRkZWQgZm9yOiAnICsgc3FyQ29sbGVjdGlvbi5pdGVtKGkpLmlkKTtcbiAgICB9XG4gIH07XG5cbiAgYXBwLnNxdWFyZUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGFwcC5nYW1lT24gJiYgYXBwLnBsYXllcnNUdXJuKSB7XG4gICAgICBhcHAucGxheShlLnRhcmdldC5pZCk7XG4gICAgICBhcHAuaXNDb3JyZWN0KGUudGFyZ2V0LmlkKTtcbiAgICB9IGVsc2UgaWYgKCFhcHAuZ2FtZU9uKSB7XG4gICAgICBhcHAudXBkYXRlVGl0bGUoJ0dhbWUgbm90IFN0YXJ0ZWQnKTtcbiAgICB9IGVsc2UgaWYgKCFhcHAucGxheWVyc1R1cm4pIHtcbiAgICAgIGFwcC51cGRhdGVUaXRsZSgnTm90IHlvdXIgdHVybicpO1xuICAgIH1cbiAgfTtcblxuICBhcHAudXBkYXRlVGl0bGUgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgbGV0IHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUnKTtcbiAgICB0LmlubmVySFRNTCA9ICdTaW1vbiAtICcgKyBtZXNzYWdlO1xuICB9O1xuXG4gIGFwcC5pc0NvcnJlY3QgPSBmdW5jdGlvbihpZCkge1xuICAgIGxldCBpbmRleCA9IGFwcC5idXR0b25zLmluZGV4T2YoaWQpO1xuICAgIGlmIChpbmRleCA9PT0gYXBwLnNlcXVlbmNlW2FwcC5jb3VudGVyXSkge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBjb3JyZWN0OiBhcHAuY291bnRlcjoke2FwcC5jb3VudGVyfSBzZXF1ZW5jZTogJHthcHAuc2VxdWVuY2UubGVuZ3RofWApO1xuXG4gICAgICBhcHAudXBkYXRlVGl0bGUoYENvcnJlY3QgZm9yICR7YXBwLmNvdW50ZXIgKyAxfSBzdGVwc2ApO1xuXG4gICAgICBpZiAoYXBwLmNvdW50ZXIgPT09IGFwcC5zZXF1ZW5jZS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlbmQgb2Ygc2VxdWVuY2UnKTtcblxuICAgICAgICBpZiAoYXBwLnNlcXVlbmNlLmxlbmd0aCA8IDIwKSB7XG4gICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhcHAubmV4dFBsYXkoKTtcbiAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcHAudXBkYXRlVGl0bGUoXG4gICAgICAgICAgICBgQ29ycmVjdCBmb3IgJHthcHAuc2VxdWVuY2UubGVuZ3RofSBzdGVwcyEhIFlvdSBXaW4hIWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGFwcC5yZXNldEdhbWUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhcHAudXBkYXRlVGl0bGUoYFdyb25nIG9uIHN0ZXAgIyAke2FwcC5jb3VudGVyfWApO1xuICAgICAgY29uc29sZS5sb2coJ3dyb25nJyk7XG4gICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyB3cm9uZy1zcXVhcmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvdW5kLXdyb25nJykucGxheSgpO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKCcgd3Jvbmctc3F1YXJlJywgJycpO1xuICAgICAgfSwgMTAwMCk7XG5cbiAgICAgIGlmIChhcHAuc3RyaWN0TW9kZSkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBhcHAucmVzZXRHYW1lKCk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYXBwLnBsYXlTZXF1ZW5jZSgwKTtcbiAgICAgICAgfSwgMjAwMCk7XG4gICAgICB9XG4gICAgfVxuICAgIGFwcC5jb3VudGVyKys7XG4gICAgY29uc29sZS5sb2coYGNvdW50OiAke2FwcC5jb3VudGVyfWApO1xuICB9O1xuXG4gIGFwcC5wbGF5ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAvLyBnZXQgc3F1YXJlIGJ5IGlkXG4gICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIC8vIGdldCBjb2xvciBvZiBzcXVhcmUgZnJvbSBwcmVzZXQgaWQgbmFtZVxuICAgIGxldCBjb2xvciA9IGlkLnN1YnN0cig3KTtcbiAgICBjb25zb2xlLmxvZyhgaWQ6ICR7aWR9LCBzb3VuZDogJHtjb2xvcn1gKTtcblxuICAgIC8vIGFkZCBjc3MgY2xhc3MgdG8gbGlnaHRlbiBjb2xvciAod2hpdGUgYmFja2dyb3VuZCArIG9wYWNpdHkpXG4gICAgZWwuY2xhc3NOYW1lICs9ICcgc2hpZnQtY29sb3InO1xuXG4gICAgLy8gcGxheSBzb3VuZCBwcmVzZXQgaWQgY29udGFpbnMgc3BlY2lmaWVkIGZvcm1hdFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3VuZC0nICsgY29sb3IpLnBsYXkoKTtcblxuICAgIC8vIGNyZWF0ZSBhIHRpbWVyIHRvIHJldHVybiBjb2xvciB0byBub3JtYWwgMzAwbXMgaXMgZW5vdWdoIHRvIG5vdGljZVxuICAgIC8vIHNldFRpbWVvdXQgZXhlY3V0ZXMgdGhlIGZ1bmN0aW9uIGFmdGVyIHRoZSBzcGVjaWZpZWQgdGltZVxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoJyBzaGlmdC1jb2xvcicsICcnKTtcbiAgICB9LCA1MDApO1xuICB9O1xuXG4gIGFwcC5wbGF5U2VxdWVuY2UgPSBmdW5jdGlvbihpKSB7XG4gICAgaWYgKGkgPCBhcHAuc2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICBhcHAucGxheShhcHAuYnV0dG9uc1thcHAuc2VxdWVuY2VbaV1dKTtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaTogJyArIGkpO1xuICAgICAgICBhcHAucGxheVNlcXVlbmNlKGkgKyAxKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHAucGxheWVyc1R1cm4gPSB0cnVlO1xuICAgICAgYXBwLmNvdW50ZXIgPSAwO1xuICAgICAgY29uc29sZS5sb2coYGdhbWU6ICR7YXBwLmdhbWVPbn0gcGxheWVyOiAke2FwcC5wbGF5ZXJzVHVybn1gKTtcbiAgICB9XG4gIH07XG5cbiAgYXBwLmNyZWF0ZVNlcXVlbmNlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IG4gPSBnZXRSYW5kb21JbnRJbmNsdXNpdmUoMyk7XG4gICAgYXBwLnNlcXVlbmNlLnB1c2gobik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0ZXAtY291bnRlcicpLmlubmVySFRNTCA9XG4gICAgICAnU3RlcHM6ICcgKyBhcHAuc2VxdWVuY2UubGVuZ3RoO1xuICB9O1xuXG4gIC8qKlxuICAqICBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcbiAgKiAgQHBhcmFtIHtpbnRlZ2VyfSBtYXggbWF4aW11bSB2YWx1ZVxuICAqICBAcGFyYW0ge2ludGVnZXJ9IG1pbiBtaW5pbXVtIHZhbHVlXG4gICogIEByZXR1cm4ge251bWJlcn0gLSBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiAwIGFuZCBtYXggKGluY2x1c2l2ZSlcbiAgKi9cbiAgZnVuY3Rpb24gZ2V0UmFuZG9tSW50SW5jbHVzaXZlKG1heCwgbWluKSB7XG4gICAgbWluID0gbWluIHx8IDA7XG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICB9XG5cbiAgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdsb2FkZWQgamF2YXNjcmlwdCcpO1xuICAgIGFwcC5zZXR1cFNxdWFyZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH07XG59KSgpO1xuIl19
