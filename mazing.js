// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

function Position(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype.toString = function() {
  return this.x + ":" + this.y;
};

function Mazing(id) {

  this.mazeContainer = document.getElementById(id);

  this.mazeScore = document.createElement("div");
  this.mazeScore.id = "maze_score";

  this.mazeMessage = document.createElement("div");
  this.mazeMessage.id = "maze_message";

  this.heroScore = this.mazeContainer.getAttribute("data-steps") - 2;

  this.maze = [];
  this.heroPos = {};
  this.heroHasKey = false;
  this.childMode = false;

  this.utter = null;

  for(i=0; i < this.mazeContainer.children.length; i++) {
    for(j=0; j < this.mazeContainer.children[i].children.length; j++) {
      var el =  this.mazeContainer.children[i].children[j];
      this.maze[new Position(i, j)] = el;
      if(el.classList.contains("entrance")) {
        this.heroPos = new Position(i, j);
        this.maze[this.heroPos].classList.add("hero");
      }
    }
  }

  var mazeOutputDiv = document.createElement("div");
  mazeOutputDiv.id = "maze_output";

  mazeOutputDiv.appendChild(this.mazeScore);
  mazeOutputDiv.appendChild(this.mazeMessage);

  mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
  this.setMessage("Pegue a chave");

  this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);

};

Mazing.prototype.enableSpeech = function() {
  this.utter = new SpeechSynthesisUtterance()
  this.setMessage(this.mazeMessage.innerText);
};

Mazing.prototype.setMessage = function(text) {
  this.mazeMessage.innerHTML = text;
  this.mazeScore.innerHTML = this.heroScore;
  if(this.utter) {
    this.utter.text = text;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(this.utter);
  }
};

Mazing.prototype.heroTakeTreasure = function() {
  this.maze[this.heroPos].classList.remove("nubbin");
  this.heroScore += 10;
  this.setMessage("Tesouro!");
};

//Mazing.prototype.loadQuiz = function() {
 // var self = this;

//  fetch("quiz.csv")
 //   .then(function(response) {
  //    return response.text();
   // })
    //.then(function(csvText) {
    //  var questions = self.parseCSV(csvText);
     // self.displayRandomQuiz(questions);
    //});
//};

//Mazing.prototype.parseCSV = function(csvText) {
 // var lines = csvText.split("\n");
 // var questions = [];

//  for (var i = 1; i < lines.length; i++) {
 //   var fields = lines[i].split(",");
  //  var question = {
   //   text: fields[0],
   //   options: [fields[1], fields[2]],
    //  answer: fields[3]
   // };
    //questions.push(question);
  //}

  //return questions;
//};

//Mazing.prototype.displayQuiz = function() {
 // var quizContainer = document.querySelector(".quiz-container");
  //var questionElement = document.getElementById("quiz-question");
 // var optionsElement = document.getElementById("quiz-options");

//  quizContainer.style.display = "flex";

  // Obtenha uma pergunta e suas opções do seu array de perguntas
//  var currentQuestion = this.quizQuestions[this.currentQuestionIndex];
 // questionElement.textContent = currentQuestion.question;

//  optionsElement.innerHTML = ""; // Limpe as opções anteriores

 // currentQuestion.options.forEach(function(option, index) {
  //  var optionElement = document.createElement("div");
   // optionElement.className = "quiz-option";
   // optionElement.textContent = option;
   // optionElement.addEventListener("click", function() {
    //  checkAnswer(index);
   // });
   // optionsElement.appendChild(optionElement);
  //});
//};

//function checkAnswer(selectedIndex) {
 // var currentQuestion = MazeGame.quizQuestions[MazeGame.currentQuestionIndex];
  //var correctIndex = currentQuestion.options.indexOf(currentQuestion.answer);

//  if (selectedIndex === correctIndex) {
 //   MazeGame.setMessage("Resposta correta! Agora vá até a porta.");
   // MazeGame.quizContainer.style.display = "none";
 // } else {
  //  MazeGame.setMessage("Resposta incorreta. Tente novamente.");
   // MazeGame.currentQuestionIndex++;
   // MazeGame.displayQuiz();
  //}
//}


Mazing.prototype.heroTakeKey = function() {
  this.maze[this.heroPos].classList.remove("key");
  this.heroHasKey = true;
  this.heroScore--;
  this.mazeScore.classList.add("has-key");
  this.setMessage("Agora vá até a porta!");
 // this.loadQuiz();
 // this.displayQuiz();

};

//Mazing.prototype.handleQuizAnswer = function(userAnswer, correctAnswer) {
  //if (userAnswer === correctAnswer) {
    //this.setMessage("Resposta correta! Continue o jogo.");
    // Implement logic for continuing the game after a correct answer
  //} else {
  //  this.setMessage("Resposta incorreta. Você não pode prosseguir sem responder corretamente.");
    // Implement logic for handling incorrect answer (e.g., game over, restart, etc.)
  //}
