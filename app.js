// const { default: axios } = require("axios");
// const { response } = require("express");


function creAccount(){
    var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;
    var contact = document.getElementById("cont").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(firstName);
    console.log(lastName);
    console.log(contact);
    console.log(email);
    console.log(password);

    axios.post('http://localhost:3000/user',{
        firstName: firstName,
        lastName : lastName,
        contact:contact,
        email:email,
        password:password
})
.then((response)=>{
    console.log(response);
    alert(response.data.message)

    document.getElementById("fname").value="";
    document.getElementById("lname").value="";
    document.getElementById("cont").value="";
    document.getElementById("email").value="";
    document.getElementById("password").value="";


}).catch((error)=>{
    console.log(error, "ye error h");
    alert(error.response.data.message)
})
}
 
function login(){
    // var firstName = document.getElementById("loginEmail").value;
   const loginEmail = document.getElementById("loginEmail").value;
   const loginPassward = document.getElementById("loginPassword").value;
console.log('ye login email password h', loginEmail ,'', loginPassward);
// console.log(firstName);
    axios.post('http://localhost:3000/login',{
     email:loginEmail,password:loginPassward
    }).then((response)=>{
        console.log(response);
        alert(response.data.message)
        window.location.href = "msg.html";
            window.localStorage.setItem("loginemail", loginEmail)
            window.localStorage.setItem("loginpassword", loginPassward)
    }).catch((error)=>{
        console.log(error);
        alert(error.response.data.message)
    })
}


///// message /////

function sendMessage(){
    const sendM = document.getElementById("sendM").value;
    const mBody = document.getElementById("cardBody")
    console.log(sendM);
    // sendM.addEventListener("keyup", function(event) {
    //     if (event.keyCode === 13) {
    //      event.preventDefault();
    //      document.getElementById("mybtn").click();  
    //     }
    //     });
         var home=`
         <div class="text-end d-fle align-items-basedline nb-4">
         <div class="pe-2">
         <div class="card d-inline-block p-2 px-3 m-1">${sendM}</div>
         <i class="fas fa-user-circle"></i>
         </div>
         </div>
         `
         mBody.innerHTML+=home;
    axios.post('http://localhost:3000/message',{
        message:sendM
    }).then((response)=>{
        console.log(response);
        console.log(response.data.message);
        document.getElementById("sendM").value=""
        getData();
    }).catch((error)=>{
        console.log(error);
        console.log(error.response.data.message);
        alert(error.response.data.message)
    })
}

function getData(){
    axios.get('http://localhost:3000/get')
    .then((response)=>{
        console.log(response);
        document.getElementById("cardBody").innerHTML=""
        response.data.forEach((data) => {
            // const createArray = []
            // createArray.push(data.message)
            // console.log(createArray);
            
            // console.log(data.message, " ye message h");
            var home1=`
         <div class="text-end d-fle align-items-basedline nb-4">
         <div class="pe-2">
         <div class="card d-inline-block p-2 px-3 m-1">${data.message}</div>
         <i class="fas fa-user-circle"></i>
         </div>
         </div>
         `
         document.getElementById("cardBody").innerHTML+=home1
        });
        
    })
    .catch((error)=>{
        console.log(error);
    })
}
getData();
