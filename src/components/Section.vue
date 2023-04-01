<script setup lang="ts">
import { Stats } from "../interfaces/Data";

const props = defineProps({
    stats: {
        type: Object as () => Stats,
        required: true,
    }
});

const identificarCantidadMonetaria = (valor: number) => {
    const sufijos = ["", " K", " M", " B", " T"];
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
            <div class="row">
                <div class="col">
                    <h5 class="col-title">
                        Crypto Currency prices in real time like BNB, DOGE and
                        <span style="color: blue">Thousands more</span>
                    </h5>
                </div>
                <div class="col">
                    <div class="container-stats">
                        <div class="card-body">
                            <h5 class="col-text">
                                {{
                                    identificarCantidadMonetaria(parseFloat(props.stats.totalMarketCap))
                                }}
                                <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: blue;" />
                            </h5>
                            <p class="col-text-info">Market Cap</p>
                        </div>
                        <div class="card-body">
                            <h5 class="col-text">
                                {{
                                    identificarCantidadMonetaria(parseFloat(props.stats.total24hVolume))
                                }}
                                <font-awesome-icon :icon="['fa', 'circle-info']" style="font-size: 0.8em; color: blue;" />
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
                    <p class="col-text-info col-text-padding">
                        All coins listed, you get circulating supplies, social links, logos,
                        blocks. explorers, sparklines and more. We have it all.
                    </p>
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

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 90px;
}

.col {
    flex: 1 0 0%;
    display: block;
    align-self: baseline;
}

.col-title {
    color: #ffffff;
    font-family: "Quicksand", sans-serif;
    font-size: 38px;
    line-height: 55px;
}

.col-text {
    color: #ffffff;
    font-family: "Quicksand", sans-serif;
    font-size: 23px;
    margin-bottom: 10px;
    white-space: nowrap;
}

.col-text-info {
    color: #ffffffc8;
    font-family: 'Quicksand';
    font-size: 15px;
    font-weight: 100;
}

.container-stats {
    display: flex;
    flex-direction: row;
    margin-bottom: 1.5rem;
    width: 80%;
}

.card-body {
    flex: 1 1 auto;
    margin-right: 10px;
}

@media only screen and (max-width: 990px) {
    .row {
        flex-direction: column;
        gap: 0;
    }

    .col-title {
        margin-bottom: 25px;
        line-height: 50px;
    }

    .col-text-padding {
        margin-right: 50%;
    }
}

@media only screen and (max-width: 792px) {
    .container-properties {
        padding: 0px 20px;
    }

    .col-text-padding {
        margin-right: 30;
    }
}

@media only screen and (max-width: 540px) {
    .container-stats {
        width: 100%;
    }

    .col-text-padding {
        margin-right: 0;
    }
}
</style>