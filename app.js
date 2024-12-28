const express=require("express");
const bodyparse=require("body-parser");
const fs=require("fs");

const app=express();
app.use(bodyparse.urlencoded({extended:false}));

app.get('/login',(req,res,next)=>{                                  //can be moved to login.js
    //console.log("This is login page.");
    res.send(`<html><body><form action="/login" method="POST"><input type="text" name="username"><button type="submit">Login</button>`)
})
app.post('/login',(req,res)=>{              //can be moved to login.js
    let username=req.body.username;

    if(!username){
        return res.status(400).send("Username is needed to login.")
    }
    //Now to store username in localstorage
    res.send(
        `<script>
            localStorage.clear();
            localStorage.setItem('username','${username}');
            window.location.href = '/';
        </script>`
    )
});

//Making chat area

app.get('/',(req,res)=>{
    fs.readFile("textchat.txt",(err,data)=>{
        //console.log(data.toString());
        res.send(`<form action="/" method="POST">
                    <p>${data.toString()}<p>
                    <input type="text" name="message">
                    <input type="hidden" id="username" name="username">
                    <button type="submit">Send</button>
                  </form>
                  <script>
                    window.onload = function(){
                        const username=localStorage.getItem('username');
                        if(!username){
                            alert("You are not logged in!");
                            window.location.href='/login';
                        } else{
                            console.log(username);
                            document.getElementById("username").value=username;
                        }
                    };
                  </script>
        `)
    })
})
app.post('/',(req,res)=>{
    let username=req.body.username;
    console.log(username);
    let message=req.body.message;
    let formattedtext=` ${username}: ${message}`;
    fs.appendFile("textchat.txt",formattedtext,(err)=>{
        res.redirect('/');
    })
})


app.get((req,res,next)=>{
    res.status(404).send(`<h1>Page not Found</h1>`);
})

app.listen(5500,()=>{
    console.log("SErver is running");
})