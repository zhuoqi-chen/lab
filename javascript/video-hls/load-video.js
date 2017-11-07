(function (root, factory) {

    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["loadVideo"] = factory();
    else
        root["loadVideo"] = factory();

})(this, function () {

    var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    return function (element, src) {

        var video = document.getElementById(element);
        // var notSupport = document.getElementById('not-support');

        if (Hls.isSupported()) {
            console.log('isSupported');
            var hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (isIOS) {
            console.log('isIOS');
            video.src = src;
        } else {
            alert('notSupported')
        }
    };
});