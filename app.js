/**
 * ==============================================================================
 * 今天吃什麼抽籤器 - 主要邏輯程式碼 (app.js)
 * 專為初學者設計，語法直觀、結構扁平、註解詳盡，方便後續修改與擴充！
 * ==============================================================================
 */

// ==============================================================================
// 1. 餐點資料庫 (可自由新增、修改或刪除餐點！)
// 欄位說明：
// - id: 唯一編號 (數字)
// - name: 餐點名稱 (字串)
// - category: 餐點類型 ("飯"、"麵"、"其他")
// - price: 預估價格 (新臺幣整數)
// - description: 餐點小特色說明 (字串)
// ==============================================================================
const MEAL_LIST = [
  // --- 飯食類 ---
  { id: 1, name: "經典排骨便當", category: "飯", price: 95, description: "香酥排骨搭配豐富三樣配菜，飽足感滿分！" },
  { id: 2, name: "酥炸大雞腿便當", category: "飯", price: 110, description: "外皮金黃酥脆、肉汁滿溢的大雞腿飯。" },
  { id: 3, name: "招牌滷肉飯套餐", category: "飯", price: 80, description: "鹹香濃郁的滷肉飯，附滷蛋和油豆腐。" },
  { id: 4, name: "韓式石鍋拌飯", category: "飯", price: 130, description: "香辣過癮的泡菜與豐富蔬菜，微焦鍋巴超香！" },
  { id: 5, name: "肉絲蛋炒飯", category: "飯", price: 85, description: "大火快炒、粒粒分明的傳統台式家常炒飯。" },
  { id: 6, name: "日式咖哩豬排飯", category: "飯", price: 135, description: "濃郁日式甜咖哩醬汁搭配厚切香脆豬排。" },
  { id: 7, name: "健康低卡舒肥雞胸餐盒", category: "飯", price: 120, description: "少油少鹽、高蛋白低負擔的健康之選。" },
  { id: 8, name: "廣式燒臘三寶飯", category: "飯", price: 115, description: "油雞、叉燒與燒鴨的三重美味滿足。" },

  // --- 麵食類 ---
  { id: 9, name: "紅燒牛肉麵", category: "麵", price: 140, description: "濃郁醇厚的紅燒湯頭，大塊入味的牛腱肉。" },
  { id: 10, name: "麻醬乾麵＋貢丸湯", category: "麵", price: 75, description: "香氣撲鼻的古早味芝麻醬與彈牙手工貢丸湯。" },
  { id: 11, name: "台南鍋燒意麵", category: "麵", price: 85, description: "熱騰騰的柴魚高湯，附蝦子、蛤蜊與吸飽湯汁的意麵。" },
  { id: 12, name: "日式豚骨叉燒拉麵", category: "麵", price: 150, description: "長時間熬煮的白濁濃郁豚骨湯底與炙燒叉燒。" },
  { id: 13, name: "經典義大利肉醬麵", category: "麵", price: 125, description: "微酸甜的番茄肉醬搭配香濃起司粉。" },
  { id: 14, name: "早餐店鐵板麵加蛋套餐", category: "麵", price: 60, description: "黑胡椒或蘑菇醬鐵板麵，配上一顆半熟荷包蛋。" },
  { id: 15, name: "溫州大餛飩麵", category: "麵", price: 90, description: "皮薄餡多的大餛飩，湯清味鮮清爽不油膩。" },

  // --- 其他類 ---
  { id: 16, name: "高麗菜鮮肉水餃 (10顆)", category: "其他", price: 70, description: "皮薄餡香的多汁水餃，沾上蒜蓉醬油剛剛好。" },
  { id: 17, name: "脆皮鍋貼 (10顆) ＋ 冰豆漿", category: "其他", price: 85, description: "煎得底部金黃酥脆的鍋貼，配上一杯香濃豆漿。" },
  { id: 18, name: "潛艇堡輕食套餐", category: "其他", price: 130, description: "自選麵包夾滿新鮮生菜與低脂肉品，健康清爽。" },
  { id: 19, name: "美式雙層牛肉起司堡套餐", category: "其他", price: 145, description: "厚實多汁的漢堡肉與濃郁融化起司，附金黃薯條。" },
  { id: 20, name: "百元精緻個人小火鍋", category: "其他", price: 160, description: "豐富肉片與火鍋料蔬菜，冷氣房裡的極致享受。" }
];

// ==============================================================================
// 2. 狀態記錄變數
// 用來記錄「上一次抽中了哪一道餐點」，確保抽籤結果不會連續重複！
// ==============================================================================
let lastPickedMealId = null;

// ==============================================================================
// 3. 取得 HTML 中的網頁元素 (DOM 元素)
// ==============================================================================
const drawBtn = document.getElementById("draw-btn");         // 「幫我決定！」按鈕
const redrawBtn = document.getElementById("redraw-btn");     // 「再抽一次！」按鈕
const resultSection = document.getElementById("result-section"); // 結果外層區塊
const mealCard = document.getElementById("meal-card");       // 餐點結果卡片
const emptyState = document.getElementById("empty-state");   // 找不到餐點的提示卡片

