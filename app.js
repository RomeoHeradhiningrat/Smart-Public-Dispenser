// ============================================================
// SMART PUBLIC DISPENSER
// FIREBASE REALTIME DASHBOARD
// ============================================================


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {

    apiKey: "AIzaSyBbCtWZDMtNB38YUfbWPSGe2F0vSOvm1n8",

    authDomain:
        "smart-dispenser-b4450.firebaseapp.com",

    databaseURL:
        "https://smart-dispenser-b4450-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "smart-dispenser-b4450",

    storageBucket:
        "smart-dispenser-b4450.firebasestorage.app",

    messagingSenderId:
        "1075653503034",

    appId:
        "1:1075653503034:web:88370909f2535e8ffcad03",

    measurementId:
        "G-PS737QN390"

};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const database = firebase.database();


// ============================================================
// DOM
// ============================================================

const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginError =
    document.getElementById("loginError");

const togglePassword =
    document.getElementById("togglePassword");

const logoutButton =
    document.getElementById("logoutButton");


// ============================================================
// DATA ELEMENTS
// ============================================================

const galonStatus =
    document.getElementById("galonStatus");

const galonDescription =
    document.getElementById("galonDescription");

const totalUsage =
    document.getElementById("totalUsage");

const coldTemp =
    document.getElementById("coldTemp");

const hotTemp =
    document.getElementById("hotTemp");

const detailGalon =
    document.getElementById("detailGalon");

const detailCold =
    document.getElementById("detailCold");

const detailHot =
    document.getElementById("detailHot");

const detailUsage =
    document.getElementById("detailUsage");


// ============================================================
// STATUS ELEMENTS
// ============================================================

const firebaseDot =
    document.getElementById("firebaseDot");

const firebaseStatus =
    document.getElementById("firebaseStatus");

const dataDot =
    document.getElementById("dataDot");

const dataStatus =
    document.getElementById("dataStatus");

const sensorDot =
    document.getElementById("sensorDot");

const sensorStatus =
    document.getElementById("sensorStatus");

const lastUpdate =
    document.getElementById("lastUpdate");

const liveDot =
    document.getElementById("liveDot");

const liveText =
    document.getElementById("liveText");

const sidebarConnectionDot =
    document.getElementById("sidebarConnectionDot");

const sidebarConnectionText =
    document.getElementById("sidebarConnectionText");


// ============================================================
// CHART VARIABLES
// ============================================================

let temperatureChart = null;

const maxDataPoints = 30;

const chartLabels = [];

const coldTemperatureData = [];

const hotTemperatureData = [];


// ============================================================
// HELPER
// ============================================================

function setStatus(dot, textElement, online, text) {

    if (online) {

        dot.classList.remove("offline");

        dot.classList.add("online");

    } else {

        dot.classList.remove("online");

        dot.classList.add("offline");

    }

    textElement.textContent = text;

}


// ============================================================
// LOGIN ERROR
// ============================================================

function showLoginError(message) {

    loginError.textContent = message;

    loginError.style.display = "block";

}

function hideLoginError() {

    loginError.textContent = "";

    loginError.style.display = "none";

}


// ============================================================
// LOGIN
// ============================================================

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    hideLoginError();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {

        showLoginError(
            "Email dan password wajib diisi."
        );

        return;
    }


    loginButton.disabled = true;

    loginButtonText.textContent =
        "Memproses login...";


    try {

        await auth.signInWithEmailAndPassword(
            email,
            password
        );

    }

    catch (error) {

        console.error(
            "Firebase Login Error:",
            error
        );


        let message =
            "Login gagal. Periksa email dan password.";

        switch (error.code) {

            case "auth/invalid-email":

                message =
                    "Format email tidak valid.";

                break;


            case "auth/user-disabled":

                message =
                    "Akun Firebase ini dinonaktifkan.";

                break;


            case "auth/user-not-found":

                message =
                    "Akun tidak ditemukan.";

                break;


            case "auth/wrong-password":

                message =
                    "Password salah.";

                break;


            case "auth/invalid-credential":

                message =
                    "Email atau password salah.";

                break;


            case "auth/too-many-requests":

                message =
                    "Terlalu banyak percobaan login. Coba lagi nanti.";

                break;


            case "auth/network-request-failed":

                message =
                    "Tidak dapat terhubung ke Firebase.";

                break;

        }


        showLoginError(message);

    }


    finally {

        loginButton.disabled = false;

        loginButtonText.textContent =
            "Login Dashboard";

    }

});


