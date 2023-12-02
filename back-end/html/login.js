// script.js
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
    const data = {};

      console.log(formData.get("username"));
      data["username"] = formData.get("username");
  
    try {
      const response = await fetch('http://localhost:3000/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        localStorage.setItem('username', formData.get("username"));
        window.location.href = "./chat.html";
      // const form = document.getElementById('form');
      // const input = document.getElementById('input');
      // const messages = document.getElementById('messages');

      // form.addEventListener('submit', (e) => {
      //   e.preventDefault();
      //   if (input.value) {
      //     socket.emit('message', input.value);
      //     input.value = '';
      //   }
      // });

      // socket.on('chat', (msg) => {
      //   const item = document.createElement('li');
      //   item.textContent = msg;
      //   messages.appendChild(item);
      //   window.scrollTo(0, document.body.scrollHeight);
      // });

          console.log('Registration successful');        
        } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
