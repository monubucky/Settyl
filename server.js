// server.js
const express = require('express');

const cors = require('cors');

const app = express();
const http = require('http').Server(app);
//const apiData = require('./api.json');
const axios = require('axios');
const API_BASE_URL = 'http://localhost:3333';
const api = axios.create({
  baseURL: API_BASE_URL,
});


// Enable CORS for development purposes
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
app.use(cors(corsOpts));

const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('vote',(id,option,datas)=>{
    console.log("id:"+id)
    console.log("Selected Option is : "+option);
    datas.count[option] += 1
    api.put(`/data/${id}`,datas)
    //socket.emit('pollUpdate',['Option D', 'Option E', 'Option F'])
  });

  socket.on('getAllpolls',async ()=>{
    // console.log(apiData);
    const apiData = await api.get('/data');
    console.log(apiData.data)
    socket.emit('setAllpolls',apiData.data);
  });

  socket.on('createNewPoll',(datas)=>{

    api.post('/data', datas);
    //apiData.push(datas);
  })

  
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});




// Handle WebSocket connections
console.log("Hello");
const port = 5000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
