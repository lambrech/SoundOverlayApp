window.updateAvailable = new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
        const errorMessage = `This browser doesn't support service workers`;
        console.error(errorMessage);
        reject(errorMessage);
        return;
    }

    navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
        .then(registration => {
            console.info(`Service worker registration successful (scope: ${registration.scope})`);

            registration.onupdatefound = () => {
                console.log("registration.onupdatefound is called");
                const installingServiceWorker = registration.installing;
                installingServiceWorker.onstatechange = () => {
                    console.log("installingServiceWorker.onstatechange is called. State: " + installingServiceWorker.state + ". FinalBoolCheck: " + !!navigator.serviceWorker.controller);
                    if (installingServiceWorker.state === 'installed') {
                        resolve(!!navigator.serviceWorker.controller);
                    }
                }
            };

            setInterval(() => {
                console.log("registration.update() is called");
                registration.update();
            }, 30 * 1000); // 60000ms -> check each minute
        })
        .catch(error => {
            console.error('Service worker registration failed with error:', error);
            reject(error);
        });
});

window.registerForUpdateAvailableNotification = (caller, methodName) => {
    window.updateAvailable.then(isUpdateAvailable => {
        console.log("window.updateAvailable then is called with: " + isUpdateAvailable);
        if (isUpdateAvailable) {
            caller.invokeMethodAsync(methodName).then();
        }
    });
};