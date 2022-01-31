const mongoose = require('mongoose');

const connectDataBase = () => {
  mongoose.connect(process.env.DB_URI,{ useNewUrlParser:true, useUnifiedTopology: true})
  .then((data)=>{
    console.log(`mongodb connected: ${data.connection.host}`)
  }).catch((err)=>{
    console.log(err)
  })
}

module.exports = connectDataBase;