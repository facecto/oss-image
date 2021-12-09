<template>
    <div>
        <OssImage url="/api/sts" bucket="lele-img" region="oss-cn-hangzhou" ref="abc" @imageUrl="getValue"/>
        <el-button @click="getUrl">get image url</el-button>
    </div>
</template>

<style>

</style>

<script>
import OssImage from './oss-image'

export default {
    components: {
        OssImage
    },
    methods:{
        getValue(url) {
            this.$message(url)
        },
        getUrl() {
            let imgUrl = this.$refs['abc'].getValue();
            this.$message(imgUrl)
        }
    }
}
</script>

<style scoped>

</style>
