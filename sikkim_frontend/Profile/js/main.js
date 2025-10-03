document.addEventListener('DOMContentLoaded', () => {
  const contentFrame = document.getElementById('content-frame');
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const menuLinks = document.querySelectorAll('.sidebar a');
  let logout = document.getElementById("Logout")
  let home = document.getElementById("home")

  home.onclick = () => {
    window.location.href = "/sikkim_frontend/Home Page/Home Page.html"
  }

  logout.onclick = () => {
    localStorage.removeItem("user")
    window.location.href = "/sikkim_frontend/Home Page/Home Page.html"
  }
  
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const newSrc = link.dataset.src;
      if (contentFrame.src !== window.location.origin + '/' + newSrc) {
        contentFrame.src = newSrc;
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('active');
        }
      }
    });
  });

  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('active');
      }
    });
  }

  
  contentFrame.onload = () => {
    console.log('Content iframe loaded with src: ', contentFrame.src);
  };

  
  window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      contentFrame.src = section;
      const targetLink = Array.from(menuLinks).find(link => link.dataset.src.includes(section));
      if (targetLink) {
        menuLinks.forEach(l => l.classList.remove('active'));
        targetLink.classList.add('active');
      }
    } else {
      contentFrame.src = 'profile_content.html';
      menuLinks[0].classList.add('active');
    }
  });
});
