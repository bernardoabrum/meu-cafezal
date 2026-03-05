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
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const router = useRouter();
const showRegister = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const inputTypes = ref({
  password: "password",
  confirm: "password",
});

const loginButton = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/home");
  } catch (err) {
    console.error("Erro ao fazer login:", err.code);

    switch (err.code) {
      case "auth/invalid-email":
        alert("O email informado é inválido");
        break;

      case "auth/invalid-credential":
        alert("Credenciais inválidas");
        break;

      case "auth/missing-password":
        alert("Insira uma senha");
        break;

      default:
        alert("Erro ao tentar entrar");
        break;
    }
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
    alert("Por favor, preencha todos os campos");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("As senhas não coincidem");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name.value,
    });

    router.push("/home");

    alert("Conta criada com sucesso!");

    name.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    showRegister.value = false;
  } catch (err) {
    console.error("Erro ao criar conta:", err);

    switch (err.code) {
      case "auth/email-already-in-use":
        alert("Este email já está cadastrado");
        break;

      case "auth/invalid-email":
        alert("O email informado não é válido");
        break;

      case "auth/weak-password":
        alert("A senha deve ter pelo menos 6 caracteres");
        break;

      case "auth/missing-password":
        alert("Digite uma senha para criar a conta");
        break;

      case "auth/operation-not-allowed":
        alert("A criação de contas está desativada");
        break;

      default:
        alert("Erro ao criar conta");
        break;
    }
  }
};
</script>
