<script lang="ts">
	import Icon from '@iconify/svelte';
	import facebookIcon from '@iconify/icons-mdi/facebook';
	import googleGmail from '@iconify/icons-mdi/gmail';
	import githubIcon from '@iconify/icons-mdi/github';
	import { fade } from 'svelte/transition';
</script>

<footer
	class="bg-primary-200 text-primary-700 flex w-screen items-center justify-between px-5 py-3 shadow-lg"
	transition:fade
>
	<p class="text-5xl font-bold">cruX</p>
	<ul class="grid list-none grid-cols-1 items-center font-semibold sm:flex">
		<li class="hover:text-primary-900 mx-2">
			<a href="https://www.github.com/crux-bphc" rel="external" target="_blank">
				<Icon icon={githubIcon} width="35" />
			</a>
		</li>
		<li class="hover:text-primary-900 mx-2">
			<a href="mailto:crux@hyderabad.bits-pilani.ac.in" rel="external" target="_blank">
				<Icon icon={googleGmail} width="35" />
			</a>
		</li>
		<li class="hover:text-primary-900 mx-2">
			<a href="https://www.facebook.com/cruxbphc/" rel="external" target="_blank">
				<Icon icon={facebookIcon} width="35" />
			</a>
		</li>
	</ul>
</footer>
