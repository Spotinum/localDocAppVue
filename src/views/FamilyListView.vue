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
    onMounted(() => {
        fetch(`http://localhost:9090/api/family/list/${clientId}`, {
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

    const paginatedFamilies = computed(() => { //shows only 5 family members per page 
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

    const addFamily = () => { //pop up with add family member form. If user clicks on the button it displays it
        showAddForm.value = true;
    };
    const editFamilyForm = () => 
    {
        showEditForm.value = true;//pop up with edit family member form. If user clicks on the button it displays it
    }
    const submitFamily = () => { //add family member
        const today = new Date();
        const selectedDate = new Date(newFamily.value.birthDate);

        if (selectedDate > today) { //check for birth date
            openModal("Birth date cannot be a future date.");
            return;
        }

        fetch(`http://localhost:9090/api/family/new/${clientId}`, { //send post request to save family member
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.accessToken}`,
            },
            body: JSON.stringify(newFamily.value)
        })
            .then(response => { //if response is ok clear the input fields and show successful message.
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
    const editFamily = (familyId) => { //send a get request to retrieve the info of the family member that the user wants to edit
        tempFamilyId.value = familyId;
    const today = new Date();
    const selectedDate = new Date(newFamily.value.birthDate);

    if (selectedDate > today) {
        openModal("Birth date cannot be a future date.");
        return;
    }

    fetch(`http://localhost:9090/api/family/${familyId}`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.accessToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        newFamily.value = { firstName: `${data.firstName}`, lastName: `${data.lastName}`, gender: `${data.gender}`, birthDate: `${data.birthDate}`, relation: `${data.relation}` };
    })
    .catch(error => {
        console.error('Error fetching family data:', error);
    });
};

const updateFamily = () => { //send a post request with the new info of the family member that the user wants to edit
    fetch(`http://localhost:9090/api/family/${tempFamilyId.value}/${clientId}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify(newFamily.value)
    })
    .then(response => {
        if (response.ok) {
            openModal('Family member updated successfully!');
        } else {
            console.log(newFamily.value)
            throw new Error('Failed to update family member');
        }
    })
    .catch(error => {
        console.error('Error updating family member:', error);
    });
};
    const cancelAddFamily = () => { //when users clicks on the X button in the pop up it closes it and clears the input fields
        newFamily.value = { firstName: '', lastName: '', gender: '', birthDate: '', relation: '' };
        showAddForm.value = false;
    };
    const cancelEditFamily = () => { //when users clicks on the X button in the pop up it closes it and clears the input fields
        newFamily.value = { firstName: '', lastName: '', gender: '', birthDate: '', relation: '' };
        showEditForm.value = false;
    };
    const removeFamily = (familyId) => { //send a post request to remove a family member 
        fetch(`http://localhost:9090/api/family/${familyId}/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.accessToken}`,
            }
        })
            .then(response => {
                if (response.ok) {
                    openModal('Removed successfully!');
                } else {
                    throw new Error('Failed to remove');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error removing family member:', error);
            });
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
.pos 
{
    margin-top: 20px;
}

.editBtn{
    margin-right: 5px;
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
        background-color: #333332;
        border: none;
        color: #fff;
        border: 1px solid #000000;
    }

    th,
    td {
        padding: 12px;
        text-align: left;
        border: 1px solid #000000;
    }

    th {
        background-color: #4f5054;
        color: #fff;
    }

    .form-label {
        color: #fff;
    }

    .form-input {
        background-color: #333332;
        color: #fff;
        border: 1px solid #fff;
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
        background-color: #333332;
        color: #fff;
        border: 1px solid #fff;
        padding: 8px;
        margin-bottom: 10px;
        width: 100%;
        border-radius: 5px;
    }
</style>
