
// this is my code here
let people = document.querySelector('.people');
let right = document.querySelector('.right');

// getItem from SesionStorage
const username = sessionStorage.getItem('username')


// start of client socket
const socket = io({
  query: {
    name : username,
  },
});

const currentDate = new Date();

let time = "";
time += currentDate.getHours();
time += ":"
time += currentDate.getMinutes();


let prs = "person";

let clientId;


let Name ;
let currentUser;





// socket that list connected clients
async function ConnectedClients()
{
  
    let i = 1;
    people.innerHTML = '';
    
    const clientPromise = new Promise((solve) => {
      socket.on('listClients', (data) => {
          solve(data);
      })

    });

    const clientMap = await clientPromise;

    //top in html here
    
    const top = document.createElement('div');
    top.classList.add('top');

    const span = document.createElement('span');
    span.innerText = "To: ";

    const span2 = document.createElement('span');
    span2.classList.add('name');
    span2.innerText = "UserName";

    span.appendChild(span2);


    for (const [key, val] of clientMap)
    {
        console.log("name : ", key, " sockeId: ", val);
        if (val != socket.id)
        {
          // list of clients here
          const Elemli = document.createElement('li');
          Elemli.classList.add('person');
          Elemli.setAttribute('data-chat', prs+i);
          Elemli.setAttribute(key, prs+i);
          
          const Elemimg = document.createElement('img');
          Elemimg.src = "https://robohash.org/"+ key + ".png";
          
  
          const Elemspan1 = document.createElement('span');
          Elemspan1.classList.add('name');
          Elemspan1.textContent = key;
  
          const Elemspan2 = document.createElement('span');
          Elemspan2.classList.add('time');
          Elemspan2.textContent = time;
  
          const Elemspan3 = document.createElement('span');
          Elemspan3.classList.add('preview');
          Elemspan3.textContent = "last message here";
  
          Elemli.appendChild(Elemimg);
          Elemli.appendChild(Elemspan1);
          Elemli.appendChild(Elemspan2);
          Elemli.appendChild(Elemspan3);
  
          people.appendChild(Elemli);
  
          
          // list of messges of clients
          
          const chatDiv = document.createElement('div');
          chatDiv.classList.add('chat');
          chatDiv.setAttribute('data-chat', prs+i);
          
          const ConvDiv = document.createElement('div');
          ConvDiv.classList.add('conversation-start');

          const span3 = document.createElement('span');
          span3.innerText = currentDate.getDay() + ", " + time;

          ConvDiv.appendChild(span3);
          chatDiv.appendChild(ConvDiv);
          

          right.appendChild(span);
          right.appendChild(chatDiv);

          i++;
  
        }
    }

    // create button to send message
    const divButton = document.createElement('div');
    divButton.classList.add('write');

    const link = document.createElement('a');
    link.setAttribute('href', 'javascript:;');
    link.classList.add('write-link');
    link.classList.add('attach');

    const input = document.createElement('input');
    input.setAttribute('id', 'text');
    input.setAttribute('type', 'text');
    
    const link2 = document.createElement('a');
    link2.setAttribute('href', 'javascript:;');
    link2.classList.add('write-link');
    link2.classList.add('smiley');

    const link3 = document.createElement('a');
    link3.setAttribute('href', 'javascript:;');
    link3.setAttribute('id', 'btnMessage');
    link3.classList.add('write-link');
    link3.classList.add('send');

    divButton.appendChild(link);
    divButton.appendChild(input);
    divButton.appendChild(link2);
    divButton.appendChild(link3);

    right.appendChild(divButton);

    setTimeout(UntilSockFinish, 2000);
}



function UntilSockFinish()
{
  // not my code

  let activeChat = document.querySelector('.chat[data-chat=person1]');
  let active = document.querySelector('.person[data-chat=person1]');
  
  if (activeChat && active )
  {
    console.log("not null here");
    activeChat.classList.add('active-chat')
    active.classList.add('active')
  }
  
  let friends = {
    list: document.querySelector('ul.people'),
    all: document.querySelectorAll('.left .person'),
    name: ''
  },
  chat = {
    container: document.querySelector('.container .right'),
    current: null,
    person: null,
    name: document.querySelector('.container .right .top .name')
  }
  
Name = document.querySelector('.name').innerText;
currentUser = "person1";

friends.all.forEach(f => {
f.addEventListener('mousedown', () => {
  f.classList.contains('active') || setAciveChat(f)
})
});
  
  
  function setAciveChat(f) {
  friends.list.querySelector('.active').classList.remove('active')
  f.classList.add('active')
  chat.current = chat.container.querySelector('.active-chat')
  chat.person = f.getAttribute('data-chat')
  currentUser = chat.person
  chat.current.classList.remove('active-chat')
  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat')
  friends.name = f.querySelector('.name').innerText
  chat.name.innerHTML = friends.name
  Name = friends.name;

  }
  // end of not my code 

// send message here
document.getElementById('btnMessage').addEventListener('click', () => {
      
  const messageInput = document.getElementById('text').value;  
  console.log("message is clicked : ", messageInput);

  const div = document.createElement('div');
  div.classList.add('bubble');
  div.classList.add('me');
  div.innerText = messageInput;

  const conv = document.querySelector(".chat[data-chat="+currentUser+"]")
  conv.appendChild(div);

  socket.emit('SendToClient', { Name , messageInput});

})


}

ConnectedClients();











// listen for incoming messages 
socket.on('DirectMessage', (data) => {
  console.log(data);

  query = document.querySelector('['+ data.from+ ']');
  

  console.log("query : ", query.getAttribute(data.from));


  chat = document.querySelector('.chat[data-chat='+ query.getAttribute(data.from)+ ']');

  const div = document.createElement('div');
  div.classList.add('bubble');
  div.classList.add('you');
  div.innerText = data.msg;

  chat.appendChild(div);



})