// ============================================================
// TOGGLE PASSWORD
// ============================================================

togglePassword.addEventListener(
    "click",
    function() {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁";

        }

    }
);


// ============================================================
// LOGOUT
// ============================================================

logoutButton.addEventListener(
    "click",
    async function() {

        try {

            await auth.signOut();

        }

        catch (error) {

            console.error(
                "Logout Error:",
                error
            );

        }

    }
);


// ============================================================
// AUTH STATE
// ============================================================

auth.onAuthStateChanged(
    function(user) {

        if (user) {

            console.log(
                "Firebase Authenticated:",
                user.email
            );


            loginPage.classList.add(
                "hidden"
            );

            dashboardPage.classList.remove(
                "hidden"
            );


            startDashboard();

        } else {

            console.log(
                "User belum login."
            );


            dashboardPage.classList.add(
                "hidden"
            );

            loginPage.classList.remove(
                "hidden"
            );


            stopDashboard();

        }

    }
);


// ============================================================
// DASHBOARD START
// ============================================================

let dashboardStarted = false;

let databaseListener = null;

let connectionListener = null;


function startDashboard() {

    if (dashboardStarted) {
        return;
    }

    dashboardStarted = true;


    initializeChart();

    listenFirebaseConnection();

    listenDispenserData();

}


// ============================================================
// DASHBOARD STOP
// ============================================================

function stopDashboard() {

    if (!dashboardStarted) {
        return;
    }


    dashboardStarted = false;


    if (databaseListener) {

        database.ref("dispenser")
            .off(
                "value",
                databaseListener
            );

        databaseListener = null;

    }


    if (connectionListener) {

        database.ref(".info/connected")
            .off(
                "value",
                connectionListener
            );

        connectionListener = null;

    }


    if (temperatureChart) {

        temperatureChart.destroy();

        temperatureChart = null;

    }

}


// ============================================================
// FIREBASE CONNECTION
// ============================================================

function listenFirebaseConnection() {

    connectionListener =
        function(snapshot) {

            const connected =
                snapshot.val() === true;


            if (connected) {

                setStatus(
                    firebaseDot,
                    firebaseStatus,
                    true,
                    "Connected"
                );


                setStatus(
                    sidebarConnectionDot,
                    sidebarConnectionText,
                    true,
                    "Firebase Online"
                );


                liveDot.classList.add(
                    "online"
                );

                liveText.textContent =
                    "Live";

            } else {

                setStatus(
                    firebaseDot,
                    firebaseStatus,
                    false,
                    "Offline"
                );


                setStatus(
                    sidebarConnectionDot,
                    sidebarConnectionText,
                    false,
                    "Firebase Offline"
                );


                liveDot.classList.remove(
                    "online"
                );

                liveText.textContent =
                    "Offline";

            }

        };


    database
        .ref(".info/connected")
        .on(
            "value",
            connectionListener
        );

}


// ============================================================
// READ DISPENSER
// ============================================================

