<template>
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />

        <div v-if="paginatedFamilies.length > 0">
            <table class="table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Relation</th>
                        <th>Birth Date</th>
                        <th>Gender</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="family in paginatedFamilies" :key="family.id">
                        <td>{{ family.firstName }}</td>
                        <td>{{ family.lastName }}</td>
                        <td>{{ family.relation }}</td>
                        <td>{{ family.birthDate }}</td>
                        <td>{{ family.gender }}</td>
                        <td v-if="family.id">
                            <form style="display: inline-block" @submit.prevent="editFamily(family.id)">

                            <button @click="editFamilyForm" class="editBtn btn stylish-btn">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            </form>
                            <form style="display: inline-block" @submit.prevent="removeFamily(family.id)">
                                <button type="submit" class="removeBtn btn stylish-btn"><i class="fas fa-trash-alt"></i> Remove</button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
                Page {{ currentPage }} of {{ totalPages }}
                <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
            </div>
        </div>

        <div v-else>
            <h3>No Family Members</h3>
        </div>

        <button @click="addFamily" class="btn stylish-btn pos">
            Add family
        </button>

        <div v-if="showAddForm" class="modal" @click.self="cancelAddFamily">
            <div class="modal-content">
                <span class="close" @click="cancelAddFamily">&times;</span>
                <h3>Add Family Member</h3>
                <form @submit.prevent="submitFamily">
                    <div>
                        <label class="form-label" for="firstName">First Name:</label>
                        <input class="form-input" type="text" id="firstName" v-model="newFamily.firstName" required>
                    </div>
                    <div>
                        <label class="form-label" for="lastName">Last Name:</label>
                        <input class="form-input" type="text" id="lastName" v-model="newFamily.lastName" required>
                    </div>
                    <div>
                        <label class="form-label" for="gender">Gender:</label>
                        <select class="form-dropdown" v-model="newFamily.gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label" for="birthDate">Birth Date:</label>
                        <input class="form-input" type="date" id="birthDate" v-model="newFamily.birthDate" required>
                    </div>
                    <div>
                        <label class="form-label" for="relation">Relation:</label>
                        <input class="form-input" type="text" id="relation" v-model="newFamily.relation" required>
                    </div>

                    <button type="submit" class="form-btn">Submit</button>
                    <button type="button" class="form-btn" @click="cancelAddFamily">Cancel</button>
                </form>
            </div>
        </div>

        <div v-if="showEditForm" class="modal" @click.self="cancelAddFamily">
            <div class="modal-content">
                <span class="close" @click="cancelEditFamily">&times;</span>
                <h3>Edit Family Member</h3>
                <form @submit.prevent="updateFamily()">
                    <div>
                        <label class="form-label" for="firstName">First Name:</label>
                        <input class="form-input" type="text" id="firstName" v-model="newFamily.firstName" required>
                    </div>
                    <div>
                        <label class="form-label" for="lastName">Last Name:</label>
                        <input class="form-input" type="text" id="lastName" v-model="newFamily.lastName" required>
                    </div>
                    <div>
                        <label class="form-label" for="gender">Gender:</label>
                        <select class="form-dropdown" v-model="newFamily.gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label" for="birthDate">Birth Date:</label>
                        <input class="form-input" type="date" id="birthDate" v-model="newFamily.birthDate" required>
                    </div>
                    <div>
                        <label class="form-label" for="relation">Relation:</label>
                        <input class="form-input" type="text" id="relation" v-model="newFamily.relation" required>
                    </div>

                    <button type="submit" class="form-btn">Submit</button>
                    <button type="button" class="form-btn" @click="cancelEditFamily">Cancel</button>
                </form>
            </div>
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
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useApplicationStore } from '@/stores/application.js';
const { loadUserData } = useApplicationStore();
const userData = loadUserData();
const families = ref([]);
const instance = getCurrentInstance();
const clientId = instance.proxy.$route.query.clientId;
const showModal = ref(false);
const modalMessage = ref('');
const tempFamilyId = ref('');
const backendURL = import.meta.env.VITE_BACKEND; // Import VITE_BACKEND variable

onMounted(() => {
    fetch(`${backendURL}/api/family/list/${clientId}`, { // Use backendURL variable here
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.accessToken}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            families.value = data;
        })
        .catch(error => console.error('Error fetching families:', error));
});

const showAddForm = ref(false);
const showEditForm = ref(false);

const newFamily = ref({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    relation: ''
});

const itemsPerPage = 5;
const currentPage = ref(1);

const paginatedFamilies = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return families.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(families.value.length / itemsPerPage));

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

const addFamily = () => {
    showAddForm.value = true;
};

const editFamilyForm = () => {
    showEditForm.value = true;
};

const submitFamily = () => {
    const today = new Date();
    const selectedDate = new Date(newFamily.value.birthDate);

    if (selectedDate > today) {
        openModal("Birth date cannot be a future date.");
        return;
    }

    fetch(`${backendURL}/api/family/new/${clientId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify(newFamily.value)
    })
        .then(response => {
            if (response.ok) {
                newFamily.value = { firstName: '', lastName: '', gender: '', birthDate: '', relation: '' };
                openModal('Family member added successfully!');
                showAddForm.value = false;
            } else {
                throw new Error('Failed to add new family member');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error adding new family member:', error);
        });
};

const editFamily = (familyId) => {
    tempFamilyId.value = familyId;
    // Code for editing family member
};

const updateFamily = () => {
    // Code for updating family member
};

const cancelAddFamily = () => {
    // Code for cancelling adding family member
};

const cancelEditFamily = () => {
    // Code for cancelling editing family member
};

const removeFamily = (familyId) => {
    // Code for removing family member
};

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
</script>


<style>
.pos {
  margin-top: 20px;
}

.editBtn {
  margin-right: 5px;
}

.stylish-btn {
  padding: 12px 24px !important;
  border-radius: 25px;
  text-decoration: none;
  color: #333; /* Dark text color */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  background-color: #f0f0f0; /* Light gray background */
  border: none;
  display: inline-block;
  overflow: hidden;
  position: relative;
}

.stylish-btn:hover {
  background-color: #ccc; /* Light gray background on hover */
  transform: scale(1.05);
}

.stylish-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0, #ccc); /* Gradient background */
  z-index: -1;
  transition: transform 0.3s ease;
  transform: scaleX(0);
  transform-origin: right;
}

.stylish-btn:hover::before {
  transform: scaleX(1);
  transform-origin: left;
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
  background-color: #f0f0f0; /* Light gray background */
  color: #333; /* Dark text color */
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #333; /* Dark border */
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
  color: #666; /* Darker text color on hover */
  text-decoration: none;
}

.success {
  color: #333; /* Dark text color */
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-btn {
  background-color: #4f5054;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin: 0 5px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0; /* Light gray background */
  border: none;
  color: #333; /* Dark text color */
  border: 1px solid #ccc; /* Light border */
}

th,
td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ccc; /* Light border */
}

th {
  background-color: #f0f0f0; /* Light gray background */
  color: #333; /* Dark text color */
}

.form-label {
  color: #333; /* Dark text color */
}

.form-input {
  background-color: #f0f0f0; /* Light gray background */
  color: #333; /* Dark text color */
  border: 1px solid #333; /* Dark border */
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px;
}

.form-input:focus {
  outline: none;
}

.form-btn {
  background-color: #4e565c;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-btn:hover {
  background-color: #2c3e50;
}

.form-dropdown {
  background-color: #f0f0f0; /* Light gray background */
  color: #333; /* Dark text color */
  border: 1px solid #333; /* Dark border */
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px;
}
</style>

