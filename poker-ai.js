/**
 * 实用德州扑克AI - 纯前端版本 (适用于Vercel部署)
 * Practical Poker AI - Frontend-only version for Vercel deployment
 */

class HandEvaluator {
    constructor() {
        this.ranks = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
                     '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
        this.suits = {'h': 1, 'd': 2, 'c': 3, 's': 4};
        
        // 手牌强度表 (基于Chen公式和实战经验)
        this.handStrengthTable = {
            // 口袋对子
            'AA': 0.95, 'KK': 0.92, 'QQ': 0.88, 'JJ': 0.84, 'TT': 0.78,
            '99': 0.74, '88': 0.70, '77': 0.66, '66': 0.62, '55': 0.58,
            '44': 0.54, '33': 0.50, '22': 0.46,
            
            // 同花牌
            'AKs': 0.86, 'AQs': 0.80, 'AJs': 0.76, 'ATs': 0.72, 'A9s': 0.66,
            'A8s': 0.62, 'A7s': 0.58, 'A6s': 0.56, 'A5s': 0.58, 'A4s': 0.56,
            'A3s': 0.54, 'A2s': 0.54,
            'KQs': 0.78, 'KJs': 0.72, 'KTs': 0.68, 'K9s': 0.62, 'K8s': 0.58,
            'K7s': 0.54, 'K6s': 0.52, 'K5s': 0.50, 'K4s': 0.48, 'K3s': 0.46,
            'K2s': 0.44,
            'QJs': 0.70, 'QTs': 0.66, 'Q9s': 0.60, 'Q8s': 0.56, 'Q7s': 0.52,
            'Q6s': 0.50, 'Q5s': 0.48, 'Q4s': 0.46, 'Q3s': 0.44, 'Q2s': 0.42,
            'JTs': 0.68, 'J9s': 0.62, 'J8s': 0.58, 'J7s': 0.54, 'J6s': 0.50,
            'J5s': 0.48, 'J4s': 0.46, 'J3s': 0.44, 'J2s': 0.42,
            'T9s': 0.64, 'T8s': 0.60, 'T7s': 0.56, 'T6s': 0.52, 'T5s': 0.50,
            'T4s': 0.48, 'T3s': 0.46, 'T2s': 0.44,
            '98s': 0.58, '97s': 0.54, '96s': 0.50, '95s': 0.48, '94s': 0.46,
            '93s': 0.44, '92s': 0.42,
            '87s': 0.56, '86s': 0.52, '85s': 0.50, '84s': 0.48, '83s': 0.46,
            '82s': 0.44,
            '76s': 0.54, '75s': 0.52, '74s': 0.50, '73s': 0.48, '72s': 0.40,
            '65s': 0.52, '64s': 0.50, '63s': 0.48, '62s': 0.46,
            '54s': 0.50, '53s': 0.48, '52s': 0.46,
            '43s': 0.48, '42s': 0.46,
            '32s': 0.44,
            
            // 非同花牌
            'AKo': 0.82, 'AQo': 0.74, 'AJo': 0.68, 'ATo': 0.64, 'A9o': 0.58,
            'A8o': 0.54, 'A7o': 0.50, 'A6o': 0.48, 'A5o': 0.50, 'A4o': 0.48,
            'A3o': 0.46, 'A2o': 0.46,
            'KQo': 0.72, 'KJo': 0.64, 'KTo': 0.60, 'K9o': 0.54, 'K8o': 0.50,
            'K7o': 0.46, 'K6o': 0.44, 'K5o': 0.42, 'K4o': 0.40, 'K3o': 0.38,
            'K2o': 0.36,
            'QJo': 0.62, 'QTo': 0.58, 'Q9o': 0.52, 'Q8o': 0.48, 'Q7o': 0.44,
            'Q6o': 0.42, 'Q5o': 0.40, 'Q4o': 0.38, 'Q3o': 0.36, 'Q2o': 0.34,
            'JTo': 0.60, 'J9o': 0.54, 'J8o': 0.50, 'J7o': 0.46, 'J6o': 0.42,
            'J5o': 0.40, 'J4o': 0.38, 'J3o': 0.36, 'J2o': 0.34,
            'T9o': 0.56, 'T8o': 0.52, 'T7o': 0.48, 'T6o': 0.44, 'T5o': 0.42,
            'T4o': 0.40, 'T3o': 0.38, 'T2o': 0.36,
            '98o': 0.50, '97o': 0.46, '96o': 0.42, '95o': 0.40, '94o': 0.38,
            '93o': 0.36, '92o': 0.34,
            '87o': 0.48, '86o': 0.44, '85o': 0.42, '84o': 0.40, '83o': 0.38,
            '82o': 0.36,
            '76o': 0.46, '75o': 0.44, '74o': 0.42, '73o': 0.40, '72o': 0.32,
            '65o': 0.44, '64o': 0.42, '63o': 0.40, '62o': 0.38,
            '54o': 0.42, '53o': 0.40, '52o': 0.38,
            '43o': 0.40, '42o': 0.38,
            '32o': 0.36
        };
    }
    
