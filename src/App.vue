<template>
	<header v-if="isAuthenticated" class="border-b border-stone-800/60 bg-stone-950">
		<div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
			<RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-2">
				<CherryFireLogo class="h-8 w-auto shrink-0" aria-label="Cherry Fire" />
				<span class="font-semibold text-lg tracking-tight text-stone-100">
					Cherryfire
				</span>
			</RouterLink>
			<nav class="flex items-center gap-2 sm:gap-6">
				<RouterLink :to="{ name: 'dashboard' }" class="text-stone-400 hover:text-stone-200 text-sm transition">
					Dashboard
				</RouterLink>
				<RouterLink :to="{ name: 'rule-editor' }"
					class="text-stone-400 hover:text-stone-200 text-sm transition">
					Rule Editor
				</RouterLink>
				<button type="button" class="text-stone-400 hover:text-stone-200 text-sm transition" @click="signOut">
					Sign out
				</button>
			</nav>
		</div>
	</header>
	<RouterView />
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import CherryFireLogo from '@/assets/Cherry-fire-logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

function signOut() {
	authStore.signOut()
	router.push({ name: 'landing' })
}
</script>