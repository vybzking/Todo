
import { auth } from "./config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const loginForm = document.getElementById("login-form");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("login-button");

const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

const togglePassword = document.getElementById("toggle-password");


// REDIRECT IF ALREADY AUTHENTICATED
onAuthStateChanged(auth, user => {

    if (user) {
        window.location.replace("dashboard.html");
    }

});


// DISPLAY MESSAGE
function showMessage(element, message) {

    errorMessage.hidden = true;
    successMessage.hidden = true;

    element.textContent = message;
    element.hidden = false;

}


// CLEAR MESSAGES
function clearMessages() {

    errorMessage.hidden = true;
    successMessage.hidden = true;

}


// PASSWORD VISIBILITY
togglePassword.addEventListener("click", () => {

    const visible = passwordInput.type === "password";

    passwordInput.type = visible ? "text" : "password";

    togglePassword.textContent = visible ? "Hide" : "Show";

    togglePassword.setAttribute(
        "aria-label",
        visible ? "Hide password" : "Show password"
    );

    togglePassword.setAttribute(
        "aria-pressed",
        String(visible)
    );

});


// LOGIN
loginForm.addEventListener("submit", async event => {

    event.preventDefault();

    clearMessages();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        alert("success")
            
        showMessage(
            successMessage,
            "Login successful. Redirecting..."
        );

        window.location.replace("dashboard.html");

    } catch (error) {

        console.error("Login error:", error);

        const messages = {
            "auth/invalid-credential":
                "Incorrect email or password.",

            "auth/user-not-found":
                "No account was found with this email.",

            "auth/wrong-password":
                "Incorrect email or password.",

            "auth/invalid-email":
                "Please enter a valid email address.",

            "auth/too-many-requests":
                "Too many attempts. Please try again later.",

            "auth/network-request-failed":
                "Network error. Check your internet connection."
        };

        alert(error)

        showMessage(
            errorMessage,
            error.code
            // messages[error.code] || "Unable to sign in. Please try again."
        );

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Sign In";

    }

});
