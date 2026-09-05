// ============================================================
// SMART PUBLIC DISPENSER
// FIREBASE REALTIME DASHBOARD
// ============================================================


// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {

  apiKey:
    "AIzaSyBbCtWZDMtNB38YUfbWPSGe2F0vSOvm1n8",

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

const database =
  firebase.database();


// ============================================================
// DATABASE REFERENCE
// ============================================================

const dispenserRef =
  database.ref("dispenser");


// ============================================================
// HELPER
// ============================================================

function getNumber(value) {

  const number =
    Number(value);

  if (
    Number.isFinite(number)
  ) {

    return number;

  }

  return null;

}


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(
  value,
  decimals
) {

  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {

    return "—";

  }

  return Number(value).toLocaleString(
    "id-ID",
    {
      minimumFractionDigits:
        decimals,

      maximumFractionDigits:
        decimals
    }
  );

}


// ============================================================
// FORMAT TIME
// ============================================================

function getCurrentTime() {

  const now =
    new Date();

  return now.toLocaleTimeString(
    "id-ID",
    {
      hour:
        "2-digit",

      minute:
        "2-digit",

      second:
        "2-digit"
    }
  );

}


// ============================================================
// ELEMENTS
// ============================================================

const galonStatus =
  document.getElementById(
    "galonStatus"
  );

const galonIndicator =
  document.getElementById(
    "galonIndicator"
  );

const galonDescription =
  document.getElementById(
    "galonDescription"
  );


const totalAir =
  document.getElementById(
    "totalAir"
  );


const suhuDingin =
  document.getElementById(
    "suhuDingin"
  );


const suhuPanas =
  document.getElementById(
    "suhuPanas"
  );


const detailGalon =
  document.getElementById(
    "detailGalon"
  );


const detailDingin =
  document.getElementById(
    "detailDingin"
  );


const detailPanas =
  document.getElementById(
    "detailPanas"
  );


const detailAir =
  document.getElementById(
    "detailAir"
  );


const lastUpdate =
  document.getElementById(
    "lastUpdate"
  );


const firebaseStatus =
  document.getElementById(
    "firebaseStatus"
  );


const dataStatus =
  document.getElementById(
    "dataStatus"
  );


const sensorStatus =
  document.getElementById(
    "sensorStatus"
  );


const firebaseCheck =
  document.getElementById(
    "firebaseCheck"
  );


const dataCheck =
  document.getElementById(
    "dataCheck"
  );


const sensorCheck =
  document.getElementById(
    "sensorCheck"
  );


const topStatusDot =
  document.getElementById(
    "topStatusDot"
  );


const topStatusText =
  document.getElementById(
    "topStatusText"
  );


const sidebarConnectionDot =
  document.getElementById(
    "sidebarConnectionDot"
  );


const sidebarConnectionText =
  document.getElementById(
    "sidebarConnectionText"
  );


const welcomeSystemStatus =
  document.getElementById(
    "welcomeSystemStatus"
  );


// ============================================================
// CONNECTION STATUS
// ============================================================

database
  .ref(".info/connected")
  .on(
    "value",
    function(snapshot) {

      const connected =
        snapshot.val() === true;


      if (connected) {

        topStatusDot
          .classList
          .add("connected");


        topStatusText.textContent =
          "Firebase Connected";


        sidebarConnectionDot
          .classList
          .add("connected");


        sidebarConnectionText.textContent =
          "Online";


        firebaseStatus.textContent =
          "Connected";


        firebaseCheck
          .classList
          .add("ok");


        welcomeSystemStatus.textContent =
          "ONLINE";

      }

      else {

        topStatusDot
          .classList
          .remove("connected");


        topStatusText.textContent =
          "Firebase Disconnected";


        sidebarConnectionDot
          .classList
          .remove("connected");


        sidebarConnectionText.textContent =
          "Offline";


        firebaseStatus.textContent =
          "Disconnected";


        firebaseCheck
          .classList
          .remove("ok");


        welcomeSystemStatus.textContent =
          "OFFLINE";

      }

    }
  );


// ============================================================
// REALTIME DATABASE
// ============================================================