function listenDispenserData() {

    const dispenserRef =
        database.ref("dispenser");


    databaseListener =
        function(snapshot) {

            console.log(
                "Firebase /dispenser:",
                snapshot.val()
            );


            const data =
                snapshot.val();


            if (!data) {

                setStatus(
                    dataDot,
                    dataStatus,
                    false,
                    "No Data"
                );

                return;

            }


            // =================================================
            // STATUS GALON
            // =================================================

            const galon =
                Number(data.statusGalon);


            detailGalon.textContent =
                Number.isFinite(galon)
                    ? galon
                    : "—";


            if (galon === 1) {

                galonStatus.textContent =
                    "Tersedia";

                galonStatus.style.color =
                    "#16a34a";

                galonDescription.textContent =
                    "Air galon tersedia";

            }

            else if (galon === 0) {

                galonStatus.textContent =
                    "Habis";

                galonStatus.style.color =
                    "#dc2626";

                galonDescription.textContent =
                    "Air galon habis";

            }

            else {

                galonStatus.textContent =
                    "Unknown";

                galonStatus.style.color =
                    "#6b7280";

                galonDescription.textContent =
                    "Status tidak diketahui";

            }


            // =================================================
            // SUHU DINGIN
            // =================================================

            const cold =
                Number(data.suhuDingin);


            if (Number.isFinite(cold)) {

                coldTemp.textContent =
                    cold.toFixed(1);

                detailCold.textContent =
                    cold.toFixed(1) + " °C";

            } else {

                coldTemp.textContent =
                    "--";

                detailCold.textContent =
                    "—";

            }


            // =================================================
            // SUHU PANAS
            // =================================================

            const hot =
                Number(data.suhuPanas);


            if (Number.isFinite(hot)) {

                hotTemp.textContent =
                    hot.toFixed(1);

                detailHot.textContent =
                    hot.toFixed(1) + " °C";

            } else {

                hotTemp.textContent =
                    "--";

                detailHot.textContent =
                    "—";

            }


            // =================================================
            // TOTAL PENGGUNAAN AIR
            // =================================================

            const usage =
                Number(data.totalPenggunaanAir);


            if (Number.isFinite(usage)) {

                totalUsage.textContent =
                    usage.toFixed(2);

                detailUsage.textContent =
                    usage.toFixed(2) + " L";

            } else {

                totalUsage.textContent =
                    "0.00";

                detailUsage.textContent =
                    "—";

            }


            // =================================================
            // SYSTEM STATUS
            // =================================================

            setStatus(
                dataDot,
                dataStatus,
                true,
                "Receiving"
            );


            setStatus(
                sensorDot,
                sensorStatus,
                Number.isFinite(cold) ||
                Number.isFinite(hot),
                (
                    Number.isFinite(cold) ||
                    Number.isFinite(hot)
                )
                    ? "Active"
                    : "Waiting"
            );


            // =================================================
            // LAST UPDATE
            // =================================================

            const now =
                new Date();

            lastUpdate.textContent =
                now.toLocaleTimeString(
                    "id-ID",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );


            // =================================================
            // CHART
            // =================================================

            if (
                Number.isFinite(cold) &&
                Number.isFinite(hot)
            ) {

                addChartData(
                    cold,
                    hot
                );

            }

        };


    dispenserRef.on(
        "value",
        databaseListener,
        function(error) {

            console.error(
                "Firebase Read Error:",
                error
            );


            setStatus(
                dataDot,
                dataStatus,
                false,
                "Read Error"
            );


            setStatus(
                sensorDot,
                sensorStatus,
                false,
                "Waiting"
            );

        }
    );

}


// ============================================================
// CHART
// ============================================================

function initializeChart() {

    const canvas =
        document.getElementById(
            "temperatureChart"
        );


    if (!canvas) {
        return;
    }


    const context =
        canvas.getContext("2d");


    temperatureChart =
        new Chart(
            context,
            {

                type: "line",

                data: {

                    labels: chartLabels,

                    datasets: [

                        {

                            label:
                                "Suhu Dingin",

                            data:
                                coldTemperatureData,

                            borderColor:
                                "#0891b2",

                            backgroundColor:
                                "
