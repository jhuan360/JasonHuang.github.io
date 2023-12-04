var board;
var score = 0;
var rows = 4;
var col = 4;
var moved = true;

window.onload = function()
{
    setGame();
}

function setGame()
{
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ]

    for(let r = 0; r < rows; r++)
    {
        for(let c = 0; c < col; c++)
        {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setNewTile();
    setNewTile();
}

function hasEmptyTile()
{
    for(let r = 0; r < rows; r++)
    {
        for(let c = 0; c < col; c++)
        {
            if(board[r][c] == 0)
            {
                return true;
            }
        }
    }
    return false;
}   

function setNewTile()
{
    if(!hasEmptyTile())
    {
        return;
    }

    if(!moved)
    {
        return;
    }

    let twoOrFour = Math.floor(Math.random() * 2);
    if(twoOrFour == 0)
    {
        setTwo();
    } else {
        setFour();
    }
}

function setTwo()
{   
    let found = false;
    while(!found)
    {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * col);

        if(board[r][c] == 0)
        {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function setFour()
{
    let found = false;
    while(!found)
    {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * col);

        if(board[r][c] == 0)
        {
            board[r][c] = 4;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "4";
            tile.classList.add("x4");
            found = true;
        }
    }
}

function updateTile(tile, num)
{
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if(num > 0)
    {
        tile.innerText = num;
        if(num <= 2048)
        {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x\>2048");
        }
    }
}

document.addEventListener("keyup", (e) =>
{
    if(e.code == "ArrowLeft")
    {
        slideLeft();
        setNewTile();
        checkGameStatus();
    }
    else if(e.code == "ArrowRight")
    {
        slideRight();
        setNewTile();
        checkGameStatus();
    }
    else if(e.code == "ArrowUp")
    {
        slideUp();
        setNewTile();
        checkGameStatus();
    }
    else if(e.code == "ArrowDown")
    {
        slideDown();
        setNewTile();
        checkGameStatus();
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row)
{
    return row.filter(num => num != 0);
}

function slide(row)
{
    let tempRow = [...row];
    row = filterZero(row);
    for(let i = 0; i < row.length-1; i++)
    {
        if(row[i] == row[i+1])
        {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    while(row.length < col)
    {
        row.push(0);
    }

    for(let i = 0; i < row.length; i++)
    {
        if(row[i] != tempRow[i])
        {
            moved = true;
        }
    }

    return row;
}

function slideLeft()
{
    moved = false;
    for(let r = 0; r < rows; r++)
    {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for(let c = 0; c < col; c++)
        {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight()
{
    moved = false;
    for(let r = 0; r < rows; r++)
    {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < col; c++)
        {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp()
{
    moved = false;
    for(let c = 0; c < col; c++)
    {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        
        for(let r = 0; r < rows; r++)
        {
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown()
{
    moved = false;
    for(let c = 0; c < col; c++)
    {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        
        for(let r = 0; r < rows; r++)
        {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function showGameOverModal() {
    const modal = document.getElementById("game-over-modal");
    modal.style.display = "flex";
    document.getElementById("board").style.opacity = "0.7";
}

function hideGameOverModal() {
    const modal = document.getElementById("game-over-modal");
    modal.style.display = "none";
    location.reload();
}

function tryAgain() {
    hideGameOverModal();
}

function gameOver()
{
    if(hasEmptyTile())
    {
        return false;
    }

    for(let r = 0; r < rows-1; r++)
    {
        for(let c = 0; c < col-1; c++)
        {
            if(board[r][c] == board[r][c+1] || board[r][c] == board[r+1][c])
            {
                return false;
            }
        }
    }

    for(let i = 0; i < 3; i++)
    {
        if(board[3][i] == board[3][i+1] || board[i][3] == board[i+1][3])
        {
            return false;
        }
    }

    return true;
}

function checkGameStatus()
{
    if(gameOver())
    {
        showGameOverModal();
    }
}