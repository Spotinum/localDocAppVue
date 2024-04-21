<template>
  <div>
    <div v-if="doctors && doctors.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>Postal Code</th>
            <th>Specialty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doctor in paginatedDoctors" :key="doctor.id">
            <td>{{ doctor.firstName }}</td>
            <td>{{ doctor.lastName }}</td>
            <td>{{ doctor.email }}</td>
            <td>{{ doctor.phone }}</td>
            <td>{{ doctor.address }}</td>
            <td>{{ doctor.city }}</td>
            <td>{{ doctor.postalCode }}</td>
            <td>{{ doctor.speciality }}</td>
            <td v-if="doctor.id">
              <div>
                <button @click="requestApproval(clientId, doctor.id)" class="btn stylish-btn">
                  Request Approval for {{ firstName }} {{ lastName }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination white-text">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        Page {{ currentPage }} of {{ totalPages }}
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div v-else>
      <h3>No Doctors</h3>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content success">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useApplicationStore } from '@/stores/application.js';

const { loadUserData } = useApplicationStore();
const userData = loadUserData();
const instance = getCurrentInstance();
const postalCode = instance.proxy.$route.query.postalCode;
const clientId = instance.proxy.$route.query.clientId;
const firstName = instance.proxy.$route.query.firstName;
const lastName = instance.proxy.$route.query.lastName;
const doctors = ref([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const showModal = ref(false);
const modalMessage = ref('');

onMounted(() => { //Send a GET request to retrieve a list of the Near Doctors
  fetch(`http://localhost:9090/api/client/list/doc/${postalCode}/${clientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`,
    },
  })
    .then(response => response.json())
    .then(data => { 
      let doc = [];
      for (let i =0; i<data.length;i++)  
      {
        if (data[i].currentClients < data[i].maxClients) //check if the doctor has maximum amount of clients otherwise display him on the page
        {
          doc.push(data[i]);
        }
      }
      doctors.value = doc;

    })
    .catch(error => console.error('Error fetching doctors:', error));
});

const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return doctors.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(doctors.value.length / itemsPerPage));

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const requestApproval = (clientId, doctorId) => { //send a POST request to requst approval from the doctor
  fetch(`http://localhost:9090/api/pending/insert/${clientId}/${doctorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.text().then(data => {
          try {
            return JSON.parse(data);
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            throw jsonError;
          }
        });
      } else {
        console.log('Non-JSON Response:', response);
        return response.text();
      }
    })
    .then(data => {
      console.log('Request approval successful:', data);
      openModal('Request approval successful!');
    })
    .catch(error => {
      console.error('Error requesting approval:', error);
    });
};

const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

</script>

<style scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background-color: #4f5054;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2c3e50; 
}
.stylish-btn {
  padding: 12px 24px !important;
  border-radius: 25px;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  background-color: #4e565c !important;
  border: none;
  display: inline-block;
  overflow: hidden;
  position: relative;
}
.stylish-btn:hover {
  background-color: #2c3e50;
  transform: scale(1.05);
}

.stylish-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #11212b, #133145);
  z-index: -1;
  transition: transform 0.3s ease;
  transform: scaleX(0);
  transform-origin: right;
}

.stylish-btn:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #333332;
  border: none;
  color: #fff;
  border: 1px solid #000000;
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #000000;
}

th {
  background-color: #4f5054;
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

.white-text {
  color: #fff;
}

h3 {
  color: #fff;
}
</style>
