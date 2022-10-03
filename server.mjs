import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; 

let todoschema = new mongoose.schema({
    text: {type: String, required: true },
    classid: String,
    createdon:{ type: Date, default: Date.now}
})
const todomodel = mongoose

const app = express()
const port = process.env.PORT || 3000;

let todos = [];

//   UNIFORM INTERFACE:

//  post/todo   
//  get /todos              get server sy get krny k liya 
//  put /updatetodo         put is used for updating todo
//  delete /removetodo      remove krny k liya delete lgta hai 
//  get /todo/:id           for single get todo

// kisi ek todo k sath khelny k liya /:id daalni hogi end mai 

app.use(express.json()); //body ko pass krta hai 
app.use(cors());         //app.use har req pr hit kry ga guzar kr jata hai 

app.post('/todo', (req, res) => { // post krdeta hai 
    
    todos.push(req.body.text);

    todomodel.create({text:req.body.text}, (err, saved)=>{
       if

    res.send({                    //simply jo data hota hai usko 
        message: "your todo is saved",
        data: todos
    })
})
app.get('/todos', (req, res) => {  //simply jo data hota hai usko as it is bhej deta hai
    
    res.send({
        message: "here is you todo list",
        data: todos
    })
})


app.delete('/del', (req, res) => {
    todos=[]
    res.send({
        message: "todo is deleted",
        data: todos
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


var dbURI = "mongodb+srv://zaidasim2197:0900786zaid@cluster0.jl5kiyo.mongodb.net/abcddatabase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
    // process.exit(1);
});
mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});
process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});