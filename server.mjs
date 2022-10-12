import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; 


let todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    classId: String,
    createdOn: { type: Date, default: Date.now }
});
const todoModel = mongoose.model('todos', todoSchema);


const app = express()
const port = process.env.PORT || 3000;


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
    
    todoModel.create({ text: req.body.text }, (err, saved) => {
        if (!err) {
            console.log(saved);

            res.send({
                message: "Wait please"
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    })
})
app.get('/todos', (req, res) => {  //simply jo data hota hai usko as it is bhej deta hai
    
  
    todoModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "here is you todo list",
                data: data
            })
        }else{
            res.status(500).send({
                message: "server error"
            })
        }
    });
})
app.delete('/todos', (req, res) => {
    
    todoModel.deleteMany({}, (err, data) => {
        if (!err) {
            res.send({
                message: "Your todo is deleted",
            })
        }else{
            res.status(500).send({
                message: "server error"
            })
        }
    });
})
app.delete('/todo/:id', (req, res) => {

    todoModel.deleteOne({ _id: req.params.id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Todo has been deleted successfully",
                })
            } else {
                res.send({
                    message: "No todo found with this id: " + req.params.id,
                })
            }


        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})


// app.put('/edit', (req, res) => {
    
//     todoModel.findOneAndUpdate({}, (err, data) => {
//         if (!err) {
//             res.send({
//                 message: "Your todo is updated",
//                 data: data
//             })
//         }else{
//             res.status(500).send({
//                 message: "server error"
//             })
//         }
//     });
// })


// app.delete("/delete", (req, res) => {
//     todoModel.deleteOne({})
//       .then(() => {
//         console.log("Deleted Todo Successfully!");
//         res.redirect("/");
//       })
//       .catch((err) => console.log(err));
//   });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


var dbURI = "mongodb+srv://zaidasim2197:0900786zaid@cluster0.jl5kiyo.mongodb.net/abcdatabase?retryWrites=true&w=majority";
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
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