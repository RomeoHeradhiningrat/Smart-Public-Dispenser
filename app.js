// ============================================================
// SMART PUBLIC DISPENSER
// FIREBASE AUTH + REALTIME DATABASE
// ============================================================


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBbCtWZDMtNB38YUfbWPSGe2Fv0v1n8",

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

const auth =
    firebase.auth();

const database =
    firebase.database();


// ============================================================
// DATABASE PATH
// ============================================================

const dispenserRef =
    database.ref("dispenser");


// ============================================================
// DOM - LOGIN
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
// DOM - CONNECTION / SYSTEM STATUS
// ============================================================

const firebaseStatus =
    document.getElementById("firebaseStatus");

const firebaseStatusDot =
    document.getElementById("firebaseDot");

const dataStatus =
    document.getElementById("dataStatus");

const dataStatusDot =
    document.getElementById("dataDot");

const sensorStatus =
    document.getElementById("sensorStatus");

const sensorStatusDot =
    document.getElementById("sensorDot");

const lastUpdate =
    document.getElementById("lastUpdate");

const sidebarConnectionText =
    document.getElementById("sidebarConnectionText");

const sidebarConnectionDot =
    document.getElementById("sidebarConnectionDot");


// ============================================================
// DOM - DASHBOARD DATA
// ============================================================

const galonStatus =
    document.getElementById("galonStatus");

const galonDescription =
    document.getElementById("galonDescription");

const totalWater =
    document.getElementById("totalUsage");

const coldTemperature =
    document.getElementById("coldTemp");

const hotTemperature =
    document.getElementById("hotTemp");

const detailGalon =
    document.getElementById("detailGalon");

const detailCold =
    document.getElementById("detailCold");

const detailHot =
    document.getElementById("detailHot");

const detailWater =
    document.getElementById("detailUsage");


// ============================================================
// OPTIONAL ELEMENTS
// ============================================================

const liveDot =
    document.getElementById("liveDot");

const liveText =
    document.getElementById("liveText");

const footerYear =
    document.getElementById("footerYear");


// ============================================================
// CHART DATA
// ============================================================

let temperatureChart = null;

const chartLabels = [];

const coldData = [];

const hotData = [];

const MAX_POINTS = 30;


// ============================================================
// DASHBOARD STATE
// ============================================================

let dashboardInitialized = false;


// ============================================================
// HELPER - SAFE ELEMENT
// ============================================================

function elementExists(element) {

    return element !== null &&
           element !== undefined;

}


// ============================================================
// SHOW LOGIN
// ============================================================

function showLogin() {

    if (elementExists(loginPage)) {

        loginPage.classList.remove("hidden");

    }

    if (elementExists(dashboardPage)) {

        dashboardPage.classList.add("hidden");

    }

}


// ============================================================
// SHOW DASHBOARD
// ============================================================

function showDashboard() {

    if (elementExists(loginPage)) {

        loginPage.classList.add("hidden");

    }

    if (elementExists(dashboardPage)) {

        dashboardPage.classList.remove("hidden");

    }

}


// ============================================================
// LOGIN ERROR
// ============================================================

function showLoginError(message) {

    if (!elementExists(loginError)) {
        return;
    }

    loginError.textContent =
        message;

    loginError.classList.remove("hidden");

}


// ============================================================
// HIDE LOGIN ERROR
// ============================================================

function hideLoginError() {

    if (!elementExists(loginError)) {
        return;
    }

    loginError.classList.add("hidden");

    loginError.textContent = "";

}


// ============================================================
// STATUS DOT
// ============================================================

function setStatusDot(element, status) {

    if (!elementExists(element)) {
        return;
    }

    element.classList.remove(
        "online",
        "offline",
        "waiting"
    );

    element.classList.add(status);

}


// ============================================================
// LOGIN
// ============================================================

