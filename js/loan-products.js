document.addEventListener("DOMContentLoaded", function () {
    // Loan Analytics Chart
    const analyticsCtx = document.getElementById("analyticsChart");
    if (analyticsCtx) {
        new Chart(analyticsCtx, {
            type: "bar",
            data: {
                labels: ["Personal", "Home", "Auto", "Education"],
                datasets: [
                    {
                        label: "Total Applications",
                        data: [50, 80, 40, 70],
                        backgroundColor: "#3b82f6",
                    },
                    {
                        label: "Approved Loans",
                        data: [30, 60, 20, 50],
                        backgroundColor: "#10b981",
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    // Loan Centric View Chart
    const centricCtx = document.getElementById("centricChart");
    if (centricCtx) {
        new Chart(centricCtx, {
            type: "pie",
            data: {
                labels: ["New", "Approved", "Pending", "Rejected"],
                datasets: [
                    {
                        label: "Loan Status",
                        data: [40, 30, 20, 10],
                        backgroundColor: [
                            "#3b82f6",
                            "#10b981",
                            "#facc15",
                            "#ef4444",
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
            },
        });
    }
});
