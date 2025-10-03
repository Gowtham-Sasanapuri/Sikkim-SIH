const navbarItems = document.querySelectorAll("#navbar > div");
const contentSections = document.querySelectorAll("#body_contents > div");
let header = document.querySelector("#header h1");
let user = JSON.parse(localStorage.getItem("user"));
let username = user.username;
const guideDetails = document.getElementById("guide_details");
const editBtn = document.querySelector("#edit_btn button");
const saveBtn = document.querySelector("#save_btn button");
let profile_img = document.getElementById("profile_img")
let img_btn = document.getElementById("edit_img")
const fileInput = document.getElementById("file_input");
let requests = document.getElementById("Request_contents")
let log_out_btn = document.querySelector("#logout_btn button")
let guide = JSON.parse(localStorage.getItem("user"))
let guide_name = guide.username
let role = guide.role

log_out_btn.addEventListener("click" , () => {
  localStorage.removeItem("user")
  window.location.href = "/sikkim_frontend/Home Page/Home Page.html"
})

fetch("http://127.0.0.1:8000/get_guide_details/",{
  method : "POST",
  headers : {
    "Content-Type" : "application/json"
  },
  body : JSON.stringify({guide_name})
}).then(response => response.json())
.then(data => { 
  console.log(data,">>>>");
  if(data.success){
    const guide = data.data;

      // Update profile image
      const imgElement = document.querySelector("#guide_img img");
      if (guide.Guide_Image) {
        imgElement.src = "http://127.0.0.1:8000" +guide.Guide_Image;
      } else {
        imgElement.src = "default_profile.png"; // fallback image
      }

      // Update text fields
      document.getElementById("username_value").textContent = guide.Guide_Username;
document.getElementById("fullname_value").textContent = guide.Guide_FullName;
document.getElementById("experience_value").textContent = guide.Guide_experience + " years";
document.getElementById("phone_value").textContent = guide.Guide_Number;
document.getElementById("gender_value").textContent = guide.Guide_Gender;
document.getElementById("languages_value").textContent = guide.Guide_Languages_know;

  }else{
    window.location.href = "../Registration/registration.js"
  }
}).catch(error => {
      console.error("Error fetching guide details:", error);
    });

function accepting_or_rejecting_req(opinion,user_id,guide_id){
  fetch("http://127.0.0.1:8000/updating_status/",{
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({"accept_or_reject" : opinion,
      guide_id,
      user_id
    })
  }).then(response => response.json())
  .then(data => {
    console.log(data)
    if(data.success){
      alert(data.msg)
    }else{
      alert(data.msg)
    }
    window.location.reload();  
  })
}

if (role === "Guide") {
  fetch("http://127.0.0.1:8000/get_status_for_guide/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      guide_name
    })
  }).then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.success) {
        data.data.forEach(req => {
          if (req.status === 0) {
            // Add to Request_contents
            let requestDiv = document.createElement("div");
            requestDiv.innerHTML = `
            <div style="text-align: left;">
                <h3><i class="fa-solid fa-user"></i> ${req.user}</h3>
                <p><i class="fa-solid fa-calendar"></i>     Dates : </p>
                <p>From : ${req.from_date}</p>
                <p>To :${req.to_date} </p>
            </div>
            <div class="accept_reject_btns">
              <button class="accept">Accept</button>
              <button class="reject">Reject</button>
            </div>
          `;
            document.getElementById("Request_contents").appendChild(requestDiv);
            let accept_btn = requestDiv.querySelector(".accept_reject_btns .accept")
            let reject_btn = requestDiv.querySelector(".accept_reject_btns .reject")

            accept_btn.addEventListener("click", () => {
              console.log("accept", req.id, req.guide_id)
              accepting_or_rejecting_req("accept", req.id, req.guide_id)
            })

            reject_btn.addEventListener("click", () => {
              console.log("accept", req.id, req.guide_id)
              accepting_or_rejecting_req("reject", req.id, req.guide_id)
            })

          } else if (req.status === 1) {
            // Add to Itinerary_contents
            let row = document.createElement("tr");
            row.innerHTML = `
            <td>${req.user}</td>
            <td>${req.user_number}</td>
            <td>${req.from_date}</td>
            <td>${req.to_date}</td>
            <td><button>Create Itinerary</button></td>
          `;
            document.querySelector("#Itinerary_contents tbody").appendChild(row);
            let itinerary_create_btn =  row.querySelector("tr td button")
            itinerary_create_btn.addEventListener("click",() => {
              console.log(req.id)
              window.location.href = `../Itinerary_Page/Itinerary.html?user_id=${req.id}`
            })
          }
        })
      }
    })
}else{
  window.location.href = "../Registration/Registration.html"
}

