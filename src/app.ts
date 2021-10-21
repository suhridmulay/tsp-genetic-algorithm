class City {
    name: string;
    x: number;
    y: number;

    constructor(name: string, x: number, y: number) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

function distanceSquared(c1: City, c2: City) {
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;
    return dx * dx + dy * dy;
}

function distance(c1: City, c2: City) {
    return Math.sqrt(distanceSquared(c1, c2));
}

function generateRandomMap(numcities: number, width: number, height: number) {
    let citylist: City[] = [];
    const THRESHOLD =
        (width * width + height * height) / ((1 + numcities) * (1 + numcities));
    let fails = 0;
    while (citylist.length < numcities) {
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
        let candidateCity = new City(`Alexandria-${citylist.length + 1}`, x, y);
        let distancesqrs = citylist.map((c) =>
            distanceSquared(c, candidateCity)
        );
        let mindistsq = Math.min(...distancesqrs);
        if (mindistsq > THRESHOLD) {
            citylist.push(candidateCity);
            fails = 0;
        } else {
            fails += 1;
        }
        if (fails > 1000) {
            throw new Error("Too many cities to fit neatly into current size");
        }
    }
    return citylist;
}

function pathDistance(path: City[]) {
    let d = 0.0;
    for (let i = 0; i < path.length - 1; i++) {
        d += distance(path[i], path[i + 1]);
    }
    return d;
}

const currentGenCanvas: HTMLCanvasElement = document.getElementById(
    "currentGen"
) as HTMLCanvasElement;
const currentGenCtx = currentGenCanvas.getContext("2d");
const currentBestCanvas: HTMLCanvasElement = document.getElementById(
    "bestYet"
) as HTMLCanvasElement;
const currentBestCtx = currentBestCanvas.getContext("2d");

const numcitiesInput: HTMLInputElement = document.getElementById(
    "numcities"
) as HTMLInputElement;
const generateMapButton: HTMLButtonElement = document.getElementById(
    "generateMapButton"
) as HTMLButtonElement;
const startGAButton: HTMLButtonElement = document.getElementById(
    "startGAButton"
) as HTMLButtonElement;

const parentsDiv: HTMLDivElement = document.getElementById(
    "parents"
) as HTMLDivElement;
const crossoverDiv: HTMLDivElement = document.getElementById(
    "crossover"
) as HTMLDivElement;
const consoleDiv: HTMLDivElement = document.getElementById(
    "console"
) as HTMLDivElement;
const popSizeInput: HTMLInputElement = document.getElementById(
    "popsize"
) as HTMLInputElement;
const mutationRateInput: HTMLInputElement = document.getElementById(
    "mrate"
) as HTMLInputElement;
const configContainer: HTMLDivElement = document.getElementById(
    "config"
) as HTMLDivElement;
const bestYetLabel: HTMLHeadingElement = document.getElementById('bylabel') as HTMLHeadingElement;
const stopGAButton: HTMLButtonElement = document.getElementById('stopGAButton') as HTMLButtonElement;

let ANIMATIONSTATE: "unstarted" | "stopped" | "running" = "unstarted";

let CITYLIST: City[] = [];
let BESTPATH: City[] = [];
let MUTATIONRATE = 0.3;
let POPCAP = 20;
const GENS = Infinity;

function drawCityList(citylist: City[], cnv: HTMLCanvasElement) {
    let ctx: CanvasRenderingContext2D = cnv.getContext("2d");
    for (let city of citylist) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        let [textx, texty] = [city.x - city.name.length, city.y - 16];
        if (city.x < 20) {
            textx = city.x + city.name.length;
        }
        if (city.y < 16) {
            texty = city.y + 16;
        }
        ctx.fillText(city.name, textx, texty);
    }
}

function clearCanvas(cnv: HTMLCanvasElement) {
    let ctx: CanvasRenderingContext2D = cnv.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}

async function drawPath(
    citylist: City[],
    cnv: HTMLCanvasElement,
    color: string,
    wait = false
) {
    let ctx = cnv.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    let pathlength = citylist.length;
    for (let i = 0; i < pathlength - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(citylist[i].x, citylist[i].y);
        ctx.lineTo(
            citylist[(i + 1) % pathlength].x,
            citylist[(i + 1) % pathlength].y
        );
        // ctx.closePath();
        ctx.stroke();
        if (wait) {
            await new Promise((r) => setTimeout(r, 500));
        }
    }
}

generateMapButton.addEventListener("click", (e) => {
    ANIMATIONSTATE = "unstarted";
    if (!numcitiesInput.value) {
        alert("Enter a value for numcities");
    }
    let numcities = parseInt(numcitiesInput.value);
    let citylist = generateRandomMap(
        numcities,
        currentGenCanvas.width,
        currentGenCanvas.height
    );
    CITYLIST = citylist;
    clearCanvas(currentGenCanvas);
    drawCityList(citylist, currentGenCanvas);
    clearCanvas(currentBestCanvas);
    drawCityList(citylist, currentBestCanvas);
    POPCAP = parseInt(popSizeInput.value);
    MUTATIONRATE =
        mutationRateInput.valueAsNumber / parseFloat(mutationRateInput.max);

    let currentConfig = JSON.stringify(
        { population: POPCAP, mutationRate: MUTATIONRATE, cities: CITYLIST },
        null,
        "\t"
    );
    let configDisplay = document.createElement("pre");
    configDisplay.innerHTML = currentConfig;
    configContainer.appendChild(configDisplay);
});

