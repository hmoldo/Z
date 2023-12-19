class DEV {
    constructor() {
        if (navigator.setAppBadge) {
            navigator.setAppBadge();
        }
    }

    start() {
        this.requestNotificationPermission();
    }

    async requestNotificationPermission() {
        const permission = await Notification.requestPermission();
        console.log('requestNotificationPermission');
        if (permission !== 'granted') return;
        console.log('granted');
        if (navigator.setAppBadge) {
            console.log('set badge');
            // Display the number of unread messages.
            navigator.setAppBadge(1);
        }
    }

    elementsWithScrolls() {
        var getComputedStyle =
            document.body && document.body.currentStyle
                ? elem => elem.currentStyle
                : elem => document.defaultView.getComputedStyle(elem, null);

        const getActualCss = (elem, style) => getComputedStyle(elem)[style],
            // isXScrollable = elem => elem.offsetWidth < elem.scrollWidth && autoOrScroll(getActualCss(elem, 'overflow-x')),
            isYScrollable = elem =>
                elem.offsetHeight < elem.scrollHeight && autoOrScroll(getActualCss(elem, 'overflow-y')),
            autoOrScroll = text => text == 'scroll' || text == 'auto';
        // hasScroller = elem => isYScrollable(elem) || isXScrollable(elem);

        return [].filter.call(document.querySelectorAll('*'), isYScrollable);
    }

    // Delete Caches, Service Worker, Local Storage
    deleteCache() {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(name => {
                caches.delete(name).then(() => console.log('cache deleted: ' + name));
            });
            navigator.serviceWorker.getRegistrations().then(regs => {
                for (let reg of regs) reg.unregister().then(u => console.log(u));
            });
            //   localStorage.clear();
        });
    }

    testDate(dateStr = '2022-06-16 01:13:44') {
        const pathDateFormat = 'd LLLL yyyy, HH:mm:ss';
        console.log('--------- Date Test -----------');
        console.log(dateStr);
        console.log('System local timeZone: ' + Intl.DateTimeFormat().resolvedOptions().timeZone);
        console.log('No UTC');
        let dateObj = new Date(dateStr);
        console.log(dateObj);
        console.log(Z.date.format(dateObj, pathDateFormat));
        // 16 June 2022, 01:13:44
        console.log('');
        console.log('Converting string to UTC format:');
        let utcDateStr = dateStr.replace(' ', 'T') + 'Z';
        console.log(utcDateStr);
        dateObj = new Date(utcDateStr);
        console.log(dateObj);
        console.log(Z.date.format(dateObj, pathDateFormat));
        console.log('-------------------------------');
        return 'END';
    }

    // TODO: create dev per app
    moored() {
        return Object.values(App.ais.latest).filter(o => o.moored);
    }

    stopped() {
        return Object.values(App.ais.latest).filter(o => o.speed < 0.3);
    }
    moving() {
        return Object.values(App.ais.latest).filter(o => o.speed > 2);
    }
    navStat() {
        const statIDs = { 0: 'moving', 1: 'anchored', 5: 'moored' },
            stat = { moored: [], anchored: [], moving: [] };
        Object.values(App.ais.latest).forEach(n => {
            stat[statIDs[n.navStat.id]].push(n);
        });
        return stat;
    }
    latest() {
        return Object.values(App.ais.latest).sort((n, p) => p.epoch - n.epoch);
    }
    navCard() {
        return Object.values(App.ais.latest).filter(n => n.showDestination);
    }
}

export default DEV;
