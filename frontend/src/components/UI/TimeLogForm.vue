<template>
    <form>
        <base-input
            type="date"
            id="dateInputField"
            for="dateInputField"
            labelText="Date"
            v-model="inputDate"
        />
        <base-dropdown
            :options="workTypes"
            id="workTypeSelect"
            for="workTypeSelect"
            labelText="Work Types"
            v-model="selectedWorkType"
        ></base-dropdown>
        <base-input
            type="number"
            id="hoursInputField"
            for="hoursInputField"
            labelText="Hours"
            v-model="inputHours"
        />
        <base-button>Submit</base-button>
    </form>

    <p>{{ inputDate }}</p>
    <br />
    <p>{{ inputHours }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LogRecord } from '../../../../types/logRecord.interface'

const workTypes = [{ text: 'Type 1', value: 'Type1' }, { text: 'Type 2', value: 'Type 2' }];
const inputDate = ref()
const inputHours = ref(0)
const selectedWorkType = ref('')

const selectedMember = ref('')
const logEntries = ref<LogRecord[]>([])

function createTimeLog(data: LogRecord) {
    const timeLog = {
        member: data.member,
        date: data.date,
        entry: data.entry
    }
    logEntries.value.push(timeLog)
}

function submitTimelog() {
    createTimeLog({
        member: selectedMember.value,
        date: inputDate.value,
        entry: {
            workType: selectedWorkType.value,
            hours: inputHours.value
        }
    })
}
</script>

<style lang="scss">
form {
    padding: 1rem 1rem;
}

header {
    padding: 0.5rem 0.5rem;
}

footer {
    padding: 1rem 1rem;
}
</style>