dispenserRef.on(

  "value",

  function(snapshot) {

    const data =
      snapshot.val();


    if (!data) {

      dataStatus.textContent =
        "No data";

      return;

    }


    // ========================================================
    // READ DATA
    // ========================================================

    const galon =
      getNumber(
        data.statusGalon
      );


    const dingin =
      getNumber(
        data.suhuDingin
      );


    const panas =
      getNumber(
        data.suhuPanas
      );


    const total =
      getNumber(
        data.totalPenggunaanAir
      );


    // ========================================================
    // STATUS GALON
    // ========================================================

    if (galon === 1) {

      galonStatus.textContent =
        "TERSEDIA";


      galonDescription.textContent =
        "Galon masih tersedia";


      galonIndicator.style.background =
        "#16b364";


      galonIndicator.style.boxShadow =
        "0 0 0 4px rgba(22,179,100,.08)";


      detailGalon.textContent =
        "TERSEDIA";

    }

    else if (galon === 0) {

      galonStatus.textContent =
        "HABIS";


      galonDescription.textContent =
        "Galon perlu diganti";


      galonIndicator.style.background =
        "#ef4444";


      galonIndicator.style.boxShadow =
        "0 0 0 4px rgba(239,68,68,.08)";


      detailGalon.textContent =
        "HABIS";

    }

    else {

      galonStatus.textContent =
        "UNKNOWN";


      galonDescription.textContent =
        "Data tidak valid";


      detailGalon.textContent =
        "UNKNOWN";

    }


    // ========================================================
    // TOTAL AIR
    // ========================================================

    if (total !== null) {

      totalAir.textContent =
        formatNumber(
          total,
          2
        );


      detailAir.textContent =
        formatNumber(
          total,
          2
        ) + " L";

    }

    else {

      totalAir.textContent =
        "—";


      detailAir.textContent =
        "— L";

    }


    // ========================================================
    // SUHU DINGIN
    // ========================================================

    if (dingin !== null) {

      suhuDingin.textContent =
        formatNumber(
          dingin,
          1
        );


      detailDingin.textContent =
        formatNumber(
          dingin,
          1
        ) + " °C";

    }

    else {

      suhuDingin.textContent =
        "—";


      detailDingin.textContent =
        "— °C";

    }


    // ========================================================
    // SUHU PANAS
    // ========================================================

    if (panas !== null) {

      suhuPanas.textContent =
        formatNumber(
          panas,
          1
        );


      detailPanas.textContent =
        formatNumber(
          panas,
          1
        ) + " °C";

    }

    else {

      suhuPanas.textContent =
        "—";


      detailPanas.textContent =
        "— °C";

    }


    // ========================================================
    // DATA STATUS
    // ========================================================

    dataStatus.textContent =
      "Receiving data";


    dataCheck
      .classList
      .add("ok");


    if (
      dingin !== null ||
      panas !== null
    ) {

      sensorStatus.textContent =
        "Sensor active";


      sensorCheck
        .classList
        .add("ok");

    }


    // ========================================================
    // LAST UPDATE
    // ========================================================

    lastUpdate.textContent =
      getCurrentTime();


    // ========================================================
    // UPDATE GRAPH
    // ========================================================

    addTemperatureData(
      dingin,
      panas
    );

  },

  function(error) {

    console.error(
      "Firebase error:",
      error
    );


    dataStatus.textContent =
      "Read error";


    dataCheck
      .classList
      .remove("ok");

  }

);


// ============================================================
// TEMPERATURE CHART
// ============================================================

const chartCanvas =
  document.getElementById(
    "temperatureChart"
  );


const chartContext =
  chartCanvas.getContext(
    "2d"
  );


const temperatureChart =
  new Chart(
    chartContext,
    {

      type:
        "line",

      data:
      {

        labels:
          [],

        datasets:
        [

          {
            label:
              "Suhu Dingin",

            data:
              [],

            borderColor:
              "#1677ff",

            backgroundColor:
              "rgba(22,119,255,.07)",

            borderWidth:
              2,

            pointRadius:
              2,

            pointHoverRadius:
              5,

            tension:
              .35,

            fill:
              true
          },


          {
            label:
              "Suhu Panas",

            data:
              [],

            borderColor:
              "#f97316",

            backgroundColor:
              "rgba(249,115,22,.05)",

            borderWidth:
              2,

            pointRadius:
              2,

            pointHoverRadius:
              5,

            tension:
              .35,

            fill:
              true
          }

        ]

      },


      options:
      {

        responsive:
          true,

        maintainAspectRatio:
          false,

        interaction:
        {
          mode:
            "index",

          intersect:
            false
        },


        plugins:
        {

          legend:
          {
            display:
              false
          },


          tooltip:
          {

            backgroundColor:
              "#ffffff",

            titleColor:
              "#142033",

            bodyColor:
              "#607089",

            borderColor:
              "#e6ebf2",

            borderWidth:
              1,

            padding:
              10,

            callbacks:
            {

              label:
                function(context) {

                  return (
                    " " +
                    context.dataset.label +
                    ": " +
                    context.parsed.y +
                    " °C"
                  );

                }

            }

          }

        },


        scales:
        {

          x:
          {

            grid:
            {
              color:
                "#f0f3f7"
            },

            ticks:
            {
              color:
                "#91a0b5",

              font:
              {
                size:
                  8
              },

              maxTicksLimit:
                7
            }

          },


          y:
          {

            grid:
            {
              color:
                "#edf1f5"
            },

            ticks:
            {

              color:
                "#91a0b5",

              font:
              {
                size:
                  8
              },

              callback:
                function(value) {

                  return value +
                    "°C";

                }

            }

          }

        }

      }

    }
  );


// ============================================================
// GRAPH DATA
// ============================================================

const MAX_GRAPH_POINTS =
  30;


function addTemperatureData(
  dingin,
  panas
) {

  if (
    dingin === null &&
    panas === null
  ) {

    return;

  }


  const time =
    new Date().toLocaleTimeString(
      "id-ID",
      {
        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit"
      }
    );


  temperatureChart.data.labels.push(
    time
  );


  temperatureChart.data.datasets[0].data.push(
    dingin
  );


  temperatureChart.data.datasets[1].data.push(
    panas
  );


  // ==========================================================
  // LIMIT DATA
  // ==========================================================

  if (
    temperatureChart.data.labels.length >
    MAX_GRAPH_POINTS
  ) {

    temperatureChart.data.labels.shift();

    temperatureChart.data.datasets.forEach(
      function(dataset) {

        dataset.data.shift();

      }
    );

  }


  temperatureChart.update(
    "none"
  );

}


// ============================================================
// INITIAL MESSAGE
// ============================================================

console.log(
  "=========================================="
);

console.log(
  "SMART PUBLIC DISPENSER DASHBOARD"
);

console.log(
  "Firebase initialized"
);

console.log(
  "Database path: /dispenser"
);

console.log(
  "=========================================="
);