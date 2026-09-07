const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

const BACKEND_URL = 'http://localhost:5000/api';

// 1. LOGIN SUBMISSION
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[name="email"]').value.trim();
        const password = loginForm.querySelector('input[name="password"]').value;

        try {
            const res = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Login successful!');
                
                // Data capture karke check karein ki user object kahan hai
                const userData = data.user || data;

                // Agar profile picture nahi hai, toh backticks (``) ka use karke avatar generate karein
                if (!userData.profilePicture) {
                    userData.profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || userData.username || 'user'}`;
                }

                // localStorage mein modified userData save karein
                localStorage.setItem('user', JSON.stringify(userData));

                window.location.href = '/';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login connection error:', err);
            alert('Cannot connect to server on port 5000.');
        }
    });
}

// 2. REGISTER SUBMISSION
const registerForm = document.querySelector('.form-box.register form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = registerForm.querySelector('input[name="email"]').value.trim();
        const name = registerForm.querySelector('input[name="name"]').value.trim();
        const password = registerForm.querySelector('input[name="password"]').value;
        const dob = registerForm.querySelector('input[name="dob"]').value.trim();

        try {
            const res = await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, dob })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Account created! Please log in.');
                container.classList.remove('active');
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration connection error:', err);
            alert('Cannot connect to server on port 5000.');
        }
    });
}