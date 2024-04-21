<template>
  <div class="overlay white-text box">
    <div class="form-container mb-4">
      <div class="modal-container">
        <div class="content">
          <div class="text-center mb-4">
            <h1 class="fs-3">Add Doctor</h1>
          </div>

          <form @submit.prevent="onFormSubmit">

            <div class="mb-2">
              <label for="firstNameFormControl" class="form-label mb-1">First Name</label>
              <div class="col-sm-8">
                <input v-model="doctor.firstName" type="text" class="form-control" id="firstNameFormControl" pattern="[A-Za-z]+" title="Please enter only letters" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="lastNameFormControl" class="form-label mb-1">Last Name</label>
              <div class="col-sm-4">
                <input v-model="doctor.lastName" type="text" class="form-control" id="lastNameFormControl" pattern="[A-Za-z]+" title="Please enter only letters" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="emailFormControl" class="form-label mb-1">Email</label>
              <div class="col-sm-4">
                <input v-model="doctor.email" type="email" class="form-control" id="emailFormControl" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="phoneFormControl" class="form-label mb-1">Phone</label>
              <div class="col-sm-4">
                <input v-model="doctor.phone" type="text" class="form-control" id="phoneFormControl" pattern="[0-9]{10}" title="Please enter only 10 numbers" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="addressFormControl" class="form-label mb-1">Address</label>
              <div class="col-sm-4">
                <input v-model="doctor.address" type="text" class="form-control" id="addressFormControl" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="cityFormControl" class="form-label mb-1">City</label>
              <div class="col-sm-4">
                <input v-model="doctor.city" type="text" class="form-control" id="cityFormControl" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="postalCodeFormControl" class="form-label mb-1">Postal Code</label>
              <div class="col-sm-4">
                <input v-model="doctor.postalCode" type="text" class="form-control" id="postalCodeFormControl" pattern="[0-9]{5}" title="Please enter only 5 numbers" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="stateFormControl" class="form-label mb-1">Specialty</label>
              <div class="col-sm-4">
                <input v-model="doctor.speciality" type="text" class="form-control" id="specialtyFormControl" required />
              </div>
            </div>

            <div class="mb-2">
              <label for="maxClients">Max Clients</label>
              <div class="col-sm-4">
                <input v-model="doctor.maxClients" type="text" class="form-control" id="maxClients" pattern="[0-9]+" title="Please enter only numbers" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg rounded-3 font-bold">Submit</button>
          </form>

          <div v-if="showModal" class="modal">
      <div class="modal-content success">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApplicationStore } from '@/stores/application.js';

const { loadUserData } = useApplicationStore();
const userData = loadUserData();

const doctor = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  speciality: '',
  maxClients: ''
});

const showModal = ref(false);
const modalMessage = ref('');
const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
const onFormSubmit = () => {
  fetch('http://localhost:9090/api/doctor/saveDoctor', { //Send post request to add doctor 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`,
    },
    body: JSON.stringify(doctor.value),
  })
    .then((response) => {
      if (response.ok) {
        openModal('Doctor saved successfully!'); //if ok show saved message
        clearForm();
      } else {
        openModal('Failed to save doctor.'); //response not ok show failed message
      }
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
};

const clearForm = () => {
  doctor.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    speciality: '',
    maxClients: ''
  };
};

</script>

<style scoped>
body, html {
  margin: 0;
}
.modal-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
.content {
  padding: 20px;
  border-radius: 8px;
  background-color: #2d2c2c;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; 
  background-color: transparent;
  overflow: hidden; 
}
.form-container {
    height: 750px;
    width: 100%;
    max-width: 500px;
    text-align: left;
    margin: 0 auto; 
  }
.mb-2 {
  width: 100%;
}
.form-control {
  width: 100%;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 0;
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
.modal {
        display: none;
        position: fixed;
        z-index: 1001;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background-color: #333332;
        color: #fff;
        margin: 0 auto;
        padding: 20px;
        border-radius: 5px;
        border: 1px solid #fff;
        width: 60%;
        max-width: 400px;
        z-index: 1002;
    }

    .close {
        color: #fff;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }

    .close:hover,
    .close:focus {
        color: #aaa;
        text-decoration: none;
    }

    .success {
        color: #b9bdb9;
    }

</style>