const logoutButton = document.getElementById('logout');

// if (!document.cookie.includes('authorization')) {
//   alert('로그인 후 이용 가능합니다.');
//   // window.location.href = 'http://localhost:5500/html/index.html';
// }

// 회원 로그인 여부 체크
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // 회원정보 조회 API 실행
    const response = await axios.get('http://localhost:3000/user', {
      withCredentials: true,
    });

    $nicknameFix.innerText = response.data.data.nickname;
  } catch (err) {
    // 오류 처리
    alert(`${err.response.data.message}`);
    if (err.response.data.message === "로그인을 진행해주세요.") {
      window.location.href = "http://localhost:5500/html/index.html";
    }
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    const response = await axios.post(`http://localhost:3000/auth/logout`, {}, { withCredentials: true });
    alert('로그아웃 성공');
    window.location.href = 'http://localhost:5500/html/index.html'; // 수정할 URL로 변경 필요
  } catch (err) {
    // 오류 처리
    alert('오류발생: ' + err);
  }
});
