import { auth, db } from "./config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


let currentUser = null;
let tasks = [];
let currentFilter = "all";

const taskCollection = collection(db, "tasks");


// AUTHENTICATION
onAuthStateChanged(auth, user => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    document.getElementById("user-email").textContent =
        user.email;

    loadTasks();
});


// LOAD USER TASKS
function loadTasks() {

    const q = query(
        taskCollection,
        where("uid", "==", currentUser.uid)
    );

    onSnapshot(q, snapshot => {

        tasks = snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));

        expireTasks();
        renderDashboard();

    }, error => {
        console.error(error);
    });
}


// CREATE TASK
async function createTask(title, description, dueDate) {

    if (!currentUser) return;

    await addDoc(taskCollection, {

        uid: currentUser.uid,

        title,
        description,

        dueAt: Timestamp.fromDate(
            new Date(dueDate)
        ),

        status: "pending",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()

    });
}


// UPDATE TASK
async function updateTask(taskId, data) {

    await updateDoc(
        doc(db, "tasks", taskId),
        {
            ...data,
            updatedAt: serverTimestamp()
        }
    );
}


// COMPLETE TASK
async function completeTask(taskId) {

    await updateTask(taskId, {

        status: "completed",

        completedAt: serverTimestamp()

    });
}


// DELETE TASK
async function deleteTask(taskId) {

    await deleteDoc(
        doc(db, "tasks", taskId)
    );
}


// EXPIRE OVERDUE TASKS
async function expireTasks() {

    const now = Date.now();

    const expired = tasks.filter(task =>

        task.status === "pending" &&
        task.dueAt?.toMillis() <= now

    );

    for (const task of expired) {

        await updateTask(task.id, {
            status: "expired"
        });

    }
}


// RESCHEDULE EXPIRED TASK
async function rescheduleTask(taskId, newDate) {

    await updateTask(taskId, {

        dueAt: Timestamp.fromDate(
            new Date(newDate)
        ),

        status: "pending"

    });
}


// DASHBOARD STATISTICS
function getStatistics() {

    return {
        total: tasks.length,

        pending: tasks.filter(
            t => t.status === "pending"
        ).length,

        completed: tasks.filter(
            t => t.status === "completed"
        ).length,

        expired: tasks.filter(
            t => t.status === "expired"
        ).length
    };
}


// FILTER TASKS
function filterTasks(filter) {

    currentFilter = filter;

    renderDashboard();
}


function renderDashboard() {

    const stats = getStatistics();

    document.getElementById("total-count").textContent =
        stats.total;

    document.getElementById("pending-count").textContent =
        stats.pending;

    document.getElementById("completed-count").textContent =
        stats.completed;

    document.getElementById("expired-count").textContent =
        stats.expired;

    const filtered = currentFilter === "all"
        ? tasks
        : tasks.filter(t => t.status === currentFilter);

    renderTasks(filtered);
}


// RENDER TASKS
function renderTasks(taskItems) {

    const container =
        document.getElementById("task-list");

    container.replaceChildren();

    if (!taskItems.length) {
        container.textContent = "No tasks found.";
        return;
    }

    taskItems.forEach(task => {

        const item = document.createElement("div");

        item.className = "task-card";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "";

        const status = document.createElement("span");
        status.textContent = task.status;

        item.append(title, description, status);

        if (task.status === "pending") {

            const complete = document.createElement("button");

            complete.textContent = "Complete";

            complete.onclick = () =>
                completeTask(task.id);

            item.append(complete);
        }

        if (task.status === "expired") {

            const reschedule = document.createElement("button");

            reschedule.textContent = "Reschedule";

            reschedule.onclick = () => {
                const date = prompt(
                    "Enter new due date (YYYY-MM-DDTHH:mm)"
                );

                if (date) {
                    rescheduleTask(task.id, date);
                }
            };

            item.append(reschedule);
        }

        const remove = document.createElement("button");

        remove.textContent = "Delete";

        remove.onclick = () => {
            if (confirm("Delete this task?")) {
                deleteTask(task.id);
            }
        };

        item.append(remove);

        container.append(item);

    });
}


// LOGOUT
document.getElementById("logout").onclick = async () => {

    await signOut(auth);

    window.location.href = "login.html";
};


// FORM SUBMISSION
document.getElementById("task-form")
    .addEventListener("submit", async event => {

        event.preventDefault();

        const title =
            document.getElementById("title").value;

        const description =
            document.getElementById("description").value;

        const dueDate =
            document.getElementById("due-date").value;

        if (!dueDate || new Date(dueDate) <= new Date()) {
            alert("Choose a future due date.");
            return;
        }

        await createTask(title, description, dueDate);

        event.target.reset();
    });
