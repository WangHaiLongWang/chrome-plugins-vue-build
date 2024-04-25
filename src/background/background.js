// 打开新 tab
async function open(url) {
    return new Promise((resolve)=>{
        chrome.tabs.create({
            url
        },
        (tab) => resolve(tab)
        )
    })
}

// 获取活跃的 tab，通常是用户正在浏览的页面

async function getActiveTab() {
    return new Promise((resolve)=>{
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            (tabs) => {
                if (tabs.length > 0) {
                    resolve(tabs[0]);
                } else {
                    resolve(null);
                }
            }
        )
    })
}

// 将指定的 tab 变成活跃的
async function activate(tabId, url) {
    if (typeof tabId === "undefined") {
        return tabId
    }
    const options = IS_FIREFOX ? {active: true} : {selected: true}
    return new Promise((resolve) => {
        chrome.tabs,update(tabId, options, () => resolve(tabId));
    })
}


