const API_URL = "https://script.google.com/macros/s/AKfycbyTOxQTg8sP-NwY2LgRnVR-1C7j6RcM1T6VXc1t8YW0hGDkQSxrAtJrtJgTI5UgfkJxtw/exec";

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

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(res => {

    console.log("Server Response:", res);

    if(res === "SUCCESS"){

      let msg = `GIABD Application 🇯🇵
Name: ${name}
Phone: ${phone}
Interest: ${interest}`;

      window.open(
        `https://wa.me/8801830150171?text=${encodeURIComponent(msg)}`
      );

      alert("Submitted Successfully!");

      document.getElementById("applyForm").reset();

    } else {
      alert("Server Error: " + res);
    }

  })
  .catch(err => {
    console.log(err);
    alert("Network Error");
  });

}
