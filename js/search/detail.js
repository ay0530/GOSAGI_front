const productQuestionButton = document.getElementById('product-question-button');

const thumbnail = document.getElementById('product-thumbnail');
const basicInfo = document.getElementById('product-basic-info');

const productDetail = document.getElementById('product-detail');
const productTotalPrice = document.getElementById('product-total-price');

const productReview = document.getElementById('product-review');
const wishDiv = document.getElementById('wish-div');

const quantity = document.getElementById('quantity');
const quantityDecreaseBtn = document.getElementById('quantity-decrease-btn');
const quantityIncrementBtn = document.getElementById('quantity-increment-btn');

let isMyWish = false;
let myWishId;

const countDiv = document.getElementById('count-div');
const countProductName = document.getElementById('count-product-name');
const addCartButton = document.getElementById('add-cart-button');
const purchaseButton = document.getElementById('purchase-button');

const address = document.getElementById('address');
const addressSearchBtn = document.getElementById('address-search-btn');

document.addEventListener('DOMContentLoaded', async function () {
  await quantityBtn();
});

wishDiv.addEventListener('click', async function (event) {
  let clickedElementId = event.currentTarget.id;
  if (isMyWish === false) {
    console.log('찜없음');
    try {
      await axios.post(`http://localhost:3000/wish`, { product_id: productId }, { withCredentials: true });
      alert('찜하기 성공');
      const wish = await getProductWish(productId);
      generateProductWish(wish);
    } catch (err) {
      alert('오류발생: ' + err);
    }
  } else if (isMyWish === true) {
    console.log('찜있음');
    try {
      await axios.delete(`http://localhost:3000/wish/${myWishId}`, { withCredentials: true });
      alert('찜취소 성공');
      const wish = await getProductWish(productId);
      generateProductWish(wish);
    } catch (err) {
      alert('오류발생: ' + err);
    }
  }
});

