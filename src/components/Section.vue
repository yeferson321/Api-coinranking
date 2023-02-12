<script setup lang="ts">

import { ref } from "@vue/reactivity";
import { onMounted } from "vue";
import { Chart, ChartConfiguration, ChartItem } from "chart.js/auto";
import { getCryptocurrencies } from "../services/CoinService";
import { Coin } from "../interfaces/Coins";

const crypto = ref<Coin[]>([]);

const loadData = async () => {
  crypto.value = await getCryptocurrencies();
};

const renderChart = (coin: Coin, index: number) => {
  console.log(index)
  const labels = Array.from({ length: 24 }, (_, i) => (i + 1).toString());
  const data = {
    labels,
    datasets: [
      {
        data: coin.sparkline,
        borderWidth: 1,
        pointRadius: 0,
        borderColor: coin.change.includes("-") ? "#FF1E1E" : "#00FFB3",
        backgroundColor: "transparent",
      },
    ],
  };

  const config: ChartConfiguration = {
    type: "line",
    data,
    options: {
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
      }
    },
  };

  const canvasTag = <ChartItem>document.getElementById(`myChart-${index}`);
  if (canvasTag) {
    new Chart(canvasTag, config);
  }
};

onMounted(async () => {
  await loadData();
  crypto.value.forEach(renderChart);
});

</script>

<template>
  <div class="">
    <table class="table">
      <thead>
        <tr>
          <th>All coins</th>
          <th>Price</th>
          <th>Market cap</th>
          <th>Sparkline</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cryptos, index) in crypto" :key="cryptos.rank">
          
          <td><i class="material-icons">favorite_border</i> {{ cryptos.name }}</td>
          <td>{{ cryptos.price }}</td>
          <td>{{ cryptos.marketCap }}</td>
          <td>
            <div class="chart-container" style="position: relative; width:7vw">
              {{ cryptos.change }}
              <div>
                <canvas :id="`myChart-${index}`" height="50">Your browser does not support the canvas element.</canvas>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>