<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { Ref, watchEffect } from "vue";
import { Chart, ChartConfiguration, ChartItem } from "chart.js/auto";
import { getFavoritesCoinsCurrencies } from "../services/CoinService";
import { Coin, Stats } from "../interfaces/Data";
import Navbar from "../components/navbar/Navbar.vue";
import Section from "../components/section/Section.vue"
import SearchFavorites from "../components/SearchFavorites.vue";
import Footer from "../components/footer/Footer.vue"

const coins: Ref<Coin[]> = ref([]);
const stats: Ref<Stats> = ref({} as Stats);
const isLoading: Ref<boolean> = ref(true);
const noFound: Ref<boolean> = ref(true);
const noResults: Ref<boolean> = ref(true);
const error: Ref<string> = ref("");
const charts: Chart[] = [];

const renderChart = (coin: Coin, index: number): void => {
  const { sparkline, change } = coin;
  const spark = sparkline || ["0", "0"];

  const canvasTag = document.getElementById(
    `myChart-${index}`
  ) as HTMLCanvasElement;
  if (!canvasTag) return;

  const labels = spark.map((_, i) => i + 1);

  const ctx = canvasTag.getContext("2d");
  if (!ctx) return;

  if (charts[index]) {
    charts[index].destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 25);
  gradient.addColorStop(0, change?.includes("-") ? "#FF1E1E87" : "#00FFB357");
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 96, 37);

  const data = {
    labels,
    datasets: [
      {
        label: "Votos",
        data: sparkline.map(Number),
        borderWidth: 1,
        pointRadius: 0,
        pointHoverBorderWidth: 1,
        fill: true,
        borderColor: change
          ? change?.includes("-")
            ? "#FF1E1E"
            : "#00FFB3"
          : "#5F80B2",
        backgroundColor: gradient,
      },
    ],
  };

  const config: ChartConfiguration = {
    type: "line",
    data,
    options: {
      animation: {
        duration: 0,
      },
      scales: {
        y: {
          display: false,
        },
        x: {
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
          usePointStyle: false,
        },
      },
    },
  };

  const myChart = new Chart(canvasTag, config);
  charts[index] = myChart;
};

const loadData = async (): Promise<void> => {
  const localUuid = localStorage.getItem("uuid");
  
  if (localUuid) {
    try {
      const data = await getFavoritesCoinsCurrencies();
      coins.value = data.coins;
      stats.value = data.stats;
      isLoading.value = false;
      noFound.value = true
    } catch (err: unknown) {
      error.value = (err as Error).message;
    }
  } else {
    isLoading.value = false;
    noResults.value = false;
  }
};

const search = (coin: Coin[]): void => {
  coin.forEach(renderChart);
};

const searchCoins = async (): Promise<void> => {
  await loadData();
  coins.value.forEach(renderChart);
};

const removeFavorite = async (uuid: string): Promise<void> => {
  const localUuid = localStorage.getItem("uuid") ?? "";
  const localUuidReplace = localUuid
    .replace(`&uuids[]=${uuid}`, "")
    .replace(`uuids[]=${uuid}`, "");

  localStorage.setItem("uuid", localUuidReplace);

  const localUuidNew = localStorage.getItem("uuid");

  if (localUuidNew) {
    searchCoins();
  } else {
    coins.value.length = 0;
    isLoading.value = false;
    noResults.value = false;
  }
};


const convertirADolar = (numero: number) => {
  // Formatear el número con dos decimales y separador de miles
  let valorFormateado = numero.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  let simbolo = "$ "; // Símbolo de la moneda

  return simbolo + valorFormateado;
}

const identificarCantidadMonetaria = (valor: number) => {
  const sufijos = [" ", " D", " M", " B", " T"]; // Sufijos de los miles, millones, billones y billones de billones
  const precision = 2; // Precisión decimal para el redondeo
  let simbolo = "$ "; // Símbolo de la moneda

  let i = 0; // Índice para el arreglo de sufijos
  while (valor >= 1000) {
    valor /= 1000;
    i++;
  }

  return simbolo + valor.toFixed(precision) + sufijos[i];
};

watchEffect(() => {
  searchCoins();
});
</script>

