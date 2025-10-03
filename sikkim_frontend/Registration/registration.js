document.addEventListener("DOMContentLoaded", () => {
  // Select main buttons and forms
  const registerBtn = document.getElementById("Register_btn");
  const loginBtn = document.getElementById("Login_btn");

  const registrationFormContainer =
    document.getElementById("Registration_form");
  const loginFormContainer = document.getElementById("login_form");

  const roleSelect = document.getElementById("role");
  const guideForm = document.getElementById("guide_form");
  const userForm = document.getElementById("user_form");
  let role = "Guide";
  const guide_btn = document.getElementById("tour_guide_submit");
  const user_btn = document.getElementById("user_submit_btn");
  const login_btn = document.getElementById("user_login_btn");

  login_btn.addEventListener("click", (e) => {
    e.preventDefault();
    let username = document.getElementById("l_username").value.trim();
    let password = document.getElementById("l_password").value.trim();
    if (role === "User") {
      fetch("http://127.0.0.1:8000/User_LogIn/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((respo) => respo.json())
        .then((data) => {
          console.log(data);
          if (data.success === true) {
            localStorage.setItem("user", JSON.stringify({
              username,
              role
            }))
            document.getElementById("l_username").value = "";
            document.getElementById("l_password").value = "";
            alert(data.msg);
            window.location.href = "../Home Page/Home Page.html";
          } else {
            document.getElementById("l_username").value = "";
            document.getElementById("l_password").value = "";
            alert(data.msg);
          }
        })
        .catch((err) => console.error(err));
    } else if (role === "Guide") {
      fetch("http://127.0.0.1:8000/Guide_LogIn/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((respo) => respo.json())
        .then((data) => {
          console.log(data);
          if (data.success === true) {
            localStorage.setItem("user", JSON.stringify({
              username,
              role
            }))
            document.getElementById("l_username").value = "";
            document.getElementById("l_password").value = "";
            alert(data.msg);
            window.location.href = "../GuidePage/guide.html";
          } else if (data.success === false) {
            alert(data.msg);
            document.getElementById("l_username").value = "";
            document.getElementById("l_password").value = "";
          }
        })
        .catch((err) => console.error(err));
    }
  });

  guide_btn.addEventListener("click", (e) => {
    e.preventDefault();
    let form = new FormData();
    form.append(
      "Guide_Username",
      document.getElementById("guide_username").value
    );
    form.append("Guide_PassWord", document.getElementById("g_pass").value);
    form.append("Guide_Mail_id", document.getElementById("g_mail").value);
    form.append("Guide_FullName", document.getElementById("g_fullname").value);
    form.append("Guide_experience", document.getElementById("g_exp").value);
    form.append(
      "Guide_Languages_know",
      document.getElementById("g_lang").value
    );
    form.append("Guide_Gender", document.querySelector('input[name="gender"]:checked').value);
    form.append("Guide_Number", document.getElementById("g_mobile").value);
    fetch("http://127.0.0.1:8000/Guide_Registration/", {
      method: "POST",
      body: form,
    })
      .then((respo) => respo.json())
      .then((data) => {
        console.log(data);
        if (data.success === false) {
          alert("User maybe Existed");
        }
        document.getElementById("g_pass").value = "";
        document.getElementById("g_mail").value = "";
        document.getElementById("g_fullname").value = "";
        document.getElementById("guide_username").value = "";
        document.getElementById("g_exp").value = "";
        document.getElementById("g_lang").value = "";
        document.querySelector('input[name="gender"]:checked').value = "";
        document.getElementById("g_mobile").value = "";
        loginFormContainer.classList.add("active");
        registrationFormContainer.classList.remove("active");
        loginBtn.classList.add("active");
        registerBtn.classList.remove("active");
      })
      .catch((err) => console.error(err));
  });

  user_btn.addEventListener("click", (e) => {
    e.preventDefault();
    let username = document.getElementById("r_username").value.trim();
    let password = document.getElementById("r_password").value.trim();
    let mail = document.getElementById("r_mail").value.trim();
    let location = document.getElementById("location").value.trim()
    let number = document.getElementById("u_mobile").value.trim()
    let gender =  document.querySelector('input[name="u_gender"]:checked').value
    let full_name = document.getElementById("u_fullname").value
    let languages = document.getElementById("u_lang").value
    console.log(number,">>>>"); 
    fetch("http://127.0.0.1:8000/user_registration/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "UserName": username,
        "PassWord": password,
        "Mail_id": mail,
        "Location": location,
        "User_Number": number,
        "User_Gender" : gender,
        "User_fullName" :full_name,
        "User_Languages_Know" : languages
      })
    })
      .then((respo) => respo.json())
      .then((data) => {
        console.log(data);
        if (data.success === false) {
          alert(data.msg);
          console.log(data.errors)
        } else {
          alert("successfully Registered");
        }
        document.getElementById("r_username").value = "";
        document.getElementById("r_password").value = "";
        document.getElementById("r_mail").value = "";
        document.getElementById("u_mobile").value = "";
        document.getElementById("location").value = "";

        loginFormContainer.classList.add("active");
        registrationFormContainer.classList.remove("active");
        loginBtn.classList.add("active");
        registerBtn.classList.remove("active");
      })
      .catch((err) => console.error(err));
  });

  roleSelect.addEventListener("change", (e) => {
    role = e.target.value;
    document.getElementById("l_username").value = "";
    document.getElementById("l_password").value = "";
    document.getElementById("g_pass").value = "";
    document.getElementById("g_mail").value = "";
    document.getElementById("g_fullname").value = "";
    document.getElementById("guide_username").value = "";
    document.getElementById("g_exp").value = "";
    document.getElementById("g_lang").value = "";
    document.getElementById("r_username").value = "";
    document.getElementById("r_password").value = "";
    document.getElementById("r_mail").value = "";
    console.log(role);
  });

  registerBtn.addEventListener("click", () => {
    registrationFormContainer.classList.add("active");
    loginFormContainer.classList.remove("active");
    registerBtn.classList.add("active");
    loginBtn.classList.remove("active");

    toggleRoleForm();
  });

  loginBtn.addEventListener("click", () => {
    loginFormContainer.classList.add("active");
    registrationFormContainer.classList.remove("active");
    loginBtn.classList.add("active");
    registerBtn.classList.remove("active");
  });

  roleSelect.addEventListener("change", toggleRoleForm);

  function toggleRoleForm() {
    if (roleSelect.value === "Guide") {
      guideForm.classList.add("active");
      userForm.classList.remove("active");
    } else {
      userForm.classList.add("active");
      guideForm.classList.remove("active");
    }
  }
  toggleRoleForm();
});
