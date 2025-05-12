import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import e from "express";

const app = express();
const port = 3000;
const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"secret",
  password:"232004",
  port:5432
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  
  try{
    const checkresult=await db.query("select * from users where email=($1)",[email]);
    if (checkresult.rowCount > 0) {
      res.send(`
        <html>
          <head>
            <style>
              .toast {
                visibility: hidden;
                min-width: 250px;
                margin-left: -125px;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 2px;
                padding: 16px;
                position: fixed;
                z-index: 1;
                left: 50%;
                bottom: 30px;
              }
    
              .toast.show {
                visibility: visible;
                animation: fadeInOut 5s;
              }
    
              
            </style>
          </head>
          <body>
            <div id="toast" class="toast">Email already exists, try login</div>
    
            <script type="text/javascript">
              // Show the toast message
              var toast = document.getElementById('toast');
              toast.className = 'toast show';
    
              // Redirect after 5 seconds
              setTimeout(function() {
                window.location.href = '/login';
              }, 5000);
            </script>
          </body>
        </html>
      `);
    }
    else{
      const result=await db.query(
        "insert into users(email,password) values($1,$2)",
        [email,password]
      );
      res.render("secrets.ejs") 
    }
  }
  catch(err){
    console.error(err);
  }
});

app.post("/login", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  try{

  
    const correctpassword=await db.query("select password from users where email=($1)",[email]);
    // console.log("correct password "+correctpassword.rows[0].password);
    // console.log("password "+password);
    // console.log(password==correctpassword);
    if(correctpassword.rowCount>0){
      if(password==correctpassword.rows[0].password) res.render("secrets.ejs");
      else{
        res.send(`
        <html>
          <head>
            <style>
              .toast {
                visibility: hidden;
                min-width: 250px;
                margin-left: -125px;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 2px;
                padding: 16px;
                position: fixed;
                z-index: 1;
                left: 50%;
                bottom: 30px;
              }
    
              .toast.show {
                visibility: visible;
                animation: fadeInOut 5s;
              }
    
              
            </style>
          </head>
          <body>
            <div id="toast" class="toast">Password is wrong</div>
    
            <script type="text/javascript">
              // Show the toast message
              var toast = document.getElementById('toast');
              toast.className = 'toast show';
    
              // Redirect after 5 seconds
              setTimeout(function() {
                window.location.href = '/login';
              }, 5000);
            </script>
          </body>
        </html>
        `);
      }
    }
    else{
      res.send("user not found try register with new user");
    }
  }
  catch(err){
    console.error(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
