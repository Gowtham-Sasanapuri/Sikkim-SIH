document.addEventListener('DOMContentLoaded', () => {

  let user_json = JSON.parse(localStorage.getItem("user"))
  let user_name = user_json.username
  let role = user_json.role
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const editImgBtn = document.getElementById("edit_profile_img");
  const fileInput = document.getElementById("file_input");
  let currentUser = null;

  saveBtn.style.display = "none";
  editImgBtn.style.display = "none";

  editImgBtn.onclick = () => {
    fileInput.click()
  }
  console.log(user_name);

  if (role !== "User") {
    window.location.href = "/sikkim_frontend/Registration/Registration.html"
  }

  fetch("http://127.0.0.1:8000/get_user_details/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_name })
  }).then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.success) {
        currentUser = data.data;  // ✅ your object is inside data.data

        // Update profile image
        const profileImg = document.querySelector(".profile-pic img");
        if (currentUser.User_profile_photo) {
          profileImg.src = "http://127.0.0.1:8000" + currentUser.User_profile_photo;
        } else {
          profileImg.src = "boy.jpg";
        }

        // Update text fields
        document.getElementById("username").textContent = currentUser.UserName || "N/A";
        document.getElementById("gender").textContent = currentUser.User_Gender || "N/A";
        document.getElementById("fullname").textContent = currentUser.User_fullName || "N/A";
        document.getElementById("languages").textContent = currentUser.User_Languages_Know || "N/A";
        document.getElementById("location").textContent = currentUser.Location || "N/A";
        document.getElementById("phone").textContent = currentUser.User_Number || "N/A";
      } else {
        alert("Failed to fetch user details");
      }
    }).catch(error => console.error(error)
    )

  editBtn.addEventListener("click", () => {
    if (!currentUser) return; // safety check

    saveBtn.style.display = "block";
    editImgBtn.style.display = "block";
    editBtn.style.display = "none";

    convertToInput("fullname", currentUser.User_fullName);
    convertToInput("languages", currentUser.User_Languages_Know);
    convertToInput("location", currentUser.Location);
    convertToInput("phone", currentUser.User_Number);
  });

  function convertToInput(id, value) {
    const span = document.getElementById(id);
    span.outerHTML = `<input type="text" id="${id}" value="${value || ""}">`;
  }

  saveBtn.addEventListener("click", () => {
    // Get input values
    const fullNameInput = document.getElementById("fullname").value;
    const languagesInput = document.getElementById("languages").value;
    const locationInput = document.getElementById("location").value;
    const phoneInput = document.getElementById("phone").value;

    // Prepare FormData
    const formData = new FormData();
    formData.append("user_name", user_json.username); // username from localStorage
    formData.append("full_name", fullNameInput);
    formData.append("languages", languagesInput);
    formData.append("Location", locationInput);
    formData.append("phone_number", phoneInput);

    if (fileInput.files.length > 0) {
      formData.append("profile_photo", fileInput.files[0]);
    }

    // Send update request
    fetch("http://127.0.0.1:8000/update_user_profile/", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Profile updated successfully");
          window.location.reload(); // reload to show updated data
        } else {
          alert(data.msg);
        }
      })
      .catch(err => console.error("Error updating profile:", err));
  });

});
