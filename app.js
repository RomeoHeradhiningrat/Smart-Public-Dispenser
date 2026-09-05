// ============================================================
// SMART PUBLIC DISPENSER
// FIREBASE AUTH + REALTIME DATABASE
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
// DATABASE PATH
// ============================================================

const dispenserRef =
    database.ref("dispenser");


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
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

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
// DASHBOARD ELEMENTS
// ============================================================

const firebaseStatus =
    document.getElementById("firebaseStatus");

const firebaseStatusDot =
    document.getElementById("firebaseStatusDot");

const dataStatus =
    document.getElementById("dataStatus");

const dataStatusDot =
    document.getElementById("dataStatusDot");

const sensorStatus =
    document.getElementById("sensorStatus");

const sensorStatusDot =
    document.getElementById("sensorStatusDot");

const lastUpdate =
    document.getElementById("lastUpdate");

const overallStatus =
    document.getElementById("overallStatus");

const overallStatusText =
    document.getElementById("overallStatusText");

const sidebarConnectionText =
    document.getElementById("sidebarConnectionText");

const sidebarConnectionDot =
    document.getElementById("sidebarConnectionDot");


// ============================================================
// DATA ELEMENTS
// ============================================================

const galonStatus =
    document.getElementById("galonStatus");

const galonBadge =
    document.getElementById("galonBadge");

const totalWater =
    document.getElementById("totalWater");

const coldTemperature =
    document.getElementById("coldTemperature");

const hotTemperature =
    document.getElementById("hotTemperature");

const detailGalon =
    document.getElementById("detailGalon");

const detailCold =
    document.getElementById("detailCold");

const detailHot =
    document.getElementById("detailHot");

const detailWater =
    document.getElementById("detailWater");


// ============================================================
// CHART DATA
// ============================================================

let temperatureChart = null;

const chartLabels = [];

const coldData = [];

const hotData = [];

const MAX_POINTS = 30;


// ============================================================
// HELPER
// ============================================================

function showLogin() {

    loginPage.classList.remove("hidden");

    dashboardPage.classList.add("hidden");
}


function showDashboard() {

    loginPage.classList.add("hidden");

    dashboardPage.classList.remove("hidden");
}


function showLoginError(message) {

    loginError.textContent = message;

    loginError.classList.remove("hidden");
}


function hideLoginError() {

    loginError.classList.add("hidden");

    loginError.textContent = "";
}


function setStatusDot(element, status) {

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

loginForm.addEventListener(
    "submit",
    async function(event) {

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
            "Sedang masuk...";


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

            }


            showLoginError(message);

        }

        finally {

            loginButton.disabled = false;

            loginButtonText.textContent =
                "Masuk ke Dashboard";

        }

    }
);


// ============================================================
// SHOW / HIDE PASSWORD
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

        }

        else {

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
                "Logout error:",
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

            showDashboard();

            initializeDashboard();

        }

        else {

            console.log(
                "Firebase: Not authenticated"
            );

            showLogin();

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

                firebaseStatus.textContent =
                    "Connected";

                sidebarConnectionText.textContent =
                    "Connected";


                setStatusDot(
                    firebaseStatusDot,
                    "online"
                );

                setStatusDot(
                    sidebarConnectionDot,
                    "online"
                );

            }

            else {

                firebaseStatus.textContent =
                    "Disconnected";

                sidebarConnectionText.textContent =
                    "Disconnected";


                setStatusDot(
                    firebaseStatusDot,
                    "offline"
                );

                setStatusDot(
                    sidebarConnectionDot,
                    "offline"
                );

            }

        }
    );

}


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

let dashboardInitialized = false;


function initializeDashboard() {

    if (dashboardInitialized) {
        return;
    }

    dashboardInitialized = true;


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

                dataStatus.textContent =
                    "No Data";

                setStatusDot(
                    dataStatusDot,
                    "waiting"
                );

                return;
            }


            const data =
                snapshot.val();


            console.log(
                "Firebase /dispenser:",
                data
            );


            updateDashboard(data);


            dataStatus.textContent =
                "Receiving Data";

            setStatusDot(
                dataStatusDot,
                "online"
            );


            sensorStatus.textContent =
                "Active";

            setStatusDot(
                sensorStatusDot,
                "online"
            );


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


            overallStatus.className =
                "overall-status online";

            overallStatusText.textContent =
                "System Online";

        },

        function(error) {

            console.error(
                "Firebase Database Read Error:",
                error
            );


            dataStatus.textContent =
                "Read Error";

            setStatusDot(
                dataStatusDot,
                "offline"
            );


            sensorStatus.textContent =
                "Unavailable";

            setStatusDot(
                sensorStatusDot,
                "offline"
            );


            overallStatus.className =
                "overall-status offline";

            overallStatusText.textContent =
                "Database Error";

        }

    );

}


// ============================================================
// UPDATE DASHBOARD
// ============================================================

function updateDashboard(data) {

    // --------------------------------------------------------
    // STATUS GALON
    // --------------------------------------------------------

    const statusGalon =
        Number(data.statusGalon);


    if (statusGalon === 1) {

        galonStatus.textContent =
            "Tersedia";

        detailGalon.textContent =
            "Tersedia";


        galonBadge.textContent =
            "Available";

        galonBadge.className =
            "badge available";

    }

    else if (statusGalon === 0) {

        galonStatus.textContent =
            "Habis";

        detailGalon.textContent =
            "Habis";


        galonBadge.textContent =
            "Empty";

        galonBadge.className =
            "badge empty";

    }

    else {

        galonStatus.textContent =
            "Unknown";

        detailGalon.textContent =
            "Unknown";


        galonBadge.textContent =
            "Unknown";

        galonBadge.className =
            "badge waiting";

    }


    // --------------------------------------------------------
    // SUHU DINGIN
    // --------------------------------------------------------

    const cold =
        Number(data.suhuDingin);


    if (Number.isFinite(cold)) {

        coldTemperature.textContent =
            cold.toFixed(1);

        detailCold.textContent =
            cold.toFixed(1);

    }

    else {

        coldTemperature.textContent =
            "—";

        detailCold.textContent =
            "—";

    }


    // --------------------------------------------------------
    // SUHU PANAS
    // --------------------------------------------------------

    const hot =
        Number(data.suhuPanas);


    if (Number.isFinite(hot)) {

        hotTemperature.textContent =
            hot.toFixed(1);

        detailHot.textContent =
            hot.toFixed(1);

    }

    else {

        hotTemperature.textContent =
            "—";

        detailHot.textContent =
            "—";

    }


    // --------------------------------------------------------
    // TOTAL PENGGUNAAN AIR
    // --------------------------------------------------------

    const water =
        Number(data.totalPenggunaanAir);


    if (Number.isFinite(water)) {

        totalWater.textContent =
            water.toFixed(2);

        detailWater.textContent =
            water.toFixed(2);

    }

    else {

        totalWater.textContent =
            "—";

        detailWater.textContent =
            "—";

    }


    // --------------------------------------------------------
    // UPDATE CHART
    // --------------------------------------------------------

    updateTemperatureChart(
        cold,
        hot
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
// PREVENT OLD DATA ON LOGOUT
// ============================================================

auth.onAuthStateChanged(
    function(user) {

        if (!user) {

            dashboardInitialized =
                false;

        }

    }
);
