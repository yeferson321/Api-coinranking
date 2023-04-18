<template>
    <nav class="navbar">
        <div class="container-navbar">
            <router-link to="/" class="navbar-brand">
                <img src="https://firebasestorage.googleapis.com/v0/b/apideployusers.appspot.com/o/apicoins%2Fbitcoin%20(1).png?alt=media&token=a1562b80-05b3-482a-aeaf-7bad41363fb5"
                    alt="Platform loog" width="28" height="28" class="img">
                Crypto
            </router-link>
            <div>
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
                    <li class="nav-item">
                        <a class="btn" href="https://github.com/yeferson321/Api-coinranking" role="button" target="_blank"
                            rel="noopener">GitHub</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    padding: 1.5rem 0rem;
}

.container-navbar {
    padding: 0px 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.navbar-brand {
    text-decoration: none;
    font-size: 24px;
    font-family: 'Quicksand', sans-serif;
    color: #ffffff;
    padding: 5px 0px;
    white-space: nowrap;
    margin-right: 16px;
    min-width: 195px;
}

.img {
    vertical-align: text-top;
}

.nav {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding-left: 0px;
    margin: auto;
}

.nav-link {
    font-family: 'Quicksand', sans-serif;
    color: #ffffff;
    padding: 8px 16px;
    text-decoration: none;
    display: block;
}

.nav-link:hover {
    color: #007CF0;
}

.btn {
    border-radius: 6px;
    border: 1px solid #ffffff;
    color: #ffffff;
    text-decoration: none;
    font-family: 'Quicksand', sans-serif;
    margin-left: 16px;
    padding: 8px 24px;
    display: block;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.btn:hover {
    background-color: #ffffff;
    color: #000000;
}

@media only screen and (max-width: 992px) {
    .rapid-api {
        display: none;
    }
}

@media only screen and (max-width: 792px) {
    .container-navbar {
        padding: 0 20px;
    }

    .coin-ranking {
        display: none;
    }
}

@media only screen and (max-width: 592px) {
    .chart-js {
        display: none;
    }
}
</style>