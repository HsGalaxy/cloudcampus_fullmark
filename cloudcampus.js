// ==UserScript==
// @name         Cloudcampus H5P Helper (带状态栏)
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  自动监控H5P提交，修正分数、答案和时间，并在页面右下角显示状态。
// @author       Hs_Galax
// @match        *://*.cloudcampus.com.cn/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------------------------------------------
    // 1. 页面状态显示器
    // -------------------------------------------------------------------
    const statusManager = {
        element: null,
        init: function() {
            if (this.element) return;
            const statusDiv = document.createElement('div');
            statusDiv.id = 'h5p-helper-status';
            Object.assign(statusDiv.style, {
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                padding: '5px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#FFFFFF',
                fontSize: '12px',
                borderRadius: '5px',
                zIndex: '99999',
                fontFamily: 'sans-serif',
                transition: 'opacity 0.5s',
                opacity: '0.8'
            });
            document.body.appendChild(statusDiv);
            this.element = statusDiv;
        },
        log: function(message, color = '#FFFFFF', duration = 5000) {
            this.init();
            this.element.innerHTML = message;
            this.element.style.color = color;
            this.element.style.opacity = '1';

            // 消息在一段时间后淡出
            if (duration > 0) {
                setTimeout(() => {
                    if (this.element.innerHTML === message) { // 避免新消息被旧的timeout清除
                       this.element.style.opacity = '0.5';
                    }
                }, duration);
            }
        }
    };

    // -------------------------------------------------------------------
    // 2. 启动和拦截逻辑
    // -------------------------------------------------------------------
    function runHijack() {
        const maxTries = 40; // 最多尝试20秒
        let tries = 0;

        statusManager.log('💡 H5P助手准备中...', '#FFD700', 0);

        const checker = setInterval(() => {
            if (window.H5PEmbedCommunicator && window.H5PEmbedCommunicator.post) {
                clearInterval(checker);
                statusManager.log('✅ H5P助手已成功启动！', '#4CAF50');
                const originalPost = window.H5PEmbedCommunicator.post;
                window.H5PEmbedCommunicator.post = function (component, statements) {
                    statusManager.log('⚡️ 拦截到提交请求！正在修改...', '#FF9800');
                    try {
                        if (Array.isArray(statements)) {
                            statements.forEach(statement => {
                                if (!statement.result) return;
                                if (typeof statement.result.duration !== 'undefined') {
                                    const randomFloatSeconds = Math.random() * (160 - 20) + 40;
                                    const formattedSeconds = randomFloatSeconds.toFixed(2);
                                    statement.result.duration = 'PT' + formattedSeconds + 'S';
                                }
                                if (statement.result.score) {
                                    const maxScore = statement.result.score.max;
                                    if (typeof maxScore !== 'undefined') {
                                        statement.result.score.raw = maxScore;
                                        if (typeof statement.result.score.scaled !== 'undefined') {
                                            statement.result.score.scaled = 1;
                                        }
                                    }
                                }
                                statement.result.completion = true;
                                statement.result.success = true;
                                if (statement.object && statement.object.definition && statement.object.definition.correctResponsesPattern) {
                                    const correctAnswer = statement.object.definition.correctResponsesPattern[0];
                                    if (correctAnswer) {
                                        statement.result.response = correctAnswer;
                                    }
                                }
                            });
                        }
                        statusManager.log('🎉 数据伪造完成！正在提交...', '#4CAF50');
                    } catch (e) {
                        statusManager.log('❌ 修改数据时发生错误！', '#F44336');
                        console.error('H5P Helper 错误:', e);
                    }
                    return originalPost.apply(this, [component, statements]);
                };

            } else {
                tries++;
                if (tries >= maxTries) {
                    clearInterval(checker);
                    statusManager.log('❌ 启动失败: 未找到H5P通信对象。', '#F44336');
                }
            }
        }, 500); // 每0.5秒检查一次
    }

    // 等待页面加载完成后再开始运行，确保body元素存在
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', runHijack);
    } else {
        runHijack();
    }

})();