export const generateProductCard = async (product, reviews) => {
  const donateValue = Math.ceil(product.point / 3) * 10;
  const detailContent = product.productContent[0].content;
  const imgFixedContent = detailContent.replaceAll('src="/upload', 'src="https://ilovegohyang.go.kr/upload');
  const embedFixedContent = imgFixedContent.replaceAll('watch?v=-', 'embed/');

  let pushCart = '';
  if (product.store_id === 1 || product.store_id === 2) {
    pushCart = 'hidden ';
    addCartButton.style.display = 'none';
    purchaseButton.style.display = 'none';
    countDiv.style.display = 'none';
  }

  let review_average_rate = 0;
  if (reviews.review_average_rate !== null) {
    review_average_rate = reviews.review_average_rate;
  }

  // thumbnail.innerHTML = `<img src="${product.productThumbnail[0].image_url}" class="aspect-square object-contain object-center w-full overflow-hidden max-md:max-w-full" />
  // <div class="flex gap-5 flex-row overflow-auto mx-auto">
  //   <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/def2e378aa743fbc0525c087abe01d089289a4b23fd4da7f6ec7d5c22ead355f?" class="aspect-[0.54] object-contain object-center w-[7px] stroke-[1.5px] stroke-black overflow-hidden self-center shrink-0 max-w-full my-auto" />
  //   <img loading="lazy" src="../../sourse/image/sample.png" class="aspect-square object-contain object-center w-[45px] overflow-hidden self-stretch shrink-0 max-w-full" />
  //   <img loading="lazy" src="../../sourse/image/sample.png" class="aspect-square object-contain object-center w-[45px] overflow-hidden self-stretch shrink-0 max-w-full" />
  //   <img loading="lazy" src="../../sourse/image/sample.png" class="aspect-square object-contain object-center w-[45px] overflow-hidden self-stretch shrink-0 max-w-full" />
  //   <img loading="lazy" src="../../sourse/image/sample.png" class="aspect-square object-contain object-center w-[45px] overflow-hidden self-stretch shrink-0 max-w-full" />
  //   <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e665837b135b992643a03878e60fe369904b32f45282902b681e572d86844c1f?" class="aspect-[0.46] object-contain object-center w-1.5 stroke-[1.5px] stroke-black overflow-hidden self-center shrink-0 max-w-full my-auto" />
  // </div>`;
  console.log(product);
  // thumbnail.innerHTML = product.productThumbnail
  //   .map((Thumbnail) => {
  //     return `<div class="hidden duration-700 ease-in-out" data-carousel-item>
  //               <img src="${Thumbnail.image_url}" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
  //             </div>`;
  //   })
  //   .join('');
  basicInfo.innerHTML = `<div id="product-name" class="text-black text-3xl font-bold max-md:max-w-full font-['Inter']">${product.name}</div>
  <div class="text-zinc-500 text-xl mt-3.5 max-md:max-w-full font-['Inter']">${product.description}</div>
  <div class="bg-stone-300 self-stretch shrink-0 h-px my-14"></div>
  <div class="justify-center items-stretch flex gap-0 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
    <div class="justify-center text-red-500 text-2xl font-bold whitespace-nowrap font-['Inter']">${product.point.toLocaleString()}</div>
    <div class="text-zinc-500 text-base mt-2.5 self-start font-['Inter']">&nbsp기부포인트&nbsp</div>
    <div class="text-zinc-500 text-base grow shrink basis-auto mt-2.5 self-start max-md:max-w-full">
      (
      <span class="font-bold font-['Inter']">${donateValue.toLocaleString()}</span>
      원 기부하면
      <span class="font-bold font-['Inter']">${product.point.toLocaleString()}</span>
      포인트를 얻을 수 있어요)
    </div>
  </div>
  <div class="${pushCart}justify-center items-stretch flex gap-0 mt-3 self-start">
    <div id="product-price" class="justify-center text-black text-2xl font-bold grow whitespace-nowrap font-['Inter']">${product.price.toLocaleString()}</div>
    <div class="text-zinc-500 text-base grow whitespace-nowrap mt-2.5 self-start font-['Inter']">&nbsp실구매가&nbsp</div>
  </div>
  <div class="items-stretch flex gap-3 mt-3 self-start">
    <div class="justify-center items-stretch flex gap-1">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef54c7d82651c6268e8ccb64862f2bfb330e69206475f1633c80e2c09f237a46?" class="aspect-[1.11] object-contain object-center w-5 fill-black overflow-hidden shrink-0 max-w-full" />
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef54c7d82651c6268e8ccb64862f2bfb330e69206475f1633c80e2c09f237a46?" class="aspect-[1.11] object-contain object-center w-5 fill-black overflow-hidden shrink-0 max-w-full" />
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef54c7d82651c6268e8ccb64862f2bfb330e69206475f1633c80e2c09f237a46?" class="aspect-[1.11] object-contain object-center w-5 fill-black overflow-hidden shrink-0 max-w-full" />
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef54c7d82651c6268e8ccb64862f2bfb330e69206475f1633c80e2c09f237a46?" class="aspect-[1.11] object-contain object-center w-5 fill-black overflow-hidden shrink-0 max-w-full" />
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef54c7d82651c6268e8ccb64862f2bfb330e69206475f1633c80e2c09f237a46?" class="aspect-[1.11] object-contain object-center w-5 fill-black overflow-hidden shrink-0 max-w-full" />
      <div class="text-red-500 text-base font-['Inter']">&nbsp;${review_average_rate}</div>
    </div>
  </div>
  <div class="bg-stone-300 self-stretch shrink-0 h-px my-14"></div>
  <div class="text-zinc-500 text-base self-start max-md:mt-10 font-['Inter']">판매자 : 판매자 샘플</div>
  <div class="text-zinc-500 text-base mt-2.5 self-start font-['Inter']">배송방법 : 택배(우체국택배)</div>
  <div class="text-zinc-500 text-base mt-2.5 self-start font-['Inter']">배송비 : 무료</div>
  
`;
  countProductName.innerHTML = `<div class="text-black text-base max-md:max-w-full font-['Inter']">${product.name}</div>`;
  productDetail.innerHTML = `<div class="mt-12 flex justify-center">${embedFixedContent}</div>`;
  productReview.innerHTML = `상품후기 (총 <span class="text-orange-400">${reviews.data.length}</span>건)`;
  productTotalPrice.innerText = product.price.toLocaleString();
};

