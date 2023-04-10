const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');



const flappyImg = new Image();
flappyImg.src = 'img/flappy_dunk.png';


// Constantes do Jogo

const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;


// variaveis passaro

let birdX = 50;
let birdY = 50;
let birdVelocity = 0.2;
let birdAcceleration = 0.2;


// variaveis do cano

let pipeX = 400;
let pipeY = canvas.height - 200;

// variaveis do placar e do placar mais alto

let scoreDiv = document.getElementById('score-display');
let score = 0;
let hightScore = 0;

//vamos adicionar uma variavel bool, para checar quando flappy
//passar vamos incrementar
let scored = false;

// vamos controlar o passaro com a tecla espaço
document.body.onkeyup = function(e){
    if(e.code == 'Space'){
        birdVelocity = FLAP_SPEED;
    }
}

//vamos reiniciar o jogo se o passaro acertar o cano
document.getElementById('restart').addEventListener('click', function(){
    hideEndMenu();
    resetGame();
    loop();
});

function increaseScore(){
// incrementando nosso contador quando o passaro passar os canos
if(birdX > pipeX + PIPE_WIDTH && 
    (birdY < pipeY + PIPE_GAP || 
      birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
      !scored) {
    score++;
    scoreDiv.innerHTML = score;
    scored = true;
}

if (birdX < pipeX + PIPE_WIDTH) {
    scored = false;
}

}

function collisionCheck(){
    // criando delimitador de area pro passaro e pros canos

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // verificação para colisão com area superior do cano
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // verificação para colisão com a area inferior do cano
    if(birdBox.x + birdBox.width > bottomPipeBox.x && 
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width && 
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
        }

    // verificação se o passaro acertar os delimitadores
    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}


function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // a maneira de sempre atualizar nossa maior pontuação no fim do nosso jogo
    // se tivermos uma pontuação maior que a melhor pontuação anterior
    if(hightScore < score) {
       hightScore = score;
    }
    document.getElementById('best-score').innerHTML = hightScore;
}

// vamos reiniciar os valores quando iniciar
// com o passaro no inicio

function resetGame(){
    

    birdX = 50;
    birdY = 50;
    birdVelocity = 0.2;
    birdAcceleration = 0.2;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0; 
    scoreDiv.innerHTML = 0
    
}

function endGame(){
    showEndMenu();
}

function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // desenhar flappy bird

    ctx.drawImage(flappyImg, birdX, birdY);

    // desenhar canos
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // agora precisamos adicionar a checagem de colisão na nossa tela de menu final
    // e final de jogo
    // a checagem de colisão ira nos retornar se foi verdadeira a colisão
    // caso contrario falso
    if(collisionCheck()) {
        endGame();
        return;
    }

    // criando a movimentação dos canos
    pipeX -= 1.5;
    // se a movimentação do cano for fora do frame(quadro) precissamos 
    //resetar o cano

    if (pipeX < -50) {
       pipeX = 400;
       pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // aplicar gravidade pro passaro se mover

        birdVelocity += birdAcceleration;
        birdY += birdVelocity;

    increaseScore()
    requestAnimationFrame(loop);
}
loop();
