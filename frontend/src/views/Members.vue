<template>
  <div class="members-table__container">
    <DataTable
      :value="members.data"
      :totalRecords="members.totalCount"
      :loading="membersStore.loading"
      lazy
      stripedRows
      class="members-table__outline"
      scrollable
      scrollHeight="20rem"
      paginator
      :rows="membersStore.defaultPageLimit"
      :rowsPerPageOptions="[5, 10, 20]"
      @page="onPaginationChange($event)"
      @sort="onSortingChange($event)"
    >
      <template #header>
        <div class="members-table__header">
          <span>Members</span>
          <Button
            icon="pi pi-plus"
            raised
            label="Add Member"
            @click="onAddMember()"
          />
        </div>
      </template>
      <Column field="firstName" header="First Name"></Column>
      <Column field="lastName" sortable header="Last Name"></Column>
      <Column field="emailAddress" header="Email Address"></Column>
      <template
        v-if="membersStore.members.totalCount === 0 && !membersStore.loading"
        #footer
      >
        <div class="members-table__footer">
          <span>No Members added yet, start adding to see data.</span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useMembersStore } from '../stores/members';
import { useDialog } from 'primevue/usedialog';
import DataTable, {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import AddMember from '../components/AddMember.vue';
import { storeToRefs } from 'pinia';

const membersStore = useMembersStore();
const { members } = storeToRefs(membersStore);
const dialog = useDialog();

onMounted(async () => {
  await membersStore.getMembersPaginated();
});

async function onPaginationChange($event: DataTablePageEvent) {
  await membersStore.getMembersPaginated({
    limit: `${$event.rows}`,
    offset: `${$event.first}`,
    order: $event.sortOrder === -1 ? 'desc' : 'asc',
  });
}

async function onSortingChange($event: DataTableSortEvent) {
  await membersStore.getMembersPaginated({
    order: $event.sortOrder === -1 ? 'desc' : 'asc',
  });
}

function onAddMember() {
  dialog.open(AddMember, {
    props: {
      modal: true,
      header: 'Add Member',
    },
  });
}
</script>

<style lang="scss" scoped>
.members-table__container {
  font-size: small;
  display: flex;
  justify-content: center;
  padding: 1rem;

  @media (max-width: $medium) {
    padding: 0.5rem;
  }

  @media (max-width: $small) {
    padding: 0rem;
    border: 1px var(--surface-border) solid;
  }
}

.members-table__outline {
  padding: 1rem;
  width: 90%;
  background-color: var(--surface-card);
  border-radius: 0.75rem;

  @media (max-width: $medium) {
    padding: 0.5rem;
  }

  @media (max-width: $small) {
    padding: 0rem;
    width: 100%;
  }
}

.members-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.members-table__footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
