<template>
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      />
      <div v-if="pendingApprovalsClients && pendingApprovalsClients.length">
        <table class="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pending in pendingApprovalsClients" :key="pending.id">
  <td>{{ pending.firstName }}</td>
  <td>{{ pending.lastName }}</td>
  <td v-if="pending.id">
    <button @click="acceptClient(pending.id)" class="btn btn-info">
      <i class="fas fa-plus-square"></i> Accept Client
    </button>
    <button @click="declineClient(pending.id)" class="btn btn-danger">
      <i class="fas fa-times-circle"></i> Decline Client
    </button>
  </td>
</tr>
          </tbody>
        </table>
      </div>
      
      <div v-else>
        <h3>No pending Clients</h3>
      </div>
      <div v-if="showModal" class="modal">
      <div class="modal-content success">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ msg }}</p>
      </div>
    </div>
    </div>
    
  </template>
  
  <script>
import { ref, onMounted } from 'vue';
import { useApplicationStore } from '@/stores/application.js';
import { useRouter } from 'vue-router';

export default {
  props: ['doctorId'],
  setup() {
    const router = useRouter();
    const { loadUserData } = useApplicationStore();
    const userData = loadUserData();
    const backendURL = import.meta.env.VITE_BACKEND; // Import VITE_BACKEND variable
    const doctorId = router.currentRoute.value.query.doctorId;
    const pendingApprovalsClients = ref([]);
    const showModal = ref(false);
    const msg = ref('');

    const acceptClient = (clientId) => {
      fetch(`${backendURL}/api/pending/show/${doctorId}/${clientId}`, { // Use backendURL variable here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`
        },
      })
      .then(response => {
        if (response.ok) {
          response.text().then(result => {
            msg.value = result;
            openModal();
          });
        } else {
          console.error('Failed to accept client:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error accepting client:', error);
      });
    };

    const declineClient = (clientId) => {
      fetch(`${backendURL}/api/pending/show/${doctorId}/${clientId}/decline`, { // Use backendURL variable here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`
        },
      })
      .then(response => {
        if (response.ok) {
          response.text().then(result => {
            msg.value = result;
            openModal();
          });
        } else {
          console.error('Failed to decline client:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error declining client:', error);
      });
    };

    onMounted(() => {
      fetch(`${backendURL}/api/pending/show/${doctorId}`, { // Use backendURL variable here
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        pendingApprovalsClients.value = data || [];
      })
      .catch(error => {
        console.error('Error fetching pending requests:', error);
      });
    });

    const openModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      setTimeout(() => {
        location.reload();
      }, 500);
    };

    return {
      pendingApprovalsClients,
      acceptClient,
      declineClient,
      openModal,
      closeModal,
      showModal,
      msg
    };
  },
};
</script>


<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* White background color */
  border: none;
  color: #333; /* Dark text color */
  border: 1px solid #ddd; /* Light border color */
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd; /* Light border color */
}

th {
  background-color: #f0f0f0; /* Light gray background color */
  color: #333; /* Dark text color */
}

.btn {
  padding: 8px 16px;
  border-radius: 5px;
  margin: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-info {
  background-color: #2bc456; /* Green background color */
  color: #fff; /* White text color */
  border: none;
}

.btn-danger {
  background-color: #f44336; /* Red background color */
  color: #fff; /* White text color */
  border: none;
}

.btn-info:hover {
  background-color: #0c8139; /* Darker green on hover */
}

.btn-danger:hover {
  background-color: #bc2323; /* Darker red on hover */
}

h3 {
  color: #333; /* Dark text color */
  font-size: 18px;
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
  background-color: rgba(255, 255, 255, 0.4); /* White background color with transparency */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #ffffff; /* White background color */
  color: #333; /* Dark text color */
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #fff; /* White border color */
  width: 60%;
  max-width: 400px;
  z-index: 1002;
}

.close {
  color: #333; /* Dark text color */
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #aaa; /* Lighter text color on hover/focus */
  text-decoration: none;
}

.success {
  color: #b9bdb9; /* Light gray text color */
}
</style>

  