import { expect, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import * as membersService from '../../services/members';
import Members from '../../views/Members.vue';
import { flushPromises } from '../mocks/helpers';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { AppConstants } from '../../utils/constants';

describe('Members View', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(Members);
    await flushPromises();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('component tests', () => {
    const membersApiSpy = vi.spyOn(membersService, 'getMembers');

    it('should create', async () => {
      expect(wrapper.isVisible()).toBe(true);
      expect(
        await wrapper.find('.members-table__header > span').text()
      ).toContain('Members');
      expect(
        await wrapper.find('.members-table__header > Button').text()
      ).toContain('Add Member');
    });

    it('should call api to get members data with correct query on mount', () => {
      expect(membersApiSpy).toHaveBeenCalledTimes(1);
      expect(membersApiSpy).toHaveBeenCalledWith({
        limit: '5',
        offset: '0',
        order: 'asc',
      });
    });

    it('should display correct number of table rows', async () => {
      expect(await wrapper.findAll('thead > tr').length).toBe(1);
      expect(await wrapper.findAll('tbody > tr').length).toBe(1);
      expect(wrapper.html()).not.toContain('class="members-table__footer"');
    });

    it('should display correct information in table rows', async () => {
      const headers = await wrapper.findAll('th');
      const tableData = await wrapper.findAll('tbody > tr > td');

      ['First Name', 'Last Name', 'Email Address'].forEach((header, i) => {
        expect(headers[i].text()).toContain(header);
      });
      ['Paige', 'Turner', 'pt@mail.com'].forEach((text, i) => {
        expect(tableData[i].text()).toContain(text);
      });
    });

    it('should trigger api call with correct order query when sorting column desc', async () => {
      // click twice as initial click sets sort to default 'asc'
      await wrapper.find('.p-sortable-column').trigger('click');
      await wrapper.find('.p-sortable-column').trigger('click');
      expect(membersApiSpy).toHaveBeenLastCalledWith({
        order: 'desc',
      });
    });

    it('should show an info text when there are no members', async () => {
      server.use(
        rest.get(`${AppConstants.apiUrl}/v0/members`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ data: [], totalCount: 0 }));
        })
      );
      const noDataWrapper = mount(Members);
      await flushPromises();
      expect(noDataWrapper.html()).toContain('class="members-table__footer"');
      expect(
        await noDataWrapper.find('.members-table__footer > span').text()
      ).toContain('No Members added yet, start adding to see data.');
    });

    it('should trigger api call with correct offset query when changing table page', async () => {
      const data: any[] = [];
      for (let i = 0; i < 25; i++) {
        data.push({
          firstName: `first${i}`,
          lastName: `last${i}`,
          emailAddress: `first${i}@last${i}.com`,
        });
      }
      server.use(
        rest.get(`${AppConstants.apiUrl}/v0/members`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ data, totalCount: data.length })
          );
        })
      );
      const moreDataWrapper = mount(Members);
      await flushPromises();

      await moreDataWrapper.find('[aria-label="Next Page"]').trigger('click');
      expect(membersApiSpy).toHaveBeenLastCalledWith({
        limit: '5',
        offset: '5',
        order: 'asc',
      });
    });

    it('should trigger api call with correct limit query when changing table row limit', async () => {
      const data: any[] = [];
      for (let i = 0; i < 25; i++) {
        data.push({
          firstName: `first${i}`,
          lastName: `last${i}`,
          emailAddress: `first${i}@last${i}.com`,
        });
      }
      server.use(
        rest.get(`${AppConstants.apiUrl}/v0/members`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ data, totalCount: data.length })
          );
        })
      );
      const moreDataWrapper = mount(Members, {
        global: {
          stubs: {
            teleport: { template: '<div />' },
          },
        },
      });
      await flushPromises();

      await moreDataWrapper.find('.p-dropdown').trigger('click');
      await moreDataWrapper.find('[aria-label="20"]').trigger('click');
      expect(membersApiSpy).toHaveBeenLastCalledWith({
        limit: '20',
        offset: '0',
        order: 'asc',
      });
    });
  });
});
