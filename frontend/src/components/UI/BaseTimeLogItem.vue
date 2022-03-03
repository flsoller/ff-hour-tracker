<template>
    <div>
        <li>
            <h2>
                <b>Member:</b>
                {{ member }}
            </h2>
            <h2>
                <b>Date:</b>
                {{ date }}
            </h2>
            <h2>
                <b>Entry:</b>
                {{ entry }}
            </h2>
        </li>
    </div>
</template>

<script setup lang="ts">
import { LogEntry } from '../../../../types/logRecord.interface';

const props = defineProps<{
    member: string,
    date: Date,
    entry: LogEntry
}>()
</script>