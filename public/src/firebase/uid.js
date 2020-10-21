// 時刻と乱数で（ほぼ）衝突しないであろうIDを生成する
export const uid = Date.now() + "-" + Math.floor(Math.random() * 10);
