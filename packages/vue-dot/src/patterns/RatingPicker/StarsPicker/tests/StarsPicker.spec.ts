import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';

import { mountComponent } from '@/tests';
import { html } from '@/tests/utils/html';

import StarsPicker from '..';

let wrapper: Wrapper<Vue>;

describe('StarsPicker', () => {
	it('renders correctly', () => {
		wrapper = mountComponent(StarsPicker,{
			propsData: {
				questionDatas: {
						name: 'first-question',
						type: 'stars',
						question: 'la deuxieme question ?'
					}
			}
		});

		expect(html(wrapper)).toMatchSnapshot();
	});
});