    parseCard(cardStr) {
        if (cardStr.length !== 2) {
            throw new Error(`Invalid card format: ${cardStr}`);
        }
        
        const rankChar = cardStr[0].toUpperCase();
        const suitChar = cardStr[1].toLowerCase();
        
        if (!(rankChar in this.ranks) || !(suitChar in this.suits)) {
            throw new Error(`Invalid card: ${cardStr}`);
        }
        
        return {
            rank: this.ranks[rankChar],
            suit: this.suits[suitChar],
            rankChar: rankChar,
            suitChar: suitChar
        };
    }
    
    evaluateHandStrength(holeCards, communityCards = "") {
        try {
            // 解析底牌
            const cards = holeCards.toUpperCase().replace(/[, ]/g, "");
            if (cards.length !== 4) {
                return 0.5; // 默认中等强度
            }
            
            const card1 = this.parseCard(cards.slice(0, 2));
            const card2 = this.parseCard(cards.slice(2, 4));
            
            // 生成手牌键值
            let handKey;
            const isSuited = card1.suit === card2.suit;
            const isPair = card1.rank === card2.rank;
            
            if (isPair) {
                handKey = card1.rankChar + card2.rankChar;
            } else {
                // 按rank排序，大的在前
                if (card1.rank > card2.rank) {
                    handKey = card1.rankChar + card2.rankChar + (isSuited ? 's' : 'o');
                } else {
                    handKey = card2.rankChar + card1.rankChar + (isSuited ? 's' : 'o');
                }
            }
            
            // 查找手牌强度
            let strength = this.handStrengthTable[handKey] || 0.5;
            
            // 根据公共牌调整强度 (简化版)
            if (communityCards) {
                // 这里可以添加更复杂的后翻牌评估逻辑
                // 目前仅做简单调整
                strength *= 1.1; // 略微提升，因为看到了更多信息
            }
            
            return Math.min(0.95, Math.max(0.05, strength));
            
        } catch (error) {
            console.error('Hand evaluation error:', error);
            return 0.5;
        }
    }
}

class PokerAI {
    constructor() {
        this.handEvaluator = new HandEvaluator();
        
        // 位置映射
        this.positions6max = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
        this.positions5max = ['UTG', 'CO', 'BTN', 'SB', 'BB'];
        
        // 动作映射
        this.actions = ['FOLD', 'CHECK/CALL', 'BET/RAISE_SMALL', 'BET/RAISE_MID', 'BET/RAISE_BIG', 'ALL-IN'];
        
        // 位置强度表
        this.positionStrength = {
            'UTG': 0.2,
            'MP': 0.4,
            'CO': 0.7,
            'BTN': 1.0,
            'SB': 0.3,
            'BB': 0.5
        };
    }
    
