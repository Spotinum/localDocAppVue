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
            <label for="userRoleFormControl" class="form-label text-dark">User Role</label>
            <select v-model="user.userRole" class="form-control rounded-3" id="userRoleFormControl">
              <option value="ROLE_CLIENT">Client</option>
              <option value="ROLE_DOCTOR">Doctor</option>
            </select>
          </div>

          <div class="form-group">
            <label for="firstNameFormControl" class="form-label text-dark">First Name</label>
            <input v-model="user.firstName" type="text" class="form-control rounded-3" id="firstNameFormControl" />
          </div>

          <div class="form-group">
            <label for="lastNameFormControl" class="form-label text-dark">Last Name</label>
            <input v-model="user.lastName" type="text" class="form-control rounded-3" id="lastNameFormControl" />
          </div>

          <div class="form-group">
            <label for="phoneFormControl" class="form-label text-dark">Phone</label>
            <input v-model="user.phone" type="text" class="form-control rounded-3" id="phoneFormControl" />
          </div>

          <div class="form-group">
            <label for="addressFormControl" class="form-label text-dark">Address</label>
            <input v-model="user.address" type="text" class="form-control rounded-3" id="addressFormControl" />
          </div>

          <div class="form-group">
            <label for="cityFormControl" class="form-label text-dark">City</label>
            <input v-model="user.city" type="text" class="form-control rounded-3" id="cityFormControl" />
          </div>

          <div class="form-group">
            <label for="stateFormControl" class="form-label text-dark">State</label>
            <input v-model="user.state" type="text" class="form-control rounded-3" id="stateFormControl" />
          </div>

          <div class="form-group">
            <label for="postalCodeFormControl" class="form-label text-dark">Postal Code</label>
            <input v-model="user.postalCode" type="text" class="form-control rounded-3" id="postalCodeFormControl" />
          </div>

          <!-- Show specialty and maxClients fields only when the role is Doctor -->
          <div v-if="user.userRole === 'ROLE_DOCTOR'">
            <div class="form-group">
              <label for="specialtyFormControl" class="form-label text-dark">Specialty</label>
              <input v-model="user.specialty" type="text" class="form-control rounded-3" id="specialtyFormControl" />
            </div>

            <div class="form-group">
              <label for="maxClientsFormControl" class="form-label text-dark">Max Clients</label>
              <input v-model="user.maxClients" type="number" class="form-control rounded-3" id="maxClientsFormControl" />
            </div>
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
  userRole: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  specialty: '',
  maxClients: null,
});

const msg = ref('');
const router = useRouter();
const backendURL = import.meta.env.VITE_BACKEND; // Import VITE_BACKEND variable

const onFormSubmit = () => {
  const endpoint = `${backendURL}/api/auth/signup`; // Use backendURL variable here
  const userData = {
    username: user.value.username,
    email: user.value.email,
    password: user.value.password,
    userRole: user.value.userRole,
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    phone: user.value.phone,
    address: user.value.address,
    city: user.value.city,
    state: user.value.state,
    postalCode: user.value.postalCode,
    // Include specialty and maxClients data if role is Doctor
    specialty: user.value.userRole === 'ROLE_DOCTOR' ? user.value.specialty : null,
    maxClients: user.value.userRole === 'ROLE_DOCTOR' ? user.value.maxClients : null,
  };

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.ok) {
        msg.value = 'User registered successfully! Redirecting to login...';

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        msg.value = 'Failed to register user. Please try again.';
        console.log(JSON.stringify(userData));
      }
    })
    .catch((error) => {
      console.error('Error during registration:', error);
      msg.value = 'An error occurred during registration. Please try again.';
    }); 
};

const toggleDoctorFields = () => {
  // Reset doctor-specific fields when switching roles
  if (user.value.userRole !== 'ROLE_DOCTOR') {
    user.value.specialty = '';
    user.value.maxClients = null;
  }
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
  
.white-text {
  color: #fff;
}
</style>
