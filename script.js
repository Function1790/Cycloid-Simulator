const HTML = {
    energy: document.getElementById("energy"),
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const O = { x: 10, y: 50 }

const PI2 = Math.PI * 2
const data = {
    G: 0.05,
    start: 0,
    end: 1 * Math.PI,
    count: 100,
    R: 250
}
data.delta = (data.end - data.start) / data.count

function Cycloid(seta) {
    return [data.R * (-seta + Math.sin(seta)), data.R * (1 - Math.cos(seta))]
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    sizeSquare() {
        return this.x ** 2 + this.y ** 2
    }
    normalized() {
        var size = Math.sqrt(this.sizeSquare())
        return new Vector(this.x / size, this.y / size)
    }
    mul(m) {
        this.x *= m
        this.y *= m
    }
    add(m) {
        this.x += m.x
        this.y += m.y
    }
    toStr() {
        return `(${this.x}, ${this.y})`
    }
}

function distance(A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function floor(v, n) {
    return Math.floor(v * 10 ** n) / 10 ** n
}

function Cyc(seta) {
    return data.R * (1 - Math.cos(seta))
}

var corr = 1
class Ball {
    constructor(color = 'rgba(255,0,0, 0.7)', funcY = Cyc) {
        this.seta = 0.1
        this.tick = 0
        this.isPlay = true
        this.color = color
        this.funcY = funcY
        this.v = 0
    }
    get x() { return data.R * -(-this.seta + Math.sin(this.seta)) }
    getx(seta) { return data.R * -(-seta + Math.sin(seta)) }
    get y() { return this.funcY(this.seta) }
    gety(seta) { return this.funcY(seta) }
    미분계수() {
        return -Math.sin(this.seta) / (Math.cos(this.seta) - 1)
    }
    move() {
        if (!this.isPlay) {
            return
        }
        var pos = { x: this.x, y: this.y }
        var s = Math.atan(this.미분계수())
        var a = s * Math.sin(s) * data.G
        this.v+=a
        //const v = Math.sqrt(data.G * data.R - data.G * (data.R - pos.y))
        this.seta += corr * this.v / data.R
        if (this.seta >= data.end) {
            this.isPlay = false
        }
        this.tick++
    }
    draw() {
        var x = this.x
        var y = this.y
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(O.x + x, O.y + y, 10, 0, PI2)
        ctx.fill()
        ctx.closePath()
    }
}
//
const EndPos = Cycloid(data.end)
const ball2 = {
    isPlay: true,
    tick: 0,
    pos: new Vector(0, 0),
    vel: new Vector(0, 0),
    sin: EndPos[1] / Math.sqrt(EndPos[0] ** 2 + EndPos[1] ** 2),
    cos: EndPos[0] / Math.sqrt(EndPos[0] ** 2 + EndPos[1] ** 2)
}

ball2.draw = () => {
    ctx.fillStyle = 'rgba(0,0,0,0.9)'
    ctx.beginPath()
    ctx.arc(ball2.pos.x + O.x, ball2.pos.y + O.y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
}

ball2.move = () => {
    if (!ball2.isPlay) {
        return
    }
    ball2.vel.add({ x: -data.G * ball2.cos, y: data.G * ball2.sin })
    ball2.pos.add(ball2.vel)
    if (ball2.pos.x >= EndPos[0] && ball2.pos.y >= EndPos[1]) {
        ball2.isPlay = false
    }
    ball2.tick++
}
//
function f3(x) {
    return x * (x - data.end) * x ** 4 + data.R * (1 - Math.cos(x))
}

const orbit = []
function drawOrbit() {
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(O.x, O.y)
    ctx.lineTo(O.x - EndPos[0], O.y + EndPos[1])
    ctx.stroke()
    ctx.closePath()
    //
    ctx.strokeStyle = 'rgb(255,50,100)'
    ctx.beginPath()
    ctx.moveTo(orbit[0][0] + O.x, [0][1] + O.y)
    for (var i = 0; i < data.count + 1; i++) {
        ctx.lineTo(-orbit[i][0] + O.x, orbit[i][1] + O.y)
    }
    ctx.stroke()
    ctx.closePath()
    //
    /*ctx.strokeStyle = 'rgb(10,205,10)'
    ctx.beginPath()
    ctx.moveTo(ball3.getx(0) + O.x, ball3.gety(0) + O.y)
    for (var j = 0; j < data.count + 1; j++) {
        var s = data.delta * j + data.start
        var pos = [ball3.getx(s), f3(s)]
        ctx.lineTo(O.x + pos[0], O.y + pos[1])
    }
    ctx.stroke()
    ctx.closePath()*/
}

for (var i = 0; i < data.count + 1; i++) {
    var seta = data.delta * i + data.start
    orbit.push(Cycloid(seta))
}

var isPlay = true
const ball1 = new Ball()
const ball3 = new Ball('rgba(10,255,10,0.6)', f3)
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawOrbit()
    ball1.draw()
    ball1.move()
    ball2.draw()
    ball2.move()
    HTML.energy.innerText = `t1=${ball1.tick}s  t2=${ball2.tick}s`
    requestAnimationFrame(render)
}

render()