if(role === "Guide"){
  fetch("http://127.0.0.1:8000/already_created_user_details/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      guide_name
    })
  }).then(response => response.json())
  .then(data => {
    console.log("^^^^",data);
    if (data.success) {
        const tbody = document.querySelector("#Itinerary_created_contents table tbody"); // Make sure your table has id="user_table"
        tbody.innerHTML = ""; // Clear existing rows

        data.data.forEach(user => {
            const tr = document.createElement("tr");

            // Username column
            const tdName = document.createElement("td");
            tdName.textContent = user.username;
            tr.appendChild(tdName);

            // Mobile column
            const tdMobile = document.createElement("td");
            tdMobile.textContent = user.mobile;
            tr.appendChild(tdMobile);

            // View Itinerary button column
            const tdButton = document.createElement("td");
            const btn = document.createElement("button");
            btn.textContent = "View Itinerary";

            // Add click event to button
            btn.addEventListener("click", () => {
                // Store user_id in localStorage or use URL query param
                localStorage.setItem("view_user_id", user.user_id);

                // Redirect to itinerary page
                window.location.href = "../view_itenary/view.itinerary.html";
            });

            tdButton.appendChild(btn);
            tr.appendChild(tdButton);

            // Append row to tbody
            tbody.appendChild(tr);
        });
    }else{
      alert("Technical issue try again after some time")
    }
    
  }).catch(err => console.error(err)
  )
}

fetch(" http://127.0.0.1:8000/past_tourist/",{
  method : "POST",
  headers : {
    "Content-Type" : "application/json"
  },
  body : JSON.stringify({guide_name})
}).then(response => response.json())
.then(data =>{
  console.log("past tourist",data);
  if (data.success) {
      const tbody = document.querySelector("#past_tourist_contents tbody");
      tbody.innerHTML = ""; // Clear old data if any

      data.users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.mobile}</td>
          <td>${user.location}</td>
        `;

        tbody.appendChild(row);
      });
    } else {
      console.error("Failed to fetch users:", data.msg);
    }
  
})

img_btn.addEventListener("click", () => {
  fileInput.click(); // open file chooser
});

editBtn.addEventListener("click", () => {
  saveBtn.style.display = "block";
  img_btn.style.display = "block";
  profile_img.style.display = "block";

  // Only select spans you want editable
  ["fullname_value", "experience_value", "phone_value","languages_value"].forEach(id => {
    const span = document.getElementById(id);
    if (span) {
      const currentValue = span.textContent.trim();
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
      input.className = "edit_input";
      input.id = id;
      span.replaceWith(input);
    }
  });
});


saveBtn.addEventListener("click", () => {
  const updatedData = new FormData();

  const fullnameInput = document.querySelector("#fullname_value");
  const experienceInput = document.querySelector("#experience_value");
  const phoneInput = document.querySelector("#phone_value");
  const languagesInput = document.querySelector("#languages_value");

  updatedData.append("guide_name", guide_name);

  if (fullnameInput) updatedData.append("full_name", fullnameInput.value.trim());
  
  if (experienceInput) {
    let expValue = experienceInput.value.trim();
    // ✅ remove "years" if present
    expValue = expValue.replace(/[^0-9]/g, ""); 
    updatedData.append("experience", expValue);
  }

  if (phoneInput) updatedData.append("phone_number", phoneInput.value.trim());
  if (languagesInput) updatedData.append("languages", languagesInput.value.trim());

  if (fileInput.files.length > 0) {
    updatedData.append("profile_photo", fileInput.files[0]);
  }

  // Replace inputs back with spans
  [fullnameInput, experienceInput, phoneInput, languagesInput].forEach(input => {
    if (input) {
      const span = document.createElement("span");
      span.className = "value";
      span.id = input.id;
      span.textContent = input.value.trim();
      input.replaceWith(span);
    }
  });

  fetch("http://127.0.0.1:8000/update_guide_profile/", {
    method: "POST",
    body: updatedData
  })
    .then(response => response.json())
    .then(data => {
      console.log("Server response:", data);
      if (data.success) {
        alert("Profile updated successfully");
        window.location.reload();
      }
    })
    .catch(err => console.error("Error updating profile:", err));
});



header.textContent += ` ${username}`;

// Add click event to each navbar item
navbarItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove 'active' from all nav items
    navbarItems.forEach((nav) => nav.classList.remove("active"));
    // Remove 'active' from all content sections
    contentSections.forEach((content) => content.classList.remove("active"));

    // Add 'active' to clicked navbar
    item.classList.add("active");

    // Find matching content by id naming convention
    const contentId = item.id + "_contents";
    const content = document.getElementById(contentId);
    if (content) {
      content.classList.add("active");
    }
  });
});
