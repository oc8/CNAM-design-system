<template>
	<RatingPicker
		:main-question="firstQuestion"
		:questions-list="questionsList"
		:after-validate="afterValidate"
		@on-validate="onValidate"
		@on-close="onClose"
	/>
</template>

<script lang="ts">
	import Vue from 'vue';
	import Component from "vue-class-component";

	@Component({
		inheritAttrs: false
	})
	export default class RatingPickerGreenBackground extends Vue {
		firstQuestion = {
			name: 'first-step',
			type: 'emotions',
			question: 'Pourriez vous donner une note ? '
		};

		questionsList = [
			{
				name: 'first-question',
				type: 'emotions',
				question: 'Avez vous aimé notre première question ?'
			}
		];

		afterValidate = [
			{
				message: 'Merci !',
				greenBackground: false
			},
			{
				message: 'Merci d\'avoir donné plus d\'information',
				greenBackground: true
			}
		];

		afterFirstQuestion(): void {
			console.log('Validation de la première question');
		}

		onValidate(): void {
			console.log('Validation');
		}

		onClose(): void {
			console.log('Fermeture');
		}
	}
</script>