export const generateProductReviews = async (reviews) => {
  if (reviews.review_length === 0) {
    return;
  }
  const productReviewTable = document.getElementById('product-review-table');
  productReviewTable.innerHTML = reviews.data
    .map((review) => {
      return `<tr class="bg-white border-b ">
      <th scope="row" class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap font-['Inter']">
        <div class="flex mb-5 justify-center items-center">
          <svg class="w-4 h-4 ms-1 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg class="w-4 h-4 ms-1 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg class="w-4 h-4 ms-1 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg class="w-4 h-4 ms-1 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg class="w-4 h-4 ms-1 text-gray-300 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        </div>
      </th>
      <td class="px-6 py-4 font-['Inter'] text-center">장충동 왕족발 보싸아암</td>
      <td class="px-6 py-4 font-['Inter'] text-center">정창일</td>
      <td class="w-1/5 px-6 py-4 font-['Inter'] text-center flex-col justify-center items-center">2024-01-01</td>
    </tr>`;
    })
    .join('');
};

export const generateProductQuestions = async (questions) => {
  console.log(questions);
  if (questions.length === 0) {
    return;
  }
  for (let i = 0; i < questions.length; i++) {
    questions[i].number = i + 1;
  }
  const productQuestionTable = document.getElementById('product-question-table');
  productQuestionTable.innerHTML = questions
    .map((question) => {
      let waitAnswer = '';
      let completeAnswer = 'hidden ';
      if (question.status === '답변완료') {
        waitAnswer = 'hidden ';
        completeAnswer = '';
      }
      let isPrivate = 'hidden';
      if (question.question.is_private === true) {
        isPrivate = '';
      }
      return `<tr class="bg-white border-b ">
      <th scope="row" class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap font-['Inter']">${question.number}</th>
      <td class="flex justify-center items-center px-6 py-4 font-['Inter'] text-center">\
      <div class="${isPrivate}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>  
      </div>
      <div>&nbsp;&nbsp;${question.question.title}</div>
      </td>
      <td class="px-6 py-4 font-['Inter'] text-center">${question.question.user_id}</td>
      <td class="px-6 py-4 font-['Inter'] text-center">${question.question.created_at.slice(0, 10)}</td>
      <td class="w-1/5 px-6 py-4 font-['Inter'] text-center flex-col justify-center items-center">
        <button class="h-5 w-1/2 ${completeAnswer}justify-center hover:bg-orange-400 hover:text-white text-xs border border-orange-400 text-orange-400 text-center bg-white items-center rounded-lg max-md:max-w-full max-md:px-5 font-['Inter']">답변완료</button>
        <button class="h-5 w-1/2 ${waitAnswer}justify-center hover:bg-gray-400 hover:text-white text-xs border border-gray-400 text-gray-400 text-center bg-white items-center rounded-lg max-md:max-w-full max-md:px-5 font-['Inter']">답변대기</button>
      </td>
    </tr>`;
    })
    .join('');
};

export const generateProductWish = async (wish) => {
  let fill = 'none';
  let stroke = 'currentColor';

  if (wish.isMyWish === true) {
    fill = '#ff0000';
    stroke = '#ff0000';
    isMyWish = true;
    myWishId = wish.myWishId;
  } else {
    isMyWish = false;
  }

  wishDiv.innerHTML = `<div title="wish-${wish.isMyWish}=${wish.myWishId}">
  <svg id="wish-${wish.isMyWish}=${wish.myWishId}" xmlns="http://www.w3.org/2000/svg" fill="${fill}" viewBox="0 0 24 24" stroke-width="1.5" stroke="${stroke}" class="w-6 h-6">
    <path id="path-wish-${wish.isMyWish}=${wish.myWishId}" stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
  </div>
  <div title="wish-${wish.isMyWish}=${wish.myWishId}" class="justify-center text-black text-center text-xs self-stretch whitespace-nowrap font-['Inter']">${wish.wishes_count}</div>
  `;
};

// 쿼리 스트링 가져오기
let queryString = window.location.search;
let searchParams = new URLSearchParams(queryString);
let productId = parseInt(searchParams.get('productId'));

export async function getProduct(productId) {
  try {
    // axios를 사용하여 로그인 API 실행
    const response = await axios.get(`http://localhost:3000/goods/detail/${productId}`, { withCredentials: true });
    return response.data.data;
  } catch (err) {
    // 오류 처리
    alert(err);
  }
}

