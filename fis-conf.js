//输出目录
var dir = 'static';
var domain = 'http://172.16.5.211:3000';
var onlineDomain = 'http://xwenliang.cn';
var staticDir = '/Users/zooble/Documents/case/xwenliang.cn/4/static';
var viewDir = '/Users/zooble/Documents/case/xwenliang.cn/4/app';

// fis.config.set('roadmap.relative', true);
// fis.config.set('settings.postpackager.simple.autoReflow', true);
// fis.config.set('settings.postpackager.simple.autoCombine', true);
// fis.config.set('settings.postpackager.simple.output', 'pkg/pages_${hash}');
fis.config.set('project.fileType.text', 'jsx');
fis.config.set('modules.parser.jsx', 'react');
fis.config.set('roadmap.ext.jsx', 'js');

fis.config.merge({
    statics: dir,
    //设置/排除某目录
    // project: {
    //     include:
    //     exclude:
    // },
    /* zoo-command-install 要实现的功能
    requires: [
        'jQuery@1.11.3'
    ],
    pages: [
        'index',
        'category',
        'post',
        'postlist',
        'user',
        'userlist',
        'water',
        'chatroom'
    ],
    */
    settings: {
        parser: {
            utc: {
                variable: 'data'
            }
        },
        postpackager: {
            simple: {
                autoReflow: true,
                autoCombine: true,
                output: 'pkg/pages_${hash}'
            }
        }
    },
    roadmap: {
        domain: domain,
        path: [
            //非模块化的js，如mod.js
            {
                reg: /^\/js\/.*$/,
                isMod: false,
                release: '${statics}/$&'
            },
            //ace编辑器
            {
                reg: /^\/modules\/(ace)\/([^\/]+)\.js/i,
                isMod: true,
                id: '$1/$2',
                release: '${statics}/$&'
            },
            {
                reg: /^\/modules\/(ace)\/([^\/]+)\/([^\/]+)\.js/i,
                isMod: true,
                id: '$1/$2/$3',
                release: '${statics}/$&'
            },
            {
                reg: /^\/modules\/(ace)\/([^\/]+)\/([^\/]+)\/([^\/]+)\.js/i,
                isMod: true,
                id: '$1/$2/$3/$4',
                release: '${statics}/$&'
            },
            //公共模块
            {
                reg: /^\/modules\/([^\/]+)\/(?:[^\/]+)\.js$/i,
                //是组件化的，会被jswrapper包装
                isMod: true,
                //id为文件夹名
                id: '$1',
                release: '${statics}/$&'
            },
            //组件
            {
                reg: /^\/(components)\/([^\/]+)\/(?:[^\/]+)\.jsx$/i,
                //是组件化的，会被jswrapper包装
                isMod: true,
                //id为文件夹名
                id: '$1/$2',
                release: '${statics}/$&'
            },
            //业务逻辑模块(一级路由)
            {
                reg: /^\/(pages)\/([^\/]+)\/(?:[^\/]+)\.jsx*$/i,
                isMod: true,
                id: '$1/$2',
                release: '${statics}/$&'
            },
            //业务逻辑中的其他js文件
            {
                reg: /^\/pages\/.+\.js$/i,
                isMod: false,
                release: '${statics}/$&'
            },
            //css文件
            {
                reg: /^(.*)\.(css|less)$/i,
                //启用sprite自动合并，书写需要合并的图片地址的时候，需要在文件地址后面加?__sprite，如: background: url(images/abc.png?__sprite);
                useSprite: true,
                release: '${statics}/$&'
            },
            //图片等媒体文件
            {
                reg: /^(.*)\.(jpg|gif|png|mp3|mp4|ttf|pdf)$/i,
                release: '${statics}/$&'
            },
            //前端模版
            {
                reg: '**.tpl',
                useOptimizer: false,
                useCache: false
            },
            //后端模板
            {
                reg: /^\/view\/.*\.html$/i,
                //当做类js文件处理，可以识别__inline, __uri等资源定位标识，参与编译
                isHtmlLike: true,
                useCache: false,
                release: '${statics}/$&'
            },
            //打包后的资源
            {
                reg: 'pkg/**.js',
                release: '${statics}/$&'
            },
            //依赖关系表
            {
                reg: 'map.json',
                release: '${statics}/$&'
            },
            //其他上文未匹配到的
            {
                reg : "**",
                release : false
            }
        ]
    },
    pack: {
        'pkg/editor.js': [
            'modules/ace/**.js'
        ],
        'pkg/common.js': [
            'js/mod.js',
            'modules/**.js'
        ],
        'pkg/common.less': [
            'css/common.less',
            'modules/**.less'
        ]
    },
    deploy: {
        //测试
        test: [
            {
                from: dir,
                to: staticDir,
                exclude: /.*\/view\/.*\.html/ig,
                subOnly: true
            },
            {
                from: dir,
                to: viewDir,
                include: /.*\/view\/.*\.html/ig,
                subOnly: true
            }
        ],
        //上线
        online: [
            {
                from: dir,
                to: staticDir,
                exclude: /.*\/view\/.*\.html/ig,
                subOnly: true,
                replace: {
                    from: domain,
                    to: onlineDomain
                }
            },
            {
                from: dir,
                to: viewDir,
                include: /.*\/view\/.*\.html/ig,
                subOnly: true,
                replace: {
                    from: domain,
                    to: onlineDomain
                }
            }
        ]
    }
});