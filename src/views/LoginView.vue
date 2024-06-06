<template>
  <div class="overlay white-text">
    <div class="modal-container">
      <div class="modal-content">
        <div class="text-center mb-4">
          <h1 class="fs-3">Login</h1>
        </div>

        <div class="mb-2" v-if="authenticationFailed">
          <div class="alert alert-danger" role="alert">
            Authentication failed!
          </div>
        </div>
        <div class="mb-2">
          <label for="usernameFormControl" class="form-label mb-1">User Name</label>
          <div class="col-sm-4">
            <input v-model="credentials.username" type="text" class="form-control" id="usernameFormControl" />
          </div>
        </div>
        <div class="mb-2">
          <label for="passwordFormControl" class="form-label mb-1">Password</label>
          <div class="col-sm-4">
            <input v-model="credentials.password" type="password" class="form-control" id="passwordFormControl" />
          </div>
        </div>
        <div>
          <button type="button" class="btn btn-primary btn-lg rounded-3 font-bold" @click.prevent="onFormSubmit">Sign In</button>
        </div>
        <div>
          Not registered User? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';

const router = useRouter();
const { setUserData, persistUserData, isAuthenticated } = useApplicationStore();

const loading = ref(false);
const credentials = ref({
    username: '',
    password: ''
});
const authenticationFailed = ref(false);

const backendURL = import.meta.env.VITE_BACKEND;

const onFormSubmit = () => {
    loading.value = true;
    authenticationFailed.value = false;

    fetch(`${backendURL}/api/auth/signin`, { // Use backendURL variable here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials.value)
    })
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setUserData(data);
                    persistUserData();
                    router.push({ name: 'home' });
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                });
            } else {
                authenticationFailed.value = true;
            }
        })
        .catch((err) => {
            console.warn(err);
            authenticationFailed.value = true;
        })
        .finally(() => {
            loading.value = false;
        });
};

onBeforeMount(() => {
    if (isAuthenticated.value === true) {
        router.replace({ name: 'home' });
    }
});

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
}
</style>