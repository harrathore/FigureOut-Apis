const GroupModel = require("../DbModels/GroupModel");
const TransactionModel = require("../DbModels/TransactionModel");
const UserModel = require("../DbModels/UserModel");

const {generateToken, verifyJwt} = require('../Utility/jwt')
async function myGroups(req, res){
    res.send("Current User all Groups....")
}

async function createGroup(req, res){

    // Get user email from Jwt(Verify all the requests)
   
    const jwtToken = req.header("token");
    let verified = null;
    try{
        verified = await verifyJwt(jwtToken);
    }catch(error){
        console.log(error.message)
    }
   if(verified){
        const userEmail =  verified.email
        try{
            const newGroup = new GroupModel({
                groupName : req.body.groupname,
                transactions : [],
                participants : [userEmail]
            });

            const savedGroup = await newGroup.save();
            res.status(201).json(savedGroup._id);
        }
        catch(error){
            res.status(400).json({message : error.message});
        }
   }else{
      res.status(401).json({message : "you are not authorisez to acces this......"})
   }

}

async function addMember(req, res){
    const jwtToken = req.header("token");
    let verified = null;
    try{
        verified = await verifyJwt(jwtToken);
    }catch(error){
        console.log(error.message)
    }
    if(verified){
        let participantEmail = req.body.participant;
        const participantFinalEmail = participantEmail.toLowerCase();
        const groupId = req.body.groupid;
        let isGroup = null
        let isUser = null;
        try{
           isUser = await UserModel.findOne({email : participantEmail});
        }catch(error){
            console.log(error.message);
        }
        try{
            isGroup = await GroupModel.findById(groupId);
        }catch(error){
            console.log(error.message)
        }
        if(!isUser){
            res.status(401).json({message : "This User is not a valid User....."});
        }else if(!isGroup){
            res.status(401).json({message : "Group you are requesting for is not present...."});
        }else{
            let ress = null;
            try{
                ress = await GroupModel.findOneAndUpdate({_id : groupId}, {$push: {participants: participantFinalEmail}});
            }catch(error){
                console.log(error.message)
            }
            if(ress){
                res.status(201).json(ress);
            }
        }
       
    }else{
        res.status(401).json({message : "you are not loged in... First Login into the system...."})
    }
}

async function removerMember(req, res){
    res.send("This is to remove the member from the group...");
}


async function addExpense(req, res){

    let jwtToken = req.header("token");
    let verified = null;
    try{
        verified = await verifyJwt(jwtToken);
    }catch(error){
        console.log(error.message);
    }
    if(verified){
        let groupId = req.body.groupid;
        let isGroup = null;
        try{
            isGroup = await GroupModel.findById(groupId);
        }catch(error){
            console.log(error.message);
        }
        if(isGroup){
           let userEmail = req.body.by;    //Check if it is present in this group or not ?? --> if not then we can't add it add by using this participant
           let amount =  0;
           amount = req.body.amount;

           let newTransaction = new TransactionModel({
              userBy : userEmail,
              transactionDate : new Date(),
              transactionAmount : amount
           });
           const ress = await GroupModel.findOneAndUpdate({_id : groupId}, {$push : {transaction : newTransaction}});
           res.status(201).json(ress);
       }

    }else{
        res.status(401).json({message : "You are not authorized to add bill......"});
    }
   
}


async function calculate(req, res){

    let jwtToken = req.header("token");
    let verified = null;
    try{
        verified = await verifyJwt(jwtToken);
    }catch(error){
        console.log(error.message);
    }

    if(verified){
        let groupId = req.body.groupid;
         //Take all transaction from Group and iterate and store in map and create Pbject of email and Money
         let listOfTransaction = [];
         try{
             let groupModel = await GroupModel.findById(groupId);
           //  console.log("group is : " + groupModel)
             listOfTransaction = groupModel.transaction;
         }catch(error){
            console.log(error.message);
         }
         //console.log("List is : " + listOfTransaction);
         let listLen = listOfTransaction.length;
         let totalAmount = 0;
         let amountMap = new Map();

         for(index=0; index<listLen; index++){
            let userEmail = listOfTransaction[index].userBy;
            let amount = listOfTransaction[index].transactionAmount;
            totalAmount = totalAmount + amount;
            if(amountMap.has(userEmail)){
                let prevAmount = amountMap.get(userEmail);
                amountMap.set(userEmail, (amount+prevAmount));
            }else{
               amountMap.set(userEmail, amount); 
            }
         }

         let totalMember = amountMap.size;
         let eachOnesAmount = totalAmount/totalMember;


         let finalArr = new Array();
         let obj = {"EveryOnes have to pay" : eachOnesAmount};
         finalArr.push(obj);
         amountMap.forEach((value, key) => {
            console.log(value, key); 
            let obj = {Email : key, amount : value, remained : (value-eachOnesAmount)}
            finalArr.push(obj)
          });
         
         
         res.status(200).json(finalArr);
         

    }else{
        res.status(400).json({message : "You are not authorised......"});
    }
}

// async function deleteGroup(req, res){
//     res.send("This is to delete a group....")
// }

module.exports = {myGroups, createGroup, addMember, removerMember, addExpense, calculate}