const menu= document.getElementById("menu");
const cartBtn= document.getElementById("cart-btn");
const cartModal= document.getElementById("cart-modal");
const cartItemsContainer= document.getElementById("cart-items");
const cartTotal= document.getElementById("cart-total");
const checkoutBtn= document.getElementById("checkout-btn");
const closeModalBtn= document.getElementById("close-model-btn");
const cartCounter= document.getElementById("cart-count");
const addressInput= document.getElementById("address");
const addressWarn= document.getElementById("address-warn");

let cart= [];

//ABRIR MODAL
cartBtn.addEventListener('click', function(){
    updateCartModal() //funciona sem estar aqui mas ele adicionou
    cartModal.style.display= "flex";
});

// FECHA O MODAL QUANDO CLICAR FORA
cartModal.addEventListener('click', function(event){
    if(event.target === cartModal){
        cartModal.style.display= "none";
    }
});

//FECHAR O MODAL ATRAVÉS DO BOTÃO
closeModalBtn.addEventListener('click', function(){
    cartModal.style.display= "none";
});

menu.addEventListener('click', function(event){
    let parentButton= event.target.closest(".add-to-cart-btn") //pegando o botão e o icone filho dele 
    // console.log(parentButton);

    if(parentButton){
        const name= parentButton.getAttribute("data-name");
        const price= parseFloat(parentButton.getAttribute("data-price"));
        // console.log(name);
        // console.log(price);

        //ADICIONAR NO CARRINHO
        addToCart(name, price);
    }
});


// FUNÇÃO PARA ADICIONAR NO CARRINHO

function addToCart(name, price){
    const hasItem= cart.find(item=> item.name === name) //verifica se tem algum item com nome name no array 
    if (hasItem){
        //se o item existe aumentar quantidade
        hasItem.quantity++;
    }else{
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal()
}


//ATUALIZAR CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML="";
    let total=0;

    cart.forEach(item => {
        const cartItemElement= document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML=`
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total+= item.price* item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    //Fazendo o valor aparecer já na forma de reais 
    cartTotal.textContent= total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML= cart.length;

}

//Remover produtos
cartItemsContainer.addEventListener('click', function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name= event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index= cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item= cart[index];

        if(item.quantity > 1){
            item.quantity-=1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1); //o splice remove o item do array de acordo com o index
        updateCartModal();
    }


}


addressInput.addEventListener('input', function(event){
    let inputValue= event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }


})

//FINALIZAR PEDIDO
checkoutBtn.addEventListener('click', function(){
    // const isOpen= checkRestaurantOpen();
    // if (isOpen){
    //     alert("RESTAURANTE FECHADO NO MOMENTO!")
    //     return;
    // }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    //Enviar o pedido para api whats
    const cartItems= cart.map((item)=> {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: (${item.price}) |`
        )
    }).join("") //Para juntar todo o array, para que não apareça como array e sim como texto

    const message=encodeURIComponent(cartItems);
    const phone= "(11)98101-4840"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart=[];

    updateCartModal();

    // if(cart.length === 0 ) return; // não fazer nada
    // if(addressInput.value === ""){
    //     addressWarn.classList.remove("hidden");
    //     addressWarn.classList.add("border-red-500");
    //     return;
    // }
})


//Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data= new Date();
    const hora= data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem= document.getElementById("date-span")
const isOpen= checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-500");
}else{
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}