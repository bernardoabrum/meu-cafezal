<template>
  <div class="login-page">
    <div class="container">
      <div v-if="!showRegister" class="login">
        <h1>Login</h1>
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Senha" />
        <div class="buttons">
          <button @click="loginButton">Entrar</button>
          <button @click="registerButton">Registrar</button>
        </div>
      </div>
      <div v-else class="register">
        <h1>Register</h1>
        <input v-model="name" type="text" placeholder="Nome" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Senha" />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirme a senha"
        />
        <button @click="createAccount">Criar conta</button>
        <button @click="goBack">Voltar</button>
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

const router = useRouter();
const { setLoggedUser } = useStore();
const showRegister = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

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
    alert("Erro ao criar conta. Tente novamente.");
  }
};
</script>
