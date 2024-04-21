<template>
  <div>
    <div v-if="pendingApprovalsClients.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pending in paginatedClients" :key="pending.id">
            <td>{{ pending.firstName }}</td>
            <td>{{ pending.lastName }}</td>
            <td v-if="pending.id">
                <button @click="showOptions(pending.id)" class="btn stylish-btn">
                  Show Options
                </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        Page {{ currentPage }} of {{ totalPages }}
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <div v-else>
      <h3>No Doctors</h3>
    </div>
  </div>
</template>

<script>
import { useApplicationStore } from '@/stores/application.js';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const { loadUserData } = useApplicationStore();
const userData = loadUserData();

export default {
  
  setup() {
    const router = useRouter();
    const pendingApprovalsClients = ref([]);
    const itemsPerPage = 5;
    const currentPage = ref(1);
    const showOptionsModal = ref(false);
    const selectedDoctorName = ref('');

    const showOptions = (doctorId) => { //if user clicks on show options send him there and query the data
  router.push({
    path: `/pending/show/results`,
    query: { doctorId: doctorId }
  });
};

onMounted(() => {
  fetch(`http://localhost:9090/api/pending/show`, { //send a GET request to retrieve a list of Doctors with Pending Requests
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.accessToken}`
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      pendingApprovalsClients.value = data || [];
    })
    .catch(error => {
      console.error('Error sending GET request:', error);
    });
});
    const paginatedClients = computed(() => { //Show only 5 doctors per page
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return pendingApprovalsClients.value.slice(start, end);
    });

    const totalPages = computed(() => Math.ceil(pendingApprovalsClients.value.length / itemsPerPage));

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

    return {
      pendingApprovalsClients,
      showOptions,
      showOptionsModal,
      selectedDoctorName,
      paginatedClients,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
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
  background-color: #333332;
  border: none;
  color: #fff;
  border: 1px solid #000000;
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #333;
  color: #fff;
}

.btn {
  padding: 8px 16px;
  border-radius: 5px;
  margin: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #333;
  font-size: 18px;
}
</style>
