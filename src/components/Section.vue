<script setup lang="ts">
import { Stats } from "../interfaces/Data";

const props = defineProps({
    stats: {
        type: Object as () => Stats,
        required: true,
    }
});

const identificarCantidadMonetaria = (valor: number) => {
    const sufijos = ["", " K", " Million", " Billion", " Trillion"];
    const precision = 2;
    let simbolo = "$ ";

    let i = 0;
    while (valor >= 1000) {
        valor /= 1000;
        i++;
    }

    return simbolo + valor.toFixed(precision) + sufijos[i];
};
</script>

<template>
    <section class="section">
        <div class="container-properties">
            <div class="col">
                <h1 class="col-title">
                    <span class="gradient-text">Crypto</span> Ranked by Market
                </h1>
                <p class="col-text-coins">
                    All coins listed, you get circulating supplies, social links, logos,
                    blocks. explorers, sparklines and more. We have it all.
                </p>
                <div class="container-stats">
                    <div class="card-body">
                        <h5 class="col-text">
                            {{ identificarCantidadMonetaria(parseFloat(props.stats.totalMarketCap)) }}
                            <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: #007CF0;" />
                        </h5>
                        <p class="col-text-info">Market Cap</p>
                    </div>
                    <div class="card-body">
                        <h5 class="col-text">
                            {{ identificarCantidadMonetaria(parseFloat(props.stats.total24hVolume)) }}
                            <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: #007CF0;" />
                        </h5>
                        <p class="col-text-info">Trading Volume</p>
                    </div>
                    <div class="card-body">
                        <h5 class="col-text">
                            {{ props.stats.totalCoins }}
                        </h5>
                        <p class="col-text-info">All Coins</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section {
    padding-top: 48px;
}

.container-properties {
    padding: 0px 100px;
}

.col-title{
    color: white;
    font-size: 4.5rem;
    font-family: 'Nunito', sans-serif;
    line-height: 80px;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: 40px;
}

.gradient-text {
    color: transparent;
    background-image: linear-gradient(180deg, #007CF0, #00DFD8 );
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

.container-stats {
    display: flex;
    justify-content: center;
    gap: 27px;
}

.col-text {
    font-family: "Quicksand", sans-serif;
    color: white;
    font-size: 1rem;
    margin-bottom: 10px;
    white-space: nowrap;
}

.col-text-info {
    font-family: "Quicksand", sans-serif;
    color: #888888;
    white-space: nowrap;
}

@media only screen and (max-width: 990px) {
    .col-title {
        font-size: 60px;
    }
}

@media only screen and (max-width: 792px) {
    .container-properties {
        padding: 0px 20px;
    }
    .col-title {
        line-height: 60px;
        font-size: 60px;
    }
}

@media only screen and (max-width: 540px) {
    .container-stats {
        gap: 15px
    }

    .col-title {
        font-size: 50px;
    }
}
</style>