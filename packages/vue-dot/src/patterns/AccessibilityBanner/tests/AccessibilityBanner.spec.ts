import Vue from 'vue';

import { Wrapper } from '@vue/test-utils';

import { mountComponent } from '@/tests';
import { html } from '@/tests/utils/html';

import AccessibilityBanner from '../';

let wrapper: Wrapper<Vue>;

describe('AccessibilityBanner', () => {
	it('renders correctly', () => {
		wrapper = mountComponent(AccessibilityBanner);

		expect(html(wrapper)).toMatchSnapshot();
	});
});
