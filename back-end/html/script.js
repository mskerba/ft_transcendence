
// this is my code here
let people = document.querySelector('.people');

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

    for (const [key, val] of clientMap)
    {
        console.log("name : ", key, " sockeId: ", val);
        if (val != socket.id)
        {
          const Elemli = document.createElement('li');
          Elemli.classList.add('person');
          Elemli.setAttribute('data-chat', prs+i);
          
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
  
          i++;
  
        }
    }
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
  chat.current.classList.remove('active-chat')
  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat')
  friends.name = f.querySelector('.name').innerText
  chat.name.innerHTML = friends.name
  Name = friends.name;

  }
  // end of not my code 
}

ConnectedClients();



  setTimeout(UntilSockFinish, 3000);













// listen for incoming messages 
socket.on('DirectMessage', (data) => {
  console.log("this is the data : ", data);
})



// send message here
document.getElementById('btnMessage').addEventListener('click', () => {
  
  const messageInput = document.getElementById('text').value;  
  console.log("msg sent to this name : ", Name);
  socket.emit('SendToClient', {Name , messageInput});

})


// check if i get get some messages


