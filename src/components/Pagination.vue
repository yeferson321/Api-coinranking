<script setup lang="ts">
import { ref, computed } from "@vue/reactivity";
import { Ref, watchEffect } from "vue";
import { Stats } from "../interfaces/Data";

const offset: Ref<number> = ref(0);
const items: Ref<number> = ref(50);
const pageCount: Ref<number[]> = ref([]);

// This allows the component to receive data from its parent component through the `stats` props.
const props = defineProps({
    stats: {
        type: Object as () => Stats,
        required: true,
    }
});

// Is defining an `emits` object that allows the component to emit events to its parent component.
const emits = defineEmits<{
    (event: "offsef", value: number): void;
}>(); 

// Is a computed property that calculates whether or not to display a separator in
// the pagination component. If the current page offset is greater than the total number of 
// pages minus 4, the separator is displayed.
const separator = computed(() => Math.ceil(offset.value / items.value) > Math.ceil(props.stats.total / items.value - 4));

// Is a function that takes a `page` number as an argument and returns a string
// representing the CSS class to apply to the corresponding pagination link in the template.
const currentPageClass = (page: number) => (page - 1) * items.value === offset.value ? "active" : "page-link";

// Is a function that calculates the lower limit of the range of page numbers to
// display in the pagination component. It does this by checking the current `offset` value and
// comparing it to certain thresholds.
const getLowerLimit = () => {
    if (offset.value < 150) {
        return 2;
    } else if (Math.ceil(offset.value / items.value) < Math.ceil(props.stats.total / items.value - 3)) {
        return 1;
    } else if (Math.ceil(offset.value / items.value) < Math.ceil(props.stats.total / items.value - 1)) {
        return 2;
    } else {
        return 3;
    }
};

// Is a function that calculates the upper limit of the range of page numbers to
// display in the pagination component. It does this by checking the current `offset` value and
// comparing it to certain thresholds.
const getUpperLimit = () => {
    if (offset.value < 100) {
        if (offset.value < items.value) {
            return 4;
        } else if (offset.value < 150) {
            return 3;
        } else {
            return 4;
        }
    } else {
        return 2;
    }
};

watchEffect(() => {
    // Emits an event called `offset` with the current `offset` value using the `emits` function.
    // This allows the main component to listen for the `offsef` event and update 
    // its own state accordingly.
    emits('offsef', offset.value);
    // Is being set to an array of page numbers that will be displayed in the pagination component.
    // The array is created using the `Array.from()` method, which creates a new
    // array from an iterable object.2
    pageCount.value = Array.from({ length: Math.ceil(props.stats.total / items.value) }, (_, i) => i + 1);
});
</script>

<template>
    <div class="container-pagination">
        <ul class="pagination">
            <li class="page-item">
                <a class="page-link-next" href="#" @click="offset -= items">
                    <font-awesome-icon :icon="['fa', 'chevron-left']" />
                </a>
            </li>
            <li v-if="offset / items >= 3" @click="offset = 0" class="page-item">
                <a class="page-link" href="#">1</a>
            </li>
            <div v-if="offset / items >= 3" class="pagination__separator"></div>
            <li v-for="page in pageCount.slice(Math.max(0, Math.ceil((offset - getLowerLimit() * items) / items)),
                Math.min(Math.ceil(props.stats.total / items), Math.ceil((offset + getUpperLimit() * items) / items)))"
                :key="page" @click="offset = (page - 1) * items" class="page-item">
                <a :class='currentPageClass(page)' href="#">{{ page }}</a>
            </li>
            <div v-if="!separator" class="pagination__separator"></div>
            <li v-if="!separator" @click="offset = props.stats.total - items" class="page-item">
                <a class="page-link" href="#">{{ Math.ceil(props.stats.total / items) }}</a>
            </li>
            <li class="page-item">
                <a class="page-link-next" href="#" @click="offset += items">
                    <font-awesome-icon :icon="['fa', 'chevron-right']" />
                </a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.container-pagination {
    padding: 70px 0rem;
}

.pagination {
    padding: 0px 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.pagination__separator {
    background-color: #295191;
    width: 1px;
    height: 15px;
    margin: 0px 5px;
    align-self: center;
}

.page-link-next {
    text-decoration: none;
    cursor: pointer;
    margin: 0 15px;
    padding: 8px 25px;
    border-radius: 16px;
    background-color: #032c6b;
    color: #ffffffc8;
    font-size: 14px;
    font-family: "Quicksand", sans-serif;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.page-link-next:hover {
    background-color: #003381;
    color: #ffffff;
}

.page-link {
    cursor: pointer;
    text-decoration: none;
    border-radius: 10px;
    padding: 7px 15px;
    color: #ffffffc8;
    font-size: 14px;
    font-family: "Quicksand", sans-serif;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.page-link:hover {
    background-color: #0034815a;
}

.active {
    cursor: pointer;
    text-decoration: none;
    border-radius: 10px;
    padding: 7px 15px;
    background-color: #ffffff;
    color: #003381;
    font-size: 14px;
    font-family: "Quicksand", sans-serif;
}

@media only screen and (max-width: 792px) {
    .pagination {
        padding: 0 20px;
    }
}

</style>