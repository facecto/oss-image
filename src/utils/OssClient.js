const OSS = require('ali-oss')

export default function OssClient(data) {
    return new OSS({
        region: data.region,
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.stsToken,
        bucket: data.bucket,
        secure: true,
        folder: '/'
    })
}
