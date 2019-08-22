// const FRAME_RATE = 30; // fps interger
const HAZARD = 100; // integer for ms, 0 for inactive
const DEFAULT_MOD = "shinny";

var canvas = document.getElementById("gol");
var ctx = canvas.getContext("2d");


function newMap() {
  map = []
  for (var i = 0; i < 100; i++) {
    var suBmap = [];
    for (var j = 0; j < 100; j++) {
      suBmap.push(Math.random() > 0.5);
    }
    map.push(suBmap)
  }
  // console.log('map generated')
  return map;
}

dataArray = newMap();

// // Change GoL String into an Array of Arrays
// var dataArray = data.split('\n').reduce((acc, cur) => {
//   return acc = [
//     ...acc,
//     Array.from(cur).map(cell => parseInt(cell))
//   ]
// }, [])

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}


function draw() {
  dataArray.forEach((line, y) => {
    line.forEach((cell, x) => {
      ctx.fillStyle = cell ? "#fff" : "#000";
      if (MODE === 'shinny') {
        ctx.fillStyle = cell ? random_rgba() : "rgba(0,0,0,0.05)";
      }
      if (MODE === 'smooth' || MODE === 'blob') {
        ctx.fillStyle = cell ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.05)";
      }
      ctx.fillRect( x * 10,  y * 10, 10, 10);
    })
  })
  // console.log('map drawn')
}

function newCycle() {
  dataArray = dataArray.reduce((res, line, y) => {
    return res = [
      ...res,
      line.map((cell, x) => {
        if (x > 0 && y > 0 && x < 99 && y < 99) { // prevent to process the edge
          let suroundings = [
            dataArray[y-1][x], // top
            dataArray[y-1][x-1], // top-left
            dataArray[y-1][x+1], // top-right
            dataArray[y][x-1], // left
            dataArray[y][x+1], // right
            dataArray[y+1][x], // bottom
            dataArray[y+1][x-1], // bottom-left
            dataArray[y+1][x+1] // bottom-right
          ]
          suroundings = suroundings.reduce((acc, cur) => acc += cur , 0);
          if (cell) {
            return cell = suroundings === 2 || suroundings === 3  ? 1 : 0;
          } else {
            return cell = suroundings === 3 ? 1 : 0;
          }
        }
      })
    ]
  }, [])

  // console.log('new cycle')
}

function toggleCell(x, y, big){
  dataArray[x][y] = !dataArray[x][y];
  if (big && dataArray[x+5] && dataArray[x-5]) {
    // DEFAULT
    dataArray[x+1][y] = !dataArray[x+1][y];//right
    dataArray[x-3][y] = !dataArray[x-3][y];//left
    dataArray[x-1][y] = !dataArray[x-1][y];//top
    dataArray[x][y+1] = !dataArray[x][y+1];//bottom
    dataArray[x+3][y] = !dataArray[x+3][y];//right
    dataArray[x-5][y] = !dataArray[x-5][y];//left
    dataArray[x][y+3] = !dataArray[x-3][y+3];//bottom

    // SMALL EXPLODER
    // dataArray[x-1][-y] = false;
    // dataArray[x+1][-y] = false;
    // dataArray[x][-y] = true;
    // dataArray[x][y] = true;
    // dataArray[x-1][y] = true;
    // dataArray[x+1][y] = true;
    // dataArray[x][y+1] = false;
    // dataArray[x-1][y+1] = true;
    // dataArray[x+1][y+1] = true;
    // dataArray[x-1][y+2] = false;
    // dataArray[x+1][y+2] = false;

    // EXPLODER
    // dataArray[x-2][y-2] = true;
    // dataArray[x-1][y-2] = false;
    // dataArray[x][y-2] = true;
    // dataArray[x+1][y-2] = false;
    // dataArray[x+2][y-2] = true;
    // //
    // dataArray[x-2][y-1] = true;
    // dataArray[x-1][y-1] = false;
    // dataArray[x][y-1] = false;
    // dataArray[x+1][y-1] = false;
    // dataArray[x+2][y-1] = true;
    // //
    // dataArray[x-2][y] = true;
    // dataArray[x-1][y] = false;
    // dataArray[x][y] = false;
    // dataArray[x+1][y] = false;
    // dataArray[x+2][y] = true;
    // //
    // dataArray[x-2][y+1] = true;
    // dataArray[x-1][y+1] = false;
    // dataArray[x][y+1] = false;
    // dataArray[x+1][y+1] = false;
    // dataArray[x+2][y+1] = true;
    // //
    // dataArray[x-2][y+2] = true;
    // dataArray[x-1][y+2] = false;
    // dataArray[x][y+2] = true;
    // dataArray[x+1][y+2] = false;
    // dataArray[x+2][y+2] = true;
  }
}

function changeMode(mode) {
  MODE = mode ? mode : DEFAULT_MOD;
  switch (MODE) {
    case 'classic':
      return canvas.style = "";
    case 'smooth':
      return canvas.style = "";
    case 'shinny':
      return canvas.style = "filter: blur(2px) contrast(10)";
    case 'blob':
      return canvas.style = "filter: blur(7px) contrast(50)";
      // return ctx.filter = "blur(7px) contrast(50)";
    default:
      return false;
  }
}

document.addEventListener('DOMContentLoaded', function() {

  changeMode();

  // hover to generate life forms
  canvas.addEventListener('mousemove', function(e){
    const x = parseInt((e.clientX - canvas.getBoundingClientRect().left) * 100 / canvas.offsetWidth)
    const y = parseInt((e.clientY - canvas.getBoundingClientRect().top) * 100 / canvas.offsetHeight)
    toggleCell(y, x, true)
  })

  // generated random life forms
  if (HAZARD) {
    const loopRand = window.setInterval(function(){
      toggleCell(parseInt(Math.random()*100), parseInt(Math.random()*100), true)
    }, HAZARD)
  }

  function loop() {
    newCycle();
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop)
  // To get the framerate working again see : https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
  // OR
  // const loop = window.setInterval(function(){
  //   newCycle();
  //   draw();
  // }, 1000/FRAME_RATE)

})
/* */
