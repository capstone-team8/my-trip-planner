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
  background: rgba(var(--vs-gray-2));
}
</style>
