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
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable, {
  DataTablePageEvent,
  DataTableSortEvent,
} from "primevue/datatable";
import { useDialog } from "primevue/usedialog";
import { onMounted } from "vue";
import AddMember from "../components/AddMember.vue";
import { useMembersStore } from "../stores/members";

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
    order: $event.sortOrder === -1 ? "desc" : "asc",
  });
}

async function onSortingChange($event: DataTableSortEvent) {
  await membersStore.getMembersPaginated({
    order: $event.sortOrder === -1 ? "desc" : "asc",
  });
}

function onAddMember() {
  dialog.open(AddMember, {
    props: {
      modal: true,
      header: "Add Member",
    },
  });
}
</script>

<style lang="scss" scoped>
@use "@/styles/base/sizes" as *;
.members-table__container {
  font-size: medium;
  display: flex;
  justify-content: center;
  padding: 1rem;

  @media (max-width: $medium) {
    padding: 0.5rem;
  }

  @media (max-width: $small) {
    padding: 0rem;
  }
}

.members-table__outline {
  padding: 1rem;
  width: 90%;
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
  font-size: 1.5rem;
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
