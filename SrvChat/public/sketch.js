let socket;
let chatBox;
let chatInput;

function setup() {
  noCanvas();

  chatBox = createDiv('');
  chatInput = createInput();
  chatInput.size(400);
  chatInput.changed(sendMsg);

  socket = io.connect("IPADRESS"); // TODO: Change
  socket.on('name', enterName);
  socket.on('join', joinServer);
}

function draw() {

}

function enterName() {
  let name = prompt("Please enter your chat name.");

  socket.emit('setName', {name: name});
}

function joinServer() {
  socket.on('chatMsg', viewMsg);
}

function viewMsg(data) {
  chatBox.child(createP(data.sender + ": " + data.msg));
}

function sendMsg() {
  socket.emit('send', {msg: chatInput.value()});
  chatInput.value('');
}
