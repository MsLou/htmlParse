/*
 * @Author: Luoxd
 * @Description: 
 * @Date: 2019-08-21 15:05:26
 * @LastEditTime: 2019-08-21 17:23:40
 * @LastEditors: Luoxd
 */
function parse (template) {
    if (typeof template !== 'string') {
        throw '模板参数格式错误'
        return
    }
    const tagReg = /^<[a-z]+(\s+[a-z]+(=\"[\w|\.|\:|\/]+\")?)*\s*\>/
    const startTagReg = /^\<[a-z]+/
    const tagAllReg = /\<(\/)?[a-z]+((\s+[a-z]+(=\"[\w|\.|\:|\/]+\")?)*\s*\>)?/g
    const endTagReg = /\<\/\w+\>/
    const nodeAll = template.match(tagAllReg)
    console.log(nodeAll, 'nodeAll')
    const templateInfo = {
        root: null
    }
    let prevTag = {}
    let startTagAll = [] // 所有开始标签集合
    if (nodeAll) {
        nodeAll.forEach(tagStr => {
            if (endTagReg.test(tagStr)) {
                const last = startTagAll[startTagAll.length - 1]
                last.isEnd = true
                startTagAll.splice(startTagAll.length - 1, 1)
                prevTag = startTagAll[startTagAll.length - 1]
            } else {
                const tagInfo = parseTag(tagStr)
                if (!templateInfo.root) {
                    templateInfo.root = tagInfo
                    prevTag = tagInfo
                } else {
                    prevTag.children.push(tagInfo)
                    prevTag = tagInfo
                }
                if (!tagInfo.isEnd) {
                    startTagAll.push(tagInfo)
                }
            }
        })
    }
    
    // if (startTagAll.length) {
    //     throw '模板解析错误'
    // }

    function parseTag (template) {
        const info = {
            tag: '',
            attr: null,
            isEnd: false,
            children: []
        }
        const startTag = template.match(tagReg)
        let attri = ''
        if (startTag) {
            attri = startTag[0].replace(startTagReg, '')
            info.tag = startTag[0].match(startTagReg)[0].replace('<', '')
            if (attri) {
                attri.split(' ').forEach(attrStr => {
                    if (!attrStr.trim()) return;
                    let attr = attrStr.indexOf('=') > -1 ? attrStr.split('=') : null
                    if (!attr) return;
                    if (!info.attr) {
                        info.attr = {}
                    }
                    info.attr[attr[0]] = attr[1].replace(/\"/g, '')
                })
            }
            switch(info.tag) {
                case 'img':
                    info.isEnd = true
                    break;
            }
        } else {
            throw '模板解析错误'
        }
        return info
    }
    return templateInfo
}

parse('<div id="bb" class="divClass"><p><img src="http://aaa.jpg"></p><ul><li></li></ul></div>')