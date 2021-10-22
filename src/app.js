var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var City = /** @class */ (function () {
    function City(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
    return City;
}());
function distanceSquared(c1, c2) {
    var dx = c1.x - c2.x;
    var dy = c1.y - c2.y;
    return dx * dx + dy * dy;
}
function distance(c1, c2) {
    return Math.sqrt(distanceSquared(c1, c2));
}
function generateRandomMap(numcities, width, height) {
    var citylist = [];
    var THRESHOLD = (width * width + height * height) / ((1 + numcities) * (1 + numcities));
    var fails = 0;
    var _loop_1 = function () {
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        var candidateCity = new City("Alexandria-" + (citylist.length + 1), x, y);
        var distancesqrs = citylist.map(function (c) {
            return distanceSquared(c, candidateCity);
        });
        var mindistsq = Math.min.apply(Math, distancesqrs);
        if (mindistsq > THRESHOLD) {
            citylist.push(candidateCity);
            fails = 0;
        }
        else {
            fails += 1;
        }
        if (fails > 1000) {
            throw new Error("Too many cities to fit neatly into current size");
        }
    };
    while (citylist.length < numcities) {
        _loop_1();
    }
    return citylist;
}
function pathDistance(path) {
    var d = 0.0;
    for (var i = 0; i < path.length - 1; i++) {
        d += distance(path[i], path[i + 1]);
    }
    return d;
}
var currentGenCanvas = document.getElementById("currentGen");
var currentGenCtx = currentGenCanvas.getContext("2d");
var currentBestCanvas = document.getElementById("bestYet");
var currentBestCtx = currentBestCanvas.getContext("2d");
var numcitiesInput = document.getElementById("numcities");
var generateMapButton = document.getElementById("generateMapButton");
var startGAButton = document.getElementById("startGAButton");
var parentsDiv = document.getElementById("parents");
var crossoverDiv = document.getElementById("crossover");
var consoleDiv = document.getElementById("console");
var popSizeInput = document.getElementById("popsize");
var mutationRateInput = document.getElementById("mrate");
var configContainer = document.getElementById("config");
var bestYetLabel = document.getElementById('bylabel');
var stopGAButton = document.getElementById('stopGAButton');
var ANIMATIONSTATE = "unstarted";
var CITYLIST = [];
var BESTPATH = [];
var MUTATIONRATE = 0.3;
var POPCAP = 20;
var GENS = Infinity;
function drawCityList(citylist, cnv) {
    var ctx = cnv.getContext("2d");
    for (var _i = 0, citylist_1 = citylist; _i < citylist_1.length; _i++) {
        var city = citylist_1[_i];
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        var _a = [city.x - city.name.length, city.y - 16], textx = _a[0], texty = _a[1];
        if (city.x < 20) {
            textx = city.x + city.name.length;
        }
        if (city.y < 16) {
            texty = city.y + 16;
        }
        ctx.fillText(city.name, textx, texty);
    }
}
function clearCanvas(cnv) {
    var ctx = cnv.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}
function drawPath(citylist, cnv, color, wait) {
    if (wait === void 0) { wait = false; }
    return __awaiter(this, void 0, void 0, function () {
        var ctx, pathlength, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx = cnv.getContext("2d");
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    pathlength = citylist.length;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < pathlength - 1)) return [3 /*break*/, 4];
                    ctx.beginPath();
                    ctx.moveTo(citylist[i].x, citylist[i].y);
                    ctx.lineTo(citylist[(i + 1) % pathlength].x, citylist[(i + 1) % pathlength].y);
                    // ctx.closePath();
                    ctx.stroke();
                    if (!wait) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
generateMapButton.addEventListener("click", function (e) {
    configContainer.innerHTML = '';
    ANIMATIONSTATE = "unstarted";
    if (!numcitiesInput.value) {
        alert("Enter a value for numcities");
    }
    var numcities = parseInt(numcitiesInput.value);
    var citylist = generateRandomMap(numcities, currentGenCanvas.width, currentGenCanvas.height);
    CITYLIST = citylist;
    clearCanvas(currentGenCanvas);
    drawCityList(citylist, currentGenCanvas);
    clearCanvas(currentBestCanvas);
    drawCityList(citylist, currentBestCanvas);
    POPCAP = parseInt(popSizeInput.value);
    MUTATIONRATE =
        mutationRateInput.valueAsNumber / parseFloat(mutationRateInput.max);
    var currentConfig = JSON.stringify({ population: POPCAP, mutationRate: MUTATIONRATE, cities: CITYLIST }, null, "\t");
    var configDisplay = document.createElement("pre");
    configDisplay.innerHTML = currentConfig;
    configContainer.appendChild(configDisplay);
});
mutationRateInput.addEventListener('change', function (e) {
    MUTATIONRATE =
        mutationRateInput.valueAsNumber / parseFloat(mutationRateInput.max);
});
function shuffle(arr) {
    var copy = __spreadArray([], arr, true);
    copy.sort(function (a, b) { return Math.random() - 0.5; });
    return copy;
}
function crossover(mother, father) {
    var child = [];
    var motherinfluence = Math.random() * mother.length;
    for (var i = 0; i < motherinfluence; i++) {
        child.push(mother[i]);
    }
    for (var i = 0; i < father.length; i++) {
        if (!child.includes(father[i])) {
            child.push(father[i]);
        }
    }
    if (child.length != CITYLIST.length) {
        throw new Error("something wrong with crossover");
    }
    return child;
}
function mutate(individual, rate) {
    var mutated = __spreadArray([], individual, true);
    for (var i = 0; i < mutated.length; i++) {
        if (Math.random() < rate) {
            var j = Math.floor(Math.random() * mutated.length);
            var temp = mutated[i];
            mutated[i] = mutated[j];
            mutated[j] = temp;
        }
    }
    return mutated;
}
startGAButton.addEventListener("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
    var genes, i, gwc, _loop_2, i, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ANIMATIONSTATE = "running";
                genes = [];
                for (i = 0; i < POPCAP; i++) {
                    genes[i] = shuffle(CITYLIST);
                }
                BESTPATH = genes[0];
                gwc = 0;
                _loop_2 = function (i) {
                    var _i, genes_1, path, color, _b, air1, air1marks, color, statusContainer, CGBstatus, GWCstatus, children, i_1, j, lucky_child;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                // Draw all paths in current generation
                                clearCanvas(currentGenCanvas);
                                drawCityList(CITYLIST, currentGenCanvas);
                                for (_i = 0, genes_1 = genes; _i < genes_1.length; _i++) {
                                    path = genes_1[_i];
                                    color = {
                                        h: Math.floor(Math.random() * 360),
                                        s: Math.floor(Math.random() * 100),
                                        l: 50 + Math.floor(Math.random() * 50)
                                    };
                                    drawPath(path, currentGenCanvas, "hsla(" + color.h + ", " + color.s + "%, " + color.l + "%, 0.15)");
                                }
                                _b = genes
                                    .map(function (g) {
                                    return { gene: g, length: pathDistance(g) };
                                })
                                    .reduce(function (p, c) { return (p.length > c.length ? c : p); }), air1 = _b.gene, air1marks = _b.length;
                                if (air1marks < pathDistance(BESTPATH)) {
                                    console.log("Updating best path");
                                    BESTPATH = __spreadArray([], air1, true);
                                    color = {
                                        h: Math.floor(Math.random() * 360),
                                        s: Math.floor(Math.random() * 100),
                                        l: 50 + Math.floor(Math.random() * 50)
                                    };
                                    clearCanvas(currentBestCanvas);
                                    drawCityList(CITYLIST, currentBestCanvas);
                                    drawPath(BESTPATH, currentBestCanvas, "hsla(" + color.h + ", " + color.s + "%, " + color.l + "%, 1)");
                                    gwc = 0;
                                }
                                else {
                                    gwc += 1;
                                }
                                statusContainer = document.createElement("div");
                                CGBstatus = document.createElement("p");
                                GWCstatus = document.createElement("p");
                                CGBstatus.innerText += "[INFO] Current Generation (" + (i + 1) + ") Best: " + air1marks + "\n";
                                GWCstatus.innerText += "[INFO] Generations since last change: " + gwc + "\n";
                                GWCstatus.appendChild(document.createElement("br"));
                                if (gwc > CITYLIST.length * CITYLIST.length - 1) {
                                    GWCstatus.innerHTML += "<br>[INFO] More than " + (CITYLIST.length * CITYLIST.length - 1) + " generations since last change\n";
                                }
                                statusContainer.appendChild(CGBstatus);
                                statusContainer.appendChild(GWCstatus);
                                return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 400); })];
                            case 1:
                                _c.sent();
                                children = [];
                                for (i_1 = 0; i_1 < POPCAP; i_1++) {
                                    for (j = i_1 + 1; j < POPCAP; j++) {
                                        children.push(crossover(genes[i_1], genes[j]));
                                    }
                                }
                                // Selection procedure
                                // Sort by path length
                                children.sort(function (a, b) { return pathDistance(a) - pathDistance(b); });
                                lucky_child = children[Math.floor(Math.random() * children.length)];
                                // Select top POPCAP - 1
                                children = children.splice(0, POPCAP - 1);
                                // One lucky child graduates with no strings attached
                                children.push(lucky_child);
                                // Mutate
                                children = children.map(function (c, i) {
                                    var potluck = 3 + Math.random() * (children.length - 3);
                                    if (i < potluck) {
                                        return mutate(c, MUTATIONRATE / potluck);
                                    }
                                    else {
                                        return mutate(c, MUTATIONRATE);
                                    }
                                });
                                // Assign to next generation
                                genes = __spreadArray([], children, true);
                                // Log status
                                consoleDiv.appendChild(statusContainer);
                                bestYetLabel.innerText = "Best Yet " + pathDistance(BESTPATH);
                                consoleDiv.scrollTop = consoleDiv.scrollHeight;
                                if (gwc > CITYLIST.length * CITYLIST.length - 1) {
                                    return [2 /*return*/, "break"];
                                }
                                if (ANIMATIONSTATE != "running") {
                                    return [2 /*return*/, "break"];
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < GENS)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_2(i)];
            case 2:
                state_1 = _a.sent();
                if (state_1 === "break")
                    return [3 /*break*/, 4];
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                ANIMATIONSTATE = "stopped";
                return [2 /*return*/];
        }
    });
}); });
stopGAButton.addEventListener('click', function (e) {
    ANIMATIONSTATE = 'stopped';
    CITYLIST = [];
    clearCanvas(currentBestCanvas);
    clearCanvas(currentGenCanvas);
    consoleDiv.innerText = '';
    configContainer.innerHTML = '';
});