if (elementExists(loginForm)) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            hideLoginError();


            // ------------------------------------------------
            // CEK ELEMENT HTML
            // ------------------------------------------------

            if (
                !elementExists(emailInput) ||
                !elementExists(passwordInput)
            ) {

                console.error(
                    "Login input tidak ditemukan."
                );

                showLoginError(
                    "Form login bermasalah. Periksa ID email/password pada HTML."
                );

                return;

            }


            // ------------------------------------------------
            // AMBIL INPUT
            // ------------------------------------------------

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // ------------------------------------------------
            // VALIDASI
            // ------------------------------------------------

            if (!email || !password) {

                showLoginError(
                    "Email dan password wajib diisi."
                );

                return;

            }


            // ------------------------------------------------
            // DISABLE BUTTON
            // ------------------------------------------------

            if (elementExists(loginButton)) {

                loginButton.disabled = true;

            }

            if (elementExists(loginButtonText)) {

                loginButtonText.textContent =
                    "Sedang masuk...";

            }


            // ------------------------------------------------
            // FIREBASE LOGIN
            // ------------------------------------------------

            try {

                await auth.signInWithEmailAndPassword(
                    email,
                    password
                );


                console.log(
                    "Login Firebase berhasil:",
                    email
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


                    case "auth/user-not-found":

                        message =
                            "Akun Firebase tidak ditemukan.";

                        break;


                    case "auth/wrong-password":

                        message =
                            "Password yang dimasukkan salah.";

                        break;


                    case "auth/invalid-credential":

                        message =
                            "Email atau password salah.";

                        break;


                    case "auth/too-many-requests":

                        message =
                            "Terlalu banyak percobaan login. Coba lagi nanti.";

                        break;


                    case "auth/user-disabled":

                        message =
                            "Akun Firebase ini telah dinonaktifkan.";

                        break;


                    case "auth/network-request-failed":

                        message =
                            "Koneksi internet bermasalah.";

                        break;


                    case "auth/operation-not-allowed":

                        message =
                            "Login Email/Password belum diaktifkan di Firebase Authentication.";

                        break;


                    case "auth/api-key-not-valid":

                        message =
                            "Firebase API Key tidak valid.";

                        break;


                    default:

                        if (error.message) {

                            console.error(
                                "Detail Firebase:",
                                error.message
                            );

                        }

                        break;

                }


                showLoginError(message);

            }

            finally {

                if (elementExists(loginButton)) {

                    loginButton.disabled = false;

                }

                if (elementExists(loginButtonText)) {

                    loginButtonText.textContent =
                        "Login Dashboard";

                }

            }

        }
    );

}


// ============================================================
// SHOW / HIDE PASSWORD
// ============================================================

if (elementExists(togglePassword)) {

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

            }

            else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁";

            }

        }
    );

}


// ============================================================
// LOGOUT
// ============================================================

