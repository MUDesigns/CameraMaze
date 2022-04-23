/* Author: Matt Nyce
   Date: 4/23/2022

   This final project was a lot of fun. I enjoyed working with the other students and getting to know them.
   I personally spent a whole lot of time making the map editor I included in the grid.html file along with 
   mapEditor.js. I hope the other students were able to take advantage of this. Thank you for giving me the
   opportunity to enjoy this course and this project. I hope you enjoy this project as much as I enjoyed
   creating it.
   
*/

const Game = function () {
  //global variables
  const twoPi = Math.PI * 2;

  const raycaster = {
    init: function () {
      this.maxDistance = Math.sqrt(minimap.cellsAcross * minimap.cellsAcross + minimap.cellsDown * minimap.cellsDown);
      let numberOfRays = 300;
      let angleBetweenRays = .2 * Math.PI / 180;
      this.castRays = function () {
        foregroundSlivers = [];
        backgroundSlivers = [];
        minimap.rays = [];
        dino.show = false;
        for (let i = 0; i < numberOfRays; i++) {
          let rayNumber = -numberOfRays / 2 + i;
          let rayAngle = angleBetweenRays * rayNumber + player.angle;
          this.castRay(rayAngle, i);
        }
      }
      this.castRay = function (rayAngle, i) {
        rayAngle %= twoPi;
        if (rayAngle < 0) rayAngle += twoPi;
        let right = (rayAngle > twoPi * 0.75 || rayAngle < twoPi * 0.25);
        let up = rayAngle > Math.PI;
        let slope = Math.tan(rayAngle);
        let distance = 0;
        let xHit = 0;
        let yHit = 0;
        let wallX;
        let wallY;
        let dX = right ? 1 : -1;
        let dY = dX * slope;
        let x = right ? Math.ceil(player.x) : Math.floor(player.x);
        let y = player.y + (x - player.x) * slope;
        let wallType;
        while (x >= 0 && x < minimap.cellsAcross && y >= 0 && y < minimap.cellsDown) {
          wallX = Math.floor(x + (right ? 0 : -1));
          wallY = Math.floor(y);
          if (map[wallY][wallX] > -1) {
            let distanceX = x - player.x;
            let distanceY = y - player.y;
            distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            xHit = x;
            yHit = y;
            wallType = map[wallY][wallX];
            break;
          } else {
            if (dino.x === wallX && dino.y === wallY) {
              dino.show = true;
            };
          }
          x += dX;
          y += dY;
        }
        slope = 1 / slope;
        dY = up ? -1 : 1;
        dX = dY * slope;
        y = up ? Math.floor(player.y) : Math.ceil(player.y);
        x = player.x + (y - player.y) * slope;
        while (x >= 0 && x < minimap.cellsAcross && y >= 0 && y < minimap.cellsDown) {
          wallY = Math.floor(y + (up ? -1 : 0));
          wallX = Math.floor(x);
          if (map[wallY][wallX] > -1) {
            let distanceX = x - player.x;
            let distanceY = y - player.y;
            let blockDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (!distance || blockDistance < distance) {
              distance = blockDistance;
              xHit = x;
              yHit = y;
              wallType = map[wallY][wallX];
            }
            break;
          } else {
            if (dino.x === wallX && dino.y === wallY) {
              dino.show = true;
            };
          }
          x += dX;
          y += dY;
        }
        if (dino.show === true) {
          let dinoDistanceX = dino.x + .5 - player.x;
          let dinoDistanceY = dino.y + .5 - player.y;
          dino.angle = Math.atan(dinoDistanceY / dinoDistanceX) - player.angle;
          dino.distance = Math.sqrt(dinoDistanceX * dinoDistanceX + dinoDistanceY * dinoDistanceY);
        };
        minimap.rays.push([xHit, yHit]);
        let adjustedDistance = Math.cos(rayAngle - player.angle) * distance;
        let wallHalfHeight = canvas.height / adjustedDistance / 2;
        let wallTop = Math.max(0, canvas.halfHeight - wallHalfHeight);
        let wallBottom = Math.min(canvas.height, canvas.halfHeight + wallHalfHeight);
        let percentageDistance = adjustedDistance / this.maxDistance;
        let brightness = 1 - percentageDistance;
        let shade = Math.floor(palette.shades * brightness);
        let color = palette.walls[wallType][shade];
        if (adjustedDistance < dino.distance) {
          foregroundSlivers.push([i, wallTop, wallBottom, color]);
        } else {
          backgroundSlivers.push([i, wallTop, wallBottom, color]);
        };
      }
    }
  } //end raycaster

  const player = {
    init: function () {
      this.x = 14;
      this.y = 14;
      this.direction = 0;
      this.angle = 80;
      this.speed = 0;
      this.movementSpeed = 0.02;
      this.turnSpeed = 4 * Math.PI / 180;
      this.move = function () {
        let moveStep = this.speed * this.movementSpeed;
        this.angle += this.direction * this.turnSpeed;
        let newX = this.x + Math.cos(this.angle) * moveStep;
        let newY = this.y + Math.sin(this.angle) * moveStep;
        if (!containsBlock(newX, newY)) {
          this.x = newX;
          this.y = newY;
        };
      };
      this.draw = function () {
        let playerXOnMinimap = this.x * minimap.cellWidth;
        let playerYOnMinimap = this.y * minimap.cellHeight;
        minimap.context.fillStyle = "#FF0000";
        minimap.context.beginPath();
        minimap.context.arc(minimap.cellWidth * this.x, minimap.cellHeight * this.y, minimap.cellWidth / 2, 0, 2 * Math.PI, true);
        minimap.context.fill();
        let projectedX = this.x + Math.cos(this.angle);
        let projectedY = this.y + Math.sin(this.angle);
        minimap.context.fillRect(minimap.cellWidth * projectedX - minimap.cellWidth / 4, minimap.cellHeight * projectedY - minimap.cellHeight / 4, minimap.cellWidth / 2, minimap.cellHeight / 2);
      };
    }
  } //end player

  function containsBlock(x, y) {
    return (map[Math.floor(y)][Math.floor(x)] !== -1);
  }; //end containsBlock

let map = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,-1,-1,-1,-1,-1,2,0,-1,-1,-1,-1,2,3,0,1],
[1,-1,-1,-1,0,-1,0,-1,-1,2,0,-1,-1,-1,-1,1],
[1,3,2,0,3,-1,3,2,3,0,3,2,3,3,-1,1],
[1,2,-1,0,2,-1,0,-1,-1,-1,-1,-1,0,2,-1,1],
[1,-1,-1,3,0,-1,2,-1,0,-1,2,-1,3,-1,-1,1],
[1,-1,0,2,3,-1,0,2,3,2,0,-1,2,-1,0,1],
[1,-1,2,3,2,-1,-1,-1,-1,3,2,-1,3,-1,3,1],
[1,-1,3,0,-1,-1,3,2,3,0,-1,-1,0,-1,2,1],
[1,-1,-1,-1,-1,2,-1,0,-1,-1,-1,2,-1,-1,-1,1],
[1,-1,2,3,-1,-1,-1,-1,-1,2,-1,-1,-1,3,-1,1],
[1,3,0,2,3,0,2,-1,0,3,2,3,0,2,-1,1],
[1,-1,-1,-1,-1,-1,3,-1,3,-1,-1,-1,3,-1,-1,1],
[1,-1,3,2,3,-1,-1,-1,2,3,0,-1,2,-1,-1,1],
[1,-1,-1,-1,-1,0,2,-1,-1,-1,-1,-1,0,-1,-1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];



    const canvas = {
      init: function () {
        this.element = document.getElementById('canvas');
        this.context = this.element.getContext("2d");
        this.width = this.element.width;
        this.height = this.element.height;
        this.halfHeight = this.height / 2;
        this.blank = function () {
          this.context.clearRect(0, 0, this.width, this.height);
          this.context.fillStyle = palette.sky;
          this.context.fillRect(0, 0, this.width, this.halfHeight);
          this.context.fillStyle = palette.ground;
          this.context.fillRect(0, this.halfHeight, this.width, this.height);
        }
        this.drawSliver = function (sliver, wallTop, wallBottom, color) {
          this.context.beginPath();
          this.context.strokeStyle = color;
          this.context.moveTo(sliver + .5, wallTop);
          this.context.lineTo(sliver + .5, wallBottom);
          this.context.closePath();
          this.context.stroke();
        }
      }
    }; //end canvas

    var minimap = {
      init: function () {
        this.element = document.getElementById('minimap');
        this.context = this.element.getContext("2d");
        this.element.width = 300;
        this.element.height = 300;
        this.width = this.element.width;
        this.height = this.element.height;
        this.cellsAcross = map[0].length;
        this.cellsDown = map.length;
        this.cellWidth = this.width / this.cellsAcross;
        this.cellHeight = this.height / this.cellsDown;
        this.colors = ["#808080", "#000000", "#808080", "#808080"];
        this.draw = function () {
          for (let y = 0; y < this.cellsDown; y++) {
            for (let x = 0; x < this.cellsAcross; x++) {
              let cell = map[y][x];
              if (cell === -1) {
                this.context.fillStyle = "#ffffff"
              } else {
                this.context.fillStyle = this.colors[map[y][x]];
              };
              this.context.fillRect(this.cellWidth * x, this.cellHeight * y, this.cellWidth, this.cellHeight);
            };
          };
          for (let i = 0; i < this.rays.length; i++) {
            this.drawRay(this.rays[i][0], this.rays[i][1])
          }
        };
        this.drawRay = function (xHit, yHit) {
          this.context.beginPath();
          this.context.moveTo(this.cellWidth * player.x, this.cellHeight * player.y);
          this.context.lineTo(xHit * this.cellWidth, yHit * this.cellHeight);
          this.context.closePath();
          this.context.stroke();
        };
      }
    }; //end minimap

    const camera = {
      init: function () {
        this.context = document.getElementById('screenshot').getContext('2d')
        let filtered = false;
        let f;
        $("#screenshot").on("click", function () {
          if (filtered) {
            filtered = false;
            f.reset().render();
          } else {
            filtered = true;
            f = Filtrr2('#screenshot', function () {
              this.expose(50)
                .render();
            }, { store: false });
          };
        });
        this.takePicture = function () {
          let image = new Image();
          image.crossOrigin = "anonymous"
          image.src = canvas.element.toDataURL('image/png');
          image.onload = function () {
            camera.context.drawImage(image, 0, 0);
          }
          filtered = false;
        }
      }
    }; //end camera

    var palette = {
      init: function () {
        this.ground = '#DFD3C3';
        this.sky = '#418DFB';
        this.shades = 300;

        let initialWallColors = [[85, 68, 102],
        [255, 53, 91],
        [255, 201, 52],
        [118, 201, 159]];

        this.walls = [];
        for (let i = 0; i < initialWallColors.length; i++) {
          this.walls[i] = [];
          for (let j = 0; j < this.shades; j++) {
            let red = Math.round(initialWallColors[i][0] * j / this.shades);
            let green = Math.round(initialWallColors[i][1] * j / this.shades);
            let blue = Math.round(initialWallColors[i][2] * j / this.shades);
            let color = `rgb(${red},${green},${blue})`;
            this.walls[i].push(color);
          };
        };
      }
    } //end palette

    const dino = {
      init: function () {
        this.sprite = new jaws.Sprite({ image: "dino.png", x: 0, y: canvas.height / 2, anchor: "center" });
        this.x = 1;
        this.y = 1;
        this.show = false;
        this.distance = 10000;
        this.draw = function () {
          this.scale = raycaster.maxDistance / dino.distance / 2;
          this.sprite.scaleTo(this.scale);
          this.angle %= twoPi;
          if (this.angle < 0) this.angle += twoPi;
          this.angleInDegrees = this.angle * 180 / Math.PI;
          let potentialWidth = 300 * .2;
          let halfAngularWidth = potentialWidth / 2;
          this.adjustedAngle = this.angleInDegrees + halfAngularWidth;
          if (this.adjustedAngle > 180 || this.adjustedAngle < -180) {
            this.adjustedAngle %= 180;
          };
          this.sprite.x = this.adjustedAngle / potentialWidth * canvas.width;
          this.sprite.draw();
        };
      }
    }; //end dino

    this.draw = function () {
      minimap.draw();
      player.draw();
      canvas.blank();
      for (let i = 0; i < backgroundSlivers.length; i++) {
        canvas.drawSliver.apply(canvas, backgroundSlivers[i]);
      };
      if (dino.show) {
        dino.draw();
      };
      for (let i = 0; i < foregroundSlivers.length; i++) {
        canvas.drawSliver.apply(canvas, foregroundSlivers[i]);
      };
    }; //end draw

    this.setup = function () {
      camera.init();
      minimap.init();
      player.init();
      raycaster.init()
      canvas.init();
      palette.init();
      dino.init();
    }; //end setup

 

        //create hud element for position of player
        let container = document.getElementById("container");
        let hud = document.createElement("div");
        hud.id = "hud";
        //include distance to 1, 1
        let distance = document.createElement("div");
        distance.id = "distance";
        hud.appendChild(distance);
        let hudPosition = document.createElement("div");
        hudPosition.id = "hud-position";
        let hudPositionX = document.createElement("div");
        hudPositionX.id = "hud-position-x";
        let hudPositionXValue = document.createElement("div");
        hudPositionXValue.id = "hud-position-x-value";
        let hudPositionY = document.createElement("div");
        hudPositionY.id = "hud-position-y";
        let hudPositionYValue = document.createElement("div");
        hudPositionYValue.id = "hud-position-y-value";
        hudPositionX.appendChild(hudPositionXValue);
        hudPositionY.appendChild(hudPositionYValue);
        hudPosition.appendChild(hudPositionX);
        hudPosition.appendChild(hudPositionY);
        hud.appendChild(hudPosition);
        container.appendChild(hud);
        //set hud x and y innerhtml
        hudPositionXValue.innerHTML = "x: " + '14'
        hudPositionYValue.innerHTML = "y: " + '14'
        distance.innerHTML = "Completion: " + '0' + "%"

        //calculate distance in percentage of player from 1,1 on map and compare to max distance which is from 14, 14 to 1, 1
        let distanceCalculator = function () {
          let x = player.x - 1;
          let y = player.y - 1;
          let distance = Math.sqrt(x * x + y * y);
          let maxDistance = Math.sqrt(13 * 13 + 13 * 13);
          let percentage = distance / maxDistance;
          return Math.ceil((1 - percentage) * 100);
        }

        //function to update hud with player.x and player.y
        function updateHud() {
          pX = Math.floor(player.x);
          pY = Math.floor(player.y);
          hudPositionXValue.innerHTML = 'X:' + pX;
          hudPositionYValue.innerHTML = 'Y:' + pY;
          distance.innerHTML = 'Completion: ' + distanceCalculator() + '%';
          if(pX === 1 && pY === 1) {
            distance.innerHTML = 'Completion: ' + '100%';
            hudPositionXValue.innerHTML = 'You Win!';
            hudPositionYValue.innerHTML = '';
            Game.pause();
          }
        }

    this.update = function () {
      raycaster.castRays();
      if (jaws.pressed("a")) { 
        player.direction = -1
      };
      if (jaws.pressed("d")) { 
        player.direction = 1
      };
      if (jaws.pressed("w")) {
         player.speed = 1
         updateHud(); 
        };
      if (jaws.pressed("s")) {
         player.speed = -1
         updateHud(); 
        };
      if (jaws.pressed("shift")) { player.movementSpeed = 0.08 };

      if (jaws.on_keyup("shift", function () {
        player.movementSpeed = 0.02
      }));

      if (jaws.on_keyup(["a", "d"], function () {
        player.direction = 0;
      }));

      if (jaws.on_keyup(["w", "s"], function () {
        player.speed = 0;
      }));

      if (jaws.pressedWithoutRepeat("space")) { camera.takePicture() };
      player.move();
    }; //end update

  } //end game


