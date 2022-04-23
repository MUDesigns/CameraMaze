        //generate grid of divs with 16 rows and 14 columns appended to body
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 16; j++) {
                var div = document.createElement("label");
                div.className = "grid";
                div.id = i + "-" + j;
                //set div content to i and j
                div.innerHTML = '-1';
                div.value = -1;
                //make each div light blue
                div.style.backgroundColor = "#ADD8E6";
                //append each div to body
                document.getElementById('grid-container').appendChild(div);
                //change all out of bounds divs to 1 and make them red
                if (i > 14 || j > 14 || i < 1 || j < 1) {
                    div.innerHTML = '1';
                    div.value = 1;
                    div.style.backgroundColor = "rgb(255, 53, 91)";
                }
                //increment div when clicked by 1 until it reaches 4, then reset to -1
                div.onclick = function() {
                    var content = this.innerHTML;
                    if (content == '-1') {
                        this.innerHTML = '0';
                        this.value = 0;
                        this.style.backgroundColor = 'rgb(85, 68, 102)';
                    } else if (content == '0') {
                        this.innerHTML = '1';
                        this.value = 1;
                        this.style.backgroundColor = 'rgb(255, 53, 91)';
                    } else if (content == '1') {
                        this.innerHTML = '2';
                        this.value = 2;
                        this.style.backgroundColor = 'rgb(255, 201, 52)';
                    } else if (content == '2') {
                        this.innerHTML = '3';
                        this.value = 3;
                        this.style.backgroundColor = 'rgb(118, 201, 159)';
                    } else if (content == '3') {
                        this.innerHTML = '-1';
                        this.value = -1;
                        this.style.backgroundColor = '#ADD8E6';
                    }
                }
                //on submit, create 2d array of values 14 by 16 from divs in javascript
                document.getElementById('genArray').onclick = function(e) {
                    e.preventDefault();
                    var grid = [];
                    for (var i = 0; i < 16; i++) {
                        grid[i] = [];
                        for (var j = 0; j < 16; j++) {
                            grid[i][j] = document.getElementById(i + "-" + j).value;
                        }
                    }
                    //format grid into json string with next line after each row
                    var gridString = JSON.stringify(grid);
                    gridString = gridString.replace(/],/g, '],\n');
                    document.getElementById('array').innerHTML = gridString;
                }
            }
        }




        