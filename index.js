const express=require("express");
const bcrypt=require('bcrypt');
const session=require('express-session');
const flash=require('express-flash');
const db=require('./connection/db');
const upload=require('./middlewares/fileupload');
const { redirect } = require("express/lib/response");

const app=express();
let port=3000;


//use hbs
app.set('view engine','hbs');//set template engine
app.use('/public', express.static(__dirname+'/public'));//because default express is protect static file use this built-in midleware    
                                                        //static file in public can use in express,first one create public folder then move static file in this
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(express.urlencoded({extended:false}));//agar tipe dari submit dijadikan string
app.use(flash());
app.use(
    session({
        cookie: {
            maxAge:2*60*60*100,
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave:false,
        secret: 'secretValue'
    })
)


// login n reg
app.get('/register',function(req,res){
    res.render('register');
})

app.post('/register',function(req,res){

    let message=makeValidation(req.body);
    if(message!='Your acount was created'){
        req.flash('active',' ');
        req.flash('failed',message);
        return res.redirect('/login');
    }

    const {userName,email,password} = req.body;
    const hashPassword=bcrypt.hashSync(password,10);

    let shortQuery=`INSERT INTO tb_user(name,email,password) VALUES('${userName}','${email}','${hashPassword}')`;
    
    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err)throw err
            req.flash('active',' ');
            req.flash('success','Your account was created');
            res.redirect('/login');
        })

    });
});

app.get('/login',function(req,res){
    res.render('login');
})

app.post('/login',function(req,res){

    const {email,password}=req.body;

    let shortQuery=`SELECT * FROM tb_user WHERE email='${email}'`;
    
    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(result.rows.length==0){
                req.flash('active',' ');
                req.flash('failed','Your data not found');
                return res.redirect('/login');
            } 
            const isMatch=bcrypt.compareSync(password,result.rows[0].password);
            if(isMatch){
                req.session.isLogin=true;
                if(result.rows[0].name=='admin'){
                    req.session.isAdmin=true;
                } else {
                    req.session.isAdmin=false;
                }
                req.session.user={
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }
                req.flash('success','Login success');
                res.redirect('/blog');
                
            } else {
                req.flash('failed','Incorect password');
                res.redirect('/login');
            }
        })

    });
})

app.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect('/login');
});

//routing express
app.get('/',function(req,res){

    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query('SELECT * FROM tb_experience',function(err,result){
            if(err)throw err
            // data: result.rows
                res.render('index', { isLogin: req.session.isLogin,user: req.session.user} );
            })
        })
})

app.get('/form',function(req,res){
    res.render('form',{ isLogin: req.session.isLogin,user: req.session.user});
})

app.get('/blog',function(req,res){

    let shortQuery=`SELECT tb_blog.id,tb_blog.title,tb_blog.content,tb_blog.image,tb_blog.post_at,tb_user.name AS author,tb_blog.authorid
    FROM tb_blog LEFT JOIN tb_user ON tb_blog.authorid=tb_user.id`;

    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err)throw err

            let dataToRender=result.rows;
            dataToRender=dataToRender.map( (data) => { 
                return {
                    ...data,
                    timeShow: GetFullTime(data.post_at),
                    distanceTime: getDistanceTIme(data.post_at),
                    isAdmin: req.session.isAdmin,
                    isLogin: req.session.isLogin
                }
            }) 
            console.log(req.session.isAdmin);
            res.render('blog', { isLogin:req.session.isLogin,user: req.session.user, blogCont: dataToRender} );
        })

    });
});

app.post('/blog', upload.single('image'), function(req,res){

    let image=req.file.filename;

    let data=req.body;

    let authorId=req.session.user.id;

    let shortQuery=`INSERT INTO tb_blog(title,content,authorid,image) VALUES('${data.title}','${data.content}',${authorId},'${image}')`;
    
    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err)throw err
            res.redirect('/blog');
        })

    });

});

app.get('/edit-blog/:id',function(req,res){

    let shortQuery=`SELECT * FROM tb_blog WHERE id=${req.params.id}`;
    
    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err)throw err
            res.render('edit-blog', { user: req.session.user,id: req.params.id, isLogin: req.session.isLogin, getTitle: result.rows[0].title, getContent: result.rows[0].content } );
        })

    });
});

app.post('/edit-blog/:id',upload.single('image'),function(req,res){
    let image=req.file.filename;
    let shortQuery=`UPDATE tb_blog SET title='${req.body.title}',content='${req.body.content}',image='${image}' WHERE id=${req.params.id}`;
    db.connect(function(err,client,done){
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err) throw err;
            res.redirect('/blog');
        });
    });
})

app.get('/addblog',function(req,res){
    if(!req.session.isLogin){
        req.flash('danger','please login');
        return res.redirect('/login');
    }
    res.render('addblog', { user: req.session.user, isLogin:req.session.isLogin } );
})

