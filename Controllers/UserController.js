

const UserModel = require('../DbModels/UserModel');
const { generateToken } = require('../Utility/jwt');

async function getAllUsers(req, res){
    res.send("This is for all users of Our Application.........");
}

async function registerUser(req, res){
    
    let userInputEmail = req.body.email;
    const finalEmail = userInputEmail.toLowerCase();    
   try{
        const userModel = new UserModel({
            name : req.body.name,
            email :  finalEmail,
            password : req.body.password
        });

        const savedUser = await userModel.save();
        res.status(201).json({savedUser});

   }catch(error){
      res.status(401).json({message : error.message});
   }
        
}

async function loginUser(req, res){

    let userInputEmail = req.body.email;
    const useremail = userInputEmail.toLowerCase(); 
    const password = req.body.password;

    if(useremail === null){
        res.status(400).json("Email Can't be Empty");
    }else if(password === null){
       res.status(400).json("Password can't be Empty");
    }else{
        let savedUser = null;
        try{
            savedUser = await UserModel.findOne({email : useremail});
        }catch(error){
            res.status(404).json({message : error.message});
        }

       if(savedUser === null){
           res.send(400).json("user with name is not present, Please register before login....");
       }else if(password !== savedUser.password){
           res.status(400).json("Password for this user doses'nt match.....");
       }else{
            try{
                const userEmail = savedUser.email;
                const jwtToken = await generateToken(userEmail);
                res.send(jwtToken); 
            }catch(error){
                res.send(error);
            }
       }  
    }
}

module.exports = {getAllUsers, registerUser, loginUser};