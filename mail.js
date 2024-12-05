const firebaseConfig = {
    apiKey: "AIzaSyDadUewTNXUwGRG582IjrwxAEr_JN9Jvco",
    authDomain: "contact-form-e5260.firebaseapp.com",
    databaseURL: "https://contact-form-e5260-default-rtdb.firebaseio.com",
    projectId: "contact-form-e5260",
    storageBucket: "contact-form-e5260.firebasestorage.app",
    messagingSenderId: "78674845781",
    appId: "1:78674845781:web:0f33bdebef555bcdf474dc"
  };
// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database 
var contactFormDB = firebase.database().ref("contactForm");

document.getElementById('contactForm').addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();

    var name = getElementval("name");
    var email = getElementval("email");
    var message = getElementval("message");

    saveMessages(name, email, message);

   // enable alert 
    document.querySelector('.alert').style.display = 'block';

    // remove the alert
    setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';   
    }, 3000);

    // reset the form
    document.getElementById('contactForm').reset()
}

const saveMessages = (name, email,message) =>{
    var newContactForm = contactFormDB.push();
    
    newContactForm.set({
        name : name,
        email : email,
        message : message,
    });
};


const getElementval = (id) => {
    return document.getElementById(id).value;
};