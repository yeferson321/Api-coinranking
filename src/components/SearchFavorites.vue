<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { Ref, onMounted } from "vue";
import { Coin, Stats } from "../interfaces/Data";
import * as bootstrap from "bootstrap";

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const error: Ref<string> = ref("");

const props = defineProps({
    coins: {
        type: Array as () => Coin[],
        required: true,
    },
    stats: {
        type: Object as () => Stats,
        required: true,
    },
    loadData: {
        type: Function,
        required: true,
    },
    search: {
        type: Function,
        required: true,
    },
});

const emits = defineEmits<{
    (event: "onChangeCoins", value: Coin[]): void;
    (event: "onChangeState", value: boolean): void;
    (event: "onChangeResult", value: boolean): void;
}>();

const handleKeyUp = () => {
    setTimeout(async function () {
        await props.loadData();

        const result = props.coins.filter((item) =>
            item.name
                .toLowerCase()
                .includes(inputRef.value?.value?.toLowerCase() ?? "")
        );

        if (result.length) {
            props.search(result);
            emits("onChangeCoins", result);
            emits("onChangeState", true);
        } else {
            emits("onChangeCoins", result);
            emits("onChangeState", false);
            emits("onChangeResult", true);
        }
    }, 1000);
};

const identificarCantidadMonetaria = (valor: number) => {
    const sufijos = ["", " K", " M", " B", " T"]; // Sufijos de los miles, millones, billones y billones de billones
    const precision = 2; // Precisión decimal para el redondeo
    let simbolo = "$ "; // Símbolo de la moneda

    let i = 0; // Índice para el arreglo de sufijos
    while (valor >= 1000) {
        valor /= 1000;
        i++;
    }

    return simbolo + valor.toFixed(precision) + sufijos[i];
};

const handleSearchClear = () => {
    if (inputRef.value?.value) {
        inputRef.value.value = "";
        props.loadData();
        emits("onChangeState", true);
    }
};

onMounted(() => {
    const tooltipTriggerList = document.querySelectorAll<HTMLElement>(
        '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = Array.prototype.slice
        .call(tooltipTriggerList)
        .map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
});
</script>

<template>
    <div class="pt-5">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="card-title crypto-title text-white">
                        Crypto Currency prices in real time like BNB, DOGE and
                        <span style="color: blue">Thousands more</span>
                    </h5>
                </div>
                <div class="col">
                    <div class="d-flex mb-4 container-stats">
                        <div class="card-body">
                            <div data-bs-custom-class="custom-tooltip" data-bs-toggle="tooltip"
                                data-bs-title="Refers to the total value of all cryptocurrencies in circulation.">
                                <h5 class="card-title text-white fs-4 mb-2">
                                    {{
                                        identificarCantidadMonetaria(
                                            parseFloat(props.stats.totalMarketCap)
                                        )
                                    }}
                                    <font-awesome-icon :icon="['fa', 'circle-info']"
                                        style="font-size: 0.8em; color: blue" />
                                </h5>
                            </div>
                            <p class="card-text text-white">Market Cap</p>
                        </div>
                        <div class="card-body">
                            <div data-bs-custom-class="custom-tooltip" data-bs-toggle="tooltip"
                                data-bs-title="Refers to the trading volume of all currencies combined.">
                                <h5 class="card-title text-white fs-4 mb-2">
                                    {{
                                        identificarCantidadMonetaria(
                                            parseFloat(props.stats.total24hVolume)
                                        )
                                    }}
                                    <font-awesome-icon :icon="['fa', 'circle-info']"
                                        style="font-size: 0.8em; color: blue" />
                                </h5>
                            </div>
                            <p class="card-text text-white">Trading Volume</p>
                        </div>
                        <div class="card-body">
                            <div data-bs-custom-class="custom-tooltip" data-bs-toggle="tooltip"
                                data-bs-title="Refers to all available trading currencies.">
                                <h5 class="card-title text-white fs-4 mb-2">
                                    {{ props.stats.totalCoins }}
                                </h5>
                            </div>
                            <p class="card-text text-white">All Coins</p>
                        </div>
                    </div>
                    <p class="card-text crypto-text text-white">
                        All coins listed, you get circulating supplies, social links, logos,
                        blocks. explorers, sparklines and more. We have it all.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="py-5">
        <div class="container-fluid d-flex align-self-center justify-content-between">
            <div class="container-input d-flex align-items-center">
                <input type="text" class="form-input bg-transparent border border-0 fw-semibold text-light"
                    placeholder="Search a coin" aria-describedby="button" aria-label="Search" @keyup="handleKeyUp()"
                    ref="inputRef" />
                <button type="button" class="search-clear bg-transparent border border-0" @click="handleSearchClear()">
                    <font-awesome-icon :icon="['fa', 'fa-xmark']" style="font-size: 1.2em; color: #a9a9a9" />
                </button>
            </div>
            <router-link to="/" class="text-decoration-none text-light">
                <button type="button" class="btn">
                    All Coins
                    <font-awesome-icon :icon="['fa', 'coins']" style="font-size: 1em; color: #ffffff" />
                </button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.container-fluid {
    padding: 0 92px;
}

.container-input {
    flex-grow: 1;
    max-width: 350px;
}

.crypto-title {
    font-size: 38px;
    line-height: 60px;
    margin-right: 20px;
}

.card-title {
    font-family: "Quicksand", sans-serif;
    font-weight: 700;
}

.form-input {
    background-image: url("https://firebasestorage.googleapis.com/v0/b/apideployusers.appspot.com/o/apicoins%2Fmagnifying.svg?alt=media&token=f3f0e252-b12c-4389-99a8-7e432912c58f");
    background-repeat: no-repeat;
    background-position: left 0px top 5px;
    padding: 0 0px 0px 35px;
    width: 100%;
    min-width: 0px;
    margin-right: 13px;
}

.form-input:focus {
    outline: none;
}

::placeholder {
    color: #a9a9a9;
}

.container-stats {
    width: 80%;
}

.btn {
    background-image: linear-gradient(25deg, #2904fa, #96008a);
    color: white;
    border: none;
    font-size: 14px;
    font-family: "Quicksand", sans-serif;
    white-space: nowrap;
}

@media only screen and (max-width: 990px) {
    .row {
        flex-direction: column;
    }

    .crypto-title {
        margin-bottom: 25px;
        line-height: 50px;
    }

    .crypto-text {
        margin-right: 200px;
    }
}

@media only screen and (max-width: 792px) {
    .container-fluid {
        padding: 0 27px;
    }

    .crypto-title {
        margin-right: 0px;
    }
}

@media only screen and (max-width: 540px) {
    .search-clear {
        display: none;
    }

    .container-stats {
        width: 100%;
    }

    .crypto-text {
        margin-right: 0px;
    }
}
</style>
