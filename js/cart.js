const cart = function() {

    const cartBtn = document.querySelector('.button-cart');
    const cart = document.querySelector('#modal-cart');
    const cartClose = document.querySelector('.modal-close');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form');
    const sumTotal = document.querySelector(".card-table__total");

    const modalFormName = document.querySelector('[name="nameCustomer"]');
    const modalFormPhone = document.querySelector("[name='phoneCustomer']");


    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.filter(good => {
            return good.id !== id;
        });

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    };

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const newCart = cart.map(good => {
            if (good.id === id) {
                good.count++;
            }
            return good;
        });
        
        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    };

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const newCart = cart.map(good => {
            if (good.id === id) {
                if (good.count > 0) {
                    good.count--;
                }
            }
            return good;
        });
        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    };

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'));
        const clickedGood = goods.find(good => good.id === id);
        const cart = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : [];

        if (cart.some(good => good.id === clickedGood.id)) {
            console.log(1);
            cart.map(good => {
                if (good.id === clickedGood.id) {
                    good.count++;
                }
                return good;
            });
        } else {
            console.log(2);
            clickedGood.count = 1;
            cart.push(clickedGood);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };  

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = '';

        goods.forEach(good => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus"">-</button></td>
                <td>${good.count}</td>
                <td><button class="cart-btn-plus"">+</button></td>
                <td data-totalPrice="">${+good.price * +good.count}$</td>
                <td><button class="cart-btn-delete"">x</button></td>
            `;
            cartTable.append(tr);

            tr.addEventListener('click', (e) => {
                if (event.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id);
                } else if (event.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id);
                } else if (event.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id);
                }
            });
            let totalPrice = +0;
                goods.forEach((item) => {
                    const priceElem = item.price * item.count;
                    totalPrice += priceElem;
                });
            sumTotal.innerText = totalPrice + "$";
        });
    };

    const sendForm = (formName, formPhone) => {
        const cartArray = localStorage.getItem('cart') ?
        JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify ({
                cart: cartArray,
                name: formName,
                phone: formPhone
            })
        }).then(() => {
            modalFormName.value = "";
            modalFormPhone.value = "";
            localStorage.removeItem("cart");
            cart.style.display = '';
        });
    };

    modalForm.addEventListener('submit', (e) => {
        event.preventDefault();

        const formName = modalFormName.value;
        const formPhone = +modalFormPhone.value;

        sendForm(formName, formPhone);
    });

    cartBtn.addEventListener('click', function() {
        const cartArray = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : [];

        renderCartGoods(cartArray);

        cart.style.display = 'flex';
    });

    cartClose.addEventListener('click', function() {
        cart.style.display = '';
    });

    cart.addEventListener('click', (event) => {
        if (!event.target.closest('.modal') && event.target.classList.contains('.overlay')) {
            cart.stlyle.display = '';
        }
    });

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {
            if (event.target.closest('.add-to-cart')) {
                const buttonToCart = event.target.closest('.add-to-cart');
                const goodId = buttonToCart.dataset.id;
                addToCart(goodId);
            }
        });
    }


};

cart();