const API_URL = "https://script.google.com/macros/s/AKfycbx20JmAJIpkqiani_q-6ZY_TGA1weXhzv6yniB5BJp3INfhTYsPBmlvWDb7bRyele4DJw/exec";

function submitLead(){

  let data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    interest: document.getElementById("interest").value,
    message: document.getElementById("message").value
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(res => {

    console.log(res);

    if(res === "SUCCESS"){

      alert("Submitted Successfully!");

      let msg = `GIABD Application 🇯🇵
Name: ${data.name}
Phone: ${data.phone}
Interest: ${data.interest}`;

      window.open(
        `https://wa.me/8801830150171?text=${encodeURIComponent(msg)}`
      );

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
