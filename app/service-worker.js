const config = require('../internals/webpack/config');
const enteringPath = process.env.ENV_TARGET;
const publicPath = config[enteringPath].output.publicPath;
const swFileName = config[enteringPath].plugins.sw.filename;

const serviceWorker = () => {
  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors.
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ) ||
    window.location.hostname.match(
      /^192\.168\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]){2}$/,
    ),
  );

  window.addEventListener('load', function () {
    if (
      'serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)
    ) {
      // // 卸载serviceWorker
      // navigator.serviceWorker.getRegistration(`${location.origin}${publicPath}service-worker.js`).then(function(registration) {
      //   if (registration) {
      //     registration.unregister().then((bool) => { // eslint-disable-line max-nested-callbacks
      //       console.log(`卸载完毕: ${bool}`);
      //     });
      //   }
      // });

      /*
      location / {
          add_header "Service-Worker-Allowed" "/";
          root /usr/share/nginx/build_routes/;
          index index.html;
          try_files $uri /tr/index.html;
      }
       */
      // 如果 nginx 不配置 Service-Worker-Allowed 的话记得将 options 去掉，否则无法使用 sw
      navigator.serviceWorker.getRegistration('/tr-portal-sw.js')
        .then((registration) => {
          if (registration && registration.unregister && /^https?:\/\/tr\..+/.test(registration.scope)) {
            registration.unregister();
          } else {
            this.sessionStorage.setItem('registration', JSON.stringify(registration));
          }
        });
      navigator.serviceWorker
        .register(`${publicPath}${swFileName}`)
        .then(function (registration) {
          // updatefound is fired if service-worker.js changes.
          registration.onupdatefound = function () {
            // updatefound is also fired the very first time the SW is installed,
            // and there's no need to prompt for a reload at that point.
            // So check here to see if the page is already controlled,
            // i.e. whether there's an existing service worker.
            if (navigator.serviceWorker.controller) {
              // The updatefound event implies that registration.installing is set
              const installingWorker = registration.installing;

              installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                  case 'installed':
                    // At this point, the old content will have been purged and the
                    // fresh content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in the page's interface.
                    break;

                  case 'redundant':
                    console.error(
                      'The installing service worker became redundant.',
                    );
                    break;
                  default:
                  // Ignore
                }
              };
            }
          };
        })
        .catch(function (e) {
          console.error('Error during service worker registration:', e);
        });
    }
  });
};

export default serviceWorker;
