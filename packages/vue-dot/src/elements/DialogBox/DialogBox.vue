<template>
	<VDialog
		v-model="dialog"
		v-bind="$attrs"
		:width="width"
		:persistent="persistent"
		aria-modal="true"
		class="vd-dialog-box"
	>
		<VCard v-bind="options.card">
			<VCardTitle
				v-if="title"
				v-bind="options.cardTitle"
			>
				<slot name="title">
					<h2 class="text-h6 font-weight-bold">
						{{ title }}
					</h2>
				</slot>

				<VSpacer v-bind="options.spacer" />

				<VBtn
					v-if="!persistent"
					v-bind="options.closeBtn"
					:aria-label="locales.closeBtn"
					@click="close"
				>
					<VIcon v-bind="options.icon">
						{{ closeIcon }}
					</VIcon>
				</VBtn>
			</VCardTitle>

			<slot />

			<div
				v-if="!hideActions"
				v-bind="options.actionsCtn"
				class="vd-dialog-box-actions-ctn"
			>
				<VSpacer v-bind="options.actionsSpacer" />

				<slot name="actions">
					<VBtn
						v-bind="options.cancelBtn"
						@click="$emit('cancel')"
					>
						{{ cancelBtnText }}
					</VBtn>

					<VBtn
						v-bind="options.confirmBtn"
						@click="$emit('confirm')"
					>
						{{ confirmBtnText }}
					</VBtn>
				</slot>
			</div>
		</VCard>
	</VDialog>
</template>

<script lang="ts">
	import Vue from 'vue';
	import Component, { mixins } from 'vue-class-component';

	import { config } from './config';
	import { locales } from './locales';
	import { SelectableElements } from './types';

	import { customizable } from '../../mixins/customizable';

	import { mdiClose } from '@mdi/js';

	const Props = Vue.extend({
		props: {
			value: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: undefined
			},
			width: {
				type: String,
				default: '800px'
			},
			cancelBtnText: {
				type: String,
				default: locales.cancelBtn
			},
			confirmBtnText: {
				type: String,
				default: locales.confirmBtn
			},
			hideActions: {
				type: Boolean,
				default: false
			},
			persistent: {
				type: Boolean,
				default: false
			}
		}
	});

	const MixinsDeclaration = mixins(Props, customizable(config));

	@Component<DialogBox>({
		inheritAttrs: false,
		model: {
			prop: 'value',
			event: 'change'
		},
		watch: {
			dialog() {
				this.setEventListeners();
			}
		}
	})
	export default class DialogBox extends MixinsDeclaration {
		locales = locales;

		closeIcon = mdiClose;

		get dialog(): boolean {
			return this.value;
		}

		set dialog(value: boolean) {
			this.$emit('change', value);
		}

		close(): void {
			this.$emit('change', false);
		}

		async getSelectableElements(): Promise<SelectableElements | undefined> {
			await this.$nextTick();

			const elements = document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select, details');

			if (!elements.length) {
				return;
			}

			return elements;
		}

		async setEventListeners(): Promise<void> {
			const elements = await this.getSelectableElements();

			if (!elements) {
				return;
			}

			for (let i = 0; i < elements.length; i++) {
				const setFocus = (e: KeyboardEvent) => {
					if (e.key !== 'Tab') {
						return;
					}

					e.preventDefault();

					if (!e.shiftKey) {
						if (i === elements.length - 1) {
							elements[0].focus();
						} else {
							elements[i + 1].focus();
						}
					} else {
						if (i === 1) {
							elements[elements.length - 1].focus();
						} else {
							elements[i - 1].focus();
						}
					}
				};

				if (!this.dialog) {
					removeEventListener('keydown', setFocus);
					return;
				}

				elements[i].addEventListener('keydown', setFocus);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.v-card__title > * {
		line-height: 1em;
	}
</style>
