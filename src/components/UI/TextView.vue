<template>
    <div class="text-view">
        <div class="header-text-view">{{ header }}</div>
        <div class="content-text-view">{{ content }}</div>
    </div>
</template>

<script>
export default {
    props:{
        header:{
            type: String,
            default: "Заголовок"
        },
        content:{
            type: String,
            default:""
        }
    }
};
</script>

<style scoped>
.text-view{
    border-style: solid;
    border-color: gray;
    color: white;
    display: grid;

    grid-template-areas: "header . ." "content content content";
}
.header-text-view{
    grid-area: header;
}
.content-text-view{
    grid-area: content;
}
</style>