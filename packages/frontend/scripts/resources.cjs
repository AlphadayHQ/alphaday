const run = require("cordova-res");

run({
    platforms: {
        android: { icon: { sources: ["resources/icon.png"] } },
        ios: { splash: { sources: ["resources/splash.png"] } },
    },
});
