const $game = document.getElementById('game')
const $score = document.getElementById('score')
const $hf = document.getElementById('hf')
const $jf = document.getElementById('jf')
const $medalha = document.getElementById('medalha')
const $trofeu = document.getElementById('trofeu')
const $level = document.getElementById('level')
const username = document.getElementById('username')
const nickname = window.localStorage.getItem('nickname')
const body = document.querySelector('body')
if (!nickname) {
    window.location.href = "index.html"
}
username.innerText = nickname
const game = {
    pontuacao: 0,
    nickname: nickname,
    frutas: 0,
    medalhas: 0,
    trofeus: 0,
}
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
    for (let index = 0; index < level * 2 + 15; index++) {
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
    for (let index = 0; index < level + 2; index++) {
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
function toggleScreen() {
    body.classList.toggle("dark")
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
var time = 300
function gameover() {
    gameOver = true
    snake.dirX = 0
    snake.dirY = 0
    const rankings = JSON.parse(window.localStorage.getItem('ranking'))
    let newRecord = false
    rankings.forEach((data, index) => {
        if (!newRecord) {
            if (game.pontuacao > data.pontuacao) {
                console.log("maior")
                rankings.splice(index,null, game)
                rankings.pop()
                newRecord = true
            }
        }
    });
    window.localStorage.setItem("ranking", JSON.stringify(rankings))
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
            } else {
                if (!gameOver) {
                    gameover()
                }
            }
            if (snake.body[0].y + snake.dirY < 17 && snake.body[0].y + snake.dirY >= 0) {
                snake.body[0].y += snake.dirY
            } else {
                if (!gameOver) {

                    gameover()
                }
            }
            snake.body.forEach((part, index) => {
                if ((snake.body[0].x == part.x && snake.body[0].y == part.y) && index != 0) {
                    if (!gameOver) {
                        gameover()
                    }
                }
            });
            if ($rows[snake.body[0].y].children[snake.body[0].x].hasChildNodes()) {
                if ($rows[snake.body[0].y].children[snake.body[0].x].classList.contains('jf')) {
                    $rows[snake.body[0].y].children[snake.body[0].x].classList.remove('jf')
                    time -= 50
                    game.pontuacao -= 3
                    $jf.innerText = parseInt($jf.innerText) + 1
                    $rows[snake.body[0].y].children[snake.body[0].x].replaceChildren(snake.body[0].obj)
                }
                if ($rows[snake.body[0].y].children[snake.body[0].x].classList.contains('hf')) {
                    $rows[snake.body[0].y].children[snake.body[0].x].classList.remove('hf')
                    $hf.innerText = parseInt($hf.innerText) + 1
                    game.frutas++
                    if(parseInt($hf.innerText) % 3 == 0){
                        game.pontuacao += 10
                    }
                    $medalha.innerText = parseInt(parseInt($hf.innerText) / 3)
                    game.medalhas = parseInt($medalha.innerText)
                    $trofeu.innerText = parseInt(parseInt($medalha.innerText) / 10)
                    game.trofeus = parseInt($trofeu.innerText)
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

                $score.innerText = game.pontuacao
            }
            snake.body.forEach((part, index) => {
                $rows[part.y].children[part.x].appendChild(part.obj)

            });


            let currentLevel = parseInt(game.pontuacao / 50)
            console.log(game.frutas)
            console.log(currentLevel)
            if (game.pontuacao % 50 >= 0 && currentLevel !== 0 && game.frutas != 0) {
                currentLevel = parseInt(currentLevel)+1
                $level.innerText = parseInt(currentLevel)
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

function toggleModal(closeModal, nextModal){
    let modal = document.getElementById(closeModal)
    modal.classList.toggle('show')
    if(nextModal){
        let newmodal = document.getElementById(nextModal)
        newmodal.classList.toggle('show')
    }
}