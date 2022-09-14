// fonction qui se lance quand la fenêtre est charger
window.onload = function()
{
     // Initialiser les variables
    var ctx;
    var canvasWidth = 900;    // largeur du canvas
    var canvasHeight= 500;    // hauteur du canvas
    var delay = 150;          // vitesse du serpent
    var blockSize = 30;
    var snakee;
    var newDirection ="right";
    var applee;
    // taille du canvas en block = taille du canvas en pixel diviser par taille du block en pixel
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;
    var timeout;

    // Executer la fonction init
    init();

    // Déclaration de la fonction d'initialisation
    function init(){
        // creer un element canvas, cadre extérieur, canvas permet de dessiner
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;          
        canvas.height = canvasHeight;        
        canvas.style.border = "30px solid gray";   // bordure
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"

        // 'attacher' le canvas au document html
        document.body.appendChild(canvas);  

        // CREER LE SERPENT, en commençant par la tête du serpent [6, 4]
        // paramètres position : [6 -> axe du x(gauche),4 -> axe du y, haut] newDirection = right
        snakee = new Snake([[6,4], [5,4], [4,4]], newDirection); 
        //CREER LA POMME
        applee = new Apple([10, 10]);
        score = 0;

        // Dessiner un rectangle dans le canvas, 2d = 2 dimension 
        ctx = canvas.getContext('2d'); 
        
        // appeler la fonction refreshCanvas
        refreshCanvas();
    }

    // Rafraichir le canvas
    function refreshCanvas(){
        // le serpent avance
        snakee.advance();
        // Si le serpent rentre en collision
        if(snakee.checkCollision()){
            gameOver();
        } else {
            // Si le serpent a manger la pomme
            if(snakee.isEatingApple(applee)){
                // le serpent a manger une pomme
                snakee.ateApple = true;
                // augmente le score
                score++;
                do{
                    // donner une nouvelle position a la pomme
                    applee.setNewPosition();

                // verifie si la nouvelle position de la pomme est sur le serpent, si oui redonner une nouvelle position a la pomme
                } while(applee.isOnSnake(snakee)) 
            }
            // effacer tous le canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Dessine le score
            drawScore();
            // Dessine le serpent
            snakee.draw();
            // Dessine la pomme
            applee.draw();
            

            // la function refreshCanvas met à jour le canvas toutes les 1s
            // ce qui permet de faire 'avancer' le serpent toute les 1s
            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    // fonction GAME OVER
    function gameOver(){
        ctx.save();
        // la police
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // bordure blanche sous de la police
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;

        // centrer le texte sur le canvas
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;

        ctx.strokeText("Game Over", centerX, centerY - 180);
        // fillText -> permet d'ecrire(1er agument le text, positon sur axe X, position sur axe Y)
        ctx.fillText("Game Over", centerX, centerY - 180);

        ctx.font = "bold, 30px, sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);        
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);

        ctx.restore();
    }

    // fonction qui relance le jeu après le game over
    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4]], newDirection); 
        applee = new Apple([10, 10]);
        score = 0;
        // remettre à zéro le timeout/delay
        clearTimeout(timeout);

        refreshCanvas();
    }

    // fonction pour l'affichage du score
    function drawScore(){  
        ctx.save();
        // changer la police
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
         // centrer le texte 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;

        // affiche le score au center du canvas
        ctx.fillText(score.toString(),centerX, centerY);

        ctx.restore();
    }

    // permet de dessiner un block (corps du serpent), en pixel
    function drawBlock(ctx, position){
        // position[0] = new snake, la tête, l'axe du x [6, ]
        var x = position[0] * blockSize;
        // position[1] = new snake, la tête, l'axe du y [ , 4] 
        var y = position[1] * blockSize;
        // dessine le corps du serpent
        ctx.fillRect(x, y, blockSize,blockSize);
    }

    // Creer une fonction constructeur qui sera le prototype du serpent
    function Snake(body, direction){
        // le corps du serpent
        this.body = body;
        // diriger le serpent
        this.direction = direction;
        // savoir si le serpent a manger une pomme
        this.ateApple = false;
        // METHODE qui va dessiner le corps du serpent dans le canvas
        this.draw = function(){
            // sauvegarder le context
            ctx.save();
            ctx.fillStyle = "#ff0000";

            // permet de 'passer sur tous les blocks, block = corps du serpent
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx,this.body[i]);
            }

            // restaurer le context
            ctx.restore();
        };

        // METHODE qui va faire avancer le serpent
        this.advance = function(){
            // le prochaine position de l'element de la tête, slice -> copier l'element
            var nextPosition = this.body[0].slice();
            // analyse le direction du serpent nextPosition[0] -> axe du x, nextPosition[1] -> axe du y
            switch (this.direction){
                case "right":
                    nextPosition[0] += 1;
                    break;

                case "left":
                    nextPosition[0] -= 1;
                    break;

                case "up":
                    nextPosition[1] -= 1;
                    break;

                case "down":
                    nextPosition[1] += 1;
                    break;

                //  message d'erreur
                default:
                    throw("Direction invalide");
            }

            // ajouter la prochaine position au début du corps du serpent
            this.body.unshift(nextPosition);
            // Si le serpent n'a pas manger de pomme 
            if(!this.ateApple){
                // pop -> supprimer la dernière position de l'element (fin du corps)
                this.body.pop();
            } else {
                // garde le dernier element au corp du serpent et remettre a false
                this.ateApple = false;
            } 
        };

        // METHODE pour donner la nouvelle direction au serpent
        this.setDirection = function(newDirection){
            // sur la direction actuelle
            var allowDirections;
            
            switch (this.direction){
                // donner les directions permises au serpent
                case "left":      
                case "right":
                    allowDirections = ["up", "down"];
                    break;

                case "up":
                case "down":
                    allowDirections = ["left", "right"];
                    break;

                default:
                    throw("Direction invalide");
            }

            // permet de changer de direction uniquement si la position est permise
            // si l'index de la nouvelle direction est supérieur à -1 alors elle est permise
            if(allowDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        // METHODE les collision du serpent
        this.checkCollision = function(){
            // collision avec le mur
            var wallCollision = false;
            // collision avec le corps du serpent
            var snakeCollision = false;

            // la tête du serpent
            var head = this.body[0];
            // le corps du serpent
            var rest = this.body.slice(1);
            // le x de la tête du serpent
            var snakeX = head[0];
            // le y de la tête du serpent
            var  snakeY = head[1];

            // taille du canvas
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 0;

            // voir si la tête du serpent à pris le mur de gauche ou  de droite
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; 
            // voir si la tête du serpent à pris le mur du haut ou du bas
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; 

            // vérifie si le serpent si situe entre les murs
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true
            }

            // voir la tête du serpent est en collision avec son corps
            // rest[i][0] =-> rest[position tête serpent axe X][position du corp serpent axe de X]
            // rest[i][1] =-> rest[position tête serpent axe Y][position du corp serpent axe de Y]
            for(var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision
        };

        // METHODE le serpent a-t-il manger la pomme
        this.isEatingApple = function(appleToEat){
            // la tête est égale au premier element du corps, index 0
            var head = this.body[0];
            // vérifie si l'axe X (=0) et Y(=1) de la tête est égale a axe X et Y de la pomme
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            } else
                return false;
        };
    }

    // fonction constructeur pour la pomme
    function Apple(position){
        this.position = position;
        // METHODE qui va dessiner la pomme dans le canvas
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";  // couleur
            ctx.beginPath();
            // trouver le rayon de la pomme
            // taille du block (30pixel) diviser par 2
            var radius = blockSize / 2;
            // définir le centre du cercle
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            // dessiner la pomme
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.restore();
        };
        // METHODE pour donner une nouvelle position a la pomme de maniere aléatoire
        this.setNewPosition = function(){
            // Math.round -> chiffre entier, Math.random -> chiffre aléatoire
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            // donner la nouvelle position a la pomme
            this.position = [newX, newY];
        };
        // METHODE pour voir si la position de la pomme est sur le serpent
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;

            for(var i = 0; i < snakeToCheck.length; i++){
                // Si(la position axe X de la pomme === a tout le corps du serpent de axe x && la position axe Y de la pomme === a tout le corps du serpent de axe Y
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
                return isOnSnake;
            }
        };
    }


    // onkeydown -> quand l'utilisateur appuie sur une touche du clavier
    // e -> évènement
    document.onkeydown = function (e){
        // chaque touche appuyer à un code et e donne le code de la touche appuyer
        var key = e.keyCode;
        
        switch(key){
            case 37:    // flèche de gauche
                newDirection = "left";
                break;

            case 38:    // flèche du haut
                newDirection = "up";
                break;

            case 39:    // flèche de droite
                newDirection = "right";
                break;

            case 40:    // flèche du bas
                newDirection = "down";     
                break;

            case 32:    // Espace
                restart();
                return;
            default:
                return; 
        }

        // appel de la function
        snakee.setDirection(newDirection);
    }          
}