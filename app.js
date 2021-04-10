import {
    Minefield
} from './minefield.js';

import {
    text,
    bg,
    bg_dark,
    bg_revealed,
    flag
} from './variables.js';

let minefield;
let total_tiles;
let mine_count;
let score = 0;

function newGame(rows,cols,mines) {
    head.textContent = 'Ready To Play';
    
    document.getElementById('newGame').style.display = 'none';
    document.getElementById('game_rows').style.display = 'none';
    document.getElementById('game_cols').style.display = 'none';
    document.getElementById('game_mines').style.display = 'none';

    minefield = new Minefield(rows, cols, mines);
    total_tiles = rows*cols;
    mine_count = mines;

    checkGame.addEventListener('click', ()=>{
        check();
    });

    createTable(minefield.field);
}


function createTable(tableData) {
    let table = document.querySelector('#main');
    table.innerHTML = "";
    let tableBody = document.createElement('tbody');

    let x = 0;

    tableData.forEach((rowData) => {
        let row = document.createElement('tr');
        row.id = x;

        rowData.forEach((cellData) => {
            let cell = document.createElement('td');
            cell.className = 'mine';
            cell.appendChild(document.createTextNode(cellData));

            cell.onclick = (elm) => {
                let x = parseInt(elm.target.parentElement.id);
                let y = elm.target.cellIndex;

                if (tableData[x][y] != "0") {
                    if (tableData[x][y] == "x") {
                        revealAll();
                        elm.target.style.color = text;
                        elm.target.style.background = flag;
                        elm.target.style.borderColor = flag;
                        changeGameState('Game Lost!');
                        return;
                    }
                    elm.target.style.color = text;
                    elm.target.headers = 'revealed';
                    increaseScore();
                    elm.target.style.background = bg;
                    
                } else {
                    reveal(tableData[x][y], x, y);
                }

                check();
            }

            cell.addEventListener('contextmenu', e => {
                e.preventDefault();
                console.log(cell.headers);
                if (cell.headers != 'revealed' && cell.style.backgroundColor != flag) {
                    cell.style.background = flag;
                    cell.style.color = flag;
                    increaseScore();
                } else if (cell.headers != 'revealed' && cell.style.backgroundColor == flag) {
                    cell.style.background = bg_dark;
                    cell.style.color = bg_dark;
                    increaseScore();
                }
            });

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
        x++;
    });

    table.appendChild(tableBody);
}

newGame(10,10,10);

document.getElementById('newGame').addEventListener('click', () => {
    let rows = document.getElementById('game_rows').value > 0 ? document.getElementById('game_rows').value : 10;
    let cols = document.getElementById('game_cols').value > 0 ? document.getElementById('game_cols').value : 10;
    let mines = document.getElementById('game_mines').value > 0 ? document.getElementById('game_mines').value: 10;
    
    newGame(rows,cols,mines)
});


function getRowElementFromIndex(index) {

    const elements = Array.from(document.getElementById('main').children[0].children);

    let carr = [];

    elements.forEach((el) => {
        if (parseInt(el.id) === index) {
            carr = Array.from(el.children);
        }
    });


    return carr;

}

function reveal(target, x, y) {
    const outVal = parseInt(target);
    if (outVal == 0) {
        for (let i = -1; i <= 1; i++) {
            let nx = x + i;
            let otherRows = getRowElementFromIndex(nx);
            for (let k = y - 1; k <= y + 1; k++) {
                if (otherRows[k] != undefined && otherRows[k].headers != "revealed" && otherRows[k].style.color != bg_revealed && otherRows[k].innerHTML == "0") {
                    otherRows[k].style.color = bg_revealed;
                    otherRows[k].style.background = bg;
                    otherRows[k].headers = 'revealed';
                    reveal(otherRows[k].innerHTML, nx, k);
                } else if (otherRows[k] != undefined && otherRows[k].innerHTML != "0") {
                    otherRows[k].style.color = text;
                    otherRows[k].style.background = bg;
                    otherRows[k].headers = 'revealed';
                }
            }
        }
    }
}

function revealAll(){
    let rows = Array.from(document.getElementById('main').children[0].children);
    rows.forEach(row => {
        let elements = Array.from(row.children);
        elements.forEach(element => {
            if (element.headers != 'revealed') {
                element.style.color = text;
                element.style.background = bg;
                element.headers = 'revealed';
            }
        });
    });

}

function check() {

    let rows = Array.from(document.getElementById('main').children[0].children);
    let total = 0;
    rows.forEach(row => {
        let elements = Array.from(row.children);
        elements.forEach(element => {
            if (element.headers == 'revealed') {
                total++;
            }
        });
    });

    let out = total_tiles - total - mine_count;
    if (out == 0) {
        revealAll();
        console.log(score);
        changeGameState('Game Won!');
    }
}

function changeGameState(state_text){
    alert(state_text);
    head.textContent = state_text;
    Array.from(document.getElementsByClassName('mine')).forEach(elm => {
        elm.onclick = () => {};
    });
    document.getElementById('newGame').style.display = '';
    document.getElementById('game_rows').style.display = '';
    document.getElementById('game_cols').style.display = '';
    document.getElementById('game_mines').style.display = '';
}

function increaseScore() {
    score += 1;
}