const http = require('http');
const https = require('https');
const fs = require('fs/promises');
const fsg = require('fs');
const crypto = require('crypto');
const uuid = require('uuid-v4');

global.profiles = JSON.parse(fsg.readFileSync("./profiles.json").toString());

function fallback(req, res) {
    res.writeHead(200);
    res.end('Kartik Content Delivery Network\n== version 1.1-5 ==============\n\nFormat:\n    https://kartikdl.cdn.minteck.org/release/<channel>/<key>/<platform>\n    https://kartikdl.cdn.minteck.org/profile/<user>\n\nchannel:\n    stable\n    eap (key required)\n    beta (key required)\n    nightly (key required)\n\nkey:\n    Use \'0\' if key is not required\n\nplatform:\n    windows\n    linux\n    darwin\n\nuser:\n    The name of the user to get profile picture\n\n(c) ' + new Date().getFullYear() + " Minteck");
}

function missing(req, res) {
    res.writeHead(400);
    res.end('400 Bad Request');
}

function forbid(req, res) {
    res.writeHead(425);
    res.end('425 Too Early');
}

function notfound(req, res) {
    res.writeHead(404);
    res.end('404 Not Found');
}

function invalid(req, res) {
    res.writeHead(401);
    res.end('401 Unauthorized (Code incorrect / Invalid key)');
}

function placeholder(req, res) {
    res.writeHead(302);
    res.end("302 Found");
}

