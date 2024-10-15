var openRule = document.getElementById("openRule");
var closeRule = document.getElementById("closeRule");
var ruleContainer = document.getElementById("ruleContainer");
var winnerContainer = document.querySelector(".winner-container");
var buttons = document.querySelectorAll("button");
var trickContainer = document.getElementById("tricks");

var tricksList = [
  {
    img: "./img/trick1.png",
    alt: "trick1",
    desc: "'Ô trống cuối cùng'là kỹ thuật giải Sudoku cơ bản. Kỹ thuật này khá đơn giản và dựa trên quy tắc là mỗi khối 3 × 3, cột dọc hoặc hàng ngang trên lưới Sudoku cần chứa các số từ 1 đến 9 và mỗi số chỉ có thể được sử dụng một lần trong khối 3 × 3, cột dọc hoặc hàng ngang",
  },
  {
    img: "./img/trick2.png",
    alt: "trick2",
    desc: "'Số khả thi còn lại' là một chiến lược đơn giản phù hợp cho những người mới bắt đầu. Kỹ thuật này dựa trên việc tìm số còn thiếu. Để tìm số còn thiếu, bạn nên để ý đến các số đã được điền sẵn trong khối 3x3 mà bạn quan tâm, cũng như trong các hàng và cột được kết nối với nó",
  },
  {
    img: "./img/trick3.png",
    alt: "trick3",
    desc: "Chiến lược này dựa trên việc điền đúng vị trí của các Ghi chú. Đôi khi nó được gọi là chiến lược Số duy nhất khả dĩ. Vấn đề là trong một ô cụ thể chỉ có thể có một số.",
  },
  {
    img: "./img/trick4.png",
    alt: "trick4",
    desc: "Giống như kỹ thuật 'Số lẻ hiển nhiên', kỹ thuật 'Cặp số hiển nhiên' dựa trên việc điền đúng vị trí của các Ghi chú. Vấn đề là ở chỗ bạn nên tìm 2 ô có các cặp Ghi chú giống nhau trong khối 3x3. Điều này có nghĩa là các cặp Ghi chú này không thể được sử dụng trong các ô khác trong khối 3x3 này. Vì vậy, bạn có thể xóa chúng khỏi Ghi chú của mình. Hãy tham khảo ví dụ sau đây để hiểu rõ hơn chiến thuật này",
  },
  {
    img: "./img/trick5.png",
    alt: "trick5",
    desc: "Kỹ thuật giải Sudoku này được phát triển dựa trên kỹ thuật trước đó - 'Cặp số hiển nhiên'. Nhưng kỹ thuật 'Bộ ba hiển nhiên' không dựa trên hai số từ Ghi chú, kỹ thuật này dựa trên ba số. Đây là điểm khác biệt duy nhất. Để hiểu rõ hơn, chúng ta hãy nhìn vào ví dụ này",
  },
  {
    img: "./img/trick6.png",
    alt: "trick6",
    desc: "Kỹ thuật 'Đánh cặp ẩn' cũng tương tự như kỹ thuật 'Số lẻ ẩn'. Điểm khác biệt duy nhất là số lượng ô và Ghi chú. Nếu bạn có thể tìm thấy hai ô trong một hàng, cột hoặc khối 3x3 trong đó không có hai Ghi chú nào xuất hiện bên ngoài các ô này, thì hai Ghi chú này phải được đặt trong hai ô. Có thể loại bỏ tất cả các Ghi chú khác khỏi hai ô này",
  },
  {
    img: "./img/trick7.png",
    alt: "trick7",
    desc: "Kỹ thuật 'Bộ ba ẩn' rất giống với 'Cặp ẩn' và cũng có chung một nguyên tắc.'Bộ ba ẩn' áp dụng khi ba ô trong một hàng, cột hoặc khối 3x3 chứa ba Ghi chú giống nhau. Ba ô này cũng chứa các số khả thi khác mà có thể bị loại bỏ",
  },
];

tricksList.forEach((items) => {
  const container = document.createElement("div");
  container.className = "image-trick-container";

  const img = document.createElement("img");
  img.src = items.img;
  img.alt = items.alt;

  const info = document.createElement("span");
  info.className = "info-trick";
  info.textContent = items.desc;

  container.appendChild(img);
  container.appendChild(info);
  trickContainer.appendChild(container);
});

function clickSound() {
  const sound = document.getElementById("click-sound");
  sound.currentTime = 0;
  sound.play();
}

buttons.forEach((button) => {
  button.addEventListener("click", clickSound);
});

openRule.addEventListener("click", function () {
  ruleContainer.style.display = "flex";
});

closeRule.addEventListener("click", function () {
  ruleContainer.style.display = "none";
});

function closeWinner() {
  winnerContainer.style.display = "none";
}
