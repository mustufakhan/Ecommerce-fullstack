const app = require('./app');
const dotenv = require('dotenv');
const connectDataBase = require('./config/database')

//config
dotenv.config({path: "backend/config/config.env"});

//connecting database
connectDataBase();

const server = app.listen(process.env.PORT, ()=>{
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
});

process.on('unhandledRejection',(err)=>{
  console.log('Error: ' + err)
  console.log('Shutting down server due to unhandle promise rejection')

  server.close(()=>{
    process.exit(1)
  });

})