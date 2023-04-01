<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { Ref, watchEffect } from "vue";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { getCoinsCurrencies } from "../services/CoinService";
import { Coin, Stats } from "../interfaces/Data";
import Navbar from "../components/Navbar.vue";
import Section from "../components/Section.vue"
import Search from "../components/SearchHomepage.vue";

const coins: Ref<Coin[]> = ref([]);
const stats: Ref<Stats> = ref({} as Stats);
const isLoading: Ref<boolean> = ref(true);
const noFound: Ref<boolean> = ref(true);
const error: Ref<string> = ref("");
const isIconActive: Ref<boolean> = ref(false);
const offset: Ref<number> = ref(0);
const pageCount = ref<number[]>([]);
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

  const gradient = ctx.createLinearGradient(0, 0, 0, 20);
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

const loadData = async (offset: number): Promise<void> => {
  try {
    const data = await getCoinsCurrencies(offset);
    coins.value = data.coins;
    stats.value = data.stats;
    isLoading.value = false;
  } catch (err: unknown) {
    error.value = (err as Error).message;
  }
};

const search = (coin: Coin[]): void => {
  coin.forEach(renderChart);
};

const addFavorite = (uuid: string): void => {
  const localUuid: string = localStorage.getItem("uuid") ?? "";
  isIconActive.value = !isIconActive.value;

  if (localUuid.includes(uuid)) {
    const localUuidReplace: string = localUuid
      .replace(`&uuids[]=${uuid}`, "")
      .replace(`uuids[]=${uuid}`, "");
    localStorage.setItem("uuid", localUuidReplace);
  } else {
    localStorage.setItem("uuid", `${localUuid}&uuids[]=${uuid}`);
  }
};

const changeIco = (uuid: string) => {
  const localUuid = localStorage.getItem("uuid") ?? "";
  const isFavorite = localUuid.includes(uuid);

  if (isFavorite) {
    return { color: "#8a2be2" };
  } else {
    return { color: "#b2b332" };
  }
};

const setPagination = (total: number) => {
  let Count = Math.ceil(total / 50);
  for (let i = 2; i <= Count; i++) {
    pageCount.value.push(i);
  }
};

watchEffect(async () => {
  await loadData(offset.value);
  coins.value.forEach(renderChart);
  setPagination(stats.value.total);
});
</script>

<template>
  <Navbar />

  <Section :stats="stats"></Section>

  <Search
    @onChangeCoins="coins = $event"
    @onChangeState="noFound = $event"
    :loadDate="loadData"
    :search="search"
  />

  <div>
    <div class="container">
      <table class="table table-borderless ps-5">
        <thead>
          <tr class="text-white">
            <th>All coins</th>
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
                  @click="addFavorite(cryptos.uuid)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'heart']"
                    :style="[
                      changeIco(cryptos.uuid),
                      isIconActive ?? { color: '#b2b332' },
                    ]"
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


      </table>
    </div>
  </div>

  <div class="container text-center">
    <h2 v-if="!noFound">sin resultados</h2>
  </div>

  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="#" @click="offset -= 50">Previous</a>
        </li>

        <li @click="offset = 0" class="page-item">
          <a class="page-link" href="#">1</a>
        </li>

        <li
          v-for="page in pageCount.slice(offset / 50 - 0, offset / 50 + 3)"
          :key="page"
          @click="offset = (page - 1) * 50"
          class="page-item"
        >
          <a class="page-link" href="#">{{ page }}</a>
        </li>

        <li @click="offset = stats.total - 50" class="page-item">
          <a class="page-link" href="#">{{ Math.ceil(stats.total / 50) }}</a>
        </li>

        <li class="page-item">
          <a class="page-link" href="#" @click="offset += 50">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 576px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .offcanvas {
    width: 60%;
  }
}

@media only screen and (max-width: 768px) {
  .market {
    display: none;
  }
}

@media only screen and (min-width: 992px) {
  .container {
    padding-right: 5rem !important;
    padding-left: 5rem !important;
  }
}
</style>