const requestListener = function(req, res) {
    uid = uuid();
    console.log(uid);
    temp[uid] = {};
    
    req.on('end', () => {
        process.stdout.write("-");
        delete temp[uid];
        process.stdout.write("-\n");
    })

    temp[uid].url = req.url.split("?")[0].split("&")[0] + "/";
    console.log(temp[uid].url);

    if (temp[uid].url === "//") {
        fallback(req, res);
        return;
    } else {
        if (temp[uid].url.startsWith("/release/")) {
            if (temp[uid].url.startsWith("/release/stable/") || temp[uid].url.startsWith("/release/eap/") || temp[uid].url.startsWith("/release/beta/") || temp[uid].url.startsWith("/release/nightly/")) {
                temp[uid].parts = temp[uid].url.split("/").filter(i => i.trim() != "");
                console.log(temp[uid].parts);
                if (temp[uid].parts.length === 4) {

                    // Stable Release
                    if (temp[uid].parts[1] === "stable" && temp[uid].parts[2] === "0") {
                        if ((new Date("2021-06-12T13:30:00.000Z") - new Date()) < 0) {
                            if (temp[uid].parts[3] === "windows" || temp[uid].parts[3] === "linux" || temp[uid].parts[3] === "darwin") {
                                if (temp[uid].parts[3] === "windows") {
                                    var filePath = "/data-krtk/packages/stable.zip";
                                    fs.stat(filePath).then((stat) => {
                                        fs.readFile("/data-krtk/data/stable/release").then((version) => {
                                            fs.readFile("./stats/stable").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/stable", orig.toString()).then(() => { console.log("Stats updated") }); });
                                        
                                            res.writeHead(200, {
                                                'Content-Type': 'application/zip',
                                                'Content-Description': 'File Transfer',
                                                'Cache-Control': 'no-cache, must-revalidate',
                                                'Content-Disposition': 'attachment; filename="kartik-stable-' + version + '-' + temp[uid].parts[3] + '.zip"',
                                                'Expires': '0',
                                                'Content-Length': stat.size
                                            });
                                            var readStream = fsg.createReadStream(filePath);
                                            readStream.pipe(res);
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    }).catch((e) => {
                                        console.error(e);
                                        res.writeHead(500);
                                        res.end('500 Internal Server Error');
                                    });
                                } else {
                                    var filePath = "/data-krtk/packages/stable.tar.gz";
                                    fs.stat(filePath).then((stat) => {
                                        fs.readFile("/data-krtk/data/stable/release").then((version) => {
                                            fs.readFile("./stats/stable").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/stable", orig.toString()).then(() => { console.log("Stats updated") }); });
                                        
                                            res.writeHead(200, {
                                                'Content-Type': 'application/x-compressed-tar',
                                                'Content-Description': 'File Transfer',
                                                'Cache-Control': 'no-cache, must-revalidate',
                                                'Content-Disposition': 'attachment; filename="kartik-stable-' + version + '-' + temp[uid].parts[3] + '.tar.gz"',
                                                'Expires': '0',
                                                'Content-Length': stat.size
                                            });

                                            var readStream = fsg.createReadStream(filePath);
                                            readStream.pipe(res);
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    }).catch((e) => {
                                        console.error(e);
                                        res.writeHead(500);
                                        res.end('500 Internal Server Error');
                                    });
                                }
                            } else {
                                notfound(req, res);
                            }
                        } else {
                            forbid(req, res);
                        }
                    } else if (temp[uid].parts[1] === "stable") {
                        invalid(req, res);
                    }

                    // Nightly Release
                    if (temp[uid].parts[1] === "nightly") {
                        fs.readFile("/data-krtk/data/key.txt").then((key) => {
                            console.log(key.toString().trim());
                            if (temp[uid].parts[1] === "nightly" && temp[uid].parts[2].trim() === key.toString().trim()) {
                                if (temp[uid].parts[3] === "windows" || temp[uid].parts[3] === "linux" || temp[uid].parts[3] === "darwin") {
                                    if (temp[uid].parts[3] === "windows") {
                                        var filePath = "/data-krtk/packages/nightly.zip";
                                        fs.stat(filePath).then((stat) => {
                                            fs.readFile("/data-krtk/data/nightly/release").then((version) => {
                                                fs.readFile("./stats/nightly").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/nightly", orig.toString()).then(() => { console.log("Stats updated") }); });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/zip',
                                                    'Content-Description': 'File Transfer',
                                                    'Cache-Control': 'no-cache, must-revalidate',
                                                    'Content-Disposition': 'attachment; filename="kartik-nightly-' + version + '-' + temp[uid].parts[3] + '.zip"',
                                                    'Expires': '0',
                                                    'Content-Length': stat.size
                                                });

                                                var readStream = fsg.createReadStream(filePath);
                                                readStream.pipe(res);
                                            }).catch((e) => {
                                                console.error(e);
                                                res.writeHead(500);
                                                res.end('500 Internal Server Error');
                                            });
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    } else {
                                        var filePath = "/data-krtk/packages/nightly.tar.gz";
                                        fs.stat(filePath).then((stat) => {
                                            fs.readFile("/data-krtk/data/nightly/release").then((version) => {
                                                fs.readFile("./stats/nightly").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/nightly", orig.toString()).then(() => { console.log("Stats updated") }); });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/x-compressed-tar',
                                                    'Content-Description': 'File Transfer',
                                                    'Cache-Control': 'no-cache, must-revalidate',
                                                    'Content-Disposition': 'attachment; filename="kartik-nightly-' + version + '-' + temp[uid].parts[3] + '.tar.gz"',
                                                    'Expires': '0',
                                                    'Content-Length': stat.size
                                                });

                                                var readStream = fsg.createReadStream(filePath);
                                                readStream.pipe(res);
                                            }).catch((e) => {
                                                console.error(e);
                                                res.writeHead(500);
                                                res.end('500 Internal Server Error');
                                            });
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    }
                                } else {
                                    notfound(req, res);
                                }
                            } else {
                                invalid(req, res);
                            }
                        }).catch((e) => {
                            console.error(e);
                            res.writeHead(500);
                            res.end('500 Internal Server Error');
                        });
                    }


                    // EAP Release
                    if (temp[uid].parts[1] === "eap") {
                        fs.readFile("/data-krtk/data/eaps.txt").then((raw) => {
                            keys = raw.toString().split("\n").filter(i => i.trim() !== "");
                            console.log(keys);
                            if (temp[uid].parts[1] === "eap" && keys.includes(temp[uid].parts[2].trim())) {
                                if (temp[uid].parts[3] === "windows" || temp[uid].parts[3] === "linux" || temp[uid].parts[3] === "darwin") {
                                    if (temp[uid].parts[3] === "windows") {
                                        var filePath = "/data-krtk/packages/eap.zip";
                                        fs.stat(filePath).then((stat) => {
                                            fs.readFile("/data-krtk/data/eap/release").then((version) => {
                                                fs.readFile("./stats/eap").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/eap", orig.toString()).then(() => { console.log("Stats updated") }); });
                                                fs.readFile("./stats/eap-keys").then((d) => { fs.writeFile("./stats/eap-keys", d.toString().trim() + "\n" + temp[uid].parts[2].trim()).then(() => { console.log("Key logging updated") }); });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/zip',
                                                    'Content-Description': 'File Transfer',
                                                    'Cache-Control': 'no-cache, must-revalidate',
                                                    'Content-Disposition': 'attachment; filename="kartik-eap-' + version + '-' + temp[uid].parts[3] + '.zip"',
                                                    'Expires': '0',
                                                    'Content-Length': stat.size
                                                });

                                                var readStream = fsg.createReadStream(filePath);
                                                readStream.pipe(res);
                                            }).catch((e) => {
                                                console.error(e);
                                                res.writeHead(500);
                                                res.end('500 Internal Server Error');
                                            });
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    } else {
                                        var filePath = "/data-krtk/packages/eap.tar.gz";
                                        fs.stat(filePath).then((stat) => {
                                            fs.readFile("/data-krtk/data/eap/release").then((version) => {
                                                fs.readFile("./stats/eap").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/eap", orig.toString()).then(() => { console.log("Stats updated") }); });
                                                fs.readFile("./stats/eap-keys").then((d) => { fs.writeFile("./stats/eap-keys", d.toString().trim() + "\n" + temp[uid].parts[2].trim()).then(() => { console.log("Key logging updated") }); });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/x-compressed-tar',
                                                    'Content-Description': 'File Transfer',
                                                    'Cache-Control': 'no-cache, must-revalidate',
                                                    'Content-Disposition': 'attachment; filename="kartik-eap-' + version + '-' + temp[uid].parts[3] + '.tar.gz"',
                                                    'Expires': '0',
                                                    'Content-Length': stat.size
                                                });

                                                var readStream = fsg.createReadStream(filePath);
                                                readStream.pipe(res);
                                            }).catch((e) => {
                                                console.error(e);
                                                res.writeHead(500);
                                                res.end('500 Internal Server Error');
                                            });
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    }
                                } else {
                                    notfound(req, res);
                                }
                            } else {
                                invalid(req, res);
                            }
                        }).catch((e) => {
                            console.error(e);
                            res.writeHead(500);
                            res.end('500 Internal Server Error');
                        });
                    }

                    // Beta Release
                    if (temp[uid].parts[1] === "beta") {
                        fs.readFile("/data-krtk/data/key.txt").then((key) => {
                            console.log(key.toString().trim());
                            if (temp[uid].parts[1] === "beta" && temp[uid].parts[2].trim() === key.toString().trim()) {
                                if (temp[uid].parts[3] === "windows" || temp[uid].parts[3] === "linux" || temp[uid].parts[3] === "darwin") {
                                    if (temp[uid].parts[3] === "windows") {
                                        var filePath = "/data-krtk/packages/beta.zip";
                                        fs.stat(filePath).then((stat) => {
                                            fs.readFile("/data-krtk/data/beta/release").then((version) => {
                                                fs.readFile("./stats/beta").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/beta", orig.toString()).then(() => { console.log("Stats updated") }); });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/zip',
                                                    'Content-Description': 'File Transfer',
                                                    'Cache-Control': 'no-cache, must-revalidate',
                                                    'Content-Disposition': 'attachment; filename="kartik-beta-' + version + '-' + temp[uid].parts[3] + '.zip"',
                                                    'Expires': '0',
                                                    'Content-Length': stat.size
                                                });

                                                var readStream = fsg.createReadStream(filePath);
                                                readStream.pipe(res);
                                            }).catch((e) => {
                                                console.error(e);
                                                res.writeHead(500);
                                                res.end('500 Internal Server Error');
                                            });
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    } else {
                                        var filePath = "/data-krtk/packages/beta.tar.gz";
                                        fs.stat(filePath).then((stat) => {
                                            fs.readFile("/data-krtk/data/beta/release").then((version) => {
                                                fs.readFile("./stats/beta").then((d) => { orig = d.toString().trim(); orig = orig - 1 + 2; fs.writeFile("./stats/beta", orig.toString()).then(() => { console.log("Stats updated") }); });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/x-compressed-tar',
                                                    'Content-Description': 'File Transfer',
                                                    'Cache-Control': 'no-cache, must-revalidate',
                                                    'Content-Disposition': 'attachment; filename="kartik-beta-' + version + '-' + temp[uid].parts[3] + '.tar.gz"',
                                                    'Expires': '0',
                                                    'Content-Length': stat.size
                                                });

                                                var readStream = fsg.createReadStream(filePath);
                                                readStream.pipe(res);
                                            }).catch((e) => {
                                                console.error(e);
                                                res.writeHead(500);
                                                res.end('500 Internal Server Error');
                                            });
                                        }).catch((e) => {
                                            console.error(e);
                                            res.writeHead(500);
                                            res.end('500 Internal Server Error');
                                        });
                                    }
                                } else {
                                    notfound(req, res);
                                }
                            } else {
                                invalid(req, res);
                            }
                        }).catch((e) => {
                            console.error(e);
                            res.writeHead(500);
                            res.end('500 Internal Server Error');
                        });
                    }
                } else {
                    missing(req, res);
                    return;
                }
            } else {
                missing(req, res);
                return;
            }
        } else if (temp[uid].url.startsWith("/profile/")) {
            temp[uid].parts = temp[uid].url.split("/").filter(i => i.trim() != "");
            console.log(temp[uid].parts);

            if (temp[uid].parts.length === 2) {
                if (temp[uid].parts[1].length < 50) {
                    console.log(temp[uid].parts[1]);
                    if (Object.keys(profiles).includes(temp[uid].parts[1])) {
                        temp[uid].url = profiles[temp[uid].parts[1]];
                    } else {
                        temp[uid].url = "https://www.gravatar.com/avatar/" + crypto.createHash('sha1').update(temp[uid].parts[1]).digest('hex') + "?s=128px&d=retro";
                    }
                    var request = https.get(temp[uid].url, function(response) {
                        response.pipe(res);
                    }).on('error', function(err) { // Handle errors
                        res.writeHead(500);
                        res.end("500 Internal Server Error");
                        console.error(err);
                    });
                } else {
                    missing(req, res);
                    return;
                }
            } else {
                missing(req, res);
            }

            return;
        } else {
            missing(req, res);
            return;
        }
    }
}

const server = http.createServer((req, res) => {
    global.temp = {};

    try {
        requestListener(req, res);
    } catch (e) {
        console.error(e);
        res.writeHead(500);
        res.end('500 Internal Server Error');
    }
});
server.listen(8874);