<template>
  <Navbar/>
  <Section :stats="stats" :isLoading="isLoading" />
  
  <SearchFavorites @onChangeCoins="coins = $event" @onChangeState="noFound = $event" @onChangeResult="noResults = $event"
    :loadData="searchCoins" :search="search" :coins="coins" />

  <div class="container-table">
    <table>
      <!-- thead -->
      <thead>
        <tr>
          <th>All coins favorites</th>
          <th>Price</th>
          <th class="th-hide">Market cap</th>
          <th class="th-right">Sparkline</th>
        </tr>
      </thead>
      <!-- tbody -->
      <tbody v-if="!isLoading">
        <!-- tr -->
        <tr>
          <td colspan="4">
            <div style="height: 30px;"></div>
          </td>
        </tr>
        <!-- tr -->
        <tr v-for="(cryptos, index) in coins" :key="index">
          <!-- td -->
          <td>
            <div class="td-icon">
              <span>
                <button type="button" class="btn" @click="removeFavorite(cryptos.uuid)">
                  <font-awesome-icon :icon="['fa', 'heart']" style="font-size: 1.2em; color: blueviolet;" />
                </button>
              </span>
              <span>
                {{ cryptos.rank }}
              </span>
              <span>
                <a :href="cryptos.coinrankingUrl">
                  <span class="logo-background">
                    <img v-if="cryptos.iconUrl" class="coin-icon" :src="cryptos.iconUrl" height="30" width="30"
                      alt="coin icon" />
                    <font-awesome-icon v-else :icon="['fa', 'clone']" style="font-size: 1.7em; color: brown;" />
                  </span>
                </a>
              </span>
              <span>
                <a :href="cryptos.coinrankingUrl" class="td-icon-link">{{ cryptos.name || "--" }}</a>
                <span class="td-icon-symbol">{{ cryptos.symbol || "--" }}</span>
              </span>
            </div>
          </td>
          <!-- td -->
          <td class="td-price">
            {{ convertirADolar(parseFloat(cryptos.price)) || "--" }}
            <span class="td-show">
              {{ identificarCantidadMonetaria(parseFloat(cryptos.marketCap)) || "--" }}
            </span>
          </td>
          <!-- td -->
          <td class="td-hide">
            {{ identificarCantidadMonetaria(parseFloat(cryptos.marketCap)) || "--" }}
          </td>
          <!-- td -->
          <td class="td-right">
            <div :style="{ color: cryptos.change ? cryptos.change?.includes('-') ? '#FF1E1E' : '#00FFB3' : '#5f80b2' }">
              {{ cryptos.change ? cryptos.change?.includes("-") ? cryptos.change : "+" + cryptos.change : "--%" }}
              <div style="width: 64px; height: 25px">
                <span>
                  <canvas :id="`myChart-${index}`" width="96" height="37" style="width: 64px; height: 25px">
                    Your browser does not support the canvas element.</canvas>
                </span>
              </div>
            </div>
          </td>
          <!---->
        </tr>
        <!---->
      </tbody>
    </table>

    <!-- loading -->
    <div class="loading" v-if="isLoading">
      <span class="loading-text">Loading...</span>
    </div>
    <!---->

    <!-- no found -->
    <div class="results" v-if="!noFound">
      <font-awesome-icon :icon="['fa', 'magnifying-glass']" style="font-size: 2em; color: #ffffffc8;" />
      <h3 class="results-text">No results</h3>
      <p class="results-text">We couldn't find a result matching the name.</p>
      <button type="button" class="btn-results" @click="searchCoins()">
        Go back
      </button>
    </div>
    <!---->

    <!-- no results -->
    <div class="results" v-if="!noResults">
      <font-awesome-icon :icon="['fa', 'heart']" style="font-size: 2em; color: blueviolet;" />
      <h3 class="results-text">No favorites</h3>
      <p class="results-text">Add coins to your favorites by clicking their heart icons.</p>
      <router-link to="/">
        <button type="button" class="btn-results">
          Go to all coins
        </button>
      </router-link>
    </div>
    <!-- -->
  </div>

  <Footer/>
</template>

<style scoped>
.container-table {
  padding: 0px 100px 50px;
}

table {
  width: 100%;
  font-family: "Quicksand", sans-serif;
  color: #ffffff;
  align-items: center;
  font-size: 16px;
}

.td-icon {
  display: flex;
  align-items: center;
  gap: 30px;
  max-width: 100%;
}

.coin-icon {
  height: 20px;
}

.logo-background {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  background-color: #fff;
  border: 3px solid #fff;
  border-radius: 40px;
  overflow: hidden;
}

.td-icon-link {
  text-decoration: none;
  color: #ffffff;
}

.td-icon-symbol {
  margin-top: 5px;
  color: #ffffffc8;
  display: block;
  font-size: 12px;
}

th,
td {
  text-align: inherit;
  padding: 8px;
}

.td-price {
  white-space: nowrap;
}

.th-right {
  text-align: right;
}

.td-right {
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

.td-show {
  font-size: 12px;
  margin-top: 5px;
  color: #ffffffc8;
  display: none;
}

.btn {
  background-color: transparent;
  border: 0;
}

.loading {
  text-align: center;
  padding: 50px 20px;
}

.loading-text {
  font-family: "Quicksand", sans-serif;
  color: #ffffffc8;
}

.results {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 13px;
  padding: 50px 20px;
}

.results-text {
  text-align: center;
  font-family: "Quicksand", sans-serif;
  color: #ffffffc8;
}

.btn-results {
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 6px;
  background-color: #032c6b;
  color: #ffffffc8;
  border: none;
  font-size: 14px;
  font-family: "Quicksand", sans-serif;
  white-space: nowrap;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.btn-results:hover {
  background-color: #003381;
  color: #ffffff;
}

@media only screen and (max-width: 792px) {
  .container-table {
    padding: 0 10px;
  }

  .th-hide {
    display: none;
  }

  .td-hide {
    display: none;
  }

  .td-show {
    display: block;
  }
}

@media only screen and (max-width: 592px) {

  table {
    font-size: 13px;
  }

  th,
  td {
    padding: 2px;
  }

  .td-icon {
    gap: 10px;
  }

  .coin-icon {
    height: 15px;
  }

  .logo-background {
    height: 20px;
    width: 20px;
  }
}
</style>