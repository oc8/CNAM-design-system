<template>
	<div
		:class="{ 'vd-form-input': !isInline }"
		class="vd-choice-button-field"
	>
		<VBtnToggle
			v-bind="options"
			:value="choiceFieldValue"
			:multiple="multiple"
			:type="undefined"
			:class="{ 'flex-column': !isInline }"
			:aria-label="options.label"
			role="listbox"
			class="vd-choice-button-field-toggle d-flex flex-wrap primary--text"
		>
			<VBtn
				v-for="(item, index) in filteredItems"
				:key="index"
				:value="item.value"
				:outlined="!isSelected(item.value)"
				:elevation="0"
				:aria-selected="isSelected(item.value)"
				role="option"
				height="auto"
				min-height="40px"
				active-class="white--text"
				class="text-wrap text-left py-2"
				color="primary"
				@click="toggleItem(item)"
			>
				<span class="text-body-1">
					{{ item.text }}
				</span>

				<VSpacer />

				<VIcon
					:style="getIconStyles(item)"
					class="white--text flex-shrink-0 ml-1"
				>
					{{ checkIcon }}
				</VIcon>
			</VBtn>
		</VBtnToggle>

		<template v-if="errorMessages">
			<p
				v-for="(errorMessage, index) in errorMessages"
				:key="index"
				:class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
				class="v-messages error--text px-3 mt-2 mb-0"
			>
				{{ errorMessage }}
			</p>
		</template>

		<p
			v-else-if="showHint"
			:class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
			class="v-messages px-3 mt-2 mb-0"
		>
			<span v-if="showHint">
				{{ options.hint }}
			</span>
		</p>
	</div>
</template>

<script lang="ts">
	import Component, { mixins } from 'vue-class-component';

	import { mdiCheck } from '@mdi/js';

	import { ChoiceComponent } from '../mixins/choiceComponent';

	import { FieldItem } from '../types';
	import { IndexedObject } from '@cnamts/vue-dot/src/types';

	const MixinsDeclaration = mixins(ChoiceComponent);

	@Component
	export default class ChoiceButtonField extends MixinsDeclaration {
		checkIcon = mdiCheck;

		get filteredItems(): FieldItem[] {
			if (!Array.isArray(this.items)) {
				return [];
			}

			const filteredItems = this.items.filter((item) => {
				return item.value !== null && item.value !== undefined;
			});

			return filteredItems;
		}

		get isInline(): boolean | null {
			return this.options?.inline as boolean | null;
		}

		get showHint(): boolean {
			return Boolean(this.options?.hint);
		}

		getIconStyles(item: FieldItem): IndexedObject {
			return {
				visibility: this.isSelected(item.value) ? 'visible' : 'hidden'
			};
		}
	}
</script>

<style lang="scss" scoped>
	@import '@cnamts/design-tokens/dist/tokens';

	.vd-choice-button-field-toggle {
		background: none !important;

		&.flex-column .v-btn {
			border-radius: 4px !important;
			border-width: 1px !important;

			+ .v-btn {
				margin-top: 8px;
			}
		}

		.v-btn {
			background: #fff;

			&.v-btn--active::before {
				opacity: 0 !important;
			}

			:deep(.v-btn__content) {
				flex-shrink: 1 !important;
			}
		}

		&.theme--dark {
			.v-btn {
				background: #1e1e1e;
			}
		}

		&:not(.v-btn-toggle--group) .v-btn.v-btn {
			border-color: $vd-primary !important;
		}
	}
</style>
