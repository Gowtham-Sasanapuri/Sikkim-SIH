document.addEventListener('DOMContentLoaded', () => {
    const defaultUser = {
        name: 'John Doe',
        username: 'akshiregana',
        email: 'john@example.com',
        address: '123 Sikkim Street, Gangtok',
        gender: 'Male',
        phone: '123-456-7890',
        profileImage: 'boy.jpg'
    };

    let user = JSON.parse(localStorage.getItem('user')) || defaultUser;

    document.getElementById('name').value = user.name;
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('address').value = user.address;
    document.getElementById('gender').value = user.gender;
    document.getElementById('phone').value = user.phone;
    document.getElementById('profile-image').value = user.profileImage;

    const successMessage = document.getElementById('success-message');

    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedUser = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            gender: document.getElementById('gender').value,
            phone: document.getElementById('phone').value,
            profileImage: document.getElementById('profile-image').value || 'boy.jpg'
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
            window.location.href = 'profile.html?section=profile_content.html';
        }, 2000); 
    });
});