const products = [
  {
    id: "denim-set",
    name: "复古牛仔周末套装",
    desc: "短袖牛仔外套与宽松长裤，一套完成松弛出门。",
    price: 399,
    image: "assets/look-denim.jpg",
    category: "set",
    sizes: ["S", "M", "L"],
    featured: true,
  },
  {
    id: "stripe-vest",
    name: "条纹马甲叠穿上衣",
    desc: "彩色纽扣、细条纹、轻薄层次感。",
    price: 229,
    image: "assets/look-vest.jpg",
    category: "top",
    sizes: ["S", "M", "L"],
  },
  {
    id: "tomato-tee",
    name: "番茄刺绣白 T",
    desc: "果篮刺绣图案，适合做夏季视觉重点。",
    price: 169,
    image: "assets/look-tomato-tee.jpg",
    category: "top",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "knit-cap",
    name: "手工感针织帽",
    desc: "适合配马甲、T 恤和轻复古造型。",
    price: 89,
    image: "assets/look-vest.jpg",
    category: "accessory",
    sizes: ["均码"],
  },
];

const productGrid = document.querySelector("#productGrid");
const bagPanel = document.querySelector("#bagPanel");
const bagItems = document.querySelector("#bagItems");
const bagCount = document.querySelector("#bagCount");
const bagTotal = document.querySelector("#bagTotal");
const openBag = document.querySelector("#openBag");
const closeBag = document.querySelector("#closeBag");
const closeBagBackdrop = document.querySelector("#closeBagBackdrop");
const checkoutButton = document.querySelector("#checkoutButton");
const filterButtons = document.querySelectorAll(".pill");
const visitForm = document.querySelector(".visit-form");

let activeFilter = "all";
let bag = [];

function formatPrice(price) {
  return `¥${price}`;
}

function renderProducts() {
  productGrid.innerHTML = "";
  const visibleProducts = products.filter((product) => activeFilter === "all" || product.category === activeFilter);

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = `product-card${product.featured ? " featured" : ""}`;
    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-meta">
          <div>
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
          </div>
          <strong class="price">${formatPrice(product.price)}</strong>
        </div>
        <div class="size-row" aria-label="${product.name} 尺码">
          ${product.sizes
            .map(
              (size, index) => `
                <label>
                  <input type="radio" name="size-${product.id}" value="${size}" ${index === 0 ? "checked" : ""}>
                  <span>${size}</span>
                </label>
              `
            )
            .join("")}
        </div>
        <button type="button" data-add="${product.id}">加入购物袋</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function renderBag() {
  bagCount.textContent = bag.length;
  bagTotal.textContent = formatPrice(bag.reduce((total, item) => total + item.price, 0));

  if (bag.length === 0) {
    bagItems.innerHTML = `<p class="bag-empty">购物袋还是空的。先挑一件适合今天心情的衣服。</p>`;
    return;
  }

  bagItems.innerHTML = bag
    .map(
      (item) => `
        <div class="bag-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <p>${item.size} / ${formatPrice(item.price)}</p>
          </div>
          <button class="remove-item" type="button" data-remove="${item.key}">移除</button>
        </div>
      `
    )
    .join("");
}

function setBagOpen(isOpen) {
  bagPanel.classList.toggle("open", isOpen);
  bagPanel.setAttribute("aria-hidden", String(!isOpen));
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const product = products.find((item) => item.id === button.dataset.add);
  const selectedSize = productGrid.querySelector(`input[name="size-${product.id}"]:checked`)?.value || product.sizes[0];

  bag.push({
    ...product,
    size: selectedSize,
    key: `${product.id}-${selectedSize}-${Date.now()}`,
  });

  renderBag();
  setBagOpen(true);
});

bagItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  bag = bag.filter((item) => item.key !== button.dataset.remove);
  renderBag();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

openBag.addEventListener("click", () => setBagOpen(true));
closeBag.addEventListener("click", () => setBagOpen(false));
closeBagBackdrop.addEventListener("click", () => setBagOpen(false));

checkoutButton.addEventListener("click", () => {
  if (bag.length === 0) return;
  checkoutButton.textContent = "已提交到店员";
  setTimeout(() => {
    checkoutButton.textContent = "提交订单";
  }, 1800);
});

visitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = visitForm.querySelector("button");
  button.textContent = "预约已记录";
  setTimeout(() => {
    button.textContent = "预约试穿";
    visitForm.reset();
  }, 1800);
});

renderProducts();
renderBag();
