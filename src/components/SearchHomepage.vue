<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { Ref } from "vue";
import { Coin } from "../interfaces/Data";
import { getSearchCoinsCurrencies } from "../services/CoinService"

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const error: Ref<string> = ref("")

const props = defineProps({
  loadDate: {
    type: Function,
    required: true
  },
  search: {
    type: Function,
    required: true
  },
})

const emits = defineEmits<{
  (event: 'onChangeCoins', value: Coin[]): void
  (event: 'onChangeState', value: boolean): void
}>();

const handleKeyUp = () => {
  setTimeout(async function () {
    try {
      const data = await getSearchCoinsCurrencies(inputRef.value?.value);
      if (data.coins.length !== 0) {
        props.search(data.coins)
        emits('onChangeCoins', data.coins)
        emits('onChangeState', true)
      } else {
        emits('onChangeCoins', data.coins)
        emits('onChangeState', false)
      }
    } catch (err: unknown) {
      error.value = (err as Error).message
    }
  }, 1000);
}

const handleSearchClear = () => {
  if (inputRef.value?.value) {
    inputRef.value.value = '';
    props.loadDate();
    emits('onChangeState', true)
  }
}
</script>

<template>
  <div class="container">
    <div class="container-search">
      <div class="container-input">
        <input type="text" class="form-input" placeholder="Search a coin" aria-describedby="button" aria-label="Search"
          @keyup="handleKeyUp()" ref="inputRef" />
        <button type="button" class="btn-clear" @click="handleSearchClear()">
          <font-awesome-icon :icon="['fa', 'fa-xmark']" style="font-size: 1.2em; color: #a9a9a9" />
        </button>
      </div>
      <router-link to="/favorites">
        <button type="button" class="btn">
          Favorites
          <font-awesome-icon :icon="['fa', 'heart']" style="font-size: 1em; color: #ffffff;" />
        </button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 48px 0px;
}

.container-search {
  display: flex;
  justify-content: space-between;
  padding: 0px 80px;
}

.container-input {
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 350px;
}

.form-input {
  background-color: transparent;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/apideployusers.appspot.com/o/apicoins%2Fmagnifying.svg?alt=media&token=f3f0e252-b12c-4389-99a8-7e432912c58f");
  background-repeat: no-repeat;
  background-position: left 0px top 1px;
  color: #ffffff;
  font-family: "Quicksand", sans-serif;
  border: none;
  font-size: 16px;
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

.btn-clear {
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.btn {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  background-image: linear-gradient(25deg, #2904fa, #96008a);
  color: white;
  border: none;
  font-size: 14px;
  font-family: "Quicksand", sans-serif;
  white-space: nowrap;
}

@media only screen and (max-width: 792px) {
  .container-search {
    padding: 0px 20px;
  }
}

@media only screen and (max-width: 540px) {
  .btn-clear {
    display: none;
  }
}
</style>