mutationRateInput.addEventListener('change', (e) => {
    MUTATIONRATE =
        mutationRateInput.valueAsNumber / parseFloat(mutationRateInput.max);
})

function shuffle(arr: any[]) {
    let copy = [...arr];
    copy.sort((a, b) => Math.random() - 0.5);
    return copy;
}

function crossover(mother: City[], father: City[]) {
    let child: City[] = [];
    let motherinfluence = Math.random() * mother.length;
    for (let i = 0; i < motherinfluence; i++) {
        child.push(mother[i]);
    }
    for (let i = 0; i < father.length; i++) {
        if (!child.includes(father[i])) {
            child.push(father[i]);
        }
    }
    if (child.length != CITYLIST.length) {
        throw new Error("something wrong with crossover");
    }
    return child;
}

function mutate(individual: City[], rate: number) {
    let mutated = [...individual];
    for (let i = 0; i < mutated.length; i++) {
        if (Math.random() < rate) {
            let j = Math.floor(Math.random() * mutated.length);
            let temp = mutated[i];
            mutated[i] = mutated[j];
            mutated[j] = temp;
        }
    }
    return mutated;
}

startGAButton.addEventListener("click", async (e) => {
    ANIMATIONSTATE = "running";
    let genes: City[][] = [];
    for (let i = 0; i < POPCAP; i++) {
        genes[i] = shuffle(CITYLIST);
    }
    BESTPATH = genes[0];
    let gwc = 0;
    for (let i = 0; i < GENS; i++) {
        // Draw all paths in current generation
        clearCanvas(currentGenCanvas);
        drawCityList(CITYLIST, currentGenCanvas);
        for (let path of genes) {
            let color = {
                h: Math.floor(Math.random() * 360),
                s: Math.floor(Math.random() * 100),
                l: 50 + Math.floor(Math.random() * 50),
            };
            drawPath(
                path,
                currentGenCanvas,
                `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.15)`
            );
        }

        let { gene: air1, length: air1marks } = genes
            .map((g) => {
                return { gene: g, length: pathDistance(g) };
            })
            .reduce((p, c) => (p.length > c.length ? c : p));

        if (air1marks < pathDistance(BESTPATH)) {
            console.log(`Updating best path`);
            BESTPATH = [...air1];
            let color = {
                h: Math.floor(Math.random() * 360),
                s: Math.floor(Math.random() * 100),
                l: 50 + Math.floor(Math.random() * 50),
            };
            clearCanvas(currentBestCanvas);
            drawCityList(CITYLIST, currentBestCanvas);
            drawPath(
                BESTPATH,
                currentBestCanvas,
                `hsla(${color.h}, ${color.s}%, ${color.l}%, 1)`
            );
            gwc = 0;
        } else {
            gwc += 1;
        }

        let statusContainer = document.createElement("div");
        let CGBstatus = document.createElement("p");
        let GWCstatus = document.createElement("p");
        CGBstatus.innerText += `[INFO] Current Generation (${i + 1}) Best: ${air1marks}\n`;
        GWCstatus.innerText += `[INFO] Generations since last change: ${gwc}\n`;
        GWCstatus.appendChild(document.createElement("br"));
        if (gwc > CITYLIST.length * CITYLIST.length - 1) {
            GWCstatus.innerHTML += `<br>[INFO] More than ${
                CITYLIST.length * CITYLIST.length - 1
            } generations since last change\n`;
        }
        statusContainer.appendChild(CGBstatus);
        statusContainer.appendChild(GWCstatus);

        await new Promise((r) => setTimeout(r, 400));

        // Generate  children
        let children: City[][] = [];
        for (let i = 0; i < POPCAP; i++) {
            for (let j = i + 1; j < POPCAP; j++) {
                children.push(crossover(genes[i], genes[j]));
            }
        }

        // Selection procedure
        // Sort by path length
        children.sort((a, b) => pathDistance(a) - pathDistance(b));
        let lucky_child = children[Math.floor(Math.random() * children.length)]
        // Select top POPCAP - 1
        children = children.splice(0, POPCAP - 1);
        // One lucky child graduates with no strings attached
        children.push(lucky_child);

        // Mutate
        children = children.map((c, i) => {
            let potluck = 3 + Math.random() * (children.length - 3);
            if (i < potluck) {
                return mutate(c, MUTATIONRATE / potluck);
            } else {
                return mutate(c, MUTATIONRATE);
            }
        });

        // Assign to next generation
        genes = [...children];

        // Log status
        consoleDiv.appendChild(statusContainer);
        bestYetLabel.innerText = `Best Yet ${pathDistance(BESTPATH)}`;
        consoleDiv.scrollTop = consoleDiv.scrollHeight;

        if (gwc > CITYLIST.length * CITYLIST.length - 1) {
            break;
        }

        if (ANIMATIONSTATE != "running") {
            break;
        }
    }

    ANIMATIONSTATE = "stopped";
});

stopGAButton.addEventListener('click', (e) => {
    ANIMATIONSTATE = 'stopped';
    CITYLIST = [];
    clearCanvas(currentBestCanvas);
    clearCanvas(currentGenCanvas);
    consoleDiv.innerText = '';
    configContainer.innerHTML = '';
})