    calculateActionProbabilities(handStrength, positionStrength, potOdds, stackPotRatio) {
        // 基础概率矩阵 - 根据手牌强度调整
        let probs;
        
        if (handStrength > 0.85) { // 超强牌 (AA, KK, AKs等)
            probs = [0.02, 0.08, 0.15, 0.35, 0.30, 0.10];
        } else if (handStrength > 0.75) { // 强牌 (QQ, JJ, AQ等)
            probs = [0.05, 0.15, 0.25, 0.30, 0.20, 0.05];
        } else if (handStrength > 0.65) { // 中强牌 (TT, AJ, KQ等)
            probs = [0.10, 0.30, 0.25, 0.20, 0.12, 0.03];
        } else if (handStrength > 0.55) { // 中等牌 (99, AT, KJ等)
            probs = [0.15, 0.40, 0.20, 0.15, 0.08, 0.02];
        } else if (handStrength > 0.45) { // 中弱牌 (88, A9, QJ等)
            probs = [0.25, 0.45, 0.15, 0.10, 0.04, 0.01];
        } else if (handStrength > 0.35) { // 弱牌 (77, KT, Q9等)
            probs = [0.40, 0.40, 0.10, 0.07, 0.02, 0.01];
        } else { // 垃圾牌 (大部分不连续、不同花的牌)
            probs = [0.70, 0.25, 0.03, 0.015, 0.004, 0.001];
        }
        
        // 位置调整
        if (positionStrength > 0.8) { // 后位 (BTN)
            probs[2] *= 1.3; // 增加小注概率
            probs[3] *= 1.2; // 增加中注概率
            probs[0] *= 0.8; // 减少弃牌概率
        } else if (positionStrength > 0.6) { // CO位
            probs[2] *= 1.2;
            probs[3] *= 1.1;
            probs[0] *= 0.9;
        } else if (positionStrength < 0.3) { // 前位 (UTG, SB)
            probs[0] *= 1.4; // 增加弃牌概率
            probs[2] *= 0.7; // 减少下注概率
            probs[3] *= 0.6;
            probs[4] *= 0.5;
        }
        
        // 底池赔率调整
        if (potOdds > 0.3) { // 需要跟注很多
            if (handStrength < 0.6) {
                probs[0] *= 1.5; // 弱牌更容易弃牌
                probs[1] *= 0.6; // 减少跟注
            }
        } else if (potOdds < 0.1) { // 很便宜或免费
            probs[1] *= 1.3; // 增加跟注/过牌
            probs[0] *= 0.7; // 减少弃牌
        }
        
        // 筹码深度调整
        if (stackPotRatio < 3) { // 短筹码
            probs[5] *= 2.0; // 增加全下概率
            probs[3] *= 0.7; // 减少中等下注
            probs[4] *= 0.8;
        } else if (stackPotRatio > 15) { // 深筹码
            probs[5] *= 0.3; // 减少全下
            probs[2] *= 1.2; // 增加小注概率
        }
        
        // 确保概率和为1
        const total = probs.reduce((sum, p) => sum + p, 0);
        probs = probs.map(p => p / total);
        
        return probs;
    }
    
    getActionRecommendation(gameState) {
        try {
            // 解析游戏状态
            const numPlayers = gameState.numPlayers || 6;
            const holeCards = gameState.holeCards || '';
            const communityCards = gameState.communityCards || '';
            const position = gameState.position || 'BTN';
            const potSize = gameState.potSize || 100;
            const betToCall = gameState.betToCall || 0;
            const stackSize = gameState.stackSize || 1000;
            
            // 评估手牌强度
            const handStrength = this.handEvaluator.evaluateHandStrength(holeCards, communityCards);
            
            // 计算基本特征
            const potOdds = betToCall / (potSize + betToCall) || 0;
            const stackPotRatio = stackSize / potSize || 10;
            const positionStrength = this.positionStrength[position] || 0.5;
            
            // 计算动作概率
            const actionProbs = this.calculateActionProbabilities(
                handStrength, positionStrength, potOdds, stackPotRatio
            );
            
            // 选择最佳动作
            const bestActionIdx = actionProbs.indexOf(Math.max(...actionProbs));
            
            return {
                holeCards: holeCards,
                handStrength: handStrength,
                recommendedAction: {
                    action: bestActionIdx,
                    actionName: this.actions[bestActionIdx],
                    confidence: actionProbs[bestActionIdx]
                },
                actionProbabilities: actionProbs,
                actionNames: this.actions,
                analysis: {
                    handStrength: handStrength.toFixed(3),
                    positionStrength: positionStrength.toFixed(3),
                    potOdds: potOdds.toFixed(3),
                    recommendation: this.getRecommendationText(handStrength, positionStrength, potOdds)
                }
            };
            
        } catch (error) {
            console.error('Action recommendation error:', error);
            return { error: error.message };
        }
    }
    
