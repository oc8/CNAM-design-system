<template>
	<VMenu
		ref="menu"
		v-model="menu"
		v-bind="options.menu"
		:top="bottom"
		attach
		class="vd-external-links"
	>
		<template #activator="{ on, attrs }">
			<VBtn
				v-bind="{
					...attrs,
					...options.btn
				}"
				ref="btn"
				:style="btnStyle"
				class="vd-external-links-btn"
				@mouseenter="hover = true"
				@mouseleave="hover = false"
				v-on="on"
			>
				<span
					:class="btnTextSpacing"
					class="vd-external-links-btn-text white--text"
				>
					{{ btnText }}
				</span>

				<VSpacer v-bind="options.spacer" />

				<VIcon v-bind="options.btnIcon">
					{{ arrowIcon }}
				</VIcon>
			</VBtn>
		</template>

		<VList
			v-if="items.length"
			v-bind="options.list"
			class="vd-external-links-list"
		>
			<VListItem
				v-for="(item, index) in items"
				:key="index"
				:href="item.href"
				v-bind="options.listItem"
			>
				<VListItemContent v-bind="options.listItemContent">
					<VListItemTitle v-bind="options.listItemTitle">
						{{ item.text }}
					</VListItemTitle>
				</VListItemContent>

				<VListItemIcon v-bind="options.listItemIcon">
					<slot name="link-icon">
						<VIcon v-bind="options.linkIcon">
							{{ linkIcon }}
						</VIcon>
					</slot>
				</VListItemIcon>
			</VListItem>
		</VList>

		<VSheet
			v-else
			v-bind="options.sheet"
		>
			<p class="mb-0">
				{{ locales.noData }}
			</p>
		</VSheet>
	</VMenu>
</template>

<script lang='ts'>
	import Vue, { PropType } from 'vue';
	import Component, { mixins } from 'vue-class-component';

	import { config } from './config';
	import { locales } from './locales';

	import { PositionEnum } from './PositionEnum';

	import { ExternalLink, Position } from './types';
	import { IndexedObject } from '../../types';

	import { customizable } from '../../mixins/customizable';

	import { convertToUnit } from '../../helpers/convertToUnit';
	import { propValidator } from '../../helpers/propValidator';

	import {
		mdiChevronRight as rightArrowIcon,
		mdiChevronLeft as leftArrowIcon,
		mdiOpenInNew
	} from '@mdi/js';

	const SPACE_CHARACTER = ' ';

	const Props = Vue.extend({
		props: {
			position: {
				type: String,
				required: true,
				validator: (value: string) => {
					const { TOP, BOTTOM, RIGHT, LEFT } = PositionEnum;

					const acceptedValues = [
						[TOP, RIGHT],
						[TOP, LEFT],
						[BOTTOM, RIGHT],
						[BOTTOM, LEFT]
					].map((item) => item.join(SPACE_CHARACTER));

					return propValidator('position', acceptedValues, value);
				}
			},
			items: {
				type: Array as PropType<ExternalLink[]>,
				default: () => []
			},
			btnText: {
				type: String,
				default: locales.btnText
			},
			nudgeTop: {
				type: [String, Number],
				default: 0
			},
			nudgeBottom: {
				type: [String, Number],
				default: 0
			},
			fixed: {
				type: Boolean,
				default: false
			}
		}
	});

	const MixinsDeclaration = mixins(Props, customizable(config));

	@Component
	export default class ExternalLinks extends MixinsDeclaration {
		locales = locales;

		linkIcon = mdiOpenInNew;

		menu = false;
		hover = false;

		menuClass = '';

		get computedPosition(): Position {
			const [ y, x ] = this.position.split(SPACE_CHARACTER);

			return { x, y };
		}

		get right(): boolean {
			return this.computedPosition.x === PositionEnum.RIGHT;
		}

		get left(): boolean {
			return this.computedPosition.x === PositionEnum.LEFT;
		}

		get top(): boolean {
			return this.computedPosition.y === PositionEnum.TOP;
		}

		get bottom(): boolean {
			return this.computedPosition.y === PositionEnum.BOTTOM;
		}

		get open(): boolean {
			return this.menu || this.hover;
		}

		get btnTextSpacing(): string {
			return this.right ? 'ml-2' : 'mr-2';
		}

		get transform(): string {
			const MIN_BTN_WIDTH = '48px';
			let translateValue: string;

			if (this.open) {
				translateValue = '0';
			} else {
				translateValue = this.right ? `calc(100% - ${MIN_BTN_WIDTH})` : `calc(-100% + ${MIN_BTN_WIDTH})`;
			}

			return `translateX(${translateValue})`;
		}

		get computedNudgeTop(): string {
			return this.top ? convertToUnit(this.nudgeTop) as string : 'auto';
		}

		get computedNudgeBottom(): string {
			return this.bottom ? convertToUnit(this.nudgeBottom) as string : 'auto';
		}

		get btnStyle(): IndexedObject {
			const transform = this.transform;
			const position = this.fixed ? 'fixed' : 'absolute';
			const flexDirection = this.right ? 'row-reverse' : 'row';

			const top = this.computedNudgeTop;
			const bottom = this.computedNudgeBottom;
			const left = this.left ? '0' : 'auto';
			const right = this.right ? '0' : 'auto';

			// Change z-index to avoid shadow bleeding (VMenu is set to 4)
			const zIndex = this.top ? '4' : '5';

			return {
				transform,
				position,
				flexDirection,
				top,
				bottom,
				left,
				right,
				zIndex
			};
		}

		get arrowIcon(): string {
			const iconMapping: IndexedObject = {
				right: this.open ? rightArrowIcon : leftArrowIcon,
				left: this.open ? leftArrowIcon : rightArrowIcon
			};

			return iconMapping[this.computedPosition.x];
		}
	}
</script>

<style lang="scss" scoped>
	$list-max-height: 248px;

	.vd-external-links-btn {
		// Allow overgrow on mobile
		max-width: none;

		:deep(.v-btn__content) {
			flex-direction: inherit;
		}
	}

	.vd-external-links-list {
		max-height: $list-max-height;
		overflow-y: auto;
	}

	@media only screen and (max-height: 340px) {
		.vd-external-links-btn {
			z-index: 4 !important;
		}
	}
</style>
