<template>
	<VBtn
		:href="href"
		outlined
		large
		color="primary"
	>
		Soumettre une demande
	</VBtn>
</template>

<script lang="ts">
	import Vue from 'vue';
	import Component from 'vue-class-component';

	@Component
	export default class DocRoadmapRequestBtn extends Vue {
		href = 'https://github.com/assurance-maladie-digital/design-system/issues/new/choose';
	}
</script>