    getRecommendationText(handStrength, positionStrength, potOdds) {
        if (handStrength > 0.85) {
            return "超强牌，建议激进下注或加注，价值最大化";
        } else if (handStrength > 0.75) {
            return "强牌，适合价值下注，可以应对加注";
        } else if (handStrength > 0.65) {
            return "中强牌，根据位置和对手行动决定策略";
        } else if (handStrength > 0.55) {
            if (positionStrength > 0.7) {
                return "中等牌在后位，可以考虑偷盲或小额下注";
            } else {
                return "中等牌在前位，建议谨慎行动";
            }
        } else if (handStrength > 0.45) {
            if (potOdds < 0.2 && positionStrength > 0.6) {
                return "投机牌，在后位且赔率合适时可以跟注";
            } else {
                return "弱牌，建议弃牌，除非有很好的底池赔率";
            }
        } else {
            return "垃圾牌，建议弃牌，保存筹码等待更好机会";
        }
    }
}

// 全局AI实例
const pokerAI = new PokerAI();

// 更新位置选项
function updatePositions() {
    const numPlayers = document.getElementById('numPlayers').value;
    const positionSelect = document.getElementById('position');
    
    const positions6 = [
        {value: 'UTG', text: 'UTG (枪口位)'},
        {value: 'MP', text: 'MP (中位)'},
        {value: 'CO', text: 'CO (关煞位)'},
        {value: 'BTN', text: 'BTN (按钮位)'},
        {value: 'SB', text: 'SB (小盲位)'},
        {value: 'BB', text: 'BB (大盲位)'}
    ];
    
    const positions5 = [
        {value: 'UTG', text: 'UTG (枪口位)'},
        {value: 'CO', text: 'CO (关煞位)'},
        {value: 'BTN', text: 'BTN (按钮位)'},
        {value: 'SB', text: 'SB (小盲位)'},
        {value: 'BB', text: 'BB (大盲位)'}
    ];
    
    const positions = numPlayers === '6' ? positions6 : positions5;
    const currentValue = positionSelect.value;
    
    positionSelect.innerHTML = '';
    positions.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.value;
        option.textContent = pos.text;
        positionSelect.appendChild(option);
    });
    
    // 尝试保持当前选择
    if (positions.find(p => p.value === currentValue)) {
        positionSelect.value = currentValue;
    } else {
        positionSelect.value = 'BTN';
    }
}

// 获取AI建议
function getAIRecommendation() {
    const card1 = document.getElementById('card1').value.trim();
    const card2 = document.getElementById('card2').value.trim();
    
    if (!card1 || !card2) {
        showError('请输入你的底牌');
        return;
    }
    
    const gameState = {
        numPlayers: parseInt(document.getElementById('numPlayers').value),
        position: document.getElementById('position').value,
        holeCards: card1 + card2,
        communityCards: getCommunityCards(),
        potSize: parseInt(document.getElementById('potSize').value),
        betToCall: parseInt(document.getElementById('betToCall').value),
        stackSize: parseInt(document.getElementById('stackSize').value)
    };
    
    showLoading();
    
    // 模拟异步处理
    setTimeout(() => {
        try {
            const result = pokerAI.getActionRecommendation(gameState);
            
            if (result.error) {
                showError(result.error);
            } else {
                showResult(result);
            }
        } catch (error) {
            showError('AI分析出错: ' + error.message);
        }
    }, 500); // 500ms延迟模拟处理时间
}

// 获取公共牌
function getCommunityCards() {
    const cards = [
        document.getElementById('flop1').value,
        document.getElementById('flop2').value,
        document.getElementById('flop3').value,
        document.getElementById('turn').value,
        document.getElementById('river').value
    ].filter(card => card.trim());
    
    return cards.join('');
}

// 随机手牌
function randomizeHand() {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const suits = ['s', 'h', 'd', 'c'];
    
    const rank1 = ranks[Math.floor(Math.random() * ranks.length)];
    const suit1 = suits[Math.floor(Math.random() * suits.length)];
    
    let rank2, suit2;
    do {
        rank2 = ranks[Math.floor(Math.random() * ranks.length)];
        suit2 = suits[Math.floor(Math.random() * suits.length)];
    } while (rank1 === rank2 && suit1 === suit2);
    
    document.getElementById('card1').value = rank1 + suit1;
    document.getElementById('card2').value = rank2 + suit2;
}

