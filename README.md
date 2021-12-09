# oss-image
Uploading files to AliCloud using vue (based on sts authentication)

## example
```
<template>
    <div>
        <OssImage url="/api/sts" bucket="lele-img" region="oss-cn-hangzhou" ref="abc" @imageUrl="getValue"/>
        <el-button @click="getUrl">getUrl</el-button>
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
```
## About Jon So
I'm an average developer who loves the landscape and loves to code.
Most important is to make more friends.
Thanks.

# About facecto.com
https://facecto.com

Translated with www.DeepL.com/Translator (free version)