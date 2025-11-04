<template>
  <div class="page login-page">
    <div class="image-container" />
    <div class="container">
      <div v-if="!showRegister" class="login">
        <h1>Insira seus dados para fazer login</h1>
        <input v-model="email" type="email" placeholder="Email" />
        <div class="password-input">
          <input
            v-model="password"
            :type="inputTypes.password"
            placeholder="Senha"
          />
          <button @click="toggleShow('password')">
            <FontAwesomeIcon
              :icon="inputTypes.password === 'password' ? faEye : faEyeSlash"
            />
          </button>
        </div>
        <button @click="loginButton">Entrar</button>
        <p>
          Não possui uma conta?
          <a href="#" @click="registerButton">Registre-se</a>
        </p>
      </div>
      <div v-else class="register">
        <div>
          <h1>Crie sua conta</h1>
          <p>Já possui uma conta? <a href="#" @click="goBack">Entrar</a></p>
        </div>
        <input v-model="name" type="text" placeholder="Nome" />
        <input v-model="email" type="email" placeholder="Email" />
        <div class="password-input">
          <input
            v-model="password"
            :type="inputTypes.password"
            placeholder="Senha"
          />
          <button @click="toggleShow('password')">
            <FontAwesomeIcon
              :icon="inputTypes.password === 'password' ? faEye : faEyeSlash"
            />
          </button>
        </div>
        <div class="password-input">
          <input
            v-model="confirmPassword"
            :type="inputTypes.confirm"
            placeholder="Confirme a senha"
          />
          <button @click="toggleShow('confirm')">
            <FontAwesomeIcon
              :icon="inputTypes.confirm === 'password' ? faEye : faEyeSlash"
            />
          </button>
        </div>
        <button @click="createAccount">Registrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./Login.scss";
import { ref } from "vue";
import axios from "axios";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const { setLoggedUser } = useStore();
const showRegister = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const inputTypes = ref({
  password: "password",
  confirm: "password",
});

const loginButton = async () => {
  if (!email.value || !password.value) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const { data } = await axios.get("http://localhost:3000/users", {
      params: {
        email: email.value,
        password: password.value,
      },
    });

    if (data.length) {
      const user = data[0];
      setLoggedUser(user);
      router.push("/home");
    } else {
      alert("Email ou senha incorretos.");
    }
  } catch (err) {
    console.error("Erro ao fazer login:", err);
  }
};

const registerButton = () => {
  showRegister.value = true;
};

const goBack = () => {
  showRegister.value = false;
};

const toggleShow = (field) => {
  inputTypes.value[field] =
    inputTypes.value[field] === "password" ? "text" : "password";
};

const createAccount = async () => {
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const { data: existingUsers } = await axios.get(
      "http://localhost:3000/users",
      {
        params: { email: email.value },
      }
    );

    if (existingUsers.length > 0) {
      alert("Este email já está cadastrado!");
      return;
    }

    await axios.post("http://localhost:3000/users", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    alert("Conta criada com sucesso!");
    name.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    showRegister.value = false;
  } catch (err) {
    console.error("Erro ao criar conta:", err);
  }
};
</script>
