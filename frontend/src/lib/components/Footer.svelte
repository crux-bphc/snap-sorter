<script lang="ts">
	import Icon from '@iconify/svelte';
	import facebookIcon from '@iconify/icons-mdi/facebook';
	import googleGmail from '@iconify/icons-mdi/gmail';
	import githubIcon from '@iconify/icons-mdi/github';
</script>

<footer
	class="container mx-auto flex items-center justify-between bg-primary-200 px-5 py-3 shadow-lg"
>
	<p class="text-5xl font-bold text-primary-600">cruX</p>
	<ul class="grid list-none grid-cols-1 items-center font-semibold text-primary-600 sm:flex">
		<li class="mx-2 hover:text-primary-900">
			<a href="https://www.github.com/crux-bphc" rel="external" target="_blank">
				<Icon icon={githubIcon} width="35" />
			</a>
		</li>
		<li class="mx-2 hover:text-primary-900">
			<a href="mailto:crux@hyderabad.bits-pilani.ac.in" rel="external" target="_blank">
				<Icon icon={googleGmail} width="35" />
			</a>
		</li>
		<li class="mx-2 hover:text-primary-900">
			<a href="https://www.facebook.com/cruxbphc/" rel="external" target="_blank">
				<Icon icon={facebookIcon} width="35" />
			</a>
		</li>
	</ul>
</footer>
