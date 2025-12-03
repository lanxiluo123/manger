import axios from 'axios'
import { ElMessage } from 'element-plus'

// 环境配置
const isDevelopment = process.env.NODE_ENV === 'development'

// 根据环境选择基础URL
const getBaseURL = () => {
    if (isDevelopment) {
        // 开发环境：使用代理
        return '/api'  // 代理前缀
    } else {
        // 生产环境：使用真实地址
        return 'http://127.0.0.1:8092'
    }
}

const service = axios.create({
    // baseURL: getBaseURL(),
    baseURL: 'http://132.232.120.215:8092/api',
    timeout: 1000 * 10,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
})


// 请求拦截器
service.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token') 
    const token = sessionStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (config.isUpload) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }

    if (config.showLoading !== false) {
        // showLoading()
    }

    return config
}, (error) => {
    return Promise.reject(error)
}
)

// 响应拦截器
service.interceptors.response.use((response) => {
    console.log(response,'response')
    const { data = {}, code = '', message = '' } = response.data
    if (code == 1) {
        return response.data || response
    } else {
        handleBusinessError(code, message)
        return Promise.reject(new Error(message || 'Error'))
    }
}, (error) => {
    handleHttpError(error);
    return Promise.reject(error);
}
)

// 处理业务错误
function handleBusinessError(code, message) {
    const errorMap = {
        401: '用户未登录',
        403: '权限不足',
        404: '请求资源不存在',
        500: '服务器内部错误',
        // 添加更多业务错误码
    };


    const errorMsg = message || errorMap[code] || '未知错误';

    // 根据错误码进行不同处理
    switch (code) {
        case 401:
            // 跳转到登录页
            window.location.href = '/login';
            break;
        case 403:
            // 权限不足提示
            ElMessage.error({
                message: '权限不足',
                description: '您没有权限访问此资源',
            });
            break;

        case 0:
            ElMessage.error({
                message: message,
            });
        default:
            // ElMessage.error({
            //     message: errorMsg,
            //     description:'1' ,
            // });
            console.log(errorMsg)
        // return
    }
}

// 处理HTTP错误
function handleHttpError(error) {
    if (error.response) {
        // 请求已发出，服务器返回状态码不在 2xx 范围
        const status = error.response.status;
        const errorMessages = {
            400: '请求参数错误',
            401: '用户认证失败',
            403: '拒绝访问',
            404: '请求地址不存在',
            405: '请求方法不允许',
            408: '请求超时',
            500: '服务器内部错误',
            502: '网关错误',
            503: '服务不可用',
            504: '网关超时',
        };

        const errorMsg = errorMessages[status] || `请求错误: ${status}`;
        ElMessage.error({
            message: errorMsg,
            description: error.response.data?.message || '',
        });

        // 如果是401错误，清除token并跳转到登录页
        if (status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        }
    } else if (error.request) {
        // 请求已发出但没有收到响应
        ElMessage.error({
            message: '网络错误',
            description: '请检查网络连接',
        });
    } else {
        // 请求配置出错
        ElMessage.error({
            message: '请求错误11111111111',
            description: error.message,
        });
    }
}

// 封装请求方法
const request = {
    /**
     * GET请求
     * @param {string} url 请求地址
     * @param {object} params 查询参数
     * @param {object} config 其他配置
     */
    get(url, params = {}, config = {}) {
        return service({
            url,
            method: 'GET',
            params,
            ...config,
        });
    },

    /**
     * POST请求
     * @param {string} url 请求地址
     * @param {object} data 请求体数据
     * @param {object} config 其他配置
     */
    post(url, data = {}, config = {}) {
        return service({
            url,
            method: 'POST',
            data,
            ...config,
        });
    },

    /**
     * PUT请求
     * @param {string} url 请求地址
     * @param {object} data 请求体数据
     * @param {object} config 其他配置
     */
    put(url, data = {}, config = {}) {
        return service({
            url,
            method: 'PUT',
            data,
            ...config,
        });
    },

    /**
     * DELETE请求
     * @param {string} url 请求地址
     * @param {object} params 查询参数
     * @param {object} config 其他配置
     */
    delete(url, params = {}, config = {}) {
        return service({
            url,
            method: 'DELETE',
            params,
            ...config,
        });
    },

    /**
     * 上传文件
     * @param {string} url 请求地址
     * @param {FormData} formData 表单数据
     * @param {object} config 其他配置
     */
    upload(url, formData, config = {}) {
        return service({
            url,
            method: 'POST',
            data: formData,
            isUpload: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        });
    },

    /**
     * 下载文件
     * @param {string} url 请求地址
     * @param {object} params 查询参数
     * @param {string} filename 文件名
     */
    // download(url, params = {}, filename = 'file') {
    //     return service({
    //         url,
    //         method: 'GET',
    //         params,
    //         responseType: 'blob',
    //     }).then((response) => {
    //         const blob = new Blob([response]);
    //         const downloadUrl = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = downloadUrl;
    //         link.download = filename;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(downloadUrl);
    //     });
    // },
};

export default request;