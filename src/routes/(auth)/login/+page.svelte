<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<h1>Sign in</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button>Continue</button>
</form>

<a href="/signup">Create an account</a>

{#if $page.form?.message}
	<p style="color:red;font-weight:bold;">{$page.form.message}</p>
{/if}
