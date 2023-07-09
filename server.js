const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))

app.get("/list", (req, res, next) => {
    fs.readFile(path.join(__dirname, "ListData", "listData.json"), "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send("Server Error")
        } else {
            const parsedData = JSON.parse(data)
            res.status(200).json(parsedData)
        }
    })
})

app.post("/list", (req, res, next) => {
    let listData = req.body.listData

    fs.readFile(path.join(__dirname, "ListData", "listData.json"), "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send("Server Error")
        } else {

            let list = JSON.parse(data)
            let newListData = {
                id: list.length > 0 ? list[list.length - 1].id + 1 : 1,
                data: listData,
                done: false
            }

            console.log(newListData)

            list.push(newListData)

            fs.writeFile(path.join(__dirname, "ListData", "listData.json"), JSON.stringify(list, null, 2), "utf-8", (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).send("Server Error");
                } else {
                    res.status(200).send("New Item Added");
                }
            })
        }
    })
})

app.patch("/list", (req, res, next) => {
    console.log(req.body)
    let isDone = req.body.isDone
    let id = req.body.listID

    fs.readFile(path.join(__dirname, "ListData", "listData.json"), "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send("Server Error")
        } else {

            let list = JSON.parse(data)

            for (let i=0; i < list.length; i++) {
                if (list[i].id === id) {
                    list[i].done = isDone
                }
            }

            fs.writeFile(path.join(__dirname, "ListData", "listData.json"), JSON.stringify(list, null, 2), "utf-8", (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).send("Server Error");
                } else {
                    res.status(200).send("Task Done");
                }
            })
        }
    })
})

app.post("/list/remove", (req, res, next) => {
    let listID = req.body.listID

    fs.readFile(path.join(__dirname, "ListData", "listData.json"), "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send("Server Error")
        } else {
            let list = JSON.parse(data)

            let index = list.findIndex(obj => obj.id === listID);

            if (index !== -1) {
                list.splice(index, 1);

                fs.writeFile(path.join(__dirname, "ListData", "listData.json"), JSON.stringify(list, null, 2), "utf-8", (err) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send("Server Error");
                    } else {
                        res.status(200).send("Item Removed");
                    }
                })
            } else {
                res.status(400).send("Item Not Found In List")
            }
        }
    })
})

app.listen(process.env.SERVER_PORT, () => {console.log(`Listening on Port: ${process.env.SERVER_PORT}`)}) 