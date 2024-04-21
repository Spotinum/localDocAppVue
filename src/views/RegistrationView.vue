<template>
    <div class="overlay white-text">
      <div class="modal-container">
        <div class="modal-content">
          <div class="text-center mb-4">
            <h3 class="display-4 text-dark font-bold">User Registration</h3>
          </div>
  
          <form @submit.prevent="onFormSubmit">
            <div class="form-group">
              <label for="usernameFormControl" class="form-label text-dark">User Name</label>
              <input v-model="user.username" type="text" class="form-control rounded-3" id="usernameFormControl" />
            </div>
  
            <div class="form-group">
              <label for="emailFormControl" class="form-label text-dark">Email</label>
              <input v-model="user.email" type="text" class="form-control rounded-3" id="emailFormControl" />
            </div>
  
            <div class="form-group">
              <label for="passwordFormControl" class="form-label text-dark">Password</label>
              <input v-model="user.password" type="password" class="form-control rounded-3" id="passwordFormControl" />
            </div>
  
            <div class="form-group">
              <label for="roleFormControl" class="form-label text-dark">Role</label>
              <select v-model="user.role" class="form-control rounded-3" id="roleFormControl">
                <option value="ROLE_CLIENT">Client</option>
                <option value="ROLE_DOCTOR">Doctor</option>
              </select>
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-lg rounded-3 font-bold">Sign Up</button>
            </div>
          </form>
  
          <div class="h6 text-danger text-center mt-3">{{ msg }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const user = ref({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  
  const msg = ref('');
  const router = useRouter();
  
  const onFormSubmit = () => {
    const endpoint = 'http://localhost:9090/api/auth/signup'; 
      const userData = {
      username: user.value.username,
      email: user.value.email,
      password: user.value.password,
      userRole: user.value.role,
    };
  
    fetch(endpoint, { //send a POST request for the user to sign up
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) { //if user doesn't exist (response ok) redirect him to login page
          msg.value = 'User registered successfully! Redirecting to login...';
  
          setTimeout(() => {
            router.push("/login");
           
          }, 2000);
        } else { //User exists try again
          msg.value = 'Failed to register user. Please try again.';
          console.log(JSON.stringify(userData));
        }
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        msg.value = 'An error occurred during registration. Please try again.';
      }); 
  };
  </script>
  
  <style scoped>
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; 
  background-color: transparent;
}
  
.modal-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto; 
}
  
  .modal-content {
    padding: 20px;
    border-radius: 8px;
    background-color: #2d2c2c;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-control {
    width: 100%;
    padding: 3px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
  }
  
  .btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(to right, #646665, #2e3030, #2a2828);
  color: #ffffff;
  transition: background 0.3s ease;
  border: none;
  outline: none;
  margin-top: 20px;
}

.btn:hover {
  box-shadow: 0 0 10px rgba(80, 173, 240, 0.5);
}
  
.white-text 
{
  color: #fff;
}  </style>