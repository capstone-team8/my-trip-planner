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
	height: 100%
}

.vs-table table {
	min-width: 0 !important;
}

.card {
	background-color: white;
	border-radius: 1em;
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
