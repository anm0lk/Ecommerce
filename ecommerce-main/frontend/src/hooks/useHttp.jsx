const BASE_URL = "https://ecommerce-302256684319.us-central1.run.app";
// const BASE_URL = "http://localhost:8080";


export const usePostReq = async (url, body, token) => {
    try {
        // console.log(body);
        const response = await fetch(`${BASE_URL}/${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data?.message || JSON.stringify(data) || response.statusText;
            throw new Error(errorMsg);
        }
        // console.log(data);
        return data;
    } catch (e) {
        console.log("Post Request Error:", e.message);
        throw e;
    }
}

export const useGetReq = async (url, token) => {
    try {
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${BASE_URL}/${url}`, {
            method: "GET",
            headers: headers
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data?.message || JSON.stringify(data) || response.statusText;
            throw new Error(errorMsg);
        }

        return data;
    } catch (e) {
        console.log("Get Method Error:", e.message);
        throw e;
    }
}

export const useDeleteReq = async (url, token) => {
    try {
        const response = await fetch(`${BASE_URL}/${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        let data=null;
        const text =await response.text();
        if(text){
            data=JSON.parse(text);
        }
        if (!response.ok) {
            const errorMsg = data?.message || text || response.statusText;
            throw new Error(errorMsg);
        }
        return data;
    } catch (e) {
        console.log("Delete Method Error:", e.message);
        throw e;
    }
}

export const usePutReq = async (url, body, token) => {
    try {
        const response = await fetch(`${BASE_URL}/${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message || JSON.stringify(data) || response.statusText;
            throw new Error(errorMsg);
        }
        return data;
    } catch (e) {
        console.log("Put Method Error:", e.message);
        throw e;
    }
}