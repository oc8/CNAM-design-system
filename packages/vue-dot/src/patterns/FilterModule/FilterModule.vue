<template>
	<div class="vd-filter-module">
		<FilterManager
			v-if="filtersCount"
			:applied-filters="appliedFilters"
			@edit-filter="editFilter"
			@clear-filter="clearFilter"
			@reset-filters="resetFilters"
		/>

		<FilterSelector
			:filters="filters"
			@filter-selected="openDialog($event, filters)"
		/>

		<DialogBox
			v-model="dialog"
			v-bind="options.dialog"
			:title="filterTitle"
		>
			<div class="vd-filter-module-dialog-content d-flex flex-column-reverse">
				<FormField v-model="dialogContent" />

				<div class="vd-filter-module-dialog-actions d-flex mb-10">
					<VSpacer v-bind="options.spacer" />

					<VBtn
						v-bind="options.validateBtn"
						@click="applyFilter"
					>
						{{ locales.apply }}
					</VBtn>
				</div>
			</div>
		</DialogBox>
	</div>
</template>

<script lang="ts">
	import Vue, { PropType } from 'vue';
	import Component, { mixins } from 'vue-class-component';

	import { config } from './config';
	import { locales } from './locales';

	import FilterManager from './FilterManager';
	import FilterSelector from './FilterSelector';

	import { customizable } from '../../mixins/customizable';

	import FormField from '@cnamts/form-builder/src/components/FormField';
	import { Field } from '@cnamts/form-builder/src/components/FormField/types';

	import { deepCopy } from '../../helpers/deepCopy';

	const Props = Vue.extend({
		props: {
			filters: {
				type: Array as PropType<Field[]>,
				required: true
			}
		}
	});

	const MixinsDeclaration = mixins(Props, customizable(config));

	@Component({
		components: {
			FilterManager,
			FilterSelector,
			FormField
		}
	})
	export default class FilterModule extends MixinsDeclaration {
		locales = locales;

		dialog = false;

		filterIndex: number | null = null;
		filterTitle: string | null = null;

		dialogContent: Field | null = null;
		appliedFilters: Field[] | null = null;

		get filtersCount(): number {
			if (this.appliedFilters === null) {
				return 0;
			}

			return this.appliedFilters.filter(item => item.value !== null).length;
		}

		openDialog(index: number, filters: Field[]): void {
			this.filterIndex = index;

			const filter = filters[index];
			this.filterTitle = filter.fieldOptions?.filterTitle as string;
			this.dialogContent = filter;

			this.dialog = true;
		}

		applyFilter(): void {
			if (this.filterIndex === null || this.dialogContent === null) {
				return;
			}

			if (this.appliedFilters === null) {
				this.appliedFilters = deepCopy<Field[]>(this.filters);
			}

			this.$set(this.appliedFilters, this.filterIndex, this.dialogContent);
			this.emitFilterListEvent();
			this.dialog = false;
		}

		clearFilter(index: number): void {
			if (this.appliedFilters === null) {
				return;
			}

			this.$set(this.appliedFilters[index], 'value', null);

			if (this.filtersCount === 0) {
				this.resetFilters();
				return;
			}

			this.emitFilterListEvent();
		}

		editFilter(index: number): void {
			if (this.appliedFilters === null) {
				return;
			}

			this.openDialog(index, this.appliedFilters);
		}

		emitFilterListEvent(): void {
			this.$emit('filter-list', this.appliedFilters);
		}

		resetFilters(): void {
			this.appliedFilters = null;
			this.emitFilterListEvent();
		}
	}
</script>
