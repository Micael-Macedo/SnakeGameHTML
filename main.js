const $game = document.getElementById('game')
const $score = document.getElementById('score')
const $hf = document.getElementById('hf')
const $jf = document.getElementById('jf')
const $medalha = document.getElementById('medalha')
const $trofeu = document.getElementById('trofeu')
const $level = document.getElementById('level')

var darkFloor = false
var firstMove = false
var gameOver = false
var lastLevel = 1
for (let i = 0; i < 17; i++) {
    var dataRow = document.createElement('div')
    dataRow.classList.add("row")
    for (let j = 0; j < 15; j++) {
        darkFloor = darkFloor == false ? true : false
        if (darkFloor === true) {
            dataRow.innerHTML += `<div class="darkGreen space"></div>`
        } else {
            dataRow.innerHTML += `<div class="lightGreen space"></div>`
        }
    }
    $game.appendChild(dataRow)
}

const $rows = document.querySelectorAll('.row')
const snake = { dirX: 0, dirY: 0, body: [] }

const snakeHead = document.createElement('div')
snakeHead.innerHTML += "<div class='eye'></div><div class='eye'></div>"
snakeHead.classList.add("snake", "head")

function loadSnake() {
    var randomL = Math.floor(Math.random() * 17)
    var randomC = Math.floor(Math.random() * 15)
    snake.body.push({ x: randomC, y: randomL, obj: snakeHead })
    $rows[randomL].children[randomC].appendChild(snake.body[0].obj)

}

function loadFood() {
    let level = parseInt($level.innerText)
    for (let index = 0; index < level * 5; index++) {
        var randomL = Math.floor(Math.random() * 17)
        var randomC = Math.floor(Math.random() * 15)
        if ($rows[randomL].children[randomC].hasChildNodes()) {
            index--
        } else {
            let image = document.createElement("img")
            let randomNum = Math.floor(Math.random() * 3 + 1)
            image.src = `IMAGENS/hf/${randomNum}.png`
            $rows[randomL].children[randomC].classList.add('hf')
            $rows[randomL].children[randomC].appendChild(image)
            $rows[randomL].children[randomC].appendChild(image)
        }
    }
    for (let index = 0; index < level * 5; index++) {
        var randomL = Math.floor(Math.random() * 17)
        var randomC = Math.floor(Math.random() * 15)
        if ($rows[randomL].children[randomC].hasChildNodes()) {
            index--
        } else {
            let image = document.createElement("img")
            let randomNum = Math.floor(Math.random() * 3 + 1)
            image.src = `IMAGENS/uf/${randomNum}.png`

            $rows[randomL].children[randomC].classList.add('jf')
            $rows[randomL].children[randomC].appendChild(image)
            $rows[randomL].children[randomC].appendChild(image)

        }
    }
}
loadSnake()
loadFood()
function movement(key) {
    if (!gameOver) {
        if (key == 'ArrowUp') {
            if (snake.dirY != 1) {
                snake.dirX = 0
                snake.dirY = -1
            }
        }
        if (key == 'ArrowDown') {
            if (snake.dirY != -1) {
                snake.dirX = 0
                snake.dirY = 1
            }
        }
        if (key == 'ArrowLeft') {
            if (snake.dirX != 1) {
                snake.dirX = -1
                snake.dirY = 0
            }
        }
        if (key == 'ArrowRight') {
            if (snake.dirX != -1) {
                snake.dirX = 1
                snake.dirY = 0
            }
        }
    }

}
document.addEventListener('keydown', (e) => {
    movement(e.key)
    if (!firstMove) {
        firstMove = true
    }
})
let milisseconds = 0
setInterval(() => {
    acao()
}, 100);
var time = 500
function gameover() {
    window.alert('game over')
    gameOver = true
    snake.dirX = 0
    snake.dirY = 0
}
function acao() {
    milisseconds += 100
    if (milisseconds >= time) {
        milisseconds = 0
        if (firstMove) {
            snake.body.forEach((part, index) => {
                $rows[part.y].children[part.x].removeChild(part.obj)

            });


            for (let i = snake.body.length - 1; i > 0; i--) {
                snake.body[i].x = snake.body[i - 1].x;
                snake.body[i].y = snake.body[i - 1].y;
            }

            if (snake.body[0].x + snake.dirX < 15 && snake.body[0].x + snake.dirX >= 0) {
                snake.body[0].x += snake.dirX
            }else{
                gameover()
            }
            if (snake.body[0].y + snake.dirY < 17 && snake.body[0].y + snake.dirY >= 0) {
                snake.body[0].y += snake.dirY
            }else{
                gameover()
            }
            snake.body.forEach((part, index) => {
                if ((snake.body[0].x == part.x && snake.body[0].y == part.y) && index != 0) {
                    gameOver()
                }
            });
            if ($rows[snake.body[0].y].children[snake.body[0].x].hasChildNodes()) {
                if ($rows[snake.body[0].y].children[snake.body[0].x].classList.contains('jf')) {
                    $rows[snake.body[0].y].children[snake.body[0].x].classList.remove('jf')
                    time -= 50
                    $jf.innerText = parseInt($jf.innerText) + 1
                    $rows[snake.body[0].y].children[snake.body[0].x].replaceChildren(snake.body[0].obj)
                }
                if ($rows[snake.body[0].y].children[snake.body[0].x].classList.contains('hf')) {
                    $rows[snake.body[0].y].children[snake.body[0].x].classList.remove('hf')
                    $hf.innerText = parseInt($hf.innerText) + 1

                    $score.innerText = parseInt($score.innerText) + 10
                    $medalha.innerText = parseInt(parseInt($hf.innerText) / 3)
                    $trofeu.innerText = parseInt(parseInt($medalha.innerText) / 10)

                    let bodyPart = document.createElement("div")
                    bodyPart.classList.add('bodySnake')
                    if (snake.body.length % 2 == 0) {
                        bodyPart.classList.add('p')
                    } else {
                        bodyPart.classList.add('s')
                    }

                    $rows[snake.body[0].y].children[snake.body[0].x].replaceChildren(snake.body[0].obj)
                    snake.body.push({ x: snake.body[snake.body.length - 1].x, y: snake.body[snake.body.length - 1].y, obj: bodyPart })
                }

            }
            snake.body.forEach((part, index) => {
                $rows[part.y].children[part.x].appendChild(part.obj)

            });


            let score = parseInt($score.innerText)
            currentLevel = score / 50

            if (score % 50 == 0 && currentLevel !== 0) {
                currentLevel++
                $level.innerText = currentLevel
                if (currentLevel != lastLevel && lastLevel < 5) {
                    lastLevel = currentLevel
                    $game.classList.remove(`l${lastLevel - 1}`)
                    $game.classList.add(`l${lastLevel}`)
                    loadFood()
                }
            }

        }
    }
}

