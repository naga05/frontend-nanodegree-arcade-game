/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times. */

 /* James Long: “You need to load all your assets before starting
the game so that they can be immediately used. If you have several
images to load, you need to make a bunch of global variables.” */
(function() {
    var resourceCache = {}; // for storing image urls
    var loading = [];
    var readyCallbacks = []; // for storing functions

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly. */

     /* This loads the url of an image or an array of urls for images
    needed by the game. In relation to each image, this loader feeds
    its location to the second loader. */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly. */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function. */

     /* This is the second loader. It is called by the first.
    If this loader finds the url of an image already stored in the
    resourceCache array, it lets the game access this url instead of
    re-loading the image. */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image. */
            return resourceCache[url];
        /* If the loader doesn't find the url in the cache, it loads
        the image and adds the new url to the cache.
        Udayan: “The onload function defines a trigger for what to do
        when an image is done loading. Here, it stores the image as
        a new value in resourceCache.” Thus, the false value of
        resourceCache (see below) is changed to true.
        It then calls the isReady function, which checks if ALL the
        necessary images have finished loading. That in turn invokes
        each function in an array called readyCallbacks. */
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image. */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future. */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL. */

             /* This sets the value of the cache at false until an image
            has been loaded. For each new image, the loader associates
            the source of the image with an url. */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL. */

     /* This fetches an image url from the cache. */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded. */

     /* This is triggered when the second image loader must load a new
    image. It checks the cache to see if all the required images have
    finished loading. Its default value is true because its for loop
    will stop running ONLY when ALL necessary images have finished
    loading. If even one image has not finished loading, this function
    evaluates to false and continues the loop. */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded. */

    /* This adds a function to the readyCallbacks array. That array is
    invoked when all necessary images have finished loading. In turn,
    it will invoke the init function in engine.js, which invokes the
    main function, which makes the game run. */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object. */

    /* Udayan: “This makes several functions in engine.js available
    globally, by assigning them to a Resources object in the global
    window object.”
    I don't really understand what that means, but possibly this
    allows resources.js and app.js to access the Resources array or
    resourceCache, which is enclosed within the Engine object in the
    engine.js file. */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
