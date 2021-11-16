var SCAP_FILES = [
    // SCAP v1.2 & v1.3
    'configuration.js',
    'deviceInfo.js',
    'inputSource.js',
    'power.js',
    'signage.js',
    'sound.js',
    'storage.js',
    'video.js',
    // SCAP v1.4, v1.5 & v1.6
    'security.js',
    'time.js',
    'utility.js',
    // SCAP v1.7
    'iot'
];

var SCAP_FILES_INDEX = {
    '1.0': 7,
    '2.0': 7,
    '3.0': 10,
    '3.2': 10,
    '4.0': 10,
    '4.1': 11,
    '6.0': 11
};

var SCAP_PATH_MAP = {
    '3.0': './js/scap-1.5/cordova-cd/',
    '3.2': './js/scap-1.5/cordova-cd/',
    '4.0': './js/scap-1.6/cordova-cd/',
    '4.1': './js/scap-1.7/cordova-cd/',
    '6.0': './js/scap-1.8/cordova-cd/'
};

var BUNDLE_PATH = './js/main.js';

/************************************************************************************************
 * Select SCAP API version
 ************************************************************************************************/
var webOSVersion = '';
var expectedScripts = 0;
var loadedScripts = 0;

// Create <script>
function createScript(webOSVersion) {
    expectedScripts = SCAP_FILES_INDEX[webOSVersion];
    for (var i = 0; i <= SCAP_FILES_INDEX[webOSVersion]; i++) {
        var jsPath = SCAP_PATH_MAP[webOSVersion] + SCAP_FILES[i];
        var script = document.createElement('SCRIPT');

        script.src = jsPath;
        script.onload = scriptLoaded;
        document.head.appendChild(script);

        console.log('addSCAP---------' + jsPath);
    }
}

function scriptLoaded() {
    loadedScripts += 1;
    if (loadedScripts === expectedScripts) {
        var script = document.createElement('SCRIPT');
        script.src = BUNDLE_PATH;
        document.head.appendChild(script);
    }
}

// Gets webOS Signage version
function getwebOSVersion() {
    var custom = new Custom();
    custom.Signage.getwebOSVersion(
        function successCallback(successObject) {
            webOSVersion = successObject.webOSVersion;
            console.log('webOS Signage version: ' + webOSVersion);

            switch(webOSVersion) {
                case '1.0':
                case '2.0':
                case '3.0':
                case '3.2':
                case '4.0':
                case '4.1':
                    createScript(webOSVersion);
                    break;
                default:
                    console.error('Unknown webOS Version!');
            }
        },
        function failureCallback(failureObject) {
            console.error('[' + failureObject.errorCode + ']' + failureObject.errorText);
            idcap.request("idcap://configuration/property/get", {
                parameters: {
                    key : "webos_version"
                },
                onSuccess: function (cbObject) {
                    console.log("onSuccess:", cbObject);
                },
                onFailure: function (err) {
                    console.log("onFailure:", err);
                }
            });
        }
    );
}
