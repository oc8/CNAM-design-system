<template>
	<VListItem
		v-bind="$attrs"
		v-on="$listeners"
		:href="item.href"
		:rel="item.href ? 'nofollow' : undefined"
		:target="item.href ? '_blank' : undefined"
		:to="item.to"
		:nuxt="Boolean(item.to)"
		class="v-list-item--default"
		color="primary"
	>
		<VListItemIcon v-if="item.icon">
			<VIcon v-text="item.icon" />
		</VListItemIcon>

		<VListItemContent>
			<VListItemTitle v-text="item.title" />
		</VListItemContent>
	</VListItem>
</template>

<script lang="ts">
	import Vue, { PropType } from 'vue';
	import Component, { mixins } from 'vue-class-component';

	import { DrawerItem } from '../../types/drawer';

	const Props = Vue.extend({
		props: {
			item: {
				type: Object as PropType<DrawerItem>,
				default: () => ({})
			}
		}
	});

	const MixinsDeclaration = mixins(Props);

	@Component
	export default class DocDrawerListItem extends MixinsDeclaration {}
</script>

<style lang="scss">
	.v-list-item.v-list-item.v-list-item--default {
		min-height: 32px;

		> .v-list-item__icon {
			margin-bottom: 6px;
			margin-top: 6px;
		}
	}
</style>
