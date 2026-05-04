
const API_URL = "https://script.google.com/macros/s/AKfycbxTiAE72GuaykC2ZJeCQE7njhy8EbC1BHX8yWVrO75fGPg911n5hm1EIWW8WWkXYL2a/exec";

function submitLead(){

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let interest = document.getElementById("interest").value;

  if(!name || !phone){
    alert("Please fill required fields");
    return;
  }

  let data = {
    name: name,
    phone: phone,
    interest: interest,
    source: "GIABD GitHub Site"
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  // WhatsApp funnel
  let msg = `GIABD Application 🇯🇵
Name: ${name}
Interest: ${interest}
Phone: ${phone}`;

  window.open(
    `https://wa.me/8801830150171?text=${encodeURIComponent(msg)}`
  );

  alert("Submitted Successfully!");
}