if (elementExists(logoutButton)) {

    logoutButton.addEventListener(
        "click",
        async function() {

            try {

                await auth.signOut();

                console.log(
                    "Firebase logout berhasil."
                );

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


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


            showDashboard();


            initializeDashboard();

        }

        else {

            console.log(
                "Firebase: Not authenticated"
            );


            showLogin();

            dashboardInitialized =
                false;

        }

    }
);


// ============================================================
// FIREBASE CONNECTION
// ============================================================

function monitorFirebaseConnection() {

    const connectionRef =
        database.ref(".info/connected");


    connectionRef.on(
        "value",
        function(snapshot) {

            const connected =
                snapshot.val() === true;


            if (connected) {

                if (elementExists(firebaseStatus)) {

                    firebaseStatus.textContent =
                        "Connected";

                }

                if (elementExists(sidebarConnectionText)) {

                    sidebarConnectionText.textContent =
                        "Connected";

                }

                if (elementExists(liveText)) {

                    liveText.textContent =
                        "Live";

                }


                setStatusDot(
                    firebaseStatusDot,
                    "online"
                );

                setStatusDot(
                    sidebarConnectionDot,
                    "online"
                );


                if (elementExists(liveDot)) {

                    liveDot.classList.add("online");

                }

            }

            else {

                if (elementExists(firebaseStatus)) {

                    firebaseStatus.textContent =
                        "Disconnected";

                }

                if (elementExists(sidebarConnectionText)) {

                    sidebarConnectionText.textContent =
                        "Disconnected";

                }

                if (elementExists(liveText)) {

                    liveText.textContent =
                        "Offline";

                }


                setStatusDot(
                    firebaseStatusDot,
                    "offline"
                );

                setStatusDot(
                    sidebarConnectionDot,
                    "offline"
                );


                if (elementExists(liveDot)) {

                    liveDot.classList.remove("online");

                }

            }

        }
    );

}


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

function initializeDashboard() {

    if (dashboardInitialized) {

        return;

    }

    dashboardInitialized =
        true;


    initializeChart();

    monitorFirebaseConnection();

    monitorDispenser();

}


// ============================================================
// REALTIME DISPENSER
// ============================================================

function monitorDispenser() {

    dispenserRef.on(

        "value",

        function(snapshot) {

            if (!snapshot.exists()) {

                console.warn(
                    "Path /dispenser tidak ditemukan."
                );


                if (elementExists(dataStatus)) {

                    dataStatus.textContent =
                        "No Data";

                }


                setStatusDot(
                    dataStatusDot,
                    "waiting"
                );


                if (elementExists(sensorStatus)) {

                    sensorStatus.textContent =
                        "Waiting";

                }


                setStatusDot(
                    sensorStatusDot,
                    "waiting"
                );


                if (elementExists(liveText)) {

                    liveText.textContent =
                        "No Data";

                }


                return;

            }


            const data =
                snapshot.val();


            console.log(
                "Firebase /dispenser:",
                data
            );


            updateDashboard(data);


            if (elementExists(dataStatus)) {

                dataStatus.textContent =
                    "Receiving Data";

            }


            setStatusDot(
                dataStatusDot,
                "online"
            );


            if (elementExists(sensorStatus)) {

                sensorStatus.textContent =
                    "Active";

            }


            setStatusDot(
                sensorStatusDot,
                "online"
            );


            if (elementExists(liveText)) {

                liveText.textContent =
                    "Live";

            }


            const now =
                new Date();


            if (elementExists(lastUpdate)) {

                lastUpdate.textContent =
                    now.toLocaleTimeString(
                        "id-ID",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }
                    );

            }

        },

        function(error) {

            console.error(
                "Firebase Database Read Error:",
                error
            );


            if (elementExists(dataStatus)) {

                dataStatus.textContent =
                    "Read Error";

            }


            setStatusDot(
                dataStatusDot,
                "offline"
            );


            if (elementExists(sensorStatus)) {

                sensorStatus.textContent =
                    "Unavailable";

            }


            setStatusDot(
                sensorStatusDot,
                "offline"
            );


            if (elementExists(liveText)) {

                liveText.textContent =
                    "Database Error";

            }

        }

    );

}


// ============================================================
// UPDATE DASHBOARD
// ============================================================

function updateDashboard(data) {


    // ========================================================
    // STATUS GALON
    // ========================================================

    const statusGalon =
        Number(data.statusGalon);


    if (statusGalon === 1) {

        if (elementExists(galonStatus)) {

            galonStatus.textContent =
                "Tersedia";

        }

        if (elementExists(galonDescription)) {

            galonDescription.textContent =
                "Galon tersedia dan dapat digunakan";

        }

        if (elementExists(detailGalon)) {

            detailGalon.textContent =
                "1";

        }

    }

    else if (statusGalon === 0) {

        if (elementExists(galonStatus)) {

            galonStatus.textContent =
                "Habis";

        }

        if (elementExists(galonDescription)) {

            galonDescription.textContent =
                "Air galon habis";

        }

        if (elementExists(detailGalon)) {

            detailGalon.textContent =
                "0";

        }

    }

    else {

        if (elementExists(galonStatus)) {

            galonStatus.textContent =
                "Unknown";

        }

        if (elementExists(galonDescription)) {

            galonDescription.textContent =
                "Status galon tidak diketahui";

        }

        if (elementExists(detailGalon)) {

            detailGalon.textContent =
                "—";

        }

    }


    // ========================================================
    // SUHU DINGIN
    // ========================================================

    const cold =
        Number(data.suhuDingin);


    if (Number.isFinite(cold)) {

        if (elementExists(coldTemperature)) {

            coldTemperature.textContent =
                cold.toFixed(1);

        }

        if (elementExists(detailCold)) {

            detailCold.textContent =
                cold.toFixed(1) + " °C";

        }

    }

    else {

        if (elementExists(coldTemperature)) {

            coldTemperature.textContent =
                "--";

        }

        if (elementExists(detailCold)) {

            detailCold.textContent =
                "—";

        }

    }


    // ========================================================
    // SUHU PANAS
    // ========================================================

    const hot =
        Number(data.suhuPanas);


    if (Number.isFinite(hot)) {

        if (elementExists(hotTemperature)) {

            hotTemperature.textContent =
                hot.toFixed(1);

        }

        if (elementExists(detailHot)) {

            detailHot.textContent =
                hot.toFixed(1) + " °C";

        }

    }

    else {

        if (elementExists(hotTemperature)) {

            hotTemperature.textContent =
                "--";

        }

        if (elementExists(detailHot)) {

            detailHot.textContent =
                "—";

        }

    }


    // ========================================================
    // TOTAL PENGGUNAAN AIR
    // ========================================================

    const water =
        Number(data.totalPenggunaanAir);


    if (Number.isFinite(water)) {

        if (elementExists(totalWater)) {

            totalWater.textContent =
                water.toFixed(2);

        }

        if (elementExists(detailWater)) {

            detailWater.textContent =
                water.toFixed(2) + " L";

        }

    }

    else {

        if (elementExists(totalWater)) {

            totalWater.textContent =
                "0.00";

        }

        if (elementExists(detailWater)) {

            detailWater.textContent =
                "—";

        }

    }


    // ========================================================
    // UPDATE CHART
    // ========================================================

    updateTemperatureChart(
        cold,
        hot
    );

}


