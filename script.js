/* ================================
   KGOTHATSO STREETWEAR
   Shopping Cart System
================================ */

let cart = JSON.parse(localStorage.getItem("kgothatsoCart")) || [];


// ================================
// SAVE CART
// ================================

function saveCart() {
    localStorage.setItem(
        "kgothatsoCart",
        JSON.stringify(cart)
    );
}


// ================================
// UPDATE CART COUNT
// ================================

function updateCartCount() {

    const cartCount = document.querySelector(".cart span");

    if (cartCount) {
        const totalItems = cart.reduce(
            (total, product) => total + product.quantity,
            0
        );

        cartCount.textContent = totalItems;
    }
}


// ================================
// ADD PRODUCT
// ================================

function addToCart(product) {

    // Check whether product already exists
    const existingProduct = cart.find(
        item => item.name === product.name
    );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        product.quantity = 1;

        cart.push(product);

    }


    saveCart();

    updateCartCount();

    alert(product.name + " has been added to your cart!");
}


// ================================
// ADD BUTTONS
// ================================

const addButtons =
    document.querySelectorAll(".add-cart");


addButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const productCard =
            button.closest(".shop-product");


        const name =
            productCard.querySelector("h3").textContent;


        const priceText =
            productCard.querySelector(".price").textContent;


        const price =
            parseFloat(
                priceText
                    .replace("R", "")
                    .replace(",", "")
            );


        const image =
            productCard
                .querySelector("img")
                .getAttribute("src");


        const product = {
            name: name,
            price: price,
            image: image
        };


        addToCart(product);

    });

});


// ================================
// DISPLAY CART
// ================================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");


    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems || !cartTotal) {
        return;
    }


    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <h2>Your cart is empty.</h2>

                <p>
                    Looks like you haven't added
                    anything yet.
                </p>

                <a href="shop.html"
                   class="shop-button">
                    START SHOPPING →
                </a>

            </div>
        `;

        cartTotal.textContent = "R0.00";

        return;
    }


    cartItems.innerHTML = "";

    let total = 0;


    // Display every product
    cart.forEach((product, index) => {

        const productTotal =
            product.price * product.quantity;


        total += productTotal;


        const item =
            document.createElement("div");


        item.className = "cart-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="cart-item-info">

                <h3>${product.name}</h3>

                <p>
                    R${product.price.toFixed(2)}
                </p>

            </div>


            <div class="quantity-control">

                <button
                    onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>
                    ${product.quantity}
                </span>

                <button
                    onclick="changeQuantity(${index}, 1)">
                    +
                </button>

            </div>


            <strong class="item-total">
                R${productTotal.toFixed(2)}
            </strong>


            <button
                class="remove-item"
                onclick="removeFromCart(${index})">

                REMOVE

            </button>

        `;


        cartItems.appendChild(item);

    });


    cartTotal.textContent =
        "R" + total.toFixed(2);
}


// ================================
// CHANGE QUANTITY
// ================================

function changeQuantity(index, change) {

    cart[index].quantity += change;


    // Remove product when quantity reaches zero
    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCartCount();

    displayCart();
}


// ================================
// REMOVE PRODUCT
// ================================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    updateCartCount();

    displayCart();
}


// ================================
// CHECKOUT
// ================================

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Add a product first."
        );

        return;
    }


    alert(
        "Checkout is coming soon! 🚀"
    );
}


// ================================
// START
// ================================

updateCartCount();

displayCart();




/* =========================
   CHECKOUT PAGE
========================= */

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutDelivery =
    document.getElementById("checkoutDelivery");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const deliverySelect =
    document.getElementById("delivery");

const checkoutForm =
    document.getElementById("checkoutForm");



/* =========================
   DISPLAY ORDER
========================= */

if (checkoutItems) {

    const cart =
        JSON.parse(
            localStorage.getItem("kgothatsoCart")
        ) || [];


    let subtotal = 0;


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>

            <br>

            <a href="shop.html">
                ← Continue Shopping
            </a>
        `;

    } else {


        cart.forEach(product => {


            const itemTotal =
                product.price *
                product.quantity;


            subtotal += itemTotal;


            checkoutItems.innerHTML += `

                <div class="checkout-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="checkout-item-info">

                        <h4>
                            ${product.name}
                        </h4>

                        <p>
                            ${product.quantity}
                            × R${product.price.toFixed(2)}
                        </p>

                    </div>

                    <strong>
                        R${itemTotal.toFixed(2)}
                    </strong>

                </div>

            `;

        });

    }



    /* =========================
       UPDATE TOTAL
    ========================== */

    function updateCheckoutTotal() {


        const deliveryCost =
            Number(deliverySelect.value);


        checkoutSubtotal.textContent =
            subtotal.toFixed(2);


        checkoutDelivery.textContent =
            deliveryCost.toFixed(2);


        checkoutTotal.textContent =
            (subtotal + deliveryCost).toFixed(2);

    }



    if (deliverySelect) {

        deliverySelect.addEventListener(
            "change",
            updateCheckoutTotal
        );

    }


    updateCheckoutTotal();

}



/* =========================
   SUBMIT ORDER
========================= */

if (checkoutForm) {


    checkoutForm.addEventListener(
        "submit",
        function(event) {


            event.preventDefault();


            const cart =
                JSON.parse(
                    localStorage.getItem("kgothatsoCart")
                ) || [];


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                window.location.href =
                    "shop.html";

                return;

            }



            /* CHECK PAYMENT PROOF */

            const paymentProof =
                document.getElementById(
                    "paymentProof"
                );


            if (
                !paymentProof ||
                paymentProof.files.length === 0
            ) {

                alert(
                    "Please upload your payment proof."
                );

                return;

            }



            /* GENERATE ORDER NUMBER */

            const orderNumber =
                "KG" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );



            /* SAVE ORDER NUMBER */

            localStorage.setItem(
                "lastOrderNumber",
                orderNumber
            );



            /*
               PAYMENT IS NOT AUTOMATICALLY
               VERIFIED.
            */

            alert(
                "ORDER SUBMITTED! 🎉\n\n" +

                "Order Number: " +
                orderNumber +

                "\n\n" +

                "Your payment proof has been selected.\n" +

                "Payment must be verified before " +
                "your order is released for collection " +
                "or delivery."
            );



            /* EMPTY CART */

            localStorage.removeItem(
                "kgothatsoCart"
            );



            /* RETURN HOME */

            window.location.href =
                "index.html";

        }
    );

}