app.get('/delete-blog/:id',function(req,res){
    
    let id=req.params.id;

    let shortQuery=`DELETE FROM tb_blog WHERE id=${id}`;
    
    db.connect(function(err,client,done){
        
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err)throw err
            res.redirect('/blog');
        });

    });
    
})

app.get('/blog-detail/:id',function(req,res){
    let id=req.params.id;

    let shortQuery=`SELECT tb_blog.id,tb_blog.title,tb_blog.content,tb_blog.image,tb_blog.post_at,tb_user.name AS author,tb_blog.authorid
    FROM tb_blog LEFT JOIN tb_user ON tb_blog.authorid=tb_user.id WHERE tb_blog.id=${req.params.id}`;
    
    db.connect(function(err,client,done){
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err) throw err;
            let data=result.rows[0];
            console.log(data);
            // console.log(data);
            res.render('blog-detail', { blog: data,now:GetFullTime(data.post_at) } );
        })
    });
})

app.get('/profil',function(req,res){
    res.render('profil',{user: req.session.user});
});

app.post('/profil/:id',upload.single('image'),function(req,res){
    let shortQuery=`UPDATE tb_user SET name='${req.body.name}',email='${req.body.email}' WHERE id=${req.params.id}`;
    db.connect(function(err,client,done){
        if(err) throw err;

        client.query(shortQuery,function(err,result){
            if(err) throw err;
            req.flash('active',' ');
            req.flash('success','Change data successfully update');
            res.redirect('/profil');
        });
    });
})


app.listen(port,function(){
    console.log("server start  3000");
})


function GetFullTime(time){
  let month=['January','February','March','April','May','June','July','August','October','September','Novemebr','Desember'];
  let date=time.getDate();
  let monthIndeks=time.getMonth();
  let year=time.getFullYear();

  let hour=time.getHours();
  let minute=time.getMinutes();

  let fulltime=`${month[monthIndeks]} ${date} ${year} ${hour}:${minute}`;
  return fulltime;
}

function getDistanceTIme(time){
    let timePost=time;
    let timeNow=new Date();
    let distance=timeNow-timePost;
  
    let miliSecond=1000;
    let minuteInHour=3600;
    let hourInday=23;
  
    let distanceDay=distance/(miliSecond*minuteInHour*hourInday);
    distanceDay=Math.floor(distanceDay);
  
    let distanceHours=Math.floor(distance/(1000*60*60));
    let distanceMinute=Math.floor(distance/(1000*60));
    let distanceSecond=Math.floor(distance/1000);
  
    if(distanceDay>=1){
      return `${distanceDay} day ago`;
    } else if(distanceHours>=1){
      return `${distanceHours} hour ago`;
    } else if(distanceMinute>=1){
      return `${distanceMinute} minute ago`;
    } else {
      return `${distanceSecond} second ago`;
    }
  }
  

function makeValidation(data){
    let isSuccess='';
    let{userName,email,password}=data;
    if(userName.length==0||email.length==0||password.length==0){
        return 'username is empty';
    }
    userName=userName.toLowerCase();
    for(let i=0;i<userName.length;i++){
        if( !(  (userName[i]>='a' && userName[i]<='z') || userName[i]==' ' ) ){
            return 'name cannot be insert a number';
        }
    }

    for(let i=0; i<email.length; i++){
        if(email[i]=='@'){
            let domainName=''; let z=i+1;
            for(let j=z; email[j]!='.' ; j++){
                domainName+=email[j];
                z++;
            } z++;
            if(domainName=='gmail' || domainName=='yahoo' || domainName=='hotmail'|| domainName=="mail"){
                let domain='';
                for( ; z<email.length; z++){ domain+=email[z]; }
                if(domain=='com'||domain=='co.id'||domain=='net'||domain=='co.uk'){ isSuccess='success'; }
                else {return 'domain email name not int the list';}
            } else{return 'domain email name is not valid';}
        }
    }
    
    let passowrdStrong=0;
    // if(password.length<8){return 'passowrd length at least 8 chracter'}
    for(let i=0; i<password.length; i++){

        if( password[i]>='a' && password[i]<='z' ){passowrdStrong++;}
        else if(password[i]>='A' && password[i]<='Z'){passowrdStrong++;}
        else if(password[i]>='0'&& password[i]<='9'){passowrdStrong++;}
        else if( (password[i]>='!' && password[i]<='/') || (password[i]>=':' && password[i]<'A') 
                (password[i]>='[' && password[i]<='`') || (password[i]>='{'&& password[i]<='~')){
            passowrdStrong++;
        }

    }
    console.log(passowrdStrong);
    if(passowrdStrong==1){return isSuccess='password is weak';}
    else if(passowrdStrong==2){return isSuccess='less uppercase for password';}
    else if(passowrdStrong==3){return isSuccess='less number for password';}
    else if(passowrdStrong>=4){return isSuccess='Your acount was created';}
}

// account list
// katty@gmail.com, fans12.A
//rino@gmail.com, rino