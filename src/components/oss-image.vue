<template>
    <div>
        <el-upload
            class="oss-image"
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :http-request="handleUpload"
            :headers="uploadHeaders"
            :limit="files"
            :file-list="fileList"
        >
            <img v-if="imgUrl" :src="imgUrl" class="oss-image-img">
            <i v-else class="el-icon-plus oss-image-icon"></i>
        </el-upload>
        <el-progress class="oss-image-progress" :percentage="progressValue" type="circle" v-show="progressShow==1"></el-progress>
    </div>
</template>

<script>
import OssClient from "../utils/OssClient"
export default {
    name: "oss-image",
    data() {
        return {
            partSize: 1024 * 1024 * 2,
            partNum: 5,
            fileList: [],
            files: 1,
            uploadHeaders: {
                authorization: '*'
            },
            expiration: '',
            tokenData: {},
            imgUrl:'',
            progressValue: 0,
            progressShow:0
        }
    },
    props: {
        region: String,
        bucket: String,
        url: String
    },
    methods: {
        init(){
            this.progressValue=0
            this.progressShow=0
        },
        getValue(){
            return this.imgUrl
        },
        returnValue(val){
            this.$emit('imageUrl',val)
        },
        getTokenData() {
            return new Promise((resolve,reject)=>{
                this.$http({
                    url: this.url,
                    method: 'post',
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        let {accessKeyId , accessKeySecret, securityToken, expiration } = data.data;
                        this.expiration = expiration
                        this.tokenData = {
                            accessKeyId:accessKeyId,
                            accessKeySecret:accessKeySecret,
                            stsToken: securityToken,
                            bucket: this.bucket,
                            region: this.region
                        }
                        resolve(true)
                    }
                    else {
                        reject(false)
                    }
                }).catch(err => {
                    console.log(err)
                    reject(false)
                })
            })
        },
        beforeUpload(file) {
            return new Promise(((resolve, reject) => {
                this.getTokenData().then(res=>{
                    if(res){
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err=>{
                    console.log(err);
                    reject(res)
                })
            }))
        },
        getFileName(len){
            len = len || 16
            if(len <6)
                len =6
            let chars ='ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxzy123456789',maxPos =chars.length, name=''
            for (let i = 0; i < len; i++) {
                name += chars.charAt(Math.floor(Math.random() * maxPos))
            }
            let date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth() >9? date.getMonth() +1: `0${date.getMonth() +1}`,
                day = date.getDate()>9 ? date.getDate(): `0${date.getDate()}`
            return `${year}${month}${day}` +"/" + new Date().getTime() +'_' + name
        },
        uploadProgress(progress, checkpoint) {
            this.progressValue= Math.round(progress*100)
        },
        partUpload(file_name, option, client,partNum,partSize){
            this.progressShow=1
            return client.multipartUpload(file_name, option.file, {
                partNum,
                partSize,
                progress: this.uploadProgress
            }).then(({res}) => {
                this.progressShow=0
                if (res.statusCode === 200) {
                    this.imgUrl = res.requestUrls[0].split('?').shift()
                    this.returnValue(this.imgUrl)
                    this.init()
                    return res.requestUrls
                } else {
                    option.onError('Your image upload failed.')
                }
            }).catch(err => {
                console.error(err)
                this.disabled = false
                option.onError('Your image upload failed.')
            })
        },
        normalUpload(file_name, option, client){
            return client.put(file_name, option.file).then(result => {
                this.imgUrl = result.url
                this.returnValue(this.imgUrl)
                this.init()
            }).catch(err => {
                console.log('Your image upload failed.')
            });
        },
        async handleUpload(option){
            try{
                let vm =this
                const client = OssClient(vm.tokenData), file = option.file
                const file_name = this.getFileName(12) +'.'+file.name.split('.').pop()
                if (file.size > this.partSize) {
                    await this.partUpload(file_name,option,client,this.partNum,this.partSize)
                } else {
                    await this.normalUpload(file_name,option,client)
                }
            } catch (error) {
                console.error(error);
                this.disabled = false;
                option.onError('Your image upload failed.')
            }
        },
        handleSuccess(response, file, fileList){
            console.log('Your image was uploaded successfully...')
        },
        created(){
            this.getTokenData();
        }
    }
}
</script>

<style>
.oss-image .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.oss-image .el-upload:hover {
    border-color: #409EFF;
}
.oss-image-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.oss-image-img {
    width: 178px;
    height: 178px;
    display: block;
}
.oss-image-progress {
    position: relative;
    left: 0px;
    top: -158px;
}
</style>
