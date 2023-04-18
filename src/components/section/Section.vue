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

// `const showTooltip` is a function that takes in a string parameter `tooltipId` representing the ID
// of a tooltip element. The function then uses `document.getElementById` to retrieve the tooltip
// element with the specified ID and adds the CSS class `show` to it using `classList.add`. This class
// likely controls the visibility of the tooltip element.
const showTooltip = (tooltipId: string) => {
    const tooltip = document.getElementById(tooltipId) as HTMLDivElement;
    tooltip?.classList.add('show');
}

// `const hideTooltip` is a function that takes in a string parameter `tooltipId` representing the ID
// of a tooltip element. The function then uses `document.getElementById` to retrieve the tooltip
// element with the specified ID and removes the CSS class `show` from it using `classList.remove`.
// This class likely controls the visibility of the tooltip element.
const hideTooltip = (tooltipId: string) => {
    const tooltip = document.getElementById(tooltipId);
    tooltip?.classList.remove('show');
}

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
                            {{ identificarCantidadMonetaria(parseFloat(props.stats.totalMarketCap)) }}
                            <div class="tooltip" id="market-cap-tooltip">The market cap of All coins combined.</div>
                            <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: #007CF0;"
                                @mouseenter="showTooltip('market-cap-tooltip')" @mouseleave="hideTooltip('market-cap-tooltip')" />
                        </h5>
                        <h5 v-else class="col-text">
                            loading...
                        </h5>
                        <p class="col-text-info">Market Cap</p>
                    </div>
                    <div class="card-body">
                        <h5 v-if="!isLoading" class="col-text">
                            {{ identificarCantidadMonetaria(parseFloat(props.stats.total24hVolume)) }}
                            <div class="tooltip" id="volume-tooltip">The 24 hour trading volume of All coins combined.</div>
                            <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: #007CF0;"
                                @mouseenter="showTooltip('volume-tooltip')" @mouseleave="hideTooltip('volume-tooltip')" />
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

.card-body {
    position: relative;
}

.tooltip {
    background-color: aliceblue;
    color: #007CF0;
    font-size: 1rem;
    padding: 8px;
    border-radius: 10px;
    display: none;
    position: absolute;
    bottom: 60px;
    width: 300px;
}

.show {
    display: block;
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

    .tooltip {
        width: 170px;
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