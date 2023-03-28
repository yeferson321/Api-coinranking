<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { onMounted, onBeforeUnmount, Ref, watchEffect, watch } from "vue";
import { Chart, ChartConfiguration, ChartItem } from "chart.js/auto";
import { getFavoritesCoinsCurrencies } from "../services/CoinService";
import { Coin, Stats } from "../interfaces/Data";
import Navbar from "../components/Navbar.vue";
import SearchFavorites from "../components/SearchFavorites.vue";

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

watchEffect(() => {
  searchCoins();
});
</script>

<template>
  <Navbar />
  <SearchFavorites
    @onChangeCoins="coins = $event"
    @onChangeState="noFound = $event"
    @onChangeResult="noResults = $event"
    :loadData="searchCoins"
    :search="search"
    :stats="stats"
    :coins="coins"
  />

  <div>
    <!-- <div class="container"> -->
      <!-- <table class="table table-borderless ps-5">
        <thead>
          <tr class="text-white">
            <th>All coins favorites</th>
            <th>Price</th>
            <th>Market cap</th>
            <th>Sparkline</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr v-for="(cryptos, index) in coins" :key="index">
            <td>
              <div class="d-flex align-items-center gap-3">
                <button
                  type="button"
                  class="search-clear bg-transparent border border-0"
                  @click="removeFavorite(cryptos.uuid)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'heart']"
                    style="color: blueviolet"
                  />
                </button>
                <p class="mb-0 text-white fw-semibold">{{ cryptos.rank }}</p>
                <div v-if="cryptos.iconUrl === null">
                  <span style="font-size: 1.7em; color: brown">
                    <font-awesome-icon icon="fa-regular fa-clone" />
                  </span>
                </div>
                <div v-else>
                  <img
                    :src="cryptos.iconUrl"
                    class=""
                    height="30"
                    width="30"
                    alt="coin icon"
                  />
                </div>
                <a :href="cryptos.coinrankingUrl" class="text-decoration-none">
                  <div>
                    <p class="mb-0 text-white fw-semibold">
                      {{ cryptos.name || "--" }}
                    </p>
                  </div>
                  <div>
                    <p class="mb-0 text-white text-opacity-75 fw-normal">
                      {{ cryptos.symbol || "--" }}
                    </p>
                  </div>
                </a>
              </div>
            </td>
            <td>
              <p class="mb-0 text-white fw-semibold">
                {{ cryptos.price || "--" }}
              </p>
            </td>
            <td class="market">
              <p class="mb-0 text-white fw-semibold">
                {{ cryptos.marketCap || "--" }}
              </p>
            </td>
            <td>
              <div class="chart-container">
                <p
                  class="mb-0"
                  :style="{
                    color: cryptos.change
                      ? cryptos.change?.includes('-')
                        ? '#FF1E1E'
                        : '#00FFB3'
                      : '#5f80b2',
                  }"
                >
                  {{
                    cryptos.change
                      ? cryptos.change?.includes("-")
                        ? cryptos.change
                        : "+" + cryptos.change
                      : "--%"
                  }}
                </p>

                <div
                  class="change__placeholder"
                  style="position: relative; width: 7vw"
                >
                  <span>
                    <canvas
                      :id="`myChart-${index}`"
                      width="96"
                      height="37"
                      style="width: 64px; height: 25px"
                    >
                      Your browser does not support the canvas element.</canvas
                    >
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>

        <div class="text-center" v-else>
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </table> -->
    <!-- </div> -->
  </div>

  <div class="container text-center">
    <h2 v-if="!noFound">sin resultados</h2>
  </div>

  <div class="no-favorites" v-if="!noResults">
    <img
      src="https://cdn.coinranking.com/assets/img/no-favorites-dark.77b6524.png"
      srcset="
        https://cdn.coinranking.com/assets/img/no-favorites-dark.77b6524.png    1x,
        https://cdn.coinranking.com/assets/img/no-favorites-dark@2x.f154e5f.png 2x,
        https://cdn.coinranking.com/assets/img/no-favorites-dark@3x.2a17684.png 3x
      "
      alt=""
      width="98"
      height="56"
      class="no-favorites__icon"
    />
    <h2 class="no-favorites__title">No favorites</h2>
    <p class="no-favorites__paragraph">
      Add coins to your favorites by clicking their heart icons.
    </p>
    <a href="/" class="no-favorites__button active-link"> Go to all coins </a>
  </div>
</template>