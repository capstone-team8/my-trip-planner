<template>
	<div id="app">
		<Navbar />
		<router-view />
	</div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
	components: {
		Navbar
	}
}
</script>

<style>
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
@import url('https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css');

:root {
	--my-lightgray: #f1f1f1;
}

#app {
	font-family: 'Noto Sans KR';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}

body {
	background: rgba(var(--vs-gray-3));
}

.fullHeight {
	height: 100%;
}

.vs-table table {
	min-width: 0 !important;
}

.vs-table-content {
	border: 3px solid rgb(var(--vs-gray-2));
}

.card {
	background-color: white;
	border-radius: 1em;
}

.card-border {
	background-color: white;
	border-radius: 1em;
	border-color: rgba(var(--vs-gray-3), 1);
	border-width: 3px;
	border-style: solid;
}

::-webkit-scrollbar {
	width: 5px;
	height: 5px;
	display: block;
}

::-webkit-scrollbar-thumb {
	background: rgba(var(--vs-gray-4));
	border-radius: 5px;
}
</style>
