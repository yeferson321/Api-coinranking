<script setup lang="ts">
import { Stats } from "@/interfaces/Data";

// This allows the component to receive data from its parent component through the `stats`, `isLoading`  props.
const props = defineProps({
    stats: {
        type: Object as () => Stats,
        required: true,
    },
    isLoading: {
        type: Boolean,
        required: true
    }
});

// is a function that takes in a number `valor` and returns a string that represents the 
// monetary value with a currency symbol, suffix (K, Million, Billion, Trillion)
const identificarCantidadMonetaria = (valor: number) => {
    const sufijos = ["", " K", " Million", " Billion", " Trillion"];
    const precision = 2;
    let simbolo = "$ ";
    let i = 0;

    // The function then enters a while loop that divides the `valor` by 1000 and
    // increments `i` until `valor` is less than 1000.
    while (valor >= 1000) {
        valor /= 1000;
        i++;
    }

    // Finally, the function returns the currency symbol concatenated with the `valor` 
    // rounded to the specified precision and the corresponding suffix from
    // the `sufijos` array based on the value of `i`.
    return simbolo + valor.toFixed(precision) + sufijos[i];
};

const showTooltip = () => {
    const canvasTag = document.getElementById('tooltip') as HTMLDivElement;
    canvasTag.style.display = 'block'
}

const hideTooltip = () => {
    const canvasTag = document.getElementById('tooltip') as HTMLDivElement;
    canvasTag.style.display = 'none'
}
</script>

<template>
    <section class="section">
        <div class="container-section">
            <div class="col">
                <h1 class="col-title">
                    <span class="gradient-text">Crypto</span> Ranked by Market
                </h1>
                <p class="col-text-coins">
                    All coins listed, you get circulating supplies, social links, logos,
                    blocks. explorers, sparklines and more. We have it all.
                </p>
                <div class="container-col">
                    <div class="card-body">
                        <h5 v-if="!isLoading" class="col-text">
                            <div class="tooltip" id="tooltip">The market cap of All coins combined.</div>
                            {{ identificarCantidadMonetaria(parseFloat(props.stats.totalMarketCap)) }}
                            <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: #007CF0;" @mouseenter="showTooltip()"  @mouseleave="hideTooltip()" />
                        </h5>
                        <h5 v-else class="col-text">
                            loading...
                        </h5>
                        <p class="col-text-info">Market Cap</p>
                    </div>
                    <div class="card-body">
                        <h5 v-if="!isLoading" class="col-text">
                            <!-- <div class="tooltip" id="tooltip">The 24 hour trading volume of All coins combined.</div> -->
                            {{ identificarCantidadMonetaria(parseFloat(props.stats.total24hVolume)) }}
                            <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: #007CF0;"  @mouseenter="showTooltip()"  @mouseleave="hideTooltip()" />
                        </h5>
                        <h5 v-else class="col-text">
                            loading...
                        </h5>
                        <p class="col-text-info">Trading Volume</p>
                    </div>
                    <div class="card-body">
                        <h5 v-if="!isLoading" class="col-text">
                            {{ props.stats.totalCoins }}
                        </h5>
                        <h5 v-else class="col-text">
                            loading...
                        </h5>
                        <p class="col-text-info">All Coins</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.container-section {
    padding-top: 48px;
}

.col {
    padding: 0px 100px;
    min-width: 330px;
}

.col-title {
    color: white;
    font-size: 4.5rem;
    font-family: 'Nunito', sans-serif;
    line-height: 80px;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: 40px;
}

.tooltip {
    position: absolute;
    background-color: aliceblue;
    color: #007CF0;
    font-size: 12px;
    padding: 6px;
    border-radius: 10px;
    margin-top: -30px;
    display: none;
}

.gradient-text {
    color: transparent;
    background-image: linear-gradient(180deg, #007CF0, #00DFD8);
    background-clip: text;
    -webkit-background-clip: text;
}

.col-text-coins {
    font-family: "Quicksand", sans-serif;
    color: #888888;
    font-size: 1.1rem;
    text-align: center;
    line-height: 27px;
    max-width: 600px;
    width: 100%;
    margin: 0 auto 40px;
}

.container-col {
    display: flex;
    justify-content: center;
    gap: 27px;
}

.col-text {
    font-family: "Quicksand", sans-serif;
    color: white;
    font-size: 1rem;
    margin-bottom: 10px;
}

.col-text-info {
    font-family: "Quicksand", sans-serif;
    color: #888888;
}

@media only screen and (max-width: 990px) {
    .col-title {
        font-size: 3.8rem;
    }
}

@media only screen and (max-width: 792px) {
    .col {
        padding: 0px 20px;
    }

    .col-title {
        line-height: 60px;
    }
}

@media only screen and (max-width: 540px) {
    .container-col {
        gap: 15px
    }

    .col-title {
        font-size: 3rem;
    }
}
</style>