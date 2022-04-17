import axios from "axios";
import config from "./config";

const UtilsTools = {
    flash: () => {
        const div = document.querySelector('.flash');
        div.classList.value = 'flash on';
        setTimeout(() => {
            div.classList.value = div.classList.contains('off') ? 'flash on' : 'flash off';
        }, 100);
    },
    uploadBase64: (image) => {
        const formData = new FormData();
        formData.append('imageb', image);
        axios({
            method: "post",
            url: `${config.API.dev}/upload_base64`,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    },
    uploadImage: (image) => {
        const formData = new FormData();
        formData.append('image', image);
        axios({
            method: "post",
            url: `${config.API.dev}/upload_image`,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    },
    getImage: (filename) => {
        axios({
            method: "get",
            url: `${config.API.dev}/image/${filename}`,
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }
}

export default UtilsTools;