export async function getProductReview(productId) {
  try {
    // axios를 사용하여 로그인 API 실행
    const review = await axios.get(`http://localhost:3000/review/product/${productId}`, { withCredentials: true });
    return review.data.data;
  } catch (err) {
    // 오류 처리
    alert('오류발생: ' + err);
  }
}

export async function getProductQuestion(productId) {
  try {
    // axios를 사용하여 로그인 API 실행
    const questions = await axios.get(`http://localhost:3000/question/productList/${productId}`, { withCredentials: true });
    return questions.data.data;
  } catch (err) {
    // 오류 처리
    alert('오류발생: ' + err);
  }
}

export async function getProductWish(productId) {
  try {
    // axios를 사용하여 로그인 API 실행
    const wishCount = await axios.get(`http://localhost:3000/wish/${productId}`, { withCredentials: true });
    return wishCount.data.data;
  } catch (err) {
    // 오류 처리
    alert('오류발생: ' + err);
  }
}

const product = await getProduct(productId);
const reviews = await getProductReview(productId);
const questions = await getProductQuestion(productId);
const wish = await getProductWish(productId);

generateProductCard(product, reviews);
generateProductQuestions(questions);
generateProductReviews(reviews);
generateProductWish(wish);

productQuestionButton.addEventListener('click', async () => {
  const title = document.getElementById('question-title').value;
  const content = document.getElementById('question-content').value;
  const isPrivate = document.getElementById('secret').checked;
  try {
    await axios.post(
      `http://localhost:3000/question`,
      {
        productId,
        title,
        content,
        isPrivate,
      },
      { withCredentials: true },
    );
    alert('문의글 등록 성공');
    location.reload();
  } catch (err) {
    alert('오류발생: ' + err);
  }
});

addCartButton.addEventListener('click', async () => {
  createCart();
});

// 장바구니에 추가하기
async function createCart() {
  const quantity = document.getElementById('quantity').value;
  try {
    const responseCart = await axios.post(
      `http://localhost:3000/cart`,
      {
        product_id: productId,
        quantity: quantity,
      },
      {
        withCredentials: true,
      },
    );
    alert(responseCart.data.message);
    window.location.href = 'http://localhost:5500/html/mypage/cart.html';
  } catch (err) {
    alert(responseCart.data.message);
  }
}

// 수량 증가 버튼 함수
async function quantityBtn() {
  const productPrice = document.getElementById('product-price');

  // 수량 증가 버튼
  quantityIncrementBtn.addEventListener('click', function () {
    const currentQuantity = Number(quantity.value);
    quantity.value = currentQuantity + 1;

    productTotalPrice.innerText = Number(quantity.value * productPrice.innerText.replace(/,/g, '')).toLocaleString('ko-KR');
  });

  // 수량 감소 버튼
  quantityDecreaseBtn.addEventListener('click', function () {
    const currentQuantity = Number(quantity.value);
    if (currentQuantity > 1) {
      quantity.value = currentQuantity - 1;

      productTotalPrice.innerText = Number(quantity.value * productPrice.innerText.replace(/,/g, '')).toLocaleString('ko-KR');
    }
  });
}

// 바로구매 버튼 클릭
purchaseButton.addEventListener('click', function () {
  drawCart();
});

// 주문 내역 조회(결제 전)
async function drawCart() {
  const productName = document.getElementById('product-name');

  const cartModalProductName = document.getElementById('cart-modal-product-name');
  const cartModalQuantity = document.getElementById('cart-modal-quantity');
  const cartModalTotalPrice = document.getElementById('cart-modal-total-price');

  cartModalProductName.value = productName.innerText;
  cartModalQuantity.value = quantity.value;
  cartModalTotalPrice.value = productTotalPrice.innerText;
}

// 주소 검색
addressSearchBtn.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ''; // 주소 변수
      var extraAddr = ''; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === 'R') {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        document.getElementById('sample6_extraAddress').value = extraAddr;
      } else {
        document.getElementById('sample6_extraAddress').value = '';
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById('sample6_postcode').value = data.zonecode;
      document.getElementById('sample6_address').value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById('sample6_detailAddress').focus();
    },
  }).open();
});
async function getPostcode() {}
