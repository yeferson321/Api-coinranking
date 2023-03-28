<template>
    <nav class="navbar navbar-expand-lg py-4">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand text-decoration-none fs-4 text-light">
                <img src="https://firebasestorage.googleapis.com/v0/b/apideployusers.appspot.com/o/apicoins%2Fbitcoin%20(1).png?alt=media&token=a1562b80-05b3-482a-aeaf-7bad41363fb5"
                    alt="Platform loog" width="28" height="28" class="d-inline-block align-text-top">
                Crypto
            </router-link>
            <div class="d-flex">
                <ul class="nav">
                    <li class="nav-item rapid-api">
                        <a class="nav-link" href="https://rapidapi.com/Coinranking/api/coinranking1" target="_blank"
                            rel="noopener">Rapidapi</a>
                    </li>
                    <li class="nav-item coin-ranking">
                        <a class="nav-link" href="https://developers.coinranking.com/api" target="_blank"
                            rel="noopener">Coinranking</a>
                    </li>
                    <li class="nav-item chart-js">
                        <a class="nav-link" href="https://www.chartjs.org/docs/latest/" target="_blank"
                            rel="noopener">Chartjs</a>
                    </li>
                    <li class="nav-item ps-3">
                        <a class="btn btn-outline-light px-4" href="#" role="button">GitHub</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar-brand {
    font-family: 'Quicksand', sans-serif;
    color: #ffffff;
}

.container-fluid {
    margin: 0 80px;
}

.nav-link {
    font-family: 'Quicksand', sans-serif;
    color: #ffffff;
}

.nav-link:hover {
    color: #2904fa;
}

.btn {
    font-family: 'Quicksand', sans-serif;
}

@media only screen and (max-width: 992px) {
    .rapid-api {
        display: none;
    }
}

@media only screen and (max-width: 792px) {
    .coin-ranking {
        display: none;
    }

    .container-fluid {
        margin: 0 15px;
    }
}

@media only screen and (max-width: 592px) {
    .chart-js {
        display: none;
    }
}
</style>