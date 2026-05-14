const API_URL = "https://script.google.com/macros/s/AKfycbyIoP40SYo9fhHlrFPmyEgPEqyBclQRpV6vMzKZ6TIvud-nzydrAHprnuq8JLqfpTA6/exec";

function submitLead(){

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let interest = document.getElementById("interest").value;
  let message = document.getElementById("message").value;

  if(!name || !phone){
    alert("Please fill required fields");
    return;
  }

  let data = {
    name,
    phone,
    interest,
    message
  };

  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify(data),
    headers:{
      "Content-Type":"application/json"
    }
  })
  .then(()=>{

    let msg = `GIABD Application 🇯🇵
Name: ${name}
Interest: ${interest}
Phone: ${phone}`;

    window.open(
      `https://wa.me/8801830150171?text=${encodeURIComponent(msg)}`
    );

    alert("Submitted Successfully!");

    document.getElementById("applyForm").reset();

  })
  .catch(()=>{
    alert("Error submitting form");
  });

}
