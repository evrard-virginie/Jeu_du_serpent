// fonction qui se lance quand la fenêtre est charger
window.onload = function()
{
    // Initialiser les variables
    var canvasWidth = 900;          // largeur du canvas
    var canvasHeight = 600;         // hauteur du canvas
    var blockSize = 30;  // taille du block en pixel
    var ctx;             // ctx = context
    var delay = 100;     // delay = délais 1000 miliseconds = 1 seconde, plus le chiffre est petit plus le rectangle va vite
    var snakee;          
    
    // Executer la fonction init
    init();

    // Déclaration de la fonction d'initialisation
    function init()
    {
        // creer un element canvas, cadre extérieur, canvas permet de dessiner
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;          // largeur
        canvas.height = canvasHeight;        // hauteur
        canvas.style.border = "1px solid";   // bordure
        // 'attacher' le canvas au document html
        document.body.appendChild(canvas);   
        // Dessiner un rectangle dans le canvas, 2d = 2 dimension 
        ctx = canvas.getContext('2d'); 
        // créer le serpent, en commençant par la tête du serpent 
        // [6 -> axe du x(gauche),4 -> axe du y, haut] et right -> direction
        snakee = new Snake([[6,4], [5,4], [4,4]], "right");
        // appeler la fonction refreshCanvas
        refreshCanvas();
    }


    // Rafraichir le canvas, faire 'avancer' le rectangle sur une nouvelle position
    function refreshCanvas()
    {
        // effacer tous le canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // Appel des méthodes
        snakee.advance();
        snakee.draw();
        // appeler la function refreshCanvas qui permet de faire 'avancer' le rectangle toute les 1s
        setTimeout(refreshCanvas, delay);
    }

    // permet de dessiner un block (corps du serpent), en pixel
    function drawBlock(ctx, position)
    {
        // position[0] = au array de la tête l'axe du x [6, ]
        var x = position[0] * blockSize;
        // position[1] = au array de la tête l'axe du y [ , 4] 
        var y = position[1] * blockSize;
        // dessine le corps du serpent
        ctx.fillRect(x, y, blockSize, blockSize);
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
                drawBlock(ctx, this.body[i]);
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
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
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
            var allowedDirections;
            
            switch(this.direction)
            {
                // donner les directions permises au serpent
                case "left":      
                case "right":
                    allowedDirections = ["up", "down"];
                    break;

                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Direction invalide");
            }
            // permet de changer de direction uniquement si la position est permise
            // si l'index de la nouvelle direction est supérieur à -1 alors elle est permise
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;  
            } 
        };
    }


    // onkeydown -> quand l'utilisateur appuie sur une touche du clavier
    // e -> évènement
    document.onekeydown = function handleKeyDown(e)
    {
        // chaque touche appuyer à un code et e donne le code de la touche appuyer
        var key = e.keyCode;
        var newDirection;
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
        // VOIR FAVORIE POUR RENOMER LES TOUCHES
        // code values for keyboard et keyboardEventCode menu gauche -> code
}