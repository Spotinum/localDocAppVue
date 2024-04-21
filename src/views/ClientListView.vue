<template>
  <div class="client-list-view white-text">
    <div v-if="clients && clients.length > 0">
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
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in paginatedClients" :key="client.id">
            <td>{{ client.firstName }}</td>
            <td>{{ client.lastName }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone }}</td>
            <td>{{ client.address }}</td>
            <td>{{ client.city }}</td>
            <td>{{ client.postalCode }}</td>
            <td v-if="!client.doctor" >
              <button class="btn stylish-btn" @click="showNearDoctors(client.postalCode, client.id, client.firstName, client.lastName)">
                Show near Doctors
              </button>

              <button class="btn stylish-btn" @click="showFamily(client.id)">
                Show family
              </button>
            </td>
            <td v-else>
              <form @submit.prevent="removeCurrentDoctor(client.id, client.doctor.id)">
                <button type="submit" class="btn stylish-btn">
                  Remove Current Doctor
                </button>
                <button class="btn stylish-btn" @click="showFamily(client.id)">
                  <i class="fas fa-eye"></i> Show family
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination white-text"> <!-- buttons for previous and next pages in the table -->
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        Page {{ currentPage }} of {{ totalPages }}
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <div v-else>
      <h3>No Clients</h3>
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
import { ref, onMounted, computed } from 'vue';
import { useApplicationStore } from '@/stores/application.js';
import { useRouter } from 'vue-router';

const { loadUserData } = useApplicationStore();
const userData = loadUserData();
const router = useRouter();

const clients = ref([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const showModal = ref(false);
const modalMessage = ref('');
const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
        showModal.value = false;
        setTimeout(() => {
      location.reload();
    }, 500);
    };
onMounted(() => { //send get request to get the list of the clients
  fetch('http://localhost:9090/api/client/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`, 
    },
  })
    .then(response => response.json())
    .then(data => {
      clients.value = data;
    })
    .catch(error => console.error('Error fetching clients:', error));
});

const paginatedClients = computed(() => { //shows only 5 clients per page 
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return clients.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(clients.value.length / itemsPerPage));

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

const showNearDoctors = (postalCode, clientId, firstName, lastName) => {//If user clicks on Show Near Doctors send him to near-doctors and query the data 
  router.push({
    name: 'near-doctors',
    query: {
      firstName: firstName,
      lastName: lastName,
      postalCode: postalCode,
      clientId: clientId
    },
  });
};

const showFamily = (clientId) => { //If user clicks on Show Family send him to family-list and query the data 
  router.push({
    name: "family-list", 
    query: { clientId: clientId }
  });
};

const removeCurrentDoctor = (clientId, doctorId) => { //Send a post request to remove the current doctor of the client
  fetch(`http://localhost:9090/api/client/list/${clientId}/removeDoc/${doctorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`, 
    },
  })
  .then((response) => {
      if (response.ok) { //if reponse is ok show message succesfull 
        openModal('Removed Doctor successfully!');
      } else { //reseponse is not ok show
        openModal('Failed to remove Doctor.');
      }
    })
    .catch((error) => {
      openModal(`Error: ${error}`);
    });

}
</script>

<style scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination button {
  background-color: #4f5054;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
}

.client-list-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #333332;
  border: none;
  border: 1px solid #000000;
  margin-top: 10px;
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
.btn {
  margin-right: 5px;
  padding: 10px 20px !important;
  border-radius: 5px;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: #4e565c !important;
  border: none;
  display: inline-block;
}

.btn:hover {
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

h3 {
  margin-top: 20px;
  color: #2c3e50;
}

.white-text {
  color: #fff;
}
</style>
