// fonction qui se lance quand la fenêtre est charger
window.onload = function()
{
     // Initialiser les variables
    var ctx;
    var canvasWidth = 900;    // largeur du canvas
    var canvasHeight= 500;   // hauteur du canvas
    var delay = 100;
    var blockSize = 30;
    var snakee;
    var newDirection ="right";
    var applee;
    // taille du canvas en block = taille du canvas en pixel diviser par taille du block en pixel
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;

    // Executer la fonction init
    init();

    // Déclaration de la fonction d'initialisation
    function init()
    {
        // creer un element canvas, cadre extérieur, canvas permet de dessiner
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;          
        canvas.height = canvasHeight;        
        canvas.style.border = "1px solid";   // bordure

        // 'attacher' le canvas au document html
        document.body.appendChild(canvas);  

        // CREER LE SERPENT, en commençant par la tête du serpent [6, 4]
        // paramètres position : [6 -> axe du x(gauche),4 -> axe du y, haut] newDirection = right
        snakee = new Snake([[6,4], [5,4], [4,4]], newDirection); 
        //CREER LA POMME
        applee = new Apple([10, 10]);

        // Dessiner un rectangle dans le canvas, 2d = 2 dimension 
        ctx = canvas.getContext('2d'); 
        
        // appeler la fonction refreshCanvas
        refreshCanvas();
    }

    // Rafraichir le canvas
    function refreshCanvas()
    {
        // le serpent avance
        snakee.advance();
        // Si le serpent rentre en collision
        if(snakee.checkCollision())
        {
            // Game over
        }
        else
        {
            // effacer tous le canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            // Dessine le serpent
            snakee.draw();
            // Dessine la pomme
            applee.draw();

            // la function refreshCanvas met à jour le canvas toutes les 1s
            // ce qui permet de faire 'avancer' le serpent toute les 1s
            setTimeout(refreshCanvas, delay);
        }
        
    }

    // permet de dessiner un block (corps du serpent), en pixel
    function drawBlock(ctx, position)
    {
        // position[0] = new snake, la tête, l'axe du x [6, ]
        var x = position[0] * blockSize;
        // position[1] = new snake, la tête, l'axe du y [ , 4] 
        var y = position[1] * blockSize;
        // dessine le corps du serpent
        ctx.fillRect(x, y, blockSize,blockSize);
    }

    // Creer une fonction constructeur qui sera le prototype du serpent
    function Snake(body, direction)
    {
        // le corps du serpent
        this.body = body;
        // diriger le serpent
        this.direction = direction;
        // METHODE qui va dessiner le corps du serpent dans le canvas
        this.draw = function()
        {
            // sauvegarder le context
            ctx.save();
            ctx.fillStyle = "#ff0000";

            // permet de 'passer sur tous les blocks, block = corps du serpent
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx,this.body[i]);
            }

            // restaurer le context
            ctx.restore();
        };

        // METHODE qui va faire avancer le serpent
        this.advance = function()
        {
            // le prochaine position de l'element de la tête, slice -> copier l'element
            var nextPosition = this.body[0].slice();
            // analyse le direction du serpent nextPosition[0] -> axe du x, nextPosition[1] -> axe du y
            switch (this.direction)
            {
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
            // supprimer la dernière position de l'element (fin du corps)
            this.body.pop();
        };

        // METHODE pour donner la nouvelle direction au serpent
        this.setDirection = function(newDirection)
        {
            // sur la direction actuelle
            var allowDirections;
            
            switch (this.direction)
            {
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
            if(allowDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };

        // METHODE les collision du serpent
        this.checkCollision = function()
        {
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
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true
            }

            // voir la tête du serpent est en collision avec son corps
            // rest[i][0] =-> rest[position tête serpent axe X][position du corp serpent axe de X]
            // rest[i][1] =-> rest[position tête serpent axe Y][position du corp serpent axe de Y]
            for(var i = 0; i < rest.length; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision
        };
    }

    // fonction constructeur pour la pomme
    function Apple(position)
    {
        this.position = position;
        // METHODE qui va dessiner la pomme dans le canvas
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";  // couleur
            ctx.beginPath();
            // trouver le rayon de la pomme
            // taille du block (30pixel) diviser par 2
            var radius = blockSize / 2;
            // définir le centre du cercle
            var x = position[0] * blockSize + radius;
            var y = position[1] * blockSize + radius;
            // dessiner la pomme
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.restore();
        };
    }


    // onkeydown -> quand l'utilisateur appuie sur une touche du clavier
    // e -> évènement
    document.onkeydown = function (e)
    {
        // chaque touche appuyer à un code et e donne le code de la touche appuyer
        var key = e.keyCode;
        
        switch(key)
        {
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
            default:
                return; 
        }

        // appel de la function
        snakee.setDirection(newDirection);
    }
    
             
}