//};

//function shuffleArray(array) {
  //for (let i = array.length - 1; i > 0; i--) {
    //const j = Math.floor(Math.random() * (i + 1));
    //[array[i], array[j]] = [array[j], array[i]];
  //}
//}

Mazing.prototype.gameOver = function(text) {
  document.removeEventListener("keydown", this.keyPressHandler, false);
  this.setMessage(text);
  this.mazeContainer.classList.add("gameover");
  document.getElementById("startBuuton").disabled=true;
};
Mazing.prototype.gameFinish = function(text) {
  document.removeEventListener("keydown", this.keyPressHandler, false);
  this.setMessage(text);
  this.mazeContainer.classList.add("finished");
  document.getElementById("startBuuton").disabled=true;
  var nextButton = document.getElementById("nextButton");
  nextButton.style.display = "block";
};



Mazing.prototype.heroWins = function() {
  this.mazeScore.classList.remove("has-key");
  this.maze[this.heroPos].classList.remove("door");
  this.heroScore--;
  this.gameFinish("Você conseguiu!");

};

Mazing.prototype.tryMoveHero = function(pos) {

  if("object" !== typeof this.maze[pos]) {
    return;
  }

  var nextStep = this.maze[pos].className;

  if(nextStep.match(/sentinel/)) {
    this.heroScore = Math.max(this.heroScore - 5, 0);
    if(!this.childMode && this.heroScore <= 0) {
      this.gameOver("Você não conseguiu!");
    } else {
      this.setMessage("Isso dói!");
    }
    return;
  }
  if(nextStep.match(/wall/)) {
    this.gameOver("Você acertou a parede!");
    return;
  }
  if(nextStep.match(/exit/)) {
    if(this.heroHasKey) {
      this.heroWins();
    } else {
      this.gameOver("Precisa da chave para destrancara porta");
      return;
    }
  }

  this.maze[this.heroPos].classList.remove("hero");
  this.maze[pos].classList.add("hero");
  this.heroPos = pos;

  if(nextStep.match(/nubbin/)) {
    this.heroTakeTreasure();
    return;
  }
  if(nextStep.match(/key/)) {
    this.heroTakeKey();
    return;
  }
  if(nextStep.match(/exit/)) {
    return;
  }
  if(this.heroScore >= 1) {
    if(!this.childMode) {
      this.heroScore--;
    }
    if(!this.childMode && (this.heroScore <= 0)) {
      this.gameOver("Você não conseguiu");
    } else {
      this.setMessage("...");
    }
  }
};

Mazing.prototype.mazeKeyPressHandler = function(e) {
  var tryPos = new Position(this.heroPos.x, this.heroPos.y);
  switch(e.keyCode)
  {
    case 37: // left
      this.mazeContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case 38: // up
      tryPos.x--;
      break;

    case 39: // right
      this.mazeContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case 40: // down
      tryPos.x++;
      break;

    default:
      return;

  }
  this.tryMoveHero(tryPos);
  e.preventDefault();
};

Mazing.prototype.start = function() {

  var namesTarget =  document.getElementById('namesTarget');
  if(namesTarget.getElementsByClassName('name') && namesTarget.getElementsByClassName('name').length > 0 ) {
    var names = namesTarget.getElementsByClassName('name');
    var i = 0;
    this.iterateWalking(this,names,i);
  }
};

Mazing.prototype.iterateWalking = function(maze,names,index) {
  var namesTarget =  document.getElementById('namesTarget');
  setTimeout(function() {   
    maze.walking(maze,names[index]); 
    namesTarget.getElementsByClassName("name").item(0).remove();
    if (names.length>0) {
      maze.iterateWalking(maze,names,index);
    } 
  }, 500)
}

Mazing.prototype.walking = function(maze,command) {

  let text = command.textContent;
  var tryPos = new Position(maze.heroPos.x, maze.heroPos.y);
  switch(text)
  {
    case 'Esquerda': // left
      maze.mazeContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case 'Cima': // up
      tryPos.x--;
      break;

    case 'Direita': // right
    maze.mazeContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case 'Baixo': // down
      tryPos.x++;
      break;

    default:
      return;

  }
  maze.tryMoveHero(tryPos);    

};

Mazing.prototype.setChildMode = function() {
  this.childMode = true;
  this.heroScore = 0;
  this.setMessage("Pegue todos os tesouros.");
};

Mazing.prototype.nextPhase = function() {
  var nextPhaseId = `maze${this.currentPhase + 1}`;
  var nextMaze = document.getElementById(nextPhaseId);
  
  if (nextMaze) {
    this.mazeContainer.removeChild(this.mazeContainer.firstChild);
    this.mazeContainer.appendChild(nextMaze);
    this.currentPhase++;
  } else {
    alert("Carregando fase.");
  }
};

