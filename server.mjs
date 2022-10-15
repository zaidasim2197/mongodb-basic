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


app.use(express.json());
app.use(cors());

app.post('/todo', (req, res) => {

    todoModel.create({ text: req.body.text }, (err, saved) => {
        if (!err) {
            console.log(saved);

            res.send({
                message: "your todo is saved"
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    })
})
app.get('/todos', (req, res) => {

    todoModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "here is you todo list",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.put('/todo/:id', async (req, res) => {

    try {
        let data = await todoModel
            .findByIdAndUpdate(
                req.params.id,
                { text: req.body.text },
                { new: true }
            )
            .exec();

        console.log('updated: ', data);

        res.send({
            message: "todo is updated successfully",
            data: data
        })

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})


app.delete('/todos', (req, res) => {

    todoModel.deleteMany({}, (err, data) => {
        if (!err) {
            res.send({
                message: "All Todo has been deleted successfully",
            })
        } else {
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

app.listen(port, () => {
    console.log(`Server app is listening on port ${port}`)
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