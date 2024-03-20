document.addEventListener("DOMContentLoaded", function () {
    // Gửi yêu cầu fetch để lấy dữ liệu và cập nhật giao diện người dùng
    fetchDataAndUpdateUI();
});

async function fetchDataAndUpdateUI() {
    try {
        // Lấy dữ liệu từ máy chủ và cập nhật giao diện người dùng
        const dailyRevenueData = await fetchDailyRevenueData();
        const monthlyRevenueData = await fetchMonthlyRevenueData();
        const yearlyRevenueData = await fetchYearlyRevenueData();

        updateDailyRevenueCard(dailyRevenueData);
        updateMonthlyRevenueCard(monthlyRevenueData);
        updateRevenueChart(yearlyRevenueData);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu và cập nhật giao diện:', error);
    }
}

async function fetchDailyRevenueData() {
    try {
        const response = await fetch('http://localhost:3000/api/orders/revenue/daily');
        if (!response.ok) {
            throw new Error('Failed to fetch daily revenue data');
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu hàng ngày:', error);
        return { date: '', total_revenue: 0 };
    }
}

async function fetchMonthlyRevenueData() {
    try {
        const response = await fetch('http://localhost:3000/api/orders/revenue/current-month');
        if (!response.ok) {
            throw new Error('Failed to fetch monthly revenue data');
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu hàng tháng:', error);
        return { month: '', totalRevenue: 0 };
    }
}

async function fetchYearlyRevenueData() {
    try {
        const response = await fetch('http://localhost:3000/api/orders/revenue/yearly');
        if (!response.ok) {
            throw new Error('Failed to fetch yearly revenue data');
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu hàng năm:', error);
        return [];
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Chuyển đổi số thập phân thành chuỗi với 2 chữ số
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    // Trả về chuỗi ngày đã được định dạng
    return `${formattedDay}/${formattedMonth}/${year}`;
}

function updateDailyRevenueCard(data) {
    const dailyRevenueCard = document.getElementById("dailyRevenueCard");
    const formattedDate = formatDate(data.date);
    dailyRevenueCard.innerHTML = `
      <p>Ngày: ${formattedDate}</p>
      <p>Tổng Doanh Thu: ${data.total_revenue} VNĐ</p>
    `;
}

function updateMonthlyRevenueCard(data) {
    const monthlyRevenueCard = document.getElementById("monthlyRevenueCard");
    monthlyRevenueCard.innerHTML = `
      <p>Tháng ${data.month}</p>
      <p>Tổng Doanh Thu: ${data.total_revenue} VNĐ</p>
    `;
}

function updateRevenueChart(data) {
    const labels = data.map((item) => ("Tháng " + item.month));
    const revenues = data.map((item) => item.total_revenue);

    const ctx = document.getElementById("revenueChart").getContext("2d");
    const revenueChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Doanh thu trong năm",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    data: revenues,
                },
            ],
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                return value + " VNĐ"; // Định dạng số tiền
                            }
                        },
                    },
                ],
            },
        },
    });
}