// 加载示例
function loadExample() {
    const examples = [
        {
            card1: 'As', card2: 'Kh', 
            pot: 30, toCall: 15, stack: 1000,
            desc: '强牌AK，前位有人下注'
        },
        {
            card1: 'Qh', card2: 'Qs', 
            pot: 50, toCall: 0, stack: 800,
            desc: '口袋QQ，无人下注'
        },
        {
            card1: 'Tc', card2: '9s', 
            pot: 100, toCall: 50, stack: 600,
            desc: '投机牌T9，大注压力'
        },
        {
            card1: '7h', card2: '7d', 
            pot: 40, toCall: 20, stack: 1200,
            desc: '小对子77，中等下注'
        },
        {
            card1: 'Ah', card2: '5s',
            pot: 60, toCall: 30, stack: 900,
            desc: 'A5o，中等位置，需要决策'
        },
        {
            card1: 'Kd', card2: 'Qc',
            pot: 25, toCall: 0, stack: 1500,
            desc: 'KQo，后位无人下注'
        }
    ];
    
    const example = examples[Math.floor(Math.random() * examples.length)];
    
    document.getElementById('card1').value = example.card1;
    document.getElementById('card2').value = example.card2;
    document.getElementById('potSize').value = example.pot;
    document.getElementById('betToCall').value = example.toCall;
    document.getElementById('stackSize').value = example.stack;
    
    showMessage(`📋 已加载示例: ${example.desc}`, 'info');
}

// 显示消息
function showMessage(message, type = 'info') {
    const colors = {
        'info': '#e7f3ff',
        'success': '#d4edda',
        'warning': '#fff3cd',
        'error': '#f8d7da'
    };
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        background: ${colors[type]};
        padding: 10px 15px;
        border-radius: 8px;
        margin: 10px 0;
        border-left: 4px solid #0066cc;
        animation: fadeInOut 3s ease-in-out;
    `;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.input-section');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => messageDiv.remove(), 3000);
}

// 显示加载状态
function showLoading() {
    document.getElementById('defaultMessage').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('loadingMessage').style.display = 'block';
}

// 显示结果
function showResult(result) {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('defaultMessage').style.display = 'none';
    document.getElementById('resultArea').style.display = 'block';
    
    // 显示手牌
    document.getElementById('handDisplay').innerHTML = `
        <h4>🎴 你的手牌</h4>
        <div style="margin: 10px 0;">
            <span class="card-display">${result.holeCards.slice(0,2)}</span>
            <span class="card-display">${result.holeCards.slice(2,4)}</span>
        </div>
        <p>手牌强度: <strong>${(result.handStrength * 100).toFixed(1)}%</strong></p>
    `;
    
    // 显示动作概率
    let actionsHTML = '';
    result.actionProbabilities.forEach((prob, index) => {
        const isRecommended = index === result.recommendedAction.action;
        const isLikely = prob > 0.15;
        const className = isRecommended ? 'recommended' : (isLikely ? 'likely' : '');
        
        actionsHTML += `
            <div class="action-card ${className}">
                <div class="action-name">${result.actionNames[index]}</div>
                <div class="action-prob">${(prob * 100).toFixed(1)}%</div>
            </div>
        `;
    });
    document.getElementById('actionsDisplay').innerHTML = actionsHTML;
    
    // 显示分析
    document.getElementById('analysisDisplay').innerHTML = `
        <h4>📊 详细分析</h4>
        <div class="analysis-row">
            <span>手牌强度:</span>
            <span>${result.analysis.handStrength}</span>
        </div>
        <div class="analysis-row">
            <span>位置强度:</span>
            <span>${result.analysis.positionStrength}</span>
        </div>
        <div class="analysis-row">
            <span>底池赔率:</span>
            <span>${result.analysis.potOdds}</span>
        </div>
    `;
    
    // 显示推荐
    document.getElementById('recommendationDisplay').innerHTML = `
        <h4>💡 AI推荐</h4>
        <p><strong>建议动作:</strong> ${result.recommendedAction.actionName}</p>
        <p><strong>置信度:</strong> ${(result.recommendedAction.confidence * 100).toFixed(1)}%</p>
        <p><strong>分析:</strong> ${result.analysis.recommendation}</p>
    `;
}

// 显示错误
function showError(message) {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('defaultMessage').innerHTML = `
        <div class="error">❌ ${message}</div>
    `;
    document.getElementById('defaultMessage').style.display = 'block';
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numPlayers').addEventListener('change', updatePositions);
    updatePositions();
});