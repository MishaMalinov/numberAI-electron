const buttons = document.querySelector('.buttons')
const start = document.querySelector('.start')
function DCanvas(el) {
    const ctx = el.getContext('2d', { willReadFrequently: true });
    const pixel = 20;
    let is_mouse_down = false;
    canv.width = 580;
    canv.height = 580;
    this.drawLine = function (x1, y1, x2, y2) {

        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.lineJoin = 'miter';
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();

    }

    this.drawCell = function (x, y, w, h) {
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'blue';
        ctx.lineJoin = 'miler';
        ctx.lineWidth = 1;
        ctx.rect(x, y, w, h);
        ctx.fill();

    }
    this.clear = function () {
        ctx.clearRect(0, 0, canv.width, canv.height);

    }
    this.drawGrid = function () {
        const w = canv.width;
        const h = canv.height;
        const p = w / pixel;
        const xStep = w / p;
        const yStep = h / p;
        for (let i = 0; i < w; i += xStep) {
            this.drawLine(i, 0, i, h)
        }
        for (let j = 0; j < h; j += yStep) {
            this.drawLine(0, j, w, j)
        }
    }
    el.addEventListener('mousedown', (e) => {
        is_mouse_down = true;
        ctx.beginPath();
    })
    el.addEventListener('mouseup', (e) => {
        is_mouse_down = false;
    })
    el.addEventListener('mousemove', (e) => {
        if (is_mouse_down) {
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
            ctx.lineWidth = pixel;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, pixel, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY)
        }
    })
    this.drawImage = async (img) => {
        ctx.drawImage(img, 0, 0, canv.width, canv.height);
    }
    this.calculate = (draw = false) => {
        const w = canv.width;//580
        const h = canv.height;//580
        const p = w / pixel;//580/20= 29px
        const xStep = w / p;//580 / 29 = 20
        const yStep = h / p;//580 / 29 = 20
        const vector = [];
        for (let x = 0; x < w; x += xStep) {
            for (let y = 0; y < h; y += yStep) {

                const data = ctx.getImageData(x, y, xStep, yStep);
                let nonEmptyPixelsCount = 0;
                for (let i = 0; i < data.data.length; i += 16) {
                    const isEmpty = data.data[i] === 0;
                    if (!isEmpty) {
                        nonEmptyPixelsCount += 1;
                    }
                }
                vector.push(nonEmptyPixelsCount > 1 ? 1 : 0)
            }
        }
        return vector;
    }
}

let vector = [];
let net = new brain.NeuralNetwork();
let train_data = [];
const d = new DCanvas(document.querySelector('#canv'))
const clearbtn = document.querySelector('.clear');
clearbtn.addEventListener('click', () => {
    d.clear();
})

async function addToTrainArray() {

    var inp = document.getElementById("get-files");
    let i = 0;

    async function timeout() {

        if (i == inp.files.length) {
            return new Promise(() => {
                console.log("train is ready")
                brainIt()
            });
        } else {
            return new Promise(() => {
                console.log(Math.round((i / inp.files.length) * 100))
                let urlimg = inp.files[i].name;
                urlimg = `../lil_train/${urlimg}`
                var img = new Image();
                img.src = urlimg;
                let rex = /[0-9]\./g;
                let out = urlimg.match(rex)[0][0]
                img.onload = function () {
                    d.drawImage(img).then(() => {

                        vector = d.calculate(true);

                        switch (out) {
                            case ('1'):
                                train_data.push({
                                    input: vector,
                                    output: { '1': 1 },
                                })
                                break;
                            case ('2'):
                                train_data.push({
                                    input: vector,
                                    output: { '2': 1 },
                                })
                                break;
                            case ('3'):
                                train_data.push({
                                    input: vector,
                                    output: { '3': 1 },
                                })
                                break;
                            case ('4'):
                                train_data.push({
                                    input: vector,
                                    output: { '4': 1 },
                                })
                                break;
                            case ('5'):
                                train_data.push({
                                    input: vector,
                                    output: { '5': 1 },
                                })
                                break;
                            case ('6'):
                                train_data.push({
                                    input: vector,
                                    output: { '6': 1 },
                                })
                                break;
                            case ('7'):
                                train_data.push({
                                    input: vector,
                                    output: { '7': 1 },
                                })
                                break;
                            case ('8'):
                                train_data.push({
                                    input: vector,
                                    output: { '8': 1 },
                                })
                                break;
                            case ('9'):
                                train_data.push({
                                    input: vector,
                                    output: { '9': 1 },
                                })
                                break;
                            case ('0'):
                                train_data.push({
                                    input: vector,
                                    output: { '0': 1 },
                                })
                                break;
                            default:
                                console.log(`Sorry, we are out of ${expr}.`);

                        }
                        i++;
                        timeout();
                    });
                }



            })

        }
    }

    await timeout();



}
function guess() {
    console.log(net)
    const result = brain.likely(d.calculate(), net);
    console.log(result)
    alert(result)
}
async function brainIt() {
    return new Promise(() => {
        console.log(vector)
        net.train(train_data, { log: true });
        console.log("train is over")
        buttons.classList.remove('none');
        start.classList.add('none');
        document.querySelector('.restart').classList.remove('none')
    })

}
function restart() {
    d.clear();
    net = new brain.NeuralNetwork();
    train_data = []
    buttons.classList.add('none');
    start.classList.remove('none');
    document.querySelector('.restart').classList.add('none')
}