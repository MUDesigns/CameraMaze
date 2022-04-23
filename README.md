# CameraMaze
game for college


Game Concept

High Concept:
This game is about the player waking up in a strange world. They soon come to realize it is a maze. Naturally, like any sane person would do, they travel in search of the flat green dinosaur. Upon finding the dinosaur, the game ends.

Genre:
FPS, Adventure

Gameplay:
The player can move throughout the maze while checking the mini map to make their way to the top left corner. During this time, they will be able to take picture along the way. The player will feel excitement and thrill as they take pictures of our beautifully painted world including four colors of flat surfaces and an 8-bit dinosaur.

Features:
This game is like no other picture taking game. Take Pokémon Snap for example. That game actually has progression and goals. Our game has none of that, you just take pictures for no particular reason until you walk into a 2D dinosaur and win. 

Story/Setting: 
The story is the best part of the game, as it’s full of symbolism and deep metaphors about something. I don’t know what myself, but certainly something. Right?

Target Audience:
The target audience is those that are 65+. This may remind them of the days when games had no real story and were beaten in less than 2 minutes. The modern twist that may shovel in some 18-25 year olds is the lack of polish and early access tag we plan to slap on upon ‘release.’

Platform:
This game can run on any potato that can open a web browser, but technically one would need a keyboard to control it. This limits us to modern consoles with keyboard support and Windows, Mac, and Linux computers.
 
Project Development

Game programming:
It is necessary to first make a boilerplate HTML page, a CSS stylesheet, and a JavaScript document. The HTML should include a ‘canvas’ element. This canvas element will be selected in the ‘.js’ file for containing the game itself. It is then necessary to style the canvas element to a playable size in the CSS stylesheet to ensure the player can see the game. Using the JavaScript library ‘jaws.js,’ the game itself must be initiated. This will include the basics such as player, tile map, mini-map, and of course, the dinosaur. Ray-casting will be used to give a smoke and mirrors 3D camera from the player’s perspective. The HUD element is then to be created and appended with the player distance from the maze goal (the dinosaur). The player will spawn at 1, 1 and the end of the maze is at 14, 14. This was expected to take around two weeks.

Level building:
The level for the game was created by hard-coding a 2D array with -1 representing open space, and 0-3 representing different color walls. Much care was taken to ensure there were enough dead ends for the player to have some trouble reaching the goal without staring at the mini-map. When the map had to be redesigned, a UI level editor was created to make things easier to visualize. This was expected to take around 4 hours.

Quality Assurance:
Testing and debugging was the longest and most tedious part of development. It’s important to ensure there are no major bugs. Being a one man team, it was easier to find any issues and fix them immediately. However, the benefit of having multiple bugs found around the same time was not present. This was expected to take around a week.

Play Testing:
This game was thoroughly play tested, as that is the best way to make sure all features and elements are working as expected. I personally play tested the game many times, and also had friends play test the game during development to ensure there was some form of enjoyment to be had. This was to coincide with quality assurance and take about a week.
