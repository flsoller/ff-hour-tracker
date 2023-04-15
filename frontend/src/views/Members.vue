<template>
  <div class="members-table__container">
    <DataTable
      :value="members.data"
      :totalRecords="members.totalCount"
      :loading="loading"
      lazy
      stripedRows
      class="members-table__outline"
      scrollable
      scrollHeight="20rem"
      paginator
      :rows="defaultPageLimit"
      :rowsPerPageOptions="[5, 10, 20]"
      @page="onPaginationChange($event)"
      @sort="onSortingChange($event)"
    >
      <template #header>
        <div class="members-table__header">
          <span>Members</span>
          <Button icon="pi pi-plus" raised label="Add Member" />
        </div>
      </template>
      <Column field="firstName" header="First Name"></Column>
      <Column field="lastName" sortable header="Last Name"></Column>
      <Column field="emailAddress" header="Email Address"></Column>
      <template v-if="members.totalCount === 0 && !loading" #footer>
        <div class="members-table__footer">
          <span>No Members added yet, start adding to see data.</span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { getMembers } from '../services/members';
import {
  IGetMembersPaginatedReq,
  IGetMembersPaginatedRes,
} from '@hour-tracker/core-types/api/members';
import { useToastService } from '../services/toast';
import DataTable, {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const members: Ref<IGetMembersPaginatedRes> = ref({ data: [], totalCount: 0 });
const toast = useToastService();
const loading = ref(true);
const defaultPageLimit = 5;

onMounted(async () => {
  await getMembersData({
    limit: `${defaultPageLimit}`,
    offset: '0',
    order: 'asc',
  });
});

async function getMembersData(params: IGetMembersPaginatedReq) {
  loading.value = true;
  const [data, error] = await getMembers(params);

  if (error) {
    toast.showToast('error', 'Unexpected error while loading members data');
  }

  members.value = {
    data: data?.data || [],
    totalCount: data?.totalCount || 0,
  };
  loading.value = false;
}

async function onPaginationChange($event: DataTablePageEvent) {
  await getMembersData({
    limit: `${$event.rows}`,
    offset: `${$event.first}`,
    order: $event.sortOrder === -1 ? 'desc' : 'asc',
  });
}

async function onSortingChange($event: DataTableSortEvent) {
  await getMembersData({
    order: $event.sortOrder === -1 ? 'desc' : 'asc',
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