// ============================================================
// INITIALIZE CHART
// ============================================================

function initializeChart() {

    const canvas =
        document.getElementById(
            "temperatureChart"
        );


    if (!canvas) {

        console.warn(
            "Canvas temperatureChart tidak ditemukan."
        );

        return;

    }


    const ctx =
        canvas.getContext("2d");


    temperatureChart =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels:
                        chartLabels,

                    datasets: [

                        {

                            label:
                                "Suhu Dingin",

                            data:
                                coldData,

                            borderWidth: 2,

                            pointRadius: 2,

                            pointHoverRadius: 5,

                            tension: 0.35,

                            fill: false

                        },

                        {

                            label:
                                "Suhu Panas",

                            data:
                                hotData,

                            borderWidth: 2,

                            pointRadius: 2,

                            pointHoverRadius: 5,

                            tension: 0.35,

                            fill: false

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    plugins: {

                        legend: {

                            position: "top",

                            align: "end",

                            labels: {

                                usePointStyle: true,

                                boxWidth: 7,

                                padding: 15,

                                font: {

                                    family:
                                        "Inter",

                                    size: 10

                                }

                            }

                        },


                        tooltip: {

                            backgroundColor:
                                "#111827",

                            padding: 10,

                            titleFont: {

                                size: 11

                            },

                            bodyFont: {

                                size: 11

                            }

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display: false

                            },

                            ticks: {

                                font: {

                                    family:
                                        "Inter",

                                    size: 9

                                },

                                color:
                                    "#9ca3af"

                            }

                        },


                        y: {

                            beginAtZero: false,

                            grid: {

                                color:
                                    "#f1f5f9"

                            },

                            ticks: {

                                font: {

                                    family:
                                        "Inter",

                                    size: 9

                                },

                                color:
                                    "#9ca3af"

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// UPDATE CHART
// ============================================================

function updateTemperatureChart(
    cold,
    hot
) {

    if (!temperatureChart) {

        return;

    }


    if (
        !Number.isFinite(cold) &&
        !Number.isFinite(hot)
    ) {

        return;

    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    chartLabels.push(time);


    coldData.push(
        Number.isFinite(cold)
            ? cold
            : null
    );


    hotData.push(
        Number.isFinite(hot)
            ? hot
            : null
    );


    while (
        chartLabels.length >
        MAX_POINTS
    ) {

        chartLabels.shift();

        coldData.shift();

        hotData.shift();

    }


    temperatureChart.update(
        "none"
    );

}


// ============================================================
// FOOTER YEAR
// ============================================================

if (elementExists(footerYear)) {

    footerYear.textContent =
        new Date().getFullYear();

}