// 顯示資訊的文字標籤
const mealCategoryEl = document.getElementById("meal-category");
const mealNameEl = document.getElementById("meal-name");
const mealPriceEl = document.getElementById("meal-price");
const mealDescEl = document.getElementById("meal-desc");

// ==============================================================================
// 4. 輔助函式：取得目前使用者勾選的條件
// ==============================================================================

/**
 * 取得目前選取的預算條件 ("100", "150", 或 "all")
 */
function getSelectedBudget() {
  const selected = document.querySelector('input[name="budget"]:checked');
  return selected ? selected.value : "all";
}

/**
 * 取得目前選取的餐點類型 ("飯", "麵", "其他", 或 "all")
 */
function getSelectedCategory() {
  const selected = document.querySelector('input[name="category"]:checked');
  return selected ? selected.value : "all";
}

// ==============================================================================
// 5. 核心抽籤邏輯
// ==============================================================================

/**
 * 根據使用者條件篩選餐點並隨機抽籤
 */
function pickMeal() {
  const selectedBudget = getSelectedBudget();
  const selectedCategory = getSelectedCategory();

  // 第一步：根據預算與類型條件進行篩選 (filter)
  const filteredMeals = MEAL_LIST.filter(meal => {
    // 預算過濾：如果是 "all" 代表不限；否則必須小於等於選取的金額
    const matchBudget = (selectedBudget === "all") || (meal.price <= Number(selectedBudget));

    // 類型過濾：如果是 "all" 代表都可以；否則餐點類別必須相符
    const matchCategory = (selectedCategory === "all") || (meal.category === selectedCategory);

    return matchBudget && matchCategory;
  });

  // 讓結果區塊顯示出來
  resultSection.classList.remove("hidden");

  // 第二步：檢查是否有符合條件的餐點
  if (filteredMeals.length === 0) {
    // 找不到符合的項目，顯示親切的提示
    mealCard.classList.add("hidden");
    emptyState.classList.remove("hidden");
    lastPickedMealId = null; // 重設歷史記錄
    return;
  }

  // 第三步：隨機抽取餐點（具備「防連續重複」機制）
  let candidateMeals = filteredMeals;

  // 當符合條件的餐點有 2 個（含）以上時，排除上一次抽中的那一道
  if (filteredMeals.length >= 2 && lastPickedMealId !== null) {
    const excludedMeals = filteredMeals.filter(m => m.id !== lastPickedMealId);
    // 確保排除後還有餐點可以抽
    if (excludedMeals.length > 0) {
      candidateMeals = excludedMeals;
    }
  }

  // 從候選名單中隨機抽取一個索引
  const randomIndex = Math.floor(Math.random() * candidateMeals.length);
  const pickedMeal = candidateMeals[randomIndex];

  // 記錄本次抽中的餐點 ID，供下次抽籤比對
  lastPickedMealId = pickedMeal.id;

  // 第四步：將抽中的餐點資訊呈現至網頁上
  renderMealResult(pickedMeal);
}

/**
 * 將餐點資訊更新至畫面中
 * @param {Object} meal 抽中的餐點物件
 */
function renderMealResult(meal) {
  // 隱藏找不到餐點的提示，顯示餐點卡片
  emptyState.classList.add("hidden");
  mealCard.classList.remove("hidden");

  // 更新類別標籤文字
  const categoryNames = {
    "飯": "🍚 飯食料理",
    "麵": "🍜 美味麵食",
    "其他": "🥟 特色其他"
  };
  mealCategoryEl.textContent = categoryNames[meal.category] || meal.category;

  // 更新名稱、價格與說明文字
  mealNameEl.textContent = meal.name;
  mealPriceEl.textContent = meal.price;
  mealDescEl.textContent = meal.description;

  // 重新觸發卡片的彈入動畫效果
  mealCard.style.animation = "none";
  // 觸發瀏覽器重繪
  void mealCard.offsetWidth;
  mealCard.style.animation = "popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  // 自動平滑滾動到結果區，讓手機使用者容易看見結果
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ==============================================================================
// 6. 綁定按鈕點擊事件 (Event Listeners)
// ==============================================================================

// 點擊「幫我決定！」按鈕
drawBtn.addEventListener("click", () => {
  pickMeal();
});

// 點擊「再抽一次！」按鈕
redrawBtn.addEventListener("click", () => {
  pickMeal();
});

// 當使用者切換選項時，重設上一次抽中的 ID，讓新的篩選可以重新開始
const radioInputs = document.querySelectorAll('input[type="radio"]');
radioInputs.forEach(input => {
  input.addEventListener("change", () => {
    lastPickedMealId = null;
  });
});
