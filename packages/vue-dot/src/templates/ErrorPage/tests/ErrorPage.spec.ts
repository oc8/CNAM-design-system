import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';

import { mountComponent } from '@/tests';
import { html } from '@/tests/utils/html';

import ErrorPage from '../';
import PageContainer from '../../../elements/PageContainer';

Vue.component('PageContainer', PageContainer);

let wrapper: Wrapper<Vue>;

describe('ErrorPage', () => {
	it('renders correctly', () => {
		wrapper = mountComponent(ErrorPage, {
			propsData: {
				pageTitle: 'Error',
				message: 'Error message'
			}
		});

		expect(html(wrapper)).toMatchSnapshot();
	});
});
