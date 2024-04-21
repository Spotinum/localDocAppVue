<template>
  <div class="overlay white-text box">
    <div class="form-container">
      <div class="modal-container">
        <div class="content">
      <div class="text-center mb-4">
        <h1 class="fs-3">Add Client</h1>
      </div>

      <form @submit.prevent="onFormSubmit">

        <div class="mb-2">
          <label for="firstNameFormControl" class="form-label mb-1">First Name</label>
          <div class="col-sm-8">
            <input v-model="client.firstName" type="text" class="form-control" id="firstNameFormControl" pattern="[A-Za-z]+" title="Please enter only letters" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="lastNameFormControl" class="form-label mb-1">Last Name</label>
          <div class="col-sm-4">
            <input v-model="client.lastName" type="text" class="form-control" id="lastNameFormControl" pattern="[A-Za-z]+" title="Please enter only letters" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="emailFormControl" class="form-label mb-1">Email</label>
          <div class="col-sm-4">
            <input v-model="client.email" type="email" class="form-control" id="emailFormControl" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="phoneFormControl" class="form-label mb-1">Phone</label>
          <div class="col-sm-4">
            <input v-model="client.phone" type="text" class="form-control" id="phoneFormControl" pattern="[0-9]{10}" title="Please enter only 10 numbers" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="addressFormControl" class="form-label mb-1">Address</label>
          <div class="col-sm-4">
            <input v-model="client.address" type="text" class="form-control" id="addressFormControl" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="cityFormControl" class="form-label mb-1">City</label>
          <div class="col-sm-4">
            <input v-model="client.city" type="text" class="form-control" id="cityFormControl" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="stateFormControl" class="form-label mb-1">State</label>
          <div class="col-sm-4">
            <input v-model="client.state" type="text" class="form-control" id="stateFormControl" required />
          </div>
        </div>

        <div class="mb-2">
          <label for="postalCodeFormControl" class="form-label mb-1">Postal Code</label>
          <div class="col-sm-4">
            <input v-model="client.postalCode" type="text" class="form-control" id="postalCodeFormControl" pattern="[0-9]{5}" title="Please enter only 5 numbers" required />
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

const client = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postal_code: ''
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
  fetch('http://localhost:9090/api/client/saveClient', { //send post request to add client
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`,
    },
    body: JSON.stringify(client.value),
  })
    .then((response) => {
      if (response.ok) {
        openModal('Client saved successfully!'); //if response is ok display saved 
        clearForm();
      } else {
        openModal('Failed to save client.');//response not ok show failed message
      }
    })
    .catch((error) => {
      console.log = `Error: ${error}`;
    });
};

const clearForm = () => {
  client.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: ''
  };

};
</script>

<style scoped>
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
body, html {
  margin: 0;
}
.modal-container {
  width: 150%;
  max-width: 1000px;
  margin: 0 auto; 
  align-items: center;

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
}

.form-container {
  height: 100%;
  width: 100%;
  max-width: 500px;
  text-align: center;
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

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.success-popup {
  color: green;
  border: 2px solid green;
}

.failure-popup {
  color: red;
  border: 2px solid red;
}

.icon {
  margin-right: 5px;
}
.white-text {
  color: #fff; 
}
</style>