$(".open").click(function () {

	$(".producstOnCart").show(800);

});

$('#closeButton').click(function () {
	$('.producstOnCart').hide();
})

$("#slider").addClass('ready');

$("#right").click(function () {
	var active, slides;

	if ($("#slider").hasClass('ready')) {
		$("#slider").toggleClass('ready not-ready');
		slides = $(".slide", "#slider");
		active = $(".slide.active", "#slider");
		active.addClass('leaving-active');
		if (slides.filter(':last').hasClass('active')) {
			slides.filter(':first').addClass('active');
		} else {
			active.next().addClass('active');
		}
		return setTimeout(function () {
			active.removeClass('active leaving-active');
			return $("#slider").toggleClass('not-ready ready');
		}, 1000);
	}
}); 


const time = 3;
function animate() {
	

  setTimeout(() => {
	
    requestAnimationFrame(animate);
  }, 6000 / time);
  $('#right').trigger('click');
}
animate();


let productsInCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
if (!productsInCart) {
	productsInCart = [];
}
const parentElement = document.querySelector('#buyItems');
const cartSumPrice = document.querySelector('#sum-prices');
const products = document.querySelectorAll('.product-under');



const countTheSumPrice = function () {
	let sum = 0;
	productsInCart.forEach(item => {
		sum += item.price;
	});
	return sum;
}

const updateShoppingCartHTML = function () {
	sessionStorage.setItem('shoppingCart', JSON.stringify(productsInCart));
	let updatedProductsInCartItem = JSON.parse(sessionStorage.getItem("shoppingCart"));

	if (updatedProductsInCartItem.length > 0) {
		let result = updatedProductsInCartItem.map(product => {
			return `
				<li class="buyItem">
					<img id="buyImg"src="${product.image}">
					<div>
						<h5 >${product.name}</h5>
						<h6 class="p-price">₹${product.price}</h6>
						<div>
							<button class="button-minus" data-id=${product.id}>-</button>
							<span class="countOfProduct">${product.count}</span>
							<button class="button-plus" data-id=${product.id}>+</button>
						</div>
					</div>
				</li>`
		});
		parentElement.innerHTML = result.join('');
		document.querySelector('.checkout').classList.remove('hidden');
		cartSumPrice.innerHTML = '₹' + countTheSumPrice();


	}
	else {
		document.querySelector('.checkout').classList.add('hidden');
		parentElement.innerHTML = '<h4 class="empty">Your shopping cart is empty</h4>';
		cartSumPrice.innerHTML = '';
	}
	return
}
updateShoppingCartHTML();

function updateProductsInCart(product) {

	for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id == product.id) {
			productsInCart[i].count += 1;
			productsInCart[i].price = productsInCart[i].basePrice * productsInCart[i].count;

			return;
		}
	}

	productsInCart.push(product);
	//sessionStorage.setItem('shoppingCart', JSON.stringify(productsInCart));

	
}

products.forEach(item => {   // 1
	item.addEventListener('click', (e) => {
		if (e.target.classList.contains('addToCart')) {
            
			const productID = e.target.dataset.productId ;
			const productName = item.querySelector('.productName').innerHTML;
			const productPrice = item.querySelector('.priceValue').innerHTML;
			const productImage = item.querySelector('img').src;
		
			let product = {
				name: productName,
				image: productImage,
				id: productID,
				count: 1,
				price: +productPrice,
				basePrice: +productPrice,
			}
			updateProductsInCart(product);
			updateShoppingCartHTML();

		}

	});

});

parentElement.addEventListener('click', (e) => {

	const isPlusButton = e.target.classList.contains('button-plus');
	const isMinusButton = e.target.classList.contains('button-minus');


	if (isPlusButton || isMinusButton) {
		for (let i = 0; i < productsInCart.length; i++) {
			
			if (productsInCart[i].id == e.target.dataset.id){
				if (isPlusButton) {

					productsInCart[i].count += 1

				}
				else if (isMinusButton) {
				
					productsInCart[i].count -= 1

				}
				productsInCart[i].price = productsInCart[i].basePrice * productsInCart[i].count;

			}
			if (productsInCart[i].count <= 0) {
			
				productsInCart.splice(i, 1);

			}

		}
		updateShoppingCartHTML();
